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
    mobileNumber;
    isCreadentialsEmpty: boolean;
    routerParams: any;
    visiblePassword = false;
    otpEnabled: boolean = false;
    otp :any  ={
      otp1: '',
      otp2: '',
      otp3: '',
      otp4: '',
      otp5: '',
      otp6: '',
    }
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
        this.triggerOTP();
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


    onKeyDown(key:string, $event){
      console.log('key', key, $event.target.value);
      this.otp[key] = $event.target.value;
      const allowedKeys = [
        'Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'
      ];
      const inputs = document.getElementById("inputs");
      if(($event.key >= '0' && $event.key <= '9' ) ||  allowedKeys.includes($event.key) ){
        this.otp[key] = !isNaN($event.key)? $event.key: this.otp[key];
        console.log("otp", this.otp)
        if($event.key == 'Backspace'){
          const next = $event.target.nextElementSibling;
          this.otp[key]= ''
          const prev =$event.target.previousElementSibling;
          prev.focus();
        }else if(($event.key >= '0' && $event.key <= '9') || (['Delete', 'Tab'].includes($event.key)) ){
          const next = $event.target.nextElementSibling;
          if (next) {
              next.focus();
          }
        }
      }else{
        this.otp[key] = ''
      }

    }

    onLoginMethodChange(event:any){

      if(this.otpEnabled){
        this.otpEnabled = !this.otpEnabled;
        if(!this.mobileNumber || isNaN(this.mobileNumber)  ){

        }
      }else{
        this.toastService.warning("Enter Registered Mobile Number");
        this.otpEnabled = false;
      }
    }
    triggerOTP(){
      // script.js
      const inputs = document.getElementById("inputs");

      // inputs.addEventListener("input", function (e:any) {
      // const target = e.target;
      // const val = e.target.value;

      // if (isNaN(val)) {
      //     target.value = "";
      //     return;
      // }

      // if (val != "") {
      //     const next = target.nextElementSibling;
      //     if (next) {
      //         next.focus();
      //     }
      // }
      // });

      // inputs.addEventListener("keyup", function (e:any) {
      // const target = e.target;
      // const key = Number(e.key)? e.key:  e.key.toLowerCase();


      // if( key &&  !isNaN(key) ){

      // }
      // if (key == "backspace" || key == "delete") {
      //     target.value = "";
      //     const prev = target.previousElementSibling;
      //     if (prev) {
      //         prev.focus();
      //     }
      //     return;
      // }
      // });
    }

    onLoggedin() {
        if (this.userName == null || this.userPassword == null) {
            this.isCreadentialsEmpty = true;
            return false;
        }
        let reqPayload = {}
        if(this.otpEnabled){
          reqPayload = {
            "username":this.userName,
            "phone": this.mobileNumber,
            "otp":true

          }
        }else{
          reqPayload = {
            "username":this.userName,
            "phone": this.mobileNumber,
            'password': this.userPassword

          }
        }
        this.authService.getAccessToken(reqPayload).pipe(first()).subscribe(data => {
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
