import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';
import { EncryDecryService } from 'src/app/shared/services';
import { VendorReqService } from '../../../../../layout/vendor-request/services/vendor-req.service';
@Component({
  selector: 'app-add-or-edit-vendor-modal',
  templateUrl: './add-or-edit-vendor-modal.component.html',
  styleUrls: ['./add-or-edit-vendor-modal.component.scss']
})
export class AddOrEditVendorModalComponent implements OnInit {
  vendorForm: FormGroup;
  isNewVendor: boolean;
  vendoryEntryType: string;
  BOQDocument: any;
  boqFile: { fileName: any; file: string; };
  formSubmitted: boolean;
  loggedUserDetails: any;
  constructor(public dialogRef: MatDialogRef<AddOrEditVendorModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private encryDecryService: EncryDecryService,
    private toaster: ToastrService,
    private modalDialog: MatDialog,
    private formBuilder: FormBuilder,
    private vendorReqService: VendorReqService,
    private converSer: ConvertToBase64Service) { }
  ngOnInit() {
    this.isNewVendor = !this.data ? true : false;
    const temp =  JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')) );
    this.loggedUserDetails = temp.details.role.roleName;
    if (this.loggedUserDetails === 'VendorManager3') {
      this.vendoryEntryType = 'bulkEntry';
    } else {
      this.vendoryEntryType = 'singleEntry';
    }
    this.createForm();
  }
  createForm() {
    if (this.isNewVendor) {
      this.vendorForm = this.formBuilder.group({
        'companyName': this.formBuilder.control('', Validators.required),
        'email': this.formBuilder.control(''),
        'organizationPhonenumber': this.formBuilder.control(''),
        'city': this.formBuilder.control('', Validators.required),
        'contactPerson': this.formBuilder.control(''),
        'vendorcategory': this.formBuilder.control('', Validators.required),
        'subCategory': this.formBuilder.control('', Validators.required),
        'hsncode': this.formBuilder.control(''),
        'website': this.formBuilder.control('', Validators.required),
      });
    } else {
      this.vendorForm = this.formBuilder.group({
        'email': this.formBuilder.control(''),
        'organizationPhonenumber': this.formBuilder.control(''),
        'vendorcategory': this.formBuilder.control('', Validators.required),
        'subCategory': this.formBuilder.control('', Validators.required),
        'city': this.formBuilder.control('', Validators.required),
        'hsncode': this.formBuilder.control(''),
      });
      this.bindFormValues();
    }
  }
  bindFormValues() {
    const controls: any = Object.keys(this.vendorForm.controls) || [];
    controls.forEach(control => {
      this.vendorForm.controls[control].setValue(this.data[control]);
    });
  }
  onVendorTypeChange() {
    this.vendorForm.reset();
    this.formSubmitted = false;
  }
  saveVendor() {
    if (this.vendoryEntryType === 'singleEntry') {
      this.formSubmitted = true;
      if (this.vendorForm.invalid) {
          this.toaster.warning('Please Enter required fields', 'Warning');
          return;
        } else {
          if (this.isNewVendor) {
            const reqObj = Object.assign({}, this.vendorForm.getRawValue());
            console.log('boj', reqObj);
            reqObj['boqfile'] = '';
            reqObj['createdBy'] = localStorage.getItem('userFullName');
            if (this.loggedUserDetails === 'VendorManager') {
              this.vendorReqService.createPreVendorDetails(reqObj).subscribe((res) => {
                if (res['status'] === 'Success') {
                  this.dialogRef.close({event: 'close'});
                  this.toaster.success(res['message'], 'Success');
                } else {
                  this.toaster.error(res['errorMessage'], 'Failed');
                }
              });
            } else {
              this.vendorReqService.createVendorByExecutive(reqObj).subscribe((res) => {
                if (res['status'] === 'Success') {
                  this.dialogRef.close({event: 'close'});
                  this.toaster.success(res['message'], 'Success');
                } else {
                  this.toaster.error(res['errorMessage'], 'Failed');
                }
              });
            }
          } else {
            const reqObj = {...this.data,  ...this.vendorForm.getRawValue()};
            const request = {
              'id': reqObj['id'],
               'email': reqObj['email'],
              'organizationPhonenumber': reqObj['organizationPhonenumber'],
              'vendorcategory': reqObj['vendorcategory'],
              'subCategory': reqObj['subCategory'],
              'city': reqObj['city'],
              'hsncode': reqObj['hsncode']
              };
            // const reqObj = {,  ...this.vendorForm.getRawValue()};
            this.vendorReqService.editPreVendorDetails(request).subscribe((res) => {
              if (res['status'] === 'Success') {
                this.dialogRef.close({event: 'close'});
                this.toaster.success(res['message'], 'Success');
              } else {
                this.toaster.error(res['errorMessage'], 'Failed');
              }
            });
          }
        }
    } else {
      if (!this.boqFile) {
        this.toaster.warning('Please upload BOQ file for Vendors', 'Warning');
        return;
      }
      const reqObj = {
        'companyName': '',
        'email': '',
        'organizationPhonenumber': '',
        'city': '',
        'contactPerson': '',
        'vendorcategory': '',
        'subCategory': '',
        'hsncode': '',
        'website': '',
        'boqfile': this.boqFile.file,
        'createdBy': localStorage.getItem('userFullName')
      };
      if (this.loggedUserDetails === 'VendorManager') {
        this.vendorReqService.createPreVendorDetails(reqObj).subscribe((res) => {
          if (res['status'] === 'Success') {
            this.dialogRef.close({event: 'close'});
            this.toaster.success(res['message'], 'Success');
          } else {
            this.toaster.error(res['errorMessage'], 'Failed');
          }
        });
      } else if (this.loggedUserDetails === 'VendorManager3') {
        const request = {'boqfile': this.boqFile.file};
        this.vendorReqService.createClientVendorsDetails(request).subscribe((res) => {
          if (res['status'] === 'Success') {
            this.dialogRef.close({event: 'close'});
            this.toaster.success(res['message'], 'Success');
          } else {
            this.toaster.error(res['errorMessage'], 'Failed');
          }
        });
      } else {
        this.vendorReqService.createVendorByExecutive(reqObj).subscribe((res) => {
          if (res['status'] === 'Success') {
            this.dialogRef.close({event: 'close'});
            this.toaster.success(res['message'], 'Success');
          } else {
            this.toaster.error(res['errorMessage'], 'Failed');
          }
        });
      }
    }
  }
  get f() {
    return this.vendorForm.controls;
  }
  uploadBOQFile($event) {
    this.BOQDocument = $event.target.files[0];
    if ((this.BOQDocument.name.split('.').pop()).toLowerCase() !== 'xlsx') {
      this.toaster.warning('Please check file format, only allowed xlsx extension files', 'Warning');
      return;
    }
    this.converSer.getBase64(this.BOQDocument).then((data: string) => {
        const temp = {
            fileName: this.BOQDocument.name,
            file: data.split(',')[1]
        };
        this.boqFile = Object.assign({}, temp);
    });
}
removeFile() {
  this.boqFile = null;
}
  reset() {
    this.vendorForm.reset();
  }
}
