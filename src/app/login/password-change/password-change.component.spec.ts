import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of, throwError } from 'rxjs';
import { PasswordChangeComponent } from './password-change.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EncryDecryService } from 'src/app/shared/services';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';

describe('PasswordChangeComponent', () => {
  let component: PasswordChangeComponent;
  let fixture: ComponentFixture<PasswordChangeComponent>;
  let auth: any;
  let toastr: any;
  let router: any;
  let encry: any;

  const strong = 'Abcdef1@';

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');
    localStorage.setItem('loggedUser', 'user@test.com');
    localStorage.setItem('loggedUserMobile', '9876543210');
    sessionStorage.setItem('tempEMail', 't@test.com');

    auth = autoMock('AuthenticationService');
    toastr = autoMock('ToastrService');
    router = autoMock('Router');
    encry = autoMock('EncryDecryService');
    encry.set.and.returnValue('enc');
    auth.updatePassword.and.returnValue(of({ status: 'Success', message: 'ok' }));
    auth.validateEmailOTP.and.returnValue(of({ status: 'Success', message: 'ok' }));
    auth.getLoggedUserData.and.returnValue(
      of({
        id: 'u1',
        org: { id: 'o1' },
        role: { roleName: 'VendorManager' },
        resetPassword: false,
      })
    );

    await TestBed.configureTestingModule({
      declarations: [PasswordChangeComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: autoMock('ChangeDetectorRef') },
        DatePipe,
        {
          provide: MAT_DIALOG_SCROLL_STRATEGY,
          useValue: () => ({
            attach: () => undefined,
            enable: () => undefined,
            disable: () => undefined,
            detach: () => undefined,
          }),
        },
        FormBuilder,
        { provide: ToastrService, useValue: toastr },
        { provide: Router, useValue: router },
        { provide: EncryDecryService, useValue: encry },
        { provide: AuthenticationService, useValue: auth },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(PasswordChangeComponent, '')
      .overrideComponent(PasswordChangeComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(PasswordChangeComponent);
    component = fixture.componentInstance;
    
    const sampleRow: any = {
      id: '1', vendorId: 'v1', ID: '1', name: 'n', status: 'Open', status_ui_display: 'Open',
      description: 'desc1', projectCategory: 'cat1', projectSubCategory: 'subcat1', brand: 'b1',
      quantity: 10, unitofMeasures: 'KG', unitprice: 100, excludetaxamount: 1000, gstValue: 180, totalamount: 1180,
      uom: { description: 'KG', id: 'u1' }, vendorData: ['v1'], action: null, org: { id: 'o1', companyName: 'Org1' },
      certificates: [{ fileName: 'c.pdf', file: 'AAA' }], clientStatus: { uiDisplay: 'Open' },
      createdTS: new Date().toISOString(), query: 'a|b', pricePerUnit: 10, rank: 1, city: 'City1',
      vendorName: 'Vendor1', companyId: 'comp1', lineItems: [], documents: [], items: [],
      rfqData: { id: '1' }, vendorRequest: { id: '1' }, vendorDataObj: { id: '1' },
    };
                (component as any).data = (component as any).data || { ppoId: '1', prId: '1', id: '1', status: 'Success', items: [sampleRow], lineItems: [sampleRow], vendorProduct: [sampleRow], vendorService: [sampleRow], rfqData: sampleRow, vendors: [sampleRow] };
    (component as any).rfqDataList = [sampleRow];
    (component as any).cache_rfqDataList = [sampleRow];
    (component as any).clientList = [sampleRow];

    seedComponent(component as any);
  });

  it('should init and expose password helpers', () => {
    component.ngOnInit();
    expect(component.submitted).toBe(false);
    component.passwdForm.patchValue({ oldPwd: 'old', newPwd: strong, confirmPwd: strong });
    expect(component.oldPwd.value).toBe('old');
    expect(component.newPwd.value).toBe(strong);
    expect(component.confirmPwd.value).toBe(strong);
    expect(component.hasLetter()).toBe(true);
    expect(component.hasNumber()).toBe(true);
    expect(component.hasSpecialChar()).toBe(true);
    expect(component.isMinLength()).toBe(true);
    expect(component.matchPwds(component.passwdForm)).toBeNull();
    component.passwdForm.patchValue({ confirmPwd: 'nope' });
    expect(component.matchPwds(component.passwdForm)).toEqual({ pwdsDontMatch: true });
    expect(component.passwordPatternValidator({ value: 'weak' } as any)).toEqual({
      invalidPassword: true,
    });
    expect(component.passwordPatternValidator({ value: strong } as any)).toBeNull();
  });

  it('should updatePassword success failure and invalid paths', fakeAsync(() => {
    component.passwdForm.patchValue({ oldPwd: 'old', newPwd: strong, confirmPwd: strong });
    auth.updatePassword.and.returnValue(of({ status: 'Success', message: 'ok' }));
    component.updatePassword();
    expect(toastr.success).toHaveBeenCalled();
    tick(3000);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);

    auth.updatePassword.and.returnValue(of({ status: 'Failure', message: 'bad' }));
    component.updatePassword();
    expect(toastr.error).toHaveBeenCalledWith('bad', 'Failed');

    auth.updatePassword.and.returnValue(throwError(() => new Error('net')));
    component.updatePassword();
    expect(toastr.error).toHaveBeenCalledWith(
      'Password did not updated successfully, please try again!!!',
      'Failed'
    );

    component.passwdForm.patchValue({ oldPwd: '', newPwd: 'bad', confirmPwd: 'bad' });
    component.updatePassword();
    expect(toastr.error).toHaveBeenCalled();
  }));

  it('should validate OTP branches', () => {
    component.otpNumber = null;
    component.getValidateOTP();
    expect(toastr.error).toHaveBeenCalledWith('Please enter the mandatory fields', 'Failed');

    component.otpNumber = 123;
    component.getValidateOTP();
    expect(toastr.error).toHaveBeenCalledWith('Please enter 6digits OTP value', 'Failed');

    component.otpNumber = 123456;
    component.passwdForm.patchValue({ oldPwd: 'old', newPwd: strong, confirmPwd: strong });
    auth.validateEmailOTP.and.returnValue(of({ status: 'Success', message: 'ok' }));
    auth.updatePassword.and.returnValue(of({ status: 'Failure', message: 'x' }));
    component.getValidateOTP();
    expect(component.isOTPVerified).toBe(true);
    expect(toastr.success).toHaveBeenCalledWith('OTP Verified Successfully!', 'Success');

    auth.validateEmailOTP.and.returnValue(of({ status: 'Failure', message: 'otpbad' }));
    component.getValidateOTP();
    expect(toastr.error).toHaveBeenCalledWith('otpbad', 'Failed');

    sessionStorage.removeItem('tempEMail');
    component.getValidateOTP();
  });

  it('should getOTP validate all early returns and phone branches', () => {
    component.passwdForm.reset();
    component.getOTP();
    expect(toastr.error).toHaveBeenCalledWith('Please enter Old Password ', 'Failed');

    component.passwdForm.patchValue({ oldPwd: 'old', newPwd: '', confirmPwd: '' });
    component.getOTP();
    expect(toastr.error).toHaveBeenCalledWith('Please enter New Password', 'Failed');

    component.passwdForm.patchValue({ oldPwd: 'old', newPwd: 'weak', confirmPwd: 'weak' });
    component.getOTP();
    expect(toastr.error).toHaveBeenCalled();

    component.passwdForm.patchValue({ oldPwd: 'old', newPwd: strong, confirmPwd: '' });
    component.getOTP();
    expect(toastr.error).toHaveBeenCalledWith('Please enter Confirm Password', 'Failed');

    component.passwdForm.patchValue({ oldPwd: 'old', newPwd: strong, confirmPwd: 'Other1@x' });
    // force confirm control valid but mismatched values for branch
    component.confirmPwd.setErrors(null);
    component.getOTP();
    expect(toastr.error).toHaveBeenCalledWith(
      'Confirm Password and New Password should  be same',
      'Failed'
    );

    component.passwdForm.patchValue({ oldPwd: 'old', newPwd: strong, confirmPwd: strong });
    auth.updatePassword.and.returnValue(of({ status: 'Failure', message: 'x' }));
    component.getOTP();
    expect(auth.updatePassword).toHaveBeenCalled();

    localStorage.setItem('loggedUserMobile', '+919876543210');
    component.getOTP();
    localStorage.setItem('loggedUserMobile', '9876543210');
  });

  it('should getLoggerUserData for role and resetPassword branches', () => {
    const roles = [
      'Vendor',
      'PartialVendor',
      'Registration',
      'CategoryManager',
      'CategoryManager2',
      'ClientInitiator',
      'VendorManager',
      'PRApprover',
      'VendorExecutive',
      'VendorExecutive2',
      'Admin',
    ];
    roles.forEach((roleName) => {
      auth.getLoggedUserData.and.returnValue(
        of({
          id: 'u1',
          org: { id: 'o1' },
          role: { roleName },
          resetPassword: false,
        })
      );
      component.getLoggerUserData();
    });
    expect(router.navigate).toHaveBeenCalled();

    auth.getLoggedUserData.and.returnValue(
      of({
        id: 'u1',
        org: { id: 'o1' },
        role: { roleName: 'Vendor' },
        resetPassword: true,
      })
    );
    component.getLoggerUserData();
    expect(router.navigate).toHaveBeenCalledWith(['login/passwordChange']);

    auth.getLoggedUserData.and.returnValue(of(null));
    component.getLoggerUserData();
  });

  it('should resetForm and numberOnly', () => {
    component.submitted = true;
    component.passwdForm.patchValue({ oldPwd: 'a', newPwd: strong, confirmPwd: strong });
    component.resetForm(component.passwdForm);
    expect(component.submitted).toBe(false);
    expect(component.numberOnly({ which: 49 })).toBe(true);
    expect(component.numberOnly({ keyCode: 65 })).toBe(false);
    expect(component.numberOnly({ which: 0, keyCode: 50 })).toBe(true);
  });
});
