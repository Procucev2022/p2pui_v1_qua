
import { LayoutComponent } from './layout.component';
import { ScreenAccessGuardGuard } from '../shared/guard/screen-access-guard.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loadLayoutRouteModule } from './layout-route-loaders';

export const layoutRoutes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' }, 
            { path: 'dashboard', loadChildren: () => loadLayoutRouteModule('dashboard', 'DashboardModule') },
            { path: 'vendormgr', loadChildren: () => loadLayoutRouteModule('vendormgr', 'VendorMgrModule') },
            { path: 'categorymgr', loadChildren: () => loadLayoutRouteModule('categorymgr', 'CategoryMgrModule') , canActivateChild: [ScreenAccessGuardGuard] },
            { path: 'procuceve', loadChildren: () => loadLayoutRouteModule('procuceve', 'ProcuceveAdminModule') },
            { path: 'client', loadChildren: () => loadLayoutRouteModule('client', 'ClientModule') , canActivateChild: [ScreenAccessGuardGuard]},
            { path: 'vendor', loadChildren: () => loadLayoutRouteModule('vendor', 'VendorModule'), canActivateChild: [ScreenAccessGuardGuard] },
            { path: 'vendorReq', loadChildren: () => loadLayoutRouteModule('vendorReq', 'VendorRequestModule') },
            { path: 'raise-issue', loadChildren: () => loadLayoutRouteModule('raise-issue', 'RaiseIssueModule') },
            { path: 'ppos', loadChildren: () => loadLayoutRouteModule('ppos', 'PposModule') },
            { path: 'pos', loadChildren: () => loadLayoutRouteModule('pos', 'PosModule') },
            { path: 'invoices', loadChildren: () => loadLayoutRouteModule('invoices', 'InvoicesModule') },
            { path: 'category', loadChildren: () => loadLayoutRouteModule('category', 'CategoryModule')},
            { path: 'config', loadChildren: () => loadLayoutRouteModule('config', 'ConfigurationsModule')},
            { path: 'bfs', loadChildren: ()=> loadLayoutRouteModule('bfs', 'BfsModule'), canActivateChild: [ScreenAccessGuardGuard] },
            { path: 'buyer-dashboard', loadChildren: () => loadLayoutRouteModule('buyer-dashboard', 'BuyerDashboardModule') },
            { path: 'subscriptions', loadChildren: () => loadLayoutRouteModule('subscriptions', 'BuyerSubscriptionsModule') },
            { path: 'buyer-subscriptions', loadChildren: () => loadLayoutRouteModule('buyer-subscriptions', 'BuyerSubscriptionsModule') }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(layoutRoutes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
