import assert from 'node:assert/strict';
import test from 'node:test';
import { generateWithModelFallback, getGeminiModels } from './geminiService.js';

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
