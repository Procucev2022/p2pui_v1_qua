import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorRegistrationComponent } from './vendor-registration/vendor-registration.component';
import { CommonModule } from '@angular/common';
import { CommonShareModule } from '../shared/modules/common-share/common-share.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
//import { NotFoundComponent } from './not-found.component';

const routes: Routes = [
    {
        path: '', component: VendorRegistrationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes),
    CommonModule,
    CommonShareModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
],
    exports: [RouterModule],
    declarations: [VendorRegistrationComponent]

})
export class VendorRegistrationRoutingModule {
}
