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
    vendorForm: FormGroup;
    vendorRegistrationForm: FormGroup;
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
            phoneNumber: new FormControl('', [Validators.required, tenDigitPhoneNumberValidator()]),
            mail: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$')]),
            gstin: new FormControl('', [Validators.required]),
            address: new FormControl('', [Validators.required]),
            pan: new FormControl('', [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]),
            india: new FormControl('true', [Validators.required]),
            crn: new FormControl(''),
            products: new FormControl('', [Validators.required])
        });

    }


    changeCountryValue(isIndia){
        if(isIndia){

            this.vendorRegistrationForm.controls['crn'].setValue('');
            this.vendorRegistrationForm.controls['crn'].clearValidators();
            this.vendorRegistrationForm.controls['phoneNumber'].setValue('');
            this.vendorRegistrationForm.controls['phoneNumber'].clearValidators();
            this.vendorRegistrationForm.controls['phoneNumber'].setValidators([Validators.required, tenDigitPhoneNumberValidator()]);
            this.vendorRegistrationForm.controls['gstin'].setValidators([Validators.required]);
            this.vendorRegistrationForm.controls['pan'].setValidators([Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]);
            this.vendorRegistrationForm.controls['pan'].setValue('');
        }else{
            this.vendorRegistrationForm.enable();
            this.vendorRegistrationForm.controls['crn'].setValue('');
            this.vendorRegistrationForm.controls['crn'].setValidators([Validators.required]);
            this.vendorRegistrationForm.controls['pan'].clearValidators();
            this.vendorRegistrationForm.controls['gstin'].clearValidators();
            this.vendorRegistrationForm.controls['pan'].setValue('');
            this.vendorRegistrationForm.controls['gstin'].setValue('');
            this.vendorRegistrationForm.controls['phoneNumber'].setValue('');
            this.vendorRegistrationForm.controls['phoneNumber'].clearValidators();
            this.vendorRegistrationForm.controls['phoneNumber'].setValidators([Validators.required]);
        }
    }
    registerVendor( form:any) {
        if (this.vendorRegistrationForm.valid) {
            const formValue =this.vendorRegistrationForm.getRawValue();
            console.log('the form is ');
            const requestObject = {
                'companyName': formValue.name,
                'organizationPhonenumber': formValue.phoneNumber,
                'email': formValue.mail,
                'pan': formValue.pan,
                'gstin': formValue.gstin,
                'address1': formValue.address,
                'details': formValue.products,
                'india': formValue.india,
                'crn': formValue.crn

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
}


export function tenDigitPhoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const phoneRegex = /^[1-9]{1}[0-9]{9}/; // Regex for a 10-digit phone number
        const valid = phoneRegex.test(control.value);
        return valid ? null : { 'invalidPhoneNumber': { value: control.value } };
    };
}
