import * as mainModule from './main';

describe('main.ts', () => {
  it('should export mainHooks with a bootstrap function', () => {
    expect(mainModule.mainHooks).toBeDefined();
    expect(typeof mainModule.mainHooks.bootstrap).toBe('function');
  });

  it('runMain should return undefined under Karma', () => {
    const result = mainModule.runMain();
    expect(result).toBeUndefined();
  });

  it('runMain should call bootstrap when not under Karma', () => {
    const origKarma = (window as any).__karma__;
    delete (window as any).__karma__;
    const spy = jasmine.createSpy('bootstrap').and.returnValue(Promise.resolve());
    const origBootstrap = mainModule.mainHooks.bootstrap;
    mainModule.mainHooks.bootstrap = spy;

    const result = mainModule.runMain();
    expect(spy).toHaveBeenCalled();
    expect(result).toBeDefined();

    // Restore
    mainModule.mainHooks.bootstrap = origBootstrap;
    (window as any).__karma__ = origKarma;
  });
});
