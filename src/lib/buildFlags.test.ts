import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Static guard (101): test panels must be compiled-in only for internal builds.
describe('debug panels gate', () => {
  const src = readFileSync(resolve(__dirname, '../onda-level1-demo_27.tsx'), 'utf8');
  it('sim / calm check-ins / push panels render only when IS_INTERNAL_BUILD', () => {
    for (const id of ['sim-panel', 'push-test-panel']) {
      const i = src.indexOf(`data-testid="${id}"`);
      const head = src.slice(Math.max(0, i - 400), i);
      expect(head).toMatch(/\{IS_INTERNAL_BUILD && [^\n]*\(\s*\n\s*<div[^\n]*$/);
    }
    // Entry events + calm check-ins live inside sim-panel.
    const panelStart = src.indexOf('data-testid="sim-panel"');
    for (const id of ['fire-entry-events', 'cc-sim-steady']) {
      const j = src.indexOf(`data-testid="${id}"`);
      expect(j).toBeGreaterThan(panelStart);
      expect(j).toBeLessThan(src.indexOf('data-testid="push-test-panel"'));
    }
    expect(src).not.toMatch(/\{internalTrafficOn && \(\s*\n\s*<div[^\n]*data-testid="sim-panel"/);
  });
});
