

import { LayoutComponent } from './layout.component';
import { ScreenAccessGuardGuard } from '../shared/guard/screen-access-guard.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' }, 
            { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'vendormgr', loadChildren: () => import('./vendor-mgr/vendor-mgr.module').then(m => m.VendorMgrModule) },
            { path: 'categorymgr', loadChildren: () => import('./category-mgr/category-mgr.module').then(m => m.CategoryMgrModule) , canActivateChild: [ScreenAccessGuardGuard] },
            { path: 'procuceve', loadChildren: () => import('./procuceve-admin/procuceve-admin.module').then(m => m.ProcuceveAdminModule) },
            { path: 'client', loadChildren: () => import('./client/client.module').then(m => m.ClientModule) , canActivateChild: [ScreenAccessGuardGuard]},
            { path: 'vendor', loadChildren: () => import('./vendor/vendor.module').then(m => m.VendorModule), canActivateChild: [ScreenAccessGuardGuard] },
            { path: 'vendorReq', loadChildren: () => import('./vendor-request/vendor-request.module').then(m => m.VendorRequestModule) },
            { path: 'raise-issue', loadChildren: () => import('./raise-issue/raise-issue.module').then(m => m.RaiseIssueModule) },
            { path: 'ppos', loadChildren: () => import('./ppos/ppos.module').then(m => m.PposModule) },
            { path: 'pos', loadChildren: () => import('./pos/pos.module').then(m => m.PosModule) },
            { path: 'invoices', loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule) },
            { path: 'category', loadChildren: () => import('./category/category.module').then(m => m.CategoryModule)},
            { path: 'config', loadChildren: () => import('./configurations/configurations.module').then(m => m.ConfigurationsModule)},
            { path: 'bfs', loadChildren: ()=> import('./bfs/bfs.module').then(m=> m.BfsModule), canActivateChild: [ScreenAccessGuardGuard] }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
