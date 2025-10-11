import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormArray, FormControl, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { VendorRegistrationService } from 'src/app/vendor-registration/services/vendor-registration.service';
import { AppApiConfig } from './../../../app/shared/constants/app-api.config';
import { RegConfirmDialogComponent } from '../reg-confirm-dialog/reg-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationService } from 'primeng/api';
import { FormValidatationsService } from 'src/app/shared/services/form-validatations.service';
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
    isValidPincode: boolean = false;

    constructor(private modalDialog:MatDialog, private toaster: ToastrService, private vendorRegSer: VendorRegistrationService,
        private confirmationService: ConfirmationService,  private cd: ChangeDetectorRef,  
        private router: Router, private formValidatorService: FormValidatationsService) { }

    ngOnInit() {
        console.log('contacts form');
        this.generateClientForm();
    }

    generateClientForm() {
        this.clientRegForm = new FormGroup({
            name: new FormControl('', [Validators.required, this.formValidatorService.alphabetValidator]),
            companyName: new FormControl('', [Validators.required, this.formValidatorService.alphaNumericNotNumericOnly]),
            organizationPhonenumber: new FormControl('',[Validators.required, tenDigitPhoneNumberValidator()]),
            email: new FormControl('', [Validators.required,Validators.email,  strictEmailValidator()]),
            // clientSector: new FormControl('', [Validators.required]), 
            // pan: new FormControl('', [Validators.required, Validators.pattern('[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[a-zA-Z0-9]{3}')]),
            india: new FormControl('true' ),
            emailOtp: new FormControl(''),
            mobileOtp: new FormControl(''),
            pinCode: new FormControl('', [Validators.required, this.formValidatorService.pincodeValidator]),
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

    isValidFormControls(){
        const clientRegForm = this.clientRegForm.getRawValue();
        let isValid = true;
      
         if(!clientRegForm.name  || clientRegForm.name.trim() == ''){
            this.toaster.warning("Please enter  Name", 'Warning'); 
            return false;
        }
        if(   this.clientRegForm.controls.name.errors && this.clientRegForm.controls.name.errors.alphabetOnly ){
            this.toaster.warning("Name must contain only alphabetic characters", 'Warning');
            return false;
        } 

        if( this.clientRegForm.controls.companyName.errors ){
            this.toaster.warning("Company Name must not be numeric only", 'Warning');
            return false;
        }
         if(!clientRegForm.companyName || clientRegForm.companyName.trim() == '' ){
            this.toaster.warning("Please enter  Company Name", 'Warning');
            return false;
        } 
        if(this.clientRegForm.controls.organizationPhonenumber.errors ){
            this.toaster.warning("Please enter valid mobile number", 'Warning');
            return false;
        }
          if(this.clientRegForm.controls.email.errors?.required){
            this.toaster.warning("Please enter  email id", 'Warning');
            return false;
        }
        if(this.clientRegForm.controls.email.errors ){
            this.toaster.warning("Please enter valid email id", 'Warning');
            return false;
        }
        return isValid;
    }

    sendOTPs() {
        const clientRegForm = this.clientRegForm.getRawValue();
        if(!this.isValidFormControls()){
            return;
        }
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
          if(!this.isValidFormControls()){
            return;
        }
        const clientRegForm = this.clientRegForm.getRawValue();
        if(!clientRegForm.emailOtp || clientRegForm.emailOtp.toString().trim() == '' ){
            this.toaster.warning("Please enter  Email OTP", 'Warning');
            return;
        }else if(clientRegForm.emailOtp && clientRegForm.emailOtp.toString().length !== 6  ){
            this.toaster.warning("Please enter valid 6digits Email OTP", 'Warning');
            return;
        }else if(!clientRegForm.mobileOtp || clientRegForm.mobileOtp.toString().trim() == '' ){
            this.toaster.warning("Please enter  Mobile OTP", 'Warning');    
            return;
        }else if(clientRegForm.mobileOtp && clientRegForm.mobileOtp.toString().length !== 6  ){
            this.toaster.warning("Please enter valid 6digits Mobile OTP", 'Warning');
            return;
        }
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
                    this.clientRegForm.controls['name'].disable();
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
        }

    }

    transformPan() {
        const splitGST = this.clientRegForm.getRawValue().pan.split('');
        const pan = splitGST.slice(2, splitGST.length - 3).join('');
        return pan;
    }
 
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

    onupdatePincodeValidationStatus(event:any){
        if(event && event.pincodeIsValid){ 
            this.isValidPincode = true; 
        } else {
            this.isValidPincode = false;
        }
    }

    registerVendor(clientRegForm: FormGroup) {
        console.log(clientRegForm);
        // if (clientRegForm.valid) {
            
            if (!this.isOTPVerified) {
                this.toaster.warning("Email & Mobile verification is Pending, Pls do that!", "Warning")
                return false;
            }
            console.log('the form is ');
            const regData = this.clientRegForm.getRawValue();
            if(!regData.companyName || !regData.name || !regData.email || !regData.organizationPhonenumber || !regData.pinCode){
                if(!regData.companyName){
                    this.toaster.error('Please enter Company Name', 'Failure'); 
                } else if(!regData.name){
                    this.toaster.error('Please enter Name', 'Failure'); 
                } else if(!regData.email){
                    this.toaster.error('Please enter Email', 'Failure');    
                } else if(!regData.organizationPhonenumber){
                    this.toaster.error('Please enter Mobile Number', 'Failure');    
                } else if(!regData.pinCode){
                    this.toaster.error('Please enter Pin Code', 'Failure');
                }   
                return;
            }
            if(this.clientRegForm.controls['email'].errors){
                this.toaster.error('Please enter valid Email', 'Failure'); 
                return;
            } 
            if(this.clientRegForm.controls['name'].errors){
                this.toaster.error('Please enter valid Name', 'Failure'); 
                return;
            }
            if(this.clientRegForm.controls['organizationPhonenumber'].errors){
                this.toaster.error('Please enter valid Mobile Number', 'Failure'); 
                return;
            }
            if(this.clientRegForm.controls['pinCode'].errors){
                this.toaster.error('Please enter valid Pin Code', 'Failure'); 
                return;
            }
            if(!this.isValidPincode){
                this.toaster.error('Please validate Pin Code', 'Failure'); 
                return;
            }
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
                if (res.status === 'Success' || res.status === 'success' ) {
                    this.toaster.success(res.message, 'Success');
                    this.successMessage = res.message;
                    this.clientRegFormReset();
                    this.confirmRegistration();
                    this.panVerificationIniatiated = false;

                } else  {
                    this.toaster.error(res.message, 'Failure');
                }
            });
        // } 
        // else {
        //     this.toaster.error('Please enter all required details', 'Failure');
        //     return;
        // }
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