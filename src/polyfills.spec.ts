import { POLYFILLS_LOADED } from './polyfills';

describe('polyfills', () => {
  it('should export POLYFILLS_LOADED as true', () => {
    expect(POLYFILLS_LOADED).toBe(true);
  });
});
