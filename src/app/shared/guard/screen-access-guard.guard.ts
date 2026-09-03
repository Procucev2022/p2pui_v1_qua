import { BFS_SYSTEM_SCREEN_LIST } from './../../app.config';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, NavigationEnd, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { EncryDecryService } from '../services';
import { GMT_SYSTEM_SCREENS_LIST, SystemViewConfig } from 'src/app/app.config';
import { ToastrService } from 'ngx-toastr';
import { AuthPageReload } from 'src/app/shared/services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class ScreenAccessGuardGuard implements CanActivateChild {
    loggedUserPermissions: any;
    loggedUserDetails: any;
    loggedUserName: any;
    roleName: any;
    GMT_SYSTEM_SCREENS_LIST: any = GMT_SYSTEM_SCREENS_LIST;
    constructor(private readonly encryDecryService: EncryDecryService, private router: Router, private toaster: ToastrService ) {

    }
    currentSystem: any;
    GMT_USERS = ['CategoryManager', 'CategoryManager2', 'ClientInitiator', 'Registration', 'PartialVendor', 'Vendor']




    canActivateChild(
        childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        if(localStorage.getItem('logData')){
            const temp = JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')));
            this.loggedUserPermissions = temp.details.listofPermission;
            this.loggedUserDetails = temp.details;
            this.loggedUserName = this.loggedUserDetails.username;
            this.roleName = this.loggedUserDetails.role.roleName;
        }


        this.currentSystem = localStorage.getItem('system-view');
        console.log('url', state.url)
        if (!!this.currentSystem && this.currentSystem != 'null') {
            // currentSystem should be in GMT Subscriptions
            if (this.GMT_USERS.includes(this.roleName) && [SystemViewConfig.GMT_BASIC, SystemViewConfig.GMT_BASIC_PLUS, SystemViewConfig.GMT_PROF].includes(this.currentSystem)) {
                if (this.isUrlAllowed(this.GMT_SYSTEM_SCREENS_LIST[this.roleName], state.url)) {
                    return true;
                } else {
                    this.navigateToUnAuthorized();
                    return false;
                }
            }
            // For BFS System Users
            else if(this.GMT_USERS.includes(this.roleName) && [SystemViewConfig.BFS_PRO].includes(this.currentSystem)){
                if (this.isUrlAllowed(BFS_SYSTEM_SCREEN_LIST[this.roleName], state.url)) {
                    return true;
                } else {
                    this.navigateToUnAuthorized();
                    return false;
                }
            }
            else {
                if (this.isUrlAllowed(this.GMT_SYSTEM_SCREENS_LIST[this.roleName], state.url)) {
                    this.navigateToUnAuthorized();
                    return false;
                } else {
                    return true;
                }
            }
        }else{
            if (this.GMT_USERS.includes(this.roleName)) {
                this.toaster.error('Session Already Expired', 'Session Warning')
                this.navigateToLogin();
                return false;
            }else{
                return true;
            }

        }




    }


    isUrlAllowed(allowedScreens: string[], url: string): boolean {
        if (!allowedScreens) {
            return false;
        }
        return allowedScreens.some(screen => url === screen) ||
            (allowedScreens.includes('/categorymgr/analytics') && url.startsWith('/categorymgr/analytics/'));
    }

    navigateToUnAuthorized() {
        this.router.navigate(['/login/unauthorizedAccess'])
    }

    navigateToLogin(){
        this.router.navigate(['/login'])
        // .then(()=>{
        //     AuthPageReload.run();
        // });
    }
}
