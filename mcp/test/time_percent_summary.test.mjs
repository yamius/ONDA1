import { test } from 'node:test';
import assert from 'node:assert';
import { summarizeTimePercent } from '../lib/practice-overrun.js';

test('103: "(empty)", "" and "(not set)" are excluded, not counted as 0', () => {
  const s = summarizeTimePercent([
    { value: '100', users: 1, events: 2 },
    { value: '(empty)', users: 5, events: 5 },
    { value: '', users: 5, events: 5 },
    { value: '(not set)', users: 5, events: 5 },
  ]);
  assert.equal(s.avg_time_percent_excl_overrun, 100);
  assert.equal(s.avg_time_percent_incl_overrun, 100);
  assert.equal(s.events_numeric, 2);
  assert.equal(s.events_non_numeric, 15);
  assert.equal(s.summary, undefined);
});

test('103: no numeric rows -> null averages and "нет данных"', () => {
  const s = summarizeTimePercent([{ value: '(not set)', users: 9, events: 9 }, { value: '', users: 1, events: 1 }]);
  assert.equal(s.avg_time_percent_excl_overrun, null);
  assert.equal(s.avg_time_percent_incl_overrun, null);
  assert.equal(s.summary, 'нет данных (no numeric values)');
});
