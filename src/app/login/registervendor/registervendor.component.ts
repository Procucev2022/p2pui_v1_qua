import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormArray, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { VendorRegistrationService } from 'src/app/vendor-registration/services/vendor-registration.service';
import { HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { RegConfirmDialogComponent } from '../reg-confirm-dialog/reg-confirm-dialog.component';

@Component({
    selector: 'app-registervendor',
    templateUrl: './registervendor.component.html',
    styleUrls: ['./registervendor.component.scss']
})
export class RegistervendorComponent implements OnInit {

    contactsForm: FormGroup;
    // private fb: FormBuilder;
    generalModel: any = {};
    contacts: FormArray;
    vendorRegistrationForm: FormGroup;
    isOTPVerified: boolean;
    isOTPSent: boolean;
    // states: any[] = this.getStatesArray();

    constructor(private modalDialog: MatDialog, private fb: FormBuilder, private toaster: ToastrService, private vendorRegSer: VendorRegistrationService, private router: Router) { }

    ngOnInit() {

        console.log('contacts form');
        console.log(this.contactsForm);
        this.generateClientForm();

    }

    generateClientForm() {
        this.vendorRegistrationForm = new FormGroup({
            name: new FormControl('', [Validators.required,]),
            companyName: new FormControl('', [Validators.required,]),
            phoneNumber: new FormControl('', [Validators.required, tenDigitPhoneNumberValidator()]),
            mail: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$')]),
            gstin: new FormControl('', [Validators.required]),
            address: new FormControl('', [Validators.required]),
            india: new FormControl('true', [Validators.required]),
            products: new FormControl('', [Validators.required]),
            mobileOtp: new FormControl(''),
            emailOtp: new FormControl('')
        });

    }


    changeCountryValue(isIndia){
        if(isIndia){

            this.vendorRegistrationForm.controls['phoneNumber'].setValue('');
            this.vendorRegistrationForm.controls['phoneNumber'].clearValidators();
            this.vendorRegistrationForm.controls['phoneNumber'].setValidators([Validators.required, tenDigitPhoneNumberValidator()]);
            this.vendorRegistrationForm.controls['gstin'].setValidators([Validators.required]);
        }
    }
    registerVendor( form:any) {
      if(!this.isOTPVerified ){
        this.toaster.error('EMail & Mobile Verification Not yet completed!', 'Failure');
        return;
      }
        if (this.vendorRegistrationForm.valid) {
            const formValue =this.vendorRegistrationForm.getRawValue();
            console.log('the form is ');
            const requestObject = {
                'companyName': formValue.companyName,
                'phoneNumber': formValue.phoneNumber,
                'email': formValue.mail,
                'gstin': formValue.gstin,
                'address1': formValue.address,
                'details': formValue.products,
                'india': formValue.india,

            };

            this.vendorRegSer.submitSelfVendorRegistration(requestObject).subscribe((r) => {
                const res = JSON.parse(JSON.stringify(r));
                if (res.status === 'Success' || res.status === 'success' || res.statusCode === '1001') {
                    this.toaster.success(res.message, 'Success');
                    this.confirmRegistration();

                } else if (res.status === 'Failure' || res.status === 'failure') {
                    this.toaster.error(res.errorMessage, 'Failure');
                }
            });
        } else {
            this.toaster.error('Please enter all required details', 'Failure');
            return;
        }

    }



    createContact() {
        const fbGroup = this.fb.group({
            firstName: [''],
            email: [''],
            phone: [''],
            designation: ['']

        });


        return fbGroup;
    }

    addContact() {

        this.contacts = this.contactsForm.get('contacts') as FormArray;
        if (this.contacts.valid) {
            this.contacts.push(this.createContact());
        } else {
            this.toaster.error('Please enter all contact details', 'Failure');
            return;
        }

    }

    removeContact(i) {
        this.contacts.removeAt(i + 1);

    }


    confirmRegistration() {
        this.modalDialog.open(RegConfirmDialogComponent, {
            width: '40%',
            minHeight: '300px',
            data: 'data',
        }).afterClosed().subscribe((result) => {
            console.log('result.event', result.event);
            if (result && result.event === 'close') {
            }
        });
    }


    sendOTPs(){

      if(this.vendorRegistrationForm.value.phoneNumber && this.vendorRegistrationForm.value.mail && this.vendorRegistrationForm.value.companyName){
          this.isOTPSent = true;
          this.isOTPVerified = false;
          const reqPayload = {
            tempEmail: sessionStorage.getItem('tempEMail') ? sessionStorage.getItem('tempEMail'): '',
            tempPhone:  sessionStorage.getItem('tempPhone')? sessionStorage.getItem('tempPhone'): '',
            "companyName": this.vendorRegistrationForm.value.companyName,
            "phoneNumber":this.vendorRegistrationForm.value.phoneNumber,
            "email":this.vendorRegistrationForm.value.mail,


          }

          this.vendorRegSer.sendAllOTPs(reqPayload).subscribe((res: any) => {
            this.isOTPSent = res && (res.otpSentToEmail || res.otpSentToMobile);
            if (this.isOTPSent) {
              this.vendorRegistrationForm.controls['email'].disable();
              this.vendorRegistrationForm.controls['phoneNumber'].disable();
              this.vendorRegistrationForm.controls['companyName'].disable();
              this
              this.vendorRegistrationForm.updateValueAndValidity();
              this.toaster.success("OTPs sent to given Mobile & Email Id");
            }
        })
      }else{
        this.toaster.warning("Please Enter Company name,  EmailId & Mobile Number", 'Warning');
      }
    }
    verifyOtps() {
      if(!(this.vendorRegistrationForm.getRawValue().phoneNumber && this.vendorRegistrationForm.getRawValue().mail
      && this.vendorRegistrationForm.getRawValue().companyName && this.vendorRegistrationForm.value.emailOtp &&
      this.vendorRegistrationForm.value.mobileOtp)){
        this.toaster.warning("Please Enter Company name,  EmailId & Mobile Number", 'Warning');
        return ;
      }
        let obj: any = {
          "companyName":this.vendorRegistrationForm.getRawValue().companyName,
          "organizationPhonenumber":this.vendorRegistrationForm.getRawValue().phoneNumber,
          "email":this.vendorRegistrationForm.getRawValue().mail,
          "emailOtp":this.vendorRegistrationForm.value.emailOtp,
          "mobileOtp":this.vendorRegistrationForm.value.mobileOtp,
          "tempEmail": sessionStorage.getItem('tempEMail') ? sessionStorage.getItem('tempEMail'): '',
          "tempPhone":  sessionStorage.getItem('tempPhone')? sessionStorage.getItem('tempPhone'): '',

        }

        this.vendorRegSer.validateAllOTPs(obj).subscribe((res: any) => {
            this.isOTPVerified = res && res.status == 'success' ? true : false;
            if (this.isOTPVerified) {
                this.vendorRegistrationForm.controls['email'].disable();
                this.vendorRegistrationForm.controls['phoneNumber'].disable();
                this.vendorRegistrationForm.controls['companyName'].disable();
            }
        })
    }
}


export function tenDigitPhoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const phoneRegex = /^[1-9]{1}[0-9]{9}/; // Regex for a 10-digit phone number
        const valid = phoneRegex.test(control.value);
        return valid ? null : { 'invalidPhoneNumber': { value: control.value } };
    };
}
