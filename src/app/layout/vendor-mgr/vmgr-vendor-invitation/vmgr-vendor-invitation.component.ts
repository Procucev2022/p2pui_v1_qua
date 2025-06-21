import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { VendorInviteService } from '../services/vendor-invite.service';
import { ToastrService } from 'ngx-toastr';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';

@Component({
  selector: 'app-vmgr-vendor-invitation',
  templateUrl: './vmgr-vendor-invitation.component.html',
  styleUrls: ['./vmgr-vendor-invitation.component.scss']
})
export class VmgrVendorInvitationComponent implements OnInit {

  invitationForm: FormGroup;
    submitted = false;
  defaultPermissions: any;
  loggedUserDetails: any;
  loggedUserPermissions: any;
  marked = false;
  minDate: Date = new Date();
  validateValue: any;


    constructor(private formBuilder: FormBuilder, private vendorInviteSer: VendorInviteService, private toasterSer: ToastrService, private encryDecryService: EncryDecryService) { }

    ngOnInit() {
      this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    const temp =  JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')) );
    this.loggedUserDetails = temp.details;


    this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
        this.invitationForm = this.formBuilder.group({
          orgName: ['', Validators.required],
          phone: ['', [Validators.required, Validators.minLength(10)]],
          email: ['', [Validators.required, Validators.email]],
          tempapproval:[false],
          vendorcategory: [''],
          hsncode: [''],
          validdate:[null],
          clientRefference:[false]
        });
      this.temporaryVendor();

    }
    temporaryVendor(){
      this.invitationForm.get('hsncode').disable();
      this.invitationForm.get('vendorcategory').disable();
     this.invitationForm.get('validdate').disable();
      }

    get f() { return this.invitationForm.controls; }

    onSubmit() {
        this.submitted = true;

        console.log(this.invitationForm.getRawValue());
        // stop here if form is invalid
        if (this.invitationForm.invalid) {
            return;
        } else {
          this.vendorInviteSer.requestRegistration(this.invitationForm.getRawValue())
          .subscribe((res:any)=> {
            if(res.status == 'Failure' || res.status == 'failure') {
              this.toasterSer.error(res.errorMessage, 'Failure');
            } else if(res.status == 'Success' || res.status == 'success' || res.statusCode == 'Success') {
              this.toasterSer.success(res.message, 'Success');
              this.invitationForm.reset();
              this.submitted = false;
              this.temporaryVendor();
            }
          });
        }

    }

    p(f) {
      console.log(f);

    }

    tempvendor(e){
      let isChecked = e.target.checked;
      this.validateValue = e.target.checked;
      let hsncode = this.invitationForm.get('hsncode');
      let vendorcategory = this.invitationForm.get('vendorcategory');
      let validdate = this.invitationForm.get('validdate');
      if(isChecked){
        hsncode.enable();
        vendorcategory.enable();
        validdate.enable();
      }
      else{
        hsncode.disable();
        vendorcategory.disable();
        validdate.disable();
        hsncode.reset();
        vendorcategory.reset();
        validdate.reset();
      }
    }
}
