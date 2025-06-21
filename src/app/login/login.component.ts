import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../router.animations';
import { AuthenticationService } from '../shared/services/authentication.service';
import { first } from 'rxjs/operators';
import { EncryDecryService } from '../shared/services';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    userName;
    userPassword;
    isCreadentialsEmpty: boolean;
    routerParams: any;
    visiblePassword = false;
    constructor(
        public router: Router,
        private authService: AuthenticationService,
        private encryDecryService: EncryDecryService,
        private toastService: ToastrService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        // console.log('intervalid', this.authService.clearIntervalId);

        // clearInterval(this.authService.clearIntervalId);
        this.routerParams = this.route.snapshot.queryParams;
        console.log('param', this.routerParams);
        localStorage.clear();
        if (this.routerParams && this.routerParams['regId']) {
            localStorage.setItem('orgId', this.routerParams['regId']);

        }
        //  else{
        //      this.router.navigate(['/login']);
        //  }

    }

    onLoggedin() {
        if (this.userName == null || this.userPassword == null) {
            this.isCreadentialsEmpty = true;
            return false;
        }
        this.authService.getAccessToken({ 'userName': this.userName, 'userPassword': this.userPassword }).pipe(first()).subscribe(data => {
            console.log(data);
            localStorage.setItem('loggedUser', this.userName);
            localStorage.setItem('at', data.access_token);
            localStorage.setItem('rt', data.refresh_token);
            localStorage.setItem('et', data.expires_in);
            if (data['access_token']) {
                this.getLoggerUserData();
            }

        }, (error) => {
            this.toastService.error(error.error_description, 'Failed');
        });

    }

    resetCredentialsMsg() {
        this.isCreadentialsEmpty = false;
    }

    getLoggerUserData() {
        // alert('helo log')



        const req = {
            'username': localStorage.getItem('loggedUser')
        };

        this.authService.getLoggedUserData(req).subscribe((data) => {
            if (data) {
                console.log('loggedUserData}}}', data);
                const obj = Object.assign({}, data);
                this.saveLoggerUserData(data);
                const k = this.encryDecryService.set('perm', JSON.stringify({ 'details': data }));
                localStorage.setItem('logData', k);
                localStorage.setItem('orgId', data.org.id);
                localStorage.setItem('loggedId', data.id);
                if (data.resetPassword && localStorage.getItem('orgId')) {
                    this.router.navigate(['login/passwordChange']);
                } else {

                    localStorage.setItem('system-view', null)

                    localStorage.setItem('isLoggedin', 'true');
                    if (data.role.roleName === 'VendorManager') {
                        this.router.navigate(['/vendormgr/dashboard']);
                    } else if (data.role.roleName === 'Vendor' || data.role.roleName === 'Registration' || data.role.roleName === 'PartialVendor') { //FOR GMT VENDORS
                        this.router.navigate(['/login/subscription-login']);
                    } else if (data.role.roleName === 'PRApprover') {
                        this.router.navigate(['/client/procurerequest']);
                    } else if (data.role.roleName === 'CategoryManagerBasic') {
                        this.router.navigate(['/categorymgr/procurequests']);
                    } else if (data.role.roleName === 'VendorExecutive2' || data.role.roleName === 'VendorExecutive') {
                        this.router.navigate(['vendormgr/vendors']);
                    }//For GMT Users
                    else if (data.role.roleName === 'CategoryManager2' || data.role.roleName === "CategoryManager" || data.role.roleName === 'ClientInitiator') {
                        this.router.navigate(['/login/subscription-login']);
                    }
                    else {
                        this.router.navigate(['/dashboard']);
                    }
                }

            }

        });
    }


    saveLoggerUserData(data){
        this.authService.saveLoggedUserData({user: {id: data.id},
            "loginTime":(new Date().toISOString()).split('Z')[0],
            "createdBy":data.username,
            "createdTS": (new Date().toISOString()).split('Z')[0],
          }).subscribe((res:any)=>{

        })
    }

    forgotpassword() {
        this.router.navigate(['login/forgotpassword']);
    }

    viewPassword() {
        this.visiblePassword = !this.visiblePassword;
    }

    registerVendor() {
        this.router.navigate(['login/registervendor']);
    }


}
