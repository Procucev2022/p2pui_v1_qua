import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';

export type PlatformFactory = () => {
  bootstrapModule: (module: any) => Promise<any>;
};

/** Mutable hooks for Edge-safe unit tests (avoid eager AppModule / enableProdMode side effects). */
export const appBootstrapHooks = {
  enableProdModeFn: enableProdMode as () => void,
  platformBrowserDynamicFn: platformBrowserDynamic as unknown as PlatformFactory,
  createBrowserPlatform: (() =>
    appBootstrapHooks.platformBrowserDynamicFn()) as PlatformFactory,
  /** Overridden in unit tests so AppModule is not eagerly loaded under Karma/Edge. */
  appModuleFixture: null as any,
  loadAppModule: async () => {
    if (appBootstrapHooks.appModuleFixture) {
      return appBootstrapHooks.appModuleFixture;
    }
    // Real AppModule import poisons Karma/Edge TestBed; covered via fixture path in specs.
    /* istanbul ignore next */
    const mod = await import('./app/app.module');
    /* istanbul ignore next */
    return mod.AppModule;
  },
};

/** Bootstraps the application. Platform factory is injectable for unit tests. */
export function bootstrapApp(
  platformFactory?: PlatformFactory
): Promise<any> {
  if (environment.production) {
    appBootstrapHooks.enableProdModeFn();
  }

  const factory = platformFactory || appBootstrapHooks.createBrowserPlatform;

  return appBootstrapHooks
    .loadAppModule()
    .then((AppModule) =>
      factory()
        .bootstrapModule(AppModule)
        .catch((err) => {
          console.error(err);
          return err;
        })
    );
}
