import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
// import {BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { UnAuthorizedComponent } from './un-authorized/un-authorized.component';
import { RegistervendorComponent } from './registervendor/registervendor.component';
import { LoginSubscriptionComponent } from './login-subscription/login-subscription.component';
import { ClientRegisterComponent } from './client-register/client-register.component';
import { UnAuthorizedAccessScreenComponent } from './un-authorized-access-screen/un-authorized-access-screen.component';
import { CommonShareModule } from '../shared/modules/common-share/common-share.module';
// import { RegConfirmDialogComponent } from './reg-confirm-dialog/reg-confirm-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        LoginRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CommonShareModule
    ],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],

    declarations: [LoginComponent, PasswordChangeComponent, ForgotpasswordComponent, UnAuthorizedComponent, RegistervendorComponent, LoginSubscriptionComponent, ClientRegisterComponent, UnAuthorizedAccessScreenComponent]
})
export class LoginModule {}
