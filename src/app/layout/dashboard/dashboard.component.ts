import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
import { Router } from '@angular/router';
import { SystemViewConfig } from 'src/app/app.config';
import { AuthPageReload } from 'src/app/shared/services/authentication.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    defaultPermissions: any = [];
    loggedUserDetails: any;
    loggedUserPermissions: any;
    loggedUserData: any;
    SYSTEM_VIEW_CONFIG :any = SystemViewConfig;
    constructor(private encryDecryService: EncryDecryService, private router: Router) {
    }

    ngOnInit() {
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        const temp =  JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')) );
        this.loggedUserDetails = temp.details;

        this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
        this.redirectTothisPage();

    }

    redirectTothisPage() {
        const data =this.loggedUserDetails;
        const systemView = localStorage.getItem('system-view')? localStorage.getItem('system-view'): '';
        // if(this.loggedUserDetails.role.roleName == 'ClientInitiator' && [SystemViewConfig.GMT_BASIC, SystemViewConfig.GMT_BASIC_PLUS].includes(systemView)){
        //     this.router.navigate(['/categorymgr/create-rfq'])
        // }
        if (data.role.roleName === "ClientInitiator") {//For GMT USER
            if(data.selfClient == true && [this.SYSTEM_VIEW_CONFIG.GMT_BASIC, this.SYSTEM_VIEW_CONFIG.GMT_BASIC_PLUS].includes(systemView)){
                this.router.navigate(['/categorymgr/create-rfq']).then(() => {
                    AuthPageReload.run();
                });
            }
            if(data.selfClient == false && [this.SYSTEM_VIEW_CONFIG.DPS_BASIC, this.SYSTEM_VIEW_CONFIG.DPS_BASIC_PLUS].includes(systemView)){
                this.router.navigate(['/client/procurerequest']).then(() => {
                    AuthPageReload.run();
                });
            }
        }
        else if (this.loggedUserPermissions.indexOf(this.defaultPermissions.PC_PR_PAGE.VIEW) !== -1) {
            this.router.navigate(['/categorymgr/procurequests']);
        } else if (this.loggedUserPermissions.indexOf(this.defaultPermissions.PC_QUOTE_PAGE.VIEW) !== -1) {
            this.router.navigate(['/categorymgr/quotations']);
        } else if (this.loggedUserPermissions.indexOf(this.defaultPermissions.PC_V_REG_PAGE.VIEW) !== -1) {
            this.router.navigate(['/vendor/vendorReg']);
        } else if (this.loggedUserPermissions.indexOf(this.defaultPermissions.PC_PRE_VENDOR_PAGE.VIEW) !== -1) {
            this.router.navigate(['/vendormgr/vendors']);
        }else if(this.loggedUserPermissions.indexOf(this.defaultPermissions.PC_C_PR_PAGE.VIEW) !== -1){
            this.router.navigate(['client/procurerequest']);
        }else if(this.loggedUserPermissions.indexOf(this.defaultPermissions.PC_VENDOR_DASHBOARD_PAGE.VIEW) !== -1){
            this.router.navigate(['/vendormgr/dashboard']);
        }
         else {

        }
    }

}
