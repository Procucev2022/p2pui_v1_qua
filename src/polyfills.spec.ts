import { POLYFILLS_LOADED } from './polyfills';

describe('polyfills', () => {
  it('should mark polyfills as loaded', () => {
    expect(POLYFILLS_LOADED).toBe(true);
  });

  it('should expose Zone from zone.js', () => {
    expect((window as any).Zone).toBeTruthy();
  });
});
