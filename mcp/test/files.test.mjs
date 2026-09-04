/**
 * File tools, and the path-allowlist guarantee they rest on.
 *
 * The load-bearing test is the last one: a sensitive path must be REFUSED
 * EXPLICITLY, with a reason. A silent skip would read as "file not found" and
 * hide that the path was off-limits — the exact failure the acceptance criteria
 * call out. The guard is unit-tested directly (no network) so it holds
 * regardless of what the live repo happens to contain.
 */
import { test } from 'node:test';
import assert from 'node:assert';
import {
  assertReadable, isReadable, normaliseRepoPath, GithubError, GITHUB_ALLOWED_PREFIXES,
} from '../lib/github.js';

test('only src/, public/locales/ and docs/ are readable', () => {
  assert.deepEqual(GITHUB_ALLOWED_PREFIXES, ['src/', 'public/locales/', 'docs/']);
  for (const p of ['src/onda-level1-demo_27.tsx', 'public/locales/en/translation.json', 'docs/ios-release-history.md']) {
    assert.equal(assertReadable(p), p);
  }
});

test('a path outside the allowlist is refused explicitly, not silently', () => {
  for (const p of ['package.json', 'README.md', 'scripts/register-analytics-reports.mjs']) {
    assert.throws(() => assertReadable(p), (e) => {
      assert.ok(e instanceof GithubError);
      assert.equal(e.code, 'path_not_allowed');
      assert.match(e.hint, /explicit refusal, not a missing file/);
      return true;
    }, p);
  }
});

test('sensitive paths are DENIED by name, with a reason', () => {
  const cases = [
    ['.env', /environment/],
    ['src/.env.local', /environment/],
    ['ios/App/App.entitlements', /provisioning/],
    ['src/keys/AuthKey_ABC.p8', /key or certificate/],
    ['public/GoogleService-Info.plist', /Firebase/],
    ['src/config/secret-token.ts', /secret/],
  ];
  for (const [p, why] of cases) {
    assert.throws(() => assertReadable(p), (e) => {
      assert.equal(e.code, 'path_denied', `${p} should be denied`);
      assert.match(e.reason, why);
      assert.match(e.hint, /explicit refusal, not a missing file/);
      return true;
    }, p);
  }
});

test('a denied path wins even under an allowed prefix', () => {
  // Defense in depth: .env inside src/ is still denied, not allowed-through.
  assert.throws(() => assertReadable('src/.env'), (e) => e.code === 'path_denied');
  assert.throws(() => assertReadable('src/certs/prod.pem'), (e) => e.code === 'path_denied');
});

test('.. and host-bearing paths are rejected before any allowlist check', () => {
  const backslash = 'src' + String.fromCharCode(92) + '..' + String.fromCharCode(92) + 'x';
  for (const p of ['../etc/passwd', 'src/../../.env', 'https://evil/x', backslash]) {
    assert.throws(() => normaliseRepoPath(p), (e) => e.code === 'bad_path', p);
  }
  // A protocol-relative "//evil/x" is harmless here — the host is baked into a
  // fixed base URL and the path is appended by string, not parsed as a URL — so
  // leading slashes are simply stripped to "evil/x", which then fails the
  // allowlist as path_not_allowed rather than bad_path.
  assert.equal(normaliseRepoPath('//evil/x'), 'evil/x');
  assert.equal(isReadable('//evil/x'), false);
});

test('isReadable never throws and matches assertReadable', () => {
  assert.equal(isReadable('src/x.ts'), true);
  assert.equal(isReadable('.env'), false);
  assert.equal(isReadable('package.json'), false);
  assert.equal(isReadable('../x'), false);
});
