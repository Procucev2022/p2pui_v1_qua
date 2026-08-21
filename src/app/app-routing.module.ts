import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared';
import { loadAppRouteModule } from './app-route-loaders';

export const appRoutes: Routes = [
    { path: '', loadChildren: () => loadAppRouteModule('layout', 'LayoutModule'), canActivate: [AuthGuard] },
    { path: 'login', loadChildren: () => loadAppRouteModule('login', 'LoginModule') },
    { path: 'signup', loadChildren: () => loadAppRouteModule('signup', 'SignupModule') },
    { path: 'error', loadChildren: () => loadAppRouteModule('error', 'ServerErrorModule') },
    { path: 'not-found', loadChildren: () => loadAppRouteModule('not-found', 'NotFoundModule') },
    // { path: 'vendorRegistration', loadChildren: () => import('./vendor-registration/vendor-registration.module').then(m => m.VendorRegistrationModule) },
    { path: 'pdf-read-write', loadChildren: () => loadAppRouteModule('pdf', 'PdfReadableModule')  },
    { path: '**', redirectTo: 'not-found' },


];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
