import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PpoViewModalComponent } from 'src/app/shared/modules/common-share/components/ppo-view-modal/ppo-view-modal.component';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';
import { EncryDecryService } from 'src/app/shared/services';
import { ClientService } from '../../client/services/client-service.service';
import { InvoicesService } from '../invoices.service';

@Component({
  selector: 'app-create-edit-advance-payment-requests',
  templateUrl: './create-edit-advance-payment-requests.component.html',
  styleUrls: ['./create-edit-advance-payment-requests.component.scss']
})
export class CreateEditAdvancePaymentRequestsComponent implements OnInit {
  advncForm: FormGroup;
  formSubmitted = false;
  advanceModes = [ {codeDesc: 'Absolute Value', codeValue: 'absolute'}, {codeDesc: 'Percentage(%) Value', codeValue: 'percentage'}];
  attachments: any = [];
  loggedUserDetails: any;
  loggedUserPermissions: any;
  isPaymentView = false;
  roleName: any;
  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<PpoViewModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private encryDecryService: EncryDecryService,
    private toaster: ToastrService,
    private invoiceService: InvoicesService,
    private convertSer: ConvertToBase64Service,
    private modalDialog: MatDialog) { }

  ngOnInit() {
    console.log('data', this.data);
    const temp = JSON.parse(
      this.encryDecryService.get('perm', localStorage.getItem('logData'))
    );
    this.loggedUserDetails = temp.details;
    this.roleName = this.loggedUserDetails.role.roleName === 'Registration' ? 'Vendor' : this.loggedUserDetails.role.roleName;
    this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
    this.advncForm = this.formBuilder.group({
      'advanceMode': this.formBuilder.control('', Validators.required),
      'includingGst': this.formBuilder.control('', Validators.required),
      'poValue': this.formBuilder.control(this.data.poValue),
      'basicAmount': this.formBuilder.control(this.data.basicAmount),
      'totalAmount': this.formBuilder.control(''),
      'advanceValue': this.formBuilder.control('', Validators.required),
      'advanceAmount': this.formBuilder.control('', Validators.required)
    });
    if (!this.data.isView) {
    this.advncForm.patchValue({advanceMode : 'percentage', includingGst: 'false'});

    this.f.advanceMode.valueChanges.subscribe((change) => {
      this.f.advanceValue.setValue(null);
     });
    this.f.includingGst.valueChanges.subscribe((chagne) => this.getAdvanceAmount());
    this.f.advanceValue.valueChanges.subscribe((change) => this.getAdvanceAmount());
    }
    this.isPaymentView = false;
    if (!this.data.isNewPayment) {
      this.bindFormData();
      this.attachments = [...this.data.documents];
    }
    if (this.data.isView) {
      this.isPaymentView = true;
      this.advncForm.disable();
      this.getAdvanceAmount();
    }
  }

  bindFormData() {
    this.data.includingGst = String(this.data.includingGst);
    const controls  = Object.keys(this.advncForm.controls);
    controls.forEach((control) => {
      console.log(control, String(this.data[control]));
      this.advncForm.controls[control].setValue(this.data[control]);
    });
    console.log('form value', this.advncForm.getRawValue());
  }

  getAdvanceAmount() {
    console.log('this.f.advanceMode.value', this.f.advanceMode.value);
    if (this.f.advanceMode.value) {
      if (this.f.advanceMode.value === 'absolute' ) {
        this.f.advanceAmount.setValue(this.f.includingGst.value === 'true' ?  this.f.advanceValue.value :  this.f.advanceValue.value);
      } else if (this.f.advanceMode.value === 'percentage' ) {
        this.f.advanceAmount.setValue( this.f.includingGst.value === 'true' ?  ( Number(this.data.poValue) / 100) * Number(this.f.advanceValue.value) :  (this.data.basicAmount / 100) * Number(this.f.advanceValue.value));
      } else {
        this.f.advanceAmount.setValue(null);
      }
    } else {
      this.f.advanceAmount.setValue(null);
    }
  }

  get f() {
    // console.log('a', this.advncForm.controls.advanceMode);
    return this.advncForm.controls;
  }
  getAttachedDocsList(event) {
    console.log('event from attachment', event);
    this.attachments = event['attachedDocuments'];
  }

  reset() {
    this.advncForm.reset();
  }


  saveAdvancePayment() {
    if (this.advncForm.valid) {
      console.log(this.advncForm.getRawValue());
      const finalPayload = {...this.advncForm.getRawValue(), ...{documents: this.attachments}};
      finalPayload['client'] = this.data['clientId'];
      finalPayload['vendor'] = this.loggedUserDetails.org.id;
      finalPayload['po'] = {id: this.data.id};
      if (this.data.isNewPayment) {
        this.invoiceService.createPOAdvancePayment(finalPayload).subscribe((res) => {
          if (res['status'] === 'Success') {
            this.dialogRef.close({event: 'close'});
            this.toaster.success(res['message'], 'Success');
          } else {
            this.toaster.error(res['message'], 'Failed');
          }
        });
     } else {
       const editPayload = {...this.data, ...finalPayload};
      this.invoiceService.editPOAdvancePayment(editPayload).subscribe((res) => {
        if (res['status'] === 'Success') {
          this.dialogRef.close({event: 'close'});
          this.toaster.success(res['message'], 'Success');
        } else {
          this.toaster.error(res['message'], 'Failed');
        }
      });
     }
    } else {
      this.toaster.warning('Please enter required fileds', 'Warning');
    }
  }

  acceptPayment() {
    if (this.data.status.uiDisplay === 'Accepted') {
      this.toaster.warning('Sorry!, Payment already approved.', 'Warning');
      return;
    }
    this.invoiceService.acceptPOAdvancePayment({id: this.data.id}).subscribe((res) => {
      if (res['status'] === 'Success') {
        this.dialogRef.close({event: 'close'});
        this.toaster.success(res['message'], 'Success');
      } else {
        this.toaster.error(res['message'], 'Failed');
      }
    });
  }

}
