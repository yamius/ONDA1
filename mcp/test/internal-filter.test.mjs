import { test } from 'node:test';
import assert from 'node:assert';
import { internalFilter } from '../lib/sources/ga4.js';
import { INTERNAL_MISLABELED_VERSIONS, internalMislabeledNote } from '../lib/internal-versions.js';

test('exclude = NOT(internal=true AND appVersion NOT IN mislabeled)', () => {
  const f = internalFilter('exclude');
  const [isTrue, notVer] = f.notExpression.andGroup.expressions;
  assert.equal(isTrue.filter.fieldName, 'customUser:internal');
  assert.equal(isTrue.filter.stringFilter.value, 'true');
  assert.equal(notVer.notExpression.filter.fieldName, 'appVersion');
  assert.deepEqual(notVer.notExpression.filter.inListFilter.values, ['1.9.5']);
  assert.deepEqual(internalFilter(undefined), f);
});

test('only / include unchanged', () => {
  assert.equal(internalFilter('only').filter.fieldName, 'customUser:internal');
  assert.equal(internalFilter('include'), null);
});

test('note only in exclude mode', () => {
  assert.ok(INTERNAL_MISLABELED_VERSIONS.includes('1.9.5'));
  assert.match(internalMislabeledNote('exclude'), /1\.9\.5 помечена internal целиком/);
  assert.match(internalMislabeledNote(undefined), /тестовые устройства/);
  assert.equal(internalMislabeledNote('only'), null);
  assert.equal(internalMislabeledNote('include'), null);
});
