const { reverse } = require('../helper/for_testing');
const assert = require('assert');
const { test } = require('node:test');

test('reverse of a', () => {
  const result = reverse('a');
  assert.strictEqual(result, 'a');
});

test('reverse of react', () => {
  const result = reverse('react');
  assert.strictEqual(result, 'tcaer');
});

test('reverse of hello', () => {
  const result = reverse('hello');
  assert.strictEqual(result, 'olleh');
});
