import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormArray, FormControl, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { VendorRegistrationService } from 'src/app/vendor-registration/services/vendor-registration.service';
import { AppApiConfig } from './../../../app/shared/constants/app-api.config';
import { RegConfirmDialogComponent } from '../reg-confirm-dialog/reg-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationService } from 'primeng/api';
@Component({
    selector: 'app-client-register',
    templateUrl: './client-register.component.html',
    styleUrls: ['./client-register.component.scss']
})
export class ClientRegisterComponent implements OnInit {

    generalModel: any = {};
    states = AppApiConfig.STATES;
    sectors = [
        "Steel", "Cement", "Sugar", "Retail", "Pharma", "Chemical",
        "Other Manufacturing", "Other Services", "Others"
    ];
    clientRegForm: FormGroup;
    isPanExist: boolean = false;
    existedClientDetails: any;
    isEmailExists: any;
    successMessage: any = '';
    showOtpBox: boolean;
    isOTPVerified: boolean;
    panVerificationIniatiated: boolean = false;
    otp: any;
    isClientDataView:boolean;
    isOTPSent: boolean = false;

    constructor(private modalDialog:MatDialog, private toaster: ToastrService, private vendorRegSer: VendorRegistrationService,
        private confirmationService: ConfirmationService,  private cd: ChangeDetectorRef,  private router: Router) { }

    ngOnInit() {
        console.log('contacts form');
        this.generateClientForm();
    }

    generateClientForm() {
        this.clientRegForm = new FormGroup({
            name: new FormControl('', [Validators.required,]),
            companyName: new FormControl('', [Validators.required]),
            organizationPhonenumber: new FormControl('',[Validators.required, tenDigitPhoneNumberValidator()]),
            email: new FormControl('', [Validators.required,Validators.email,  strictEmailValidator()]),
            // clientSector: new FormControl('', [Validators.required]), 
            // pan: new FormControl('', [Validators.required, Validators.pattern('[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[a-zA-Z0-9]{3}')]),
            india: new FormControl('true', [Validators.required]),
            emailOtp: new FormControl(''),
            mobileOtp: new FormControl(''),
            pinCode: new FormControl('', [Validators.required])
        });
        // this.clientRegForm.disable();

    }


    sendOTP() {
        if (this.clientRegForm.value.email) {
            if (this.isEmailExists) {
                this.toaster.warning("Email already exists!", 'Warning');
                return false;
            }
            this.vendorRegSer.sendOTP({ email: this.clientRegForm.value.email }).subscribe((res: any) => {
                if (res && res.status == 'Success') {
                    this.toaster.success(res.message, 'Success');
                    this.showOtpBox = true;
                } else {
                    this.toaster.warning(res.message, 'Warning');

                }
            })
        } else {
            this.toaster.warning("Please enter EmailId", 'Warning');

        }
    }

