import { describe, it, expect, beforeEach, vi } from 'vitest';
vi.mock('@capacitor/preferences', () => ({ Preferences: { set: async () => undefined } }));
import { resolveHomeTapTarget, installHomeTapTracking } from './homeTap';
import { startFirstSession, endFirstSession, _resetFirstSession } from './firstSession';

describe('home_tap (101)', () => {
  beforeEach(() => { _resetFirstSession(); document.body.innerHTML = `
    <button data-testid="button-menu"><span data-testid="icon">x</span></button>
    <div data-home-tap="practice:box"><b id="inner">t</b></div>
    <button data-testid="menu-item-settings">s</button>
    <button data-testid="other">o</button>`; });

  it('maps elements to short targets', () => {
    expect(resolveHomeTapTarget(document.querySelector('[data-testid=icon]'))).toBe('menu');
    expect(resolveHomeTapTarget(document.getElementById('inner'))).toBe('practice:box');
    expect(resolveHomeTapTarget(document.querySelector('[data-testid=menu-item-settings]'))).toBe('menu_settings');
    expect(resolveHomeTapTarget(document.querySelector('[data-testid=other]'))).toBeNull();
  });

  it('fires only in the first session, once per target', () => {
    const send = vi.fn();
    const off = installHomeTapTracking(send);
    const menu = document.querySelector('[data-testid=button-menu]') as HTMLElement;
    menu.click();
    expect(send).not.toHaveBeenCalled();
    startFirstSession();
    menu.click(); menu.click();
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith({ target: 'menu', is_first_session: 'true' });
    endFirstSession();
    (document.getElementById('inner') as HTMLElement).click();
    expect(send).toHaveBeenCalledTimes(1);
    off();
  });
});
