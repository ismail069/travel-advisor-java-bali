import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyChatScope, generateWithModelFallback, getGeminiModels } from './geminiService.js';

test('limits chat scope to Java and Bali travel', () => {
  assert.equal(classifyChatScope('Rekomendasi pantai keluarga di Bali'), 'travel');
  assert.equal(classifyChatScope('Buat itinerary 3 hari di Yogyakarta'), 'travel');
  assert.equal(classifyChatScope('Hotel dan restoran di sekitar Tanah Lot'), 'travel');
  assert.equal(classifyChatScope('Transportasi menuju Ubud dari Denpasar'), 'travel');
  assert.equal(classifyChatScope('Rumah sakit terdekat dari Tanah Lot'), 'travel');
  assert.equal(classifyChatScope('Kantor polisi sekitar Ubud'), 'travel');
  assert.equal(classifyChatScope('Halo'), 'greeting');
  assert.equal(classifyChatScope('Buatkan kode JavaScript'), 'outside');
  assert.equal(classifyChatScope('Apa tempat wisata terbaik di Lombok?'), 'outside');
  assert.equal(classifyChatScope('Siapa presiden Indonesia?'), 'outside');
});

test('uses configured models in order and removes duplicates', () => {
  assert.deepEqual(
    getGeminiModels({ GEMINI_MODELS: 'model-a, model-b,model-a' }),
    ['model-a', 'model-b']
  );
});

test('falls back to the next model after a failure', async () => {
  const attempts = [];
  const genAI = {
    getGenerativeModel({ model }) {
      attempts.push(model);
      return {
        async generateContent() {
          if (model === 'model-a') throw new Error('quota exceeded');
          return { response: { text: () => 'Berhasil dari fallback' } };
        }
      };
    }
  };

  const result = await generateWithModelFallback(genAI, 'prompt', ['model-a', 'model-b']);

  assert.deepEqual(attempts, ['model-a', 'model-b']);
  assert.deepEqual(result, { text: 'Berhasil dari fallback', model: 'model-b' });
});

test('throws a summarized error after every model fails', async () => {
  const genAI = {
    getGenerativeModel({ model }) {
      return { generateContent: async () => { throw new Error(`${model} unavailable`); } };
    }
  };

  await assert.rejects(
    generateWithModelFallback(genAI, 'prompt', ['model-a', 'model-b']),
    (error) => error.failures.length === 2 && error.message.includes('model-a, model-b')
  );
});
