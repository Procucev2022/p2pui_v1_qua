import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EncryDecryService } from 'src/app/shared/services';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit {
  passwdForm: FormGroup;
  submitted: boolean;
  otpNumber: any;
  isOTPVerified: boolean;
  isOTPSent: boolean;

  ngOnInit() {
    this.submitted = false;
  }




  constructor(fb: FormBuilder, private toastrService: ToastrService, private router: Router, private encryDecryService: EncryDecryService, private authService: AuthenticationService) {
    this.passwdForm = fb.group({
      'oldPwd': ['', Validators.required],
      'newPwd': ['', [Validators.required, this.passwordPatternValidator.bind(this)]],
      'confirmPwd': ['', Validators.required]
    }, {
      validator: this.matchPwds
    });
  }

  get oldPwd() {
    return this.passwdForm.get('oldPwd');
  }

  get newPwd() {
    return this.passwdForm.get('newPwd');
  }

  get confirmPwd() {
    return this.passwdForm.get('confirmPwd');
  }

  matchPwds(control: AbstractControl) {
    const newPwd = control.get('newPwd');
    const confirmPwd = control.get('confirmPwd');
    if (newPwd.value !== confirmPwd.value) {
      return { pwdsDontMatch: true };
    }
    return null;
  }

  passwordPatternValidator(control: AbstractControl) {
    // const regex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}$');
    const regex = new RegExp('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$');
    const valid = regex.test(control.value);
    return valid ? null : { invalidPassword: true };
  }


  hasLetter(): boolean {
    return /[A-Za-z]/.test(this.newPwd.value);
  }

  hasNumber(): boolean {
    return /\d/.test(this.newPwd.value);
  }

  hasSpecialChar(): boolean {
    return /[@$!%*?&]/.test(this.newPwd.value);
  }

  isMinLength(): boolean {
    return this.newPwd.value.length >= 8;
  }


  updatePassword() {
    this.submitted = true;
    if (this.passwdForm.valid) {
      const obj = {
        'userName': localStorage.getItem('loggedUser'),
        'phone': localStorage.getItem('loggedUserMobile'),
        'password': this.passwdForm.value.oldPwd,
        'newpassword': this.passwdForm.value.newPwd
      };
      this.authService.updatePassword(obj).subscribe((response) => {

        if (response.status && response.status.toLowerCase() === 'success') {
          this.toastrService.success('Password updated successfully, You will be redirected to login page shortly.', 'Success');
          setTimeout(() => {
            localStorage.removeItem('loggedUserMobile');
            localStorage.removeItem('loggedUser');
            localStorage.removeItem('logData');
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          this.toastrService.error(response.message, 'Failed');
        }

      }, (error) => {
        this.toastrService.error('Password did not updated successfully, please try again!!!', 'Failed');
      });
    } else {
      if (this.passwdForm.controls.newPwd.errors && this.passwdForm.controls.newPwd.errors.invalidPassword) {
        this.toastrService.error('New Password should contain at least 8 characters, including uppercase, lowercase, number and special character(@$!%*?&)', 'Failed');
        return;
      }
    }




  }



  getValidateOTP() {

    if (this.otpNumber) {
      if ((this.otpNumber.toString().length < 6)) {
        this.toastrService.error('Please enter 6digits OTP value', 'Failed');
        return;
      }
      this.authService.validateEmailOTP({
        "email": localStorage.getItem('loggedUser'),
        "tempEmail": sessionStorage.getItem('tempEMail') ? sessionStorage.getItem('tempEMail') : '',
        "emailOtp": this.otpNumber.toString(),
        "organizationPhonenumber": ('+91' + localStorage.getItem('loggedUserMobile')).toString(),
      }
      ).subscribe((res: any) => {
        if (res && res.status.toLowerCase() == 'success') {
          this.isOTPVerified = true;
          this.toastrService.success('OTP Verified Successfully!', 'Success');
          this.updatePassword();
        } else {
          this.toastrService.error(res.message, 'Failed');
        }
      })
    } else {
      this.toastrService.error('Please enter the mandatory fields', 'Failed');
    }

  }

  getOTP() {
    if (this.oldPwd.valid == false) {
      this.toastrService.error('Please enter Old Password ', 'Failed');
      return;
    }
    if (this.newPwd.value.trim() == '') {
      this.toastrService.error('Please enter New Password', 'Failed');
      return;
    }

    if (!this.hasLetter() || !this.hasNumber() || !this.hasSpecialChar() || !this.isMinLength()) {
      this.toastrService.error('New Password must contain at least one letter, one number, one special character(@$!%*?&) and minimum 8 characters', 'Failed');
      return;
    }
    if (this.confirmPwd.valid == false) {
      this.toastrService.error('Please enter Confirm Password', 'Failed');
      return;
    }
    if (this.confirmPwd.value !== this.newPwd.value) {
      this.toastrService.error('Confirm Password and New Password should  be same', 'Failed');
      return;
    }

    if (!!this.passwdForm.errors && this.passwdForm.errors.pwdsDontMatch) {
      this.toastrService.error('New Password and Confirm Password should be same and not empty', 'Failed');
      return;
    }
    const phoneNumber = localStorage.getItem('loggedUserMobile');
    let added91Number = '';
    if (!!phoneNumber && phoneNumber.toString().length == 10) {
      added91Number = '+91' + phoneNumber.toString();
    } else {
      added91Number = phoneNumber;
    }

    this.updatePassword();
    // const  reqPayload = { 
    //     "otp": true,
    //     'username': localStorage.getItem('loggedUser'),
    //     "phone": added91Number,
    //     "tempEmail": sessionStorage.getItem('tempEMail') ? sessionStorage.getItem('tempEMail') : '',
    //     "tempPhone": sessionStorage.getItem('tempPhone') ? sessionStorage.getItem('tempPhone') : '',
    //   }
    // this.authService.getAccessToken(reqPayload).pipe(first()).subscribe(data => {
    //   if (data && data.status == 'error') {
    //   }else if (data && data.status == 'success') {
    //     if (data.methodType == 'otp') {
    //       this.toastrService.success(data.message, 'Success');
    //       this.isOTPSent = true;
    //     }
    //   }

    //   if(!this.isOTPSent){ 
    //      this.toastrService.error('OTP Sent Failed', 'Failed');
    //   }
    // });
  }

  getLoggerUserData() {
    // alert('helo log')
    const req = {
      'username': localStorage.getItem('loggedUser')
    };
    this.authService.getLoggedUserData(req).subscribe((data) => {
      if (data) {
        console.log('loggedUserData', data);
        const obj = Object.assign({}, data);
        const k = this.encryDecryService.set('perm', JSON.stringify({ 'details': data }));
        localStorage.setItem('logData', k);
        localStorage.setItem('orgId', data.org.id);
        localStorage.setItem('loggedId', data.id);
        if (data.resetPassword && localStorage.getItem('orgId')) {
          this.router.navigate(['login/passwordChange']);
        } else {
          localStorage.setItem('isLoggedin', 'true');
          if (['Vendor', 'PartialVendor', 'Registration', 'CategoryManager', 'CategoryManager2', 'ClientInitiator'].includes(data.role.roleName)) {
            this.router.navigate(['/login/subscription-login']);
          } else if (data.role.roleName === 'VendorManager') {
            this.router.navigate(['/vendormgr/dashboard']);
          } else if (data.role.roleName === 'Vendor') {
            this.router.navigate(['/vendor/rfq']);
          } else if (data.role.roleName === 'PRApprover') {
            this.router.navigate(['/client/procurerequest']);
          } else if (data.role.roleName === 'ClientInitiator') {
            this.router.navigate(['/client/procurerequest']);
          } else if (data.role.roleName === 'CategoryManager') {
            this.router.navigate(['/categorymgr/procurequests']);
          } else if (data.role.roleName === 'VendorExecutive2' || data.role.roleName === 'VendorExecutive') {
            this.router.navigate(['vendormgr/vendors']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }

      }

    });

  }

  resetForm(form) {
    this.submitted = false;
    this.passwdForm.reset();
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
