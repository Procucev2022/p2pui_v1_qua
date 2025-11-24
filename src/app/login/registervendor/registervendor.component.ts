import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormArray, FormControl, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { VendorRegistrationService } from 'src/app/vendor-registration/services/vendor-registration.service';
import { HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { RegConfirmDialogComponent } from '../reg-confirm-dialog/reg-confirm-dialog.component';
import { ConfirmationService } from 'primeng/api';
import { FormValidatationsService } from 'src/app/shared/services/form-validatations.service';

@Component({
    selector: 'app-registervendor',
    templateUrl: './registervendor.component.html',
    styleUrls: ['./registervendor.component.scss']
})
export class RegistervendorComponent implements OnInit {
    visible: boolean;
    contactsForm: FormGroup;
    // private fb: FormBuilder;
    generalModel: any = {};
    contacts: FormArray;
    vendorRegistrationForm: FormGroup;
    isOTPVerified: boolean;
    isOTPSent: boolean;

    isValidPincode: boolean = false;
    // states: any[] = this.getStatesArray();

    constructor(private modalDialog: MatDialog, private fb: FormBuilder, private toaster: ToastrService,
        private vendorRegSer: VendorRegistrationService, private router: Router, private confirmationService: ConfirmationService,
        private cd: ChangeDetectorRef, private formValidatorService: FormValidatationsService) { }

    ngOnInit() {

        console.log('contacts form');
        console.log(this.contactsForm);
        this.generateClientForm();

    }

    generateClientForm() {
        this.vendorRegistrationForm = new FormGroup({
            name: new FormControl('', [Validators.required, this.formValidatorService.alphabetValidator]),
            companyName: new FormControl('', [Validators.required, this.formValidatorService.alphaNumericNotNumericOnly]),
            organizationPhonenumber: new FormControl('', [Validators.required, tenDigitPhoneNumberValidator()]),
            mail: new FormControl('', [Validators.required, Validators.email, strictEmailValidator()]),
            gstin: new FormControl('', [gstinValidator()]),
            india: new FormControl('true'),
            products: new FormControl('', [Validators.required]),
            mobileOtp: new FormControl(''),
            emailOtp: new FormControl(''),
            pinCode: new FormControl('', [Validators.required, this.formValidatorService.pincodeValidator])
        });

    }

    onupdatePincodeValidationStatus(event: any) {
        if (event && event.pincodeIsValid) {
            this.isValidPincode = true;
        } else {
            this.isValidPincode = false;
        }
    }
    isValidFormControls() {
        const vendorRegistrationForm = this.vendorRegistrationForm.getRawValue();
        let isValid = true;

        if (!vendorRegistrationForm.name || vendorRegistrationForm.name.trim() == '') {
            this.toaster.warning("Please enter  Name", 'Warning');
            return false;
        }
        if (this.vendorRegistrationForm.controls.name.errors && this.vendorRegistrationForm.controls.name.errors.alphabetOnly) {
            this.toaster.warning("Name must contain only alphabetic characters", 'Warning');
            return false;
        }

        if (this.vendorRegistrationForm.controls.companyName.errors) {
            this.toaster.warning("Company Name must not be numeric only", 'Warning');
            return false;
        }
        if (!vendorRegistrationForm.companyName || vendorRegistrationForm.companyName.trim() == '') {
            this.toaster.warning("Please enter  Company Name", 'Warning');
            return false;
        }
        if (this.vendorRegistrationForm.controls.organizationPhonenumber.errors) {
            this.toaster.warning("Please enter valid mobile number", 'Warning');
            return false;
        }
        if (this.vendorRegistrationForm.controls.mail.errors?.required) {
            this.toaster.warning("Please enter  email id", 'Warning');
            return false;
        }
        if (this.vendorRegistrationForm.controls.mail.errors) {
            this.toaster.warning("Please enter valid email id", 'Warning');
            return false;
        }
        if (this.vendorRegistrationForm.controls.products.errors || !vendorRegistrationForm.products || vendorRegistrationForm.products.trim() == '') {
            this.toaster.warning("Please enter valid Products", 'Warning');
            return false;
        }
        if (this.isValidPincode == false) {
            this.toaster.warning("Please validate Pin Code", 'Warning');
            return false;
        }
        return isValid;
    }

    isValidFormOTPControls() {
        const vendorRegistrationForm = this.vendorRegistrationForm.getRawValue();
        let isValid = true;

        if (!vendorRegistrationForm.name || vendorRegistrationForm.name.trim() == '') {
            this.toaster.warning("Please enter  Name", 'Warning');
            return false;
        }
        if (this.vendorRegistrationForm.controls.name.errors && this.vendorRegistrationForm.controls.name.errors.alphabetOnly) {
            this.toaster.warning("Name must contain only alphabetic characters", 'Warning');
            return false;
        }

        if (this.vendorRegistrationForm.controls.companyName.errors) {
            this.toaster.warning("Company Name must not be numeric only", 'Warning');
            return false;
        }
        if (!vendorRegistrationForm.companyName || vendorRegistrationForm.companyName.trim() == '') {
            this.toaster.warning("Please enter  Company Name", 'Warning');
            return false;
        }
        if (this.vendorRegistrationForm.controls.organizationPhonenumber.errors) {
            this.toaster.warning("Please enter valid mobile number", 'Warning');
            return false;
        }
        if (this.vendorRegistrationForm.controls.mail.errors?.required) {
            this.toaster.warning("Please enter  email id", 'Warning');
            return false;
        }
        if (this.vendorRegistrationForm.controls.mail.errors) {
            this.toaster.warning("Please enter valid email id", 'Warning');
            return false;
        }
        return isValid;
    }

    numberOnly(event): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    changeCountryValue(isIndia) {
        if (isIndia) {

            this.vendorRegistrationForm.controls['organizationPhonenumber'].setValue('');
            this.vendorRegistrationForm.controls['organizationPhonenumber'].clearValidators();
            this.vendorRegistrationForm.controls['organizationPhonenumber'].setValidators([Validators.required, tenDigitPhoneNumberValidator()]);
            this.vendorRegistrationForm.controls['gstin'].setValidators([Validators.required]);
        }
    }
    registerVendor(form: any) {
        if (!this.isOTPVerified) {
            this.toaster.error('EMail & Mobile Verification Not yet completed!', 'Failure');
            return;
        }
        // if (this.vendorRegistrationForm.valid) {

        const formValue = this.vendorRegistrationForm.getRawValue();
        if (!formValue.companyName || !formValue.name || !formValue.mail || !formValue.organizationPhonenumber || !formValue.pinCode || !formValue.products) {
            if (!formValue.companyName) {
                this.toaster.error('Please enter Company Name', 'Failure');
                return;
            } else if (!formValue.name) {
                this.toaster.error('Please enter Contact Person Name', 'Failure');
                return;
            } else if (!formValue.mail) {
                this.toaster.error('Please enter Email ID', 'Failure'); return;
            } else if (!formValue.organizationPhonenumber) {
                this.toaster.error('Please enter Phone Number', 'Failure'); return;
            } else if (!formValue.products) {
                this.toaster.error('Please enter Products', 'Failure'); return;
            }

        }

        if (!this.isValidFormControls()) {
            return;
        }

        if (this.vendorRegistrationForm.controls.gstin.errors) {
            this.toaster.warning("Please enter valid GSTIN", 'Warning');
            return false;
        }
        console.log('the form is ');
        const requestObject = {
            'companyName': formValue.companyName,
            'organizationPhonenumber': formValue.organizationPhonenumber,
            'email': formValue.mail,
            'gstin': formValue.gstin,
            'address1': formValue.address,
            'details': formValue.products,
            'india': formValue.india,
            'zipCode': formValue.pinCode,
            'isWebApp': true,
            'name': formValue.name

        };

        this.vendorRegSer.submitSelfVendorRegistration(requestObject).subscribe((r) => {
            const res = JSON.parse(JSON.stringify(r));
            if (res.status === 'Success' || res.status === 'success') {
                this.toaster.success(res.message, 'Success');
                this.confirmRegistration();

            } else {
                this.toaster.error(res.message, 'Failure');
            }
        });
        // } else {
        //     this.toaster.error('Please enter all required details', 'Failure');
        //     return;
        // }

    }

    resetVendorForm() {
        this.isOTPSent = false;
        this.vendorRegistrationForm.reset();
        this.vendorRegistrationForm.enable();
        this.isOTPVerified = false;
        // this.visible = true;
        // this.cd.detectChanges();
        //  this.confirmationService.confirm({
        //     header: 'Confirmation',
        //     rejectLabel: 'No',
        //     acceptLabel: 'Yes',
        //     message: `Are you sure about to discard the changes!`,
        //     accept: () => {
        //         this.isOTPSent = false;
        //         this.vendorRegistrationForm.reset();
        //         this.isOTPVerified = false;
        //     },
        //     reject: () => {

        //     }
        // });
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


    sendOTPs() {
        if (!this.isValidFormOTPControls()) {
            return;
        }
        const vendorRegForm = this.vendorRegistrationForm.getRawValue();
        this.isOTPSent = true;
        this.isOTPVerified = false;
        const reqPayload = {
            "tempEmail": sessionStorage.getItem('tempEMail') ? sessionStorage.getItem('tempEMail') : '',
            "tempPhone": sessionStorage.getItem('tempPhone') ? sessionStorage.getItem('tempPhone') : '',
            "companyName": vendorRegForm.companyName,
            "organizationPhonenumber": vendorRegForm.organizationPhonenumber,
            "email": vendorRegForm.mail,


        }

        this.vendorRegSer.sendAllOTPs(reqPayload).subscribe((res: any) => {
            this.isOTPSent = res && (res.otpSentToEmail && res.otpSentToMobile);
            if (this.isOTPSent) {
                this.vendorRegistrationForm.controls['mail'].disable();
                this.vendorRegistrationForm.controls['organizationPhonenumber'].disable();
                this.vendorRegistrationForm.controls['companyName'].disable();
                this.vendorRegistrationForm.updateValueAndValidity();
                this.toaster.success("OTPs sent to given Mobile & Email Id");
            } else {
                if (!res.otpSentToEmail) {
                    this.toaster.error("Email OTP sending failed", res.message);
                }
                if (!res.otpSentToMobile) {
                    this.toaster.error("Mobile OTP sending failed", res.message);
                }
            }
        })

    }
    verifyOtps() {
        if (!this.isValidFormOTPControls()) {
            return;
        }
        const vendorRegForm = this.vendorRegistrationForm.getRawValue();
        if (!vendorRegForm.emailOtp || vendorRegForm.emailOtp.toString().trim() == '') {
            this.toaster.warning("Please enter  Email OTP", 'Warning');
            return;
        } else if (vendorRegForm.emailOtp && vendorRegForm.emailOtp.toString().length !== 6) {
            this.toaster.warning("Please enter valid 6digits Email OTP", 'Warning');
            return;
        } else if (!vendorRegForm.mobileOtp || vendorRegForm.mobileOtp.toString().trim() == '') {
            this.toaster.warning("Please enter  Mobile OTP", 'Warning');
            return;
        } else if (vendorRegForm.mobileOtp && vendorRegForm.mobileOtp.toString().length !== 6) {
            this.toaster.warning("Please enter valid 6digits Mobile OTP", 'Warning');
            return;
        }
        let obj: any = {
            "companyName": this.vendorRegistrationForm.getRawValue().companyName,
            "organizationPhonenumber": this.vendorRegistrationForm.getRawValue().organizationPhonenumber,
            "email": this.vendorRegistrationForm.getRawValue().mail,
            "emailOtp": this.vendorRegistrationForm.value.emailOtp,
            "mobileOtp": this.vendorRegistrationForm.value.mobileOtp,
            "tempEmail": sessionStorage.getItem('tempEMail') ? sessionStorage.getItem('tempEMail') : '',
            "tempPhone": sessionStorage.getItem('tempPhone') ? sessionStorage.getItem('tempPhone') : '',

        }

        this.vendorRegSer.validateAllOTPs(obj).subscribe((res: any) => {
            this.isOTPVerified = res && res.status == 'success' ? true : false;
            if (this.isOTPVerified) {
                this.vendorRegistrationForm.controls['mail'].disable();
                this.vendorRegistrationForm.controls['organizationPhonenumber'].disable();
                this.vendorRegistrationForm.controls['companyName'].disable();
                this.vendorRegistrationForm.updateValueAndValidity();
                this.toaster.success(res.message, 'Success');
            } else {
                this.toaster.warning(res.message, 'Failed');
            }
        })
    }

    hasAnyErrors(): boolean {
        const controls = this.vendorRegistrationForm.controls;
        const hasErrors=  Object.keys(controls).some(key => {
            const control = controls[key];
            return control && control.invalid;
        });
        return hasErrors;
    }


}


export function tenDigitPhoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const phoneRegex = /^[1-9]{1}[0-9]{9}/; // Regex for a 10-digit phone number
        const valid = phoneRegex.test(control.value);
        return valid ? null : { 'invalidPhoneNumber': { value: control.value } };
    };
}




export function gstinValidator(): ValidatorFn {
    const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) {
            return null; // Don't validate empty value here
        }
        return GSTIN_REGEX.test(value.toUpperCase()) ? null : { invalidGstin: true };
    };
}

export function strictEmailValidator(): ValidatorFn {
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) return null;
        return EMAIL_REGEX.test(value) ? null : { invalidEmail: true };
    };
}
