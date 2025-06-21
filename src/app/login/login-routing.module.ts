import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { UnAuthorizedComponent } from './un-authorized/un-authorized.component';
import {RegistervendorComponent} from './registervendor/registervendor.component';
import { LoginSubscriptionComponent } from './login-subscription/login-subscription.component';
import { ClientRegisterComponent } from './client-register/client-register.component';
import { UnAuthorizedAccessScreenComponent } from './un-authorized-access-screen/un-authorized-access-screen.component';

const routes: Routes = [
    {
        path: '',
        component: LoginComponent,

    },
    {
        path: 'passwordChange',
        component: PasswordChangeComponent
    },
    {
        path: 'forgotpassword',
        component: ForgotpasswordComponent
    },
    {
        path: 'unauthorized',
        component: UnAuthorizedComponent
    },{
        path: 'unauthorizedAccess',
        component: UnAuthorizedAccessScreenComponent
    },
    {
        path: 'registervendor',
        component: RegistervendorComponent
    },{
        path: 'reg-client',
        component: ClientRegisterComponent
    },
    {
        path: 'subscription-login',
        component: LoginSubscriptionComponent
    }


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoginRoutingModule {}
