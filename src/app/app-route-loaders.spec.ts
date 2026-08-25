import {
  appRouteLoaderHooks,
  loadAppRouteModule,
} from './app-route-loaders';

describe('app-route-loaders', () => {
  const originalImporters = { ...appRouteLoaderHooks.importers };

  afterEach(() => {
    appRouteLoaderHooks.fixtures = null;
    appRouteLoaderHooks.importers = { ...originalImporters };
  });

  const cases: Array<[string, string]> = [
    ['layout', 'LayoutModule'],
    ['login', 'LoginModule'],
    ['signup', 'SignupModule'],
    ['error', 'ServerErrorModule'],
    ['not-found', 'NotFoundModule'],
    ['pdf', 'PdfReadableModule'],
  ];

  it('should load modules via fixtures for every key (Edge-safe)', async () => {
    appRouteLoaderHooks.fixtures = {
      layout: { LayoutModule: { name: 'LayoutModule' } },
      login: { LoginModule: { name: 'LoginModule' } },
      signup: { SignupModule: { name: 'SignupModule' } },
      error: { ServerErrorModule: { name: 'ServerErrorModule' } },
      'not-found': { NotFoundModule: { name: 'NotFoundModule' } },
      pdf: { PdfReadableModule: { name: 'PdfReadableModule' } },
    };

    for (const [key, exportName] of cases) {
      const loaded = await loadAppRouteModule(key, exportName);
      expect(loaded).toEqual(jasmine.objectContaining({ name: exportName }));
    }
  });

  it('should load via stubbed importers when fixtures are absent', async () => {
    appRouteLoaderHooks.fixtures = null;
    for (const [key, exportName] of cases) {
      appRouteLoaderHooks.importers[key] = async () => ({
        [exportName]: { name: exportName },
      });
    }

    for (const [key, exportName] of cases) {
      const loaded = await loadAppRouteModule(key, exportName);
      expect(loaded).toEqual(jasmine.objectContaining({ name: exportName }));
    }
  });

  it('should reject unknown keys via loadReal', async () => {
    appRouteLoaderHooks.fixtures = null;
    await expectAsync(appRouteLoaderHooks.loadReal('nope')).toBeRejectedWithError(
      /Unknown app route module key/
    );
  });
});
