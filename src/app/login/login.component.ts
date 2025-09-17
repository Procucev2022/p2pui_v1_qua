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
  isOTPSent: boolean;
  clearIntervalTime: any;
  otp: any = {
    otp1: '',
    otp2: '',
    otp3: '',
    otp4: '',
    otp5: '',
    otp6: '',
  }
  otpNumber: any;
  isOTPVerified: boolean;
  resendOTPTime: number = 0;
  isResendOTP: boolean;
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


  onKeyDown(key: string, $event) {
    console.log('key', key, $event.target.value);
    this.otp[key] = $event.target.value;
    const allowedKeys = [
      'Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'
    ];
    const inputs = document.getElementById("inputs");
    if (($event.key >= '0' && $event.key <= '9') || allowedKeys.includes($event.key)) {
      this.otp[key] = !isNaN($event.key) ? $event.key : this.otp[key];
      console.log("otp", this.otp)
      if ($event.key == 'Backspace') {
        const next = $event.target.nextElementSibling;
        this.otp[key] = ''
        const prev = $event.target.previousElementSibling;
        prev.focus();
      } else if (($event.key >= '0' && $event.key <= '9') || (['Delete', 'Tab'].includes($event.key))) {
        const next = $event.target.nextElementSibling;
        if (next) {
          next.focus();
        }
      }
    } else {
      this.otp[key] = ''
    }

  }

  onLoginMethodChange(event: any) {
    if (!this.mobileNumber || isNaN(this.mobileNumber)) {
      this.toastService.error("Enter Valid Registered Mobile Number", 'Failed');
      return;
    }
    this.otpEnabled = !this.otpEnabled;
    this.isOTPSent = false;
    this.isOTPVerified = false;
  }

  enableResentOTP() {
    this.isResendOTP = true;
    this.resendOTPTime = 30;
    this.clearIntervalTime = setInterval(() => {
      this.resendOTPTime--;
      if (this.resendOTPTime <= 0) {
        clearInterval(this.clearIntervalTime);
      }
    }, 1000)
  }
  triggerOTP() {
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
    if ((this.otpEnabled && this.userName == null) || (!this.otpEnabled && (this.userName == null || this.userPassword == null))) {
      this.isCreadentialsEmpty = true;
      return false;
    }
    let reqPayload: any = {}
    if (this.otpEnabled) {
      if (!this.mobileNumber) {
        this.toastService.warning("Enter Mobile Number", "Warning");
        return;
      }
      if (this.isOTPSent && this.isOTPVerified) {  // OTP Sent & Verified Scenario

        reqPayload = {
          "username": this.userName,
          "phone": this.mobileNumber

        }

      } else { //  TO send OTP
        reqPayload = {
          "username": this.userName,
          "phone": this.mobileNumber,
          "otp": true

        }
       
      }

    } else { // If Password only provided
      if (!this.mobileNumber || !this.userPassword || !this.userName) {
        this.toastService.warning("Enter EmailId, Mobile Number & Password", "Warning");
        return;
      }
      reqPayload = {
        "username": this.userName,
        "phone": this.mobileNumber,
        'password': this.userPassword

      }
    }
    const body = {
      ...reqPayload, "phone": "+91"+reqPayload.phone, "tempEmail": sessionStorage.getItem('tempEMail') ? sessionStorage.getItem('tempEMail') : '',
      "tempPhone": sessionStorage.getItem('tempPhone') ? sessionStorage.getItem('tempPhone') : '',
    }
    // "tempEmail": sessionStorage.getItem('tempEMail') ? sessionStorage.getItem('tempEMail'): '',
    this.authService.getAccessToken(body).pipe(first()).subscribe(data => {
      if (data && data.status == 'error') {
        if (data.methodType == 'otp') {
          this.toastService.error(data.message, 'Failed');
          this.isOTPSent = false;
        } else if (data && data.methodType == 'validate') {

          this.toastService.error(data.message, 'Failed');
        }else{
          this.toastService.error(data.message, 'Failed');
        }
      } else if (data && data.status == 'success') {
        if (data.methodType == 'otp') {
          this.toastService.success(data.message, 'Success');
          this.isOTPSent = true;
           this.enableResentOTP();
        } else if (data && data.methodType == 'validate' && this.isOTPVerified) {
          localStorage.setItem('loggedUser', this.userName);
          localStorage.setItem('loggedUserMobile', this.mobileNumber);
          localStorage.setItem('at', data.access_token);
          localStorage.setItem('rt', data.refresh_token);
          localStorage.setItem('et', data.expires_in);
          if (data['access_token']) {
            this.getLoggerUserData();
          }
        } else if (data && data.methodType == 'authenticated') {
          localStorage.setItem('loggedUser', this.userName);
          localStorage.setItem('loggedUserMobile', this.mobileNumber);
          localStorage.setItem('at', data.access_token);
          localStorage.setItem('rt', data.refresh_token);
          localStorage.setItem('et', data.expires_in);
          if (data['access_token']) {
            this.getLoggerUserData();
          }
        }
      }
    }, (error) => {
      this.toastService.error(error.error_description, 'Failed');
    });

  }

  resendOTP() {
    clearInterval(this.clearIntervalTime);
    this.isOTPSent = false;
    this.isOTPVerified = false;
    this.otpEnabled = true;
    this.sendOrValidateOTP();

  }


  sendOrValidateOTP() {

    if (!this.isOTPSent) {
      this.onLoggedin();
    } else {
      this.validateEmailOTP();
    }
  }


  validateEmailOTP() {
    if (!(this.otpNumber && this.otpNumber.toString().length == 6)) {
      this.toastService.warning("Enter Valid 6Digits OTP", 'Warning');
      return;
    }
    this.authService.validateEmailOTP({
      "email": this.userName,
      "tempEmail": sessionStorage.getItem('tempEMail') ? sessionStorage.getItem('tempEMail') : '',
      "emailOtp": this.otpNumber.toString()
    }
    ).subscribe((res: any) => {
      if (res && res.status.toLowerCase() == 'success') {
        this.isOTPVerified = true;
        this.toastService.success('OTP Verified Successfully!', 'Success');
        this.onLoggedin();
      } else {
        this.toastService.error(res.message, 'Failed');
      }
    })

  }

  resetCredentialsMsg() {
    this.isCreadentialsEmpty = false;
  }

  getLoggerUserData() {
    // alert('helo log')



    const req = {
      'username': localStorage.getItem('loggedUser'),
      'phone': localStorage.getItem('loggedUserMobile'),
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


  saveLoggerUserData(data) {
    this.authService.saveLoggedUserData({
      user: { id: data.id },
      "loginTime": (new Date().toISOString()).split('Z')[0],
      "createdBy": data.username,
      "createdTS": (new Date().toISOString()).split('Z')[0],
    }).subscribe((res: any) => {

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
