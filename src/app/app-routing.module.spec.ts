import { AppRoutingModule, appRoutes } from './app-routing.module';
import { appRouteLoaderHooks } from './app-route-loaders';

describe('AppRoutingModule', () => {
  afterEach(() => {
    appRouteLoaderHooks.fixtures = null;
  });

  it('should create an instance', () => {
    expect(new AppRoutingModule()).toBeTruthy();
  });

  it('should export appRoutes with expected paths', () => {
    const paths = appRoutes.map((r) => r.path);
    expect(paths).toContain('');
    expect(paths).toContain('login');
    expect(paths).toContain('signup');
    expect(paths).toContain('error');
    expect(paths).toContain('not-found');
    expect(paths).toContain('pdf-read-write');
    expect(paths).toContain('**');
  });

  it('should invoke every loadChildren factory via fixtures (Edge-safe)', async () => {
    appRouteLoaderHooks.fixtures = {
      layout: { LayoutModule: { name: 'LayoutModule' } },
      login: { LoginModule: { name: 'LoginModule' } },
      signup: { SignupModule: { name: 'SignupModule' } },
      error: { ServerErrorModule: { name: 'ServerErrorModule' } },
      'not-found': { NotFoundModule: { name: 'NotFoundModule' } },
      pdf: { PdfReadableModule: { name: 'PdfReadableModule' } },
    };

    const loadersRoutes = appRoutes.filter(
      (r) => typeof r.loadChildren === 'function'
    );
    expect(loadersRoutes.length).toBeGreaterThan(0);

    for (const route of loadersRoutes) {
      const loaded = await (route.loadChildren as () => Promise<any>)();
      expect(loaded).toEqual(
        jasmine.objectContaining({ name: jasmine.any(String) })
      );
    }
  });
});
