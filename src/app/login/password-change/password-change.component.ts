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

  ngOnInit() {
    this.submitted = false;
  }




  constructor(fb: FormBuilder, private toastrService: ToastrService, private router: Router, private encryDecryService: EncryDecryService, private authService: AuthenticationService) {
    this.passwdForm = fb.group({
      'oldPwd': ['', Validators.required],
      'newPwd': ['', Validators.required],
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

  updatePassword() {
    this.submitted = true;
    if (this.passwdForm.valid) {
      const obj  = {
        'userName': localStorage.getItem('loggedUser'),
        'password': this.passwdForm.value.oldPwd,
        'newpassword': this.passwdForm.value.newPwd
        };
      this.authService.updatePassword(obj).subscribe((response) => {
        localStorage.setItem('isLoggedin', 'true');
        // this.router.navigate(['/login'], {queryParams: { regId: localStorage.getItem('regId')} });
        this.authService.getAccessToken({'userName': localStorage.getItem('loggedUser'), 'userPassword': this.passwdForm.value.newPwd}).pipe(first()).subscribe(data => {
          console.log(data);
          localStorage.setItem('loggedUser', localStorage.getItem('loggedUser'));
          localStorage.setItem('at', data.access_token);
          localStorage.setItem('rt', data.refresh_token);
          localStorage.setItem('et', data.expires_in);
          if (data['access_token']) {
              this.getLoggerUserData();
          }

        }, (error) => {
            // this.toastService.error(error.error_description, 'Failed');
            this.toastrService.warning('Password updated successfully, Login failed, please try again!!!', 'Failed');
            this.router.navigate(['/login'], {queryParams: { regId: localStorage.getItem('regId')} });
        });

      }, (error) => {
        this.toastrService.error('Password did not updated successfully, please try again!!!', 'Failed');
      });
    } else {
      this.toastrService.error('Please enter the mandatory fields', 'Failed');
    }



    // let obj ={
    //   active: true,
    //   createdBy: "jaswanth",
    //   createdTS: null,
    //   deptName: null,
    //   fullName: "Srikanth",
    //   id: "4005",
    //   lastModifiedBy: null,
    //   lastModifiedTS: null,
    //   listofPermission:  ["VENDOR MANAGER", "PC_VENDOR_SEARCH_PAGE_SEARCH", "SEARCH", "PC_VENDOR_APPROVALS_PAGE_VIEW", "APPROVALS", "PC_VENDOR_REQUEST_PAGE_VIEW", "REQUESTS", "PC_VENDOR_INVITE_PAGE_SEND_INVITE", "PC_VENDOR_INVITE_PAGE_VIEW", "PC_VENDOR_DASHBOARD_PAGE_REG_PENDING_VIEW", "PC_VENDOR_DASHBOARD_PAGE_APPROVE_PENDING_TAB_REJECT", "PC_VENDOR_DASHBOARD_PAGE_APPROVE_PENDING_TAB_PROFILE_VIEW", "PC_VENDOR_DASHBOARD_PAGE_APPROVE_PENDING_TAB_APPROVE", "PC_VENDOR_DASHBOARD_PAGE_APPROVE_PENDING_TAB_VIEW", "PC_VENDOR_DASHBOARD_PAGE_VENDORS_TAB_VIEW", "PC_VENDOR_DASHBOARD_PAGE_VIEW"],
    //   org: {id: "3756ebe8-0fd9-4f21-bf3d-9827864b6cd9", createdBy: null, lastModifiedBy: null, createdTS: null, lastModifiedTS: "2020-05-09",
    //   orgType: { description: 'Procucve'}},
    //   role: {id: "5002", createdBy: "HARSHI", roleName: 'admin', lastModifiedBy: "JASHWANTH", createdTS: null, lastModifiedTS: null},
    //   username: "srikanth@procucev.com"
    // };
    // const k = this.encryDecryService.set('perm', JSON.stringify({ 'details':  obj}));
    // localStorage.setItem('logData', k);
    // localStorage.setItem('isLoggedin', 'true')
    // this.router.navigate(['/vendor/vendorReg'], {queryParams: { regId: '131121-131312'} });
  }

  getLoggerUserData() {
    // alert('helo log')
    const req  = {
        'username':  localStorage.getItem('loggedUser')
      };
      this.authService.getLoggedUserData(req).subscribe((data) => {
          if (data) {
            console.log('loggedUserData', data);
            const obj = Object.assign({}, data);
            const k = this.encryDecryService.set('perm', JSON.stringify({ 'details':  data}));
            localStorage.setItem('logData', k);
            localStorage.setItem('orgId', data.org.id);
            localStorage.setItem('loggedId', data.id);
            if (data.resetPassword && localStorage.getItem('orgId')) {
               this.router.navigate(['login/passwordChange']);
            } else {
                localStorage.setItem('isLoggedin', 'true');
                if(['Vendor', 'PartialVendor', 'Registration','CategoryManager','CategoryManager2','ClientInitiator'].includes(data.role.roleName)){
                    this.router.navigate(['/login/subscription-login']);
                }else if (data.role.roleName === 'VendorManager') {
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

}
