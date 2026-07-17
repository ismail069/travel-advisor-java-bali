import assert from 'node:assert/strict';
import test from 'node:test';
import { accessibilityLabel, nearbyMetadata, scoreToPercent } from './destination-component-utils.ts';

test('scoreToPercent maps the editorial scale to bar width', () => {
  assert.equal(scoreToPercent(1), 20);
  assert.equal(scoreToPercent(5), 100);
});

test('nearbyMetadata omits missing optional values', () => {
  assert.equal(nearbyMetadata({ name: 'Example', href: '/destinasi', distance: '10 km', relation: 'Same route' }), '10 km · Same route');
});

test('accessibilityLabel covers every canonical status', () => {
  assert.deepEqual(['available', 'partial', 'unavailable', 'unknown'].map((status) => accessibilityLabel(status as 'available' | 'partial' | 'unavailable' | 'unknown')), ['Available', 'Partial', 'Unavailable', 'Unknown']);
});
