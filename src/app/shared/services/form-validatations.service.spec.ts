import { FormControl, FormGroup } from '@angular/forms';
import { FormValidatationsService } from './form-validatations.service';

describe('FormValidatationsService', () => {
  let service: FormValidatationsService;

  beforeEach(() => {
    service = new FormValidatationsService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should validate numberOnly key events', () => {
    expect(service.numberOnly({ which: 49 })).toBe(true);
    expect(service.numberOnly({ keyCode: 8 })).toBe(true);
    expect(service.numberOnly({ which: 65 })).toBe(false);
  });

  it('should validate gstin', () => {
    const validator = service.gstinValidator();
    expect(validator(new FormControl(''))).toBeNull();
    expect(validator(new FormControl('27AAPFU0939F1ZV'))).toBeNull();
    expect(validator(new FormControl('bad'))).toEqual({ invalidGstin: true });
  });

  it('should validate alphabet only', () => {
    expect(service.alphabetValidator(new FormControl('Hello World'))).toBeNull();
    expect(service.alphabetValidator(new FormControl('Hi1'))).toEqual({ alphabetOnly: true });
  });

  it('should validate alphaNumericNotNumericOnly', () => {
    expect(service.alphaNumericNotNumericOnly(new FormControl(''))).toBeNull();
    expect(service.alphaNumericNotNumericOnly(new FormControl('AB12'))).toBeNull();
    expect(service.alphaNumericNotNumericOnly(new FormControl('123'))).toEqual({ numericOnly: true });
    expect(service.alphaNumericNotNumericOnly(new FormControl('@@@'))).toBeNull();
  });

  it('should detect invalid description and specification', () => {
    const form = new FormGroup({
      desc: new FormControl('  !!!  '),
      spec: new FormControl('!abc'),
      empty: new FormControl('   ')
    });
    form.get('desc').markAsDirty();
    form.get('spec').markAsDirty();
    form.get('empty').markAsDirty();

    expect(service.isInvalidDescription(form, 'desc')).toBe(true);
    expect(service.isInvalidSpecification(form, 'spec')).toBe(true);
    expect(service.isEmptyControl(form, 'empty')).toBe(true);
    expect(service.isEmptySpecification(form, 'empty')).toBe(true);
  });

  it('should allow valid multi-word description after trim collapse', () => {
    const form = new FormGroup({
      desc: new FormControl('valid text')
    });
    form.get('desc').markAsDirty();
    expect(service.isInvalidDescription(form, 'desc')).toBe(false);
  });

  it('should validate helpers for special chars', () => {
    expect(service.isOnlySpecialCharacters('@@@')).toBe(true);
    expect(service.isOnlySpecialCharacters('a@')).toBe(false);
    expect(service.startsWithSpecialChar('!a')).toBe(true);
    expect(service.startsWithSpecialChar('a!')).toBe(false);
  });

  it('should validate pincode', () => {
    expect(service.pincodeValidator(new FormControl(''))).toBeNull();
    expect(service.pincodeValidator(new FormControl('560001'))).toBeNull();
    expect(service.pincodeValidator(new FormControl('056001'))).toEqual({ invalidPincode: true });
    expect(service.pincodeValidator(new FormControl('111111'))).toEqual({ repeatedDigits: true });
  });
});
