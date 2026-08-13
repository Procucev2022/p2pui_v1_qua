import { mainHooks, runMain } from './main';

describe('main', () => {
  const originalBootstrap = mainHooks.bootstrap;

  afterEach(() => {
    mainHooks.bootstrap = originalBootstrap;
    if (typeof (window as any).__karma__ === 'undefined') {
      (window as any).__karma__ = { start: () => undefined };
    }
  });

  it('should export runMain', () => {
    expect(typeof runMain).toBe('function');
  });

  it('should no-op under Karma (__karma__ present)', () => {
    const result = runMain();
    expect(result).toBeUndefined();
  });

  it('should call mainHooks.bootstrap when __karma__ is undefined', async () => {
    const karmaRef = (window as any).__karma__;
    mainHooks.bootstrap = jasmine
      .createSpy('bootstrap')
      .and.returnValue(Promise.resolve({ booted: true })) as any;

    try {
      (window as any).__karma__ = undefined;
      const result = runMain();
      expect(mainHooks.bootstrap).toHaveBeenCalled();
      await expectAsync(Promise.resolve(result)).toBeResolvedTo({
        booted: true,
      });
    } finally {
      (window as any).__karma__ = karmaRef;
    }
  });
});