    sendOTPs() {
        const clientRegForm = this.clientRegForm.getRawValue();
        if (clientRegForm.organizationPhonenumber && clientRegForm.email && clientRegForm.companyName) {
            this.isOTPSent = true;
            this.isOTPVerified = false;
            const reqPayload = {
                tempEmail: sessionStorage.getItem('tempEMail') ? sessionStorage.getItem('tempEMail') : '',
                tempPhone: sessionStorage.getItem('tempPhone') ? sessionStorage.getItem('tempPhone') : '',
                "companyName": clientRegForm.companyName,
                "organizationPhonenumber": clientRegForm.organizationPhonenumber,
                "email": clientRegForm.email,


            }

            this.vendorRegSer.sendAllOTPs(reqPayload).subscribe((res: any) => {
                this.isOTPSent = res && (res.otpSentToEmail && res.otpSentToMobile);
                if (this.isOTPSent) {
                    this.clientRegForm.controls['email'].disable();
                    this.clientRegForm.controls['organizationPhonenumber'].disable();
                    this.clientRegForm.controls['companyName'].disable();
                    this.clientRegForm.updateValueAndValidity();
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
        } else {
            this.toaster.warning("Please Enter Company name,  EmailId & Mobile Number", 'Warning');
        }
    }
    verifyOtps() {

        if (this.clientRegForm.getRawValue().organizationPhonenumber && this.clientRegForm.getRawValue().email && this.clientRegForm.getRawValue().companyName &&
            this.clientRegForm.getRawValue().emailOtp && this.clientRegForm.getRawValue().mobileOtp) {
            let obj: any = {
                "companyName": this.clientRegForm.getRawValue().companyName,
                "organizationPhonenumber": this.clientRegForm.getRawValue().organizationPhonenumber,
                "email": this.clientRegForm.getRawValue().email,
                "emailOtp": this.clientRegForm.value.emailOtp.toString(),
                "mobileOtp": this.clientRegForm.value.mobileOtp.toString(),
                "tempEmail": sessionStorage.getItem('tempEMail') ? sessionStorage.getItem('tempEMail') : '',
                "tempPhone": sessionStorage.getItem('tempPhone') ? sessionStorage.getItem('tempPhone') : '',
            }

            this.vendorRegSer.validateAllOTPs(obj).subscribe((res: any) => {
                this.isOTPVerified = res && res.status == 'success' ? true : false;
                if (this.isOTPVerified) {
                    this.clientRegForm.controls['email'].disable();
                    this.clientRegForm.controls['organizationPhonenumber'].disable();
                    this.clientRegForm.controls['companyName'].disable();
                    this.clientRegForm.updateValueAndValidity();
                    this.toaster.success(res.message, 'Success');
                } else {
                    this.toaster.error(res.message, 'Failed');
                }
            },
                (error) => {
                    this.toaster.error('OTP Verification Failed', 'Failed');    
                });
        } else {
            this.toaster.warning("Please Enter Company name,  EmailId & Mobile Number, OTPs ", 'Warning');
        }
    }

    onlyPanEnable() {
        Object.keys(this.clientRegForm.controls).forEach(ctrl => {
            if (!['pan'].includes(ctrl)) {
                this.clientRegForm.controls[ctrl].setValue('');
                this.clientRegForm.controls[ctrl].disable();
            } else {
                this.clientRegForm.controls[ctrl].enable();
            }
        })
    }

    onValidatePan() {
        if (this.clientRegForm.controls.pan.errors) {
            this.toaster.warning("Invalid GST", "Warning")
            return;
        }

        if (this.isPanExist || this.panVerificationIniatiated) {
            this.resetOtherCtrlExceptPan();
            this.onlyPanEnable();

            return;
        } else {

            let obj: any = { "pan": this.transformPan() };
            // this.vendorRegSer.panOrEamilValidation(obj).subscribe((res: any) => {
            //     this.isPanExist = res.exists ? res.exists : false;
            //     if (this.isPanExist)
            //         this.clientRegForm.disable();
            //     else
            //         this.clientRegForm.controls.pan.disable();
            //         this.panVerificationIniatiated = true;
            // })
            // if (!this.isPanExist) {
            //     this.clientRegForm.enable();
            // }
        }

    }

    transformPan() {
        const splitGST = this.clientRegForm.getRawValue().pan.split('');
        const pan = splitGST.slice(2, splitGST.length - 3).join('');
        return pan;
    }

    // getDetailsByPan() {
    //     this.existedClientDetails = null;
    //     this.isEmailExists = false;
    //     let obj: any = { "pan": this.transformPan() }
    //     this.vendorRegSer.getDetailsByPan(obj).subscribe((res: any) => {
    //         console.log('pan details', res)
    //         if (res && res.id) {
    //             this.existedClientDetails = res;
    //             this.updateFormData();
    //         }

    //     })
    // }
    // updateFormData() {
    //     this.clientRegForm.patchValue({
    //         name: '',
    //         companyName: this.existedClientDetails.companyName,
    //         organizationPhonenumber: this.existedClientDetails.organizationPhonenumber,
    //         address1: this.existedClientDetails.address1,
    //         state: this.existedClientDetails.state,
    //         email: ''
    //     })
    //     this.enableDisableFormCtrl();

    // }
    enableDisableFormCtrl() {
        Object.keys(this.clientRegForm.controls).forEach(ctrl => {
            if (!['name', 'email', 'organizationPhonenumber'].includes(ctrl)) {
                this.clientRegForm.controls[ctrl].disable();
            } else {
                this.clientRegForm.controls[ctrl].enable();
            }
        })
    }

    resetOtherCtrlExceptPan() {
        this.successMessage = '';
        this.isOTPVerified = false;
        this.showOtpBox = false;
        this.isPanExist = false;
        this.existedClientDetails = null;
        this.panVerificationIniatiated = false;
        this.isEmailExists = false;
    }
    clientRegFormReset() {
        this.clientRegForm.reset();
        this.clientRegForm.enable();
        this.existedClientDetails = null;
        this.isPanExist = false;
        this.isEmailExists = false;
        this.successMessage = '';
        this.isOTPVerified = false;
        this.showOtpBox = false;
        this.isOTPSent = false;
        this.panVerificationIniatiated = false;
        // this.onlyPanEnable();

    }

    resetWholeForm() {
        this.isOTPSent = false;
        this.clientRegFormReset();
        this.clientRegForm.enable();
        this.isOTPVerified = false;
        this.isOTPSent = false;
        // this.cd.detectChanges();
        //  this.confirmationService.confirm({
        //     header: 'Confirmation',
        //     rejectLabel: 'No',
        //     acceptLabel: 'Yes',
        //     message: `Are you sure about to discard the changes!`,
        //     accept: () => {

        //     },
        //     reject: () => {

        //     }
        // });
    }

    checkEmailValidity() {
        if (this.clientRegForm.value.email) {
            let obj: any = { "email": this.clientRegForm.value.email };
            this.vendorRegSer.panOrEamilValidation(obj).subscribe((res: any) => {
                this.isEmailExists = res.exists ? res.exists : false;
                this.isOTPVerified = false;
                if (!this.isEmailExists) {
                    this.showOtpBox = false;
                    this.otp = '';
                }
            })
        } else {
            this.toaster.warning("Please Enter Email for Validation", "Warning")
        }
    }

    isInvalidPAN() {
        return !this.clientRegForm.controls['pan'].value
    }
    numberOnly(event): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    registerVendor(clientRegForm: FormGroup) {
        console.log(clientRegForm);
        if (clientRegForm.valid) {
            if (!this.isOTPVerified) {
                this.toaster.warning("Email & Mobile verification is Pending, Pls do that!", "Warning")
                return false;
            }
            console.log('the form is ');
            const regData = this.clientRegForm.getRawValue();
            // const splitGST = this.clientRegForm.getRawValue().pan.split('');
            // const pan = splitGST.slice(2, splitGST.length-3).join('')
            const requestObject = {
                'name': regData.name,
                'companyName': regData.companyName,
                'organizationPhonenumber': regData.organizationPhonenumber,
                'email': regData.email,
                'clientSector': '',
                'pan': '',
                'india': regData.india,
                'crn': '',
                'zipCode': regData.pinCode,
                'isWebApp': true
            };
            this.vendorRegSer.submitSelfClientRegistration(requestObject).subscribe((r) => {
                const res = JSON.parse(JSON.stringify(r));
                if (res.status === 'Success' || res.status === 'success' || res.statusCode === '1001') {
                    this.toaster.success(res.message, 'Success');
                    this.successMessage = res.message;
                    this.clientRegFormReset();
                    this.confirmRegistration();
                    this.panVerificationIniatiated = false;

                } else if (res.status === 'Failure' || res.status === 'failure') {
                    this.toaster.error(res.errorMessage, 'Failure');
                }
            });
        } else {
            this.toaster.error('Please enter all required details', 'Failure');
            return;
        }
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

}

export function tenDigitPhoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const phoneRegex = /^[1-9]{1}[0-9]{9}/; // Regex for a 10-digit phone number
        const valid = phoneRegex.test(control.value);
        return valid ? null : { 'invalidPhoneNumber': { value: control.value } };
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