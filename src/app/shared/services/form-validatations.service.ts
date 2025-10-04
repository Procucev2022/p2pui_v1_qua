import { Injectable } from '@angular/core';
import { AbstractControl, Form, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidatationsService {

  constructor() { }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  gstinValidator(): ValidatorFn {
    const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null; // Don't validate empty value here
      }
      return GSTIN_REGEX.test(value.toUpperCase()) ? null : { invalidGstin: true };
    };
  }

  
  alphabetValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isValid = /^[A-Za-z\s]*$/.test(value); // allows letters and spaces
    return isValid ? null : { alphabetOnly: true };
  }

  alphaNumericNotNumericOnly(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const hasLetters = /[A-Za-z]/.test(value);
  const isNumericOnly = /^[0-9]+$/.test(value);

  return hasLetters || !isNumericOnly ? null : { numericOnly: true };
}


  isInvalidDescription(formName: FormGroup, controlName: string) {
    let description = formName.controls[controlName].value?.trim();
    if (description && description.split(' ').length > 1) {
      description = description.replace(/\s+/g, '');
    }
    return (formName.controls[controlName].dirty) &&
      (this.isOnlySpecialCharacters(description) ||
        this.startsWithSpecialChar(description));
  }

  isEmptyControl(formName: FormGroup, controlName: string) {
    return formName.controls[controlName].dirty && formName.controls[controlName].value.trim() == '';
  }
  isEmptySpecification(formName: FormGroup, controlName: string) {
    return this.isEmptyControl(formName, controlName);
  }

  isInvalidSpecification(formName: FormGroup, controlName: string) {
    let controlValue = formName.controls[controlName].value?.trim();
    if (controlValue && controlValue.split(' ').length > 1) {
      controlValue = controlValue.replace(/\s+/g, '');
    }
    return (formName.controls[controlName].dirty) &&
      (this.isOnlySpecialCharacters(controlValue) ||
        this.startsWithSpecialChar(controlValue));
  }


  isOnlySpecialCharacters(controlValue: string): boolean {
    const regex = /^[^a-zA-Z0-9\s]+$/;

    return regex.test(controlValue);
  }

  startsWithSpecialChar(controlValue: string): boolean {
    const regex = /^[^a-zA-Z0-9]/;
    return regex.test(controlValue);
  }


  

pincodeValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  // Check for exactly 6 digits
  const pinRegex = /^[1-9][0-9]{5}$/;
  if (!pinRegex.test(value)) return { invalidPincode: true };

  // Check if all digits are the same
  const repeated = /^(\d)\1{5}$/.test(value);
  return repeated ? { repeatedDigits: true } : null;
}

}
