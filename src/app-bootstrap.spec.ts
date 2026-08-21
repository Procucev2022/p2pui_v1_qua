import { appBootstrapHooks, bootstrapApp } from './app-bootstrap';
import { environment } from './environments/environment';

describe('app-bootstrap', () => {
  const originalCreate = appBootstrapHooks.createBrowserPlatform;
  const originalEnable = appBootstrapHooks.enableProdModeFn;
  const originalPlatformFn = appBootstrapHooks.platformBrowserDynamicFn;

  beforeEach(() => {
    // Never eagerly pull AppModule during early suites (breaks Edge TestBed ɵcmp restore).
    appBootstrapHooks.appModuleFixture = class FakeAppModule {};
    // enableProdMode is process-global; never call the real one from unit tests.
    appBootstrapHooks.enableProdModeFn = jasmine.createSpy('enableProdModeFn');
  });

  afterEach(() => {
    (environment as any).production = false;
    appBootstrapHooks.createBrowserPlatform = originalCreate;
    appBootstrapHooks.enableProdModeFn = originalEnable;
    appBootstrapHooks.platformBrowserDynamicFn = originalPlatformFn;
    appBootstrapHooks.appModuleFixture = null;
  });

  it('should call production path when production is true', async () => {
    (environment as any).production = true;
    const bootstrapModule = jasmine
      .createSpy('bootstrapModule')
      .and.returnValue(Promise.resolve({ ok: true }));

    const result = await bootstrapApp(() => ({ bootstrapModule }));
    expect(appBootstrapHooks.enableProdModeFn).toHaveBeenCalled();
    expect(bootstrapModule).toHaveBeenCalled();
    expect(result).toEqual({ ok: true });
  });

  it('should bootstrap when production is false', async () => {
    (environment as any).production = false;
    const bootstrapModule = jasmine
      .createSpy('bootstrapModule')
      .and.returnValue(Promise.resolve({ ok: true }));

    const result = await bootstrapApp(() => ({ bootstrapModule }));
    expect(appBootstrapHooks.enableProdModeFn).not.toHaveBeenCalled();
    expect(bootstrapModule).toHaveBeenCalled();
    expect(result).toEqual({ ok: true });
  });

  it('should catch bootstrap errors', async () => {
    const bootstrapModule = jasmine
      .createSpy('bootstrapModule')
      .and.returnValue(Promise.reject(new Error('boot fail')));
    spyOn(console, 'error');

    const result = await bootstrapApp(() => ({ bootstrapModule }));
    expect(console.error).toHaveBeenCalled();
    expect(result).toEqual(jasmine.any(Error));
  });

  it('should use createBrowserPlatform when no factory is passed', async () => {
    (environment as any).production = false;
    const bootstrapModule = jasmine
      .createSpy('bootstrapModule')
      .and.returnValue(Promise.resolve({ defaultPlatform: true }));
    appBootstrapHooks.createBrowserPlatform = () => ({ bootstrapModule });

    const result = await bootstrapApp();
    expect(bootstrapModule).toHaveBeenCalled();
    expect(result).toEqual({ defaultPlatform: true });
  });

  it('should delegate createBrowserPlatform to platformBrowserDynamicFn', () => {
    const fakePlatform = {
      bootstrapModule: jasmine.createSpy('bootstrapModule'),
    };
    appBootstrapHooks.platformBrowserDynamicFn = (() =>
      fakePlatform) as any;
    const platform = originalCreate();
    expect(platform).toBe(fakePlatform);
  });
});
