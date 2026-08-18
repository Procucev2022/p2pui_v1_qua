import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { VmgrVendorInvitationComponent } from './vmgr-vendor-invitation.component';
import { defaultAppConfig } from 'src/testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { VendorInviteService } from '../services/vendor-invite.service';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';

describe('VmgrVendorInvitationComponent', () => {
  let component: VmgrVendorInvitationComponent;
  let fixture: ComponentFixture<VmgrVendorInvitationComponent>;
  let vendorInviteSer: any;
  let toastr: any;
  let encryDecryService: any;

  const mockLoggedUserData = {
    details: {
      username: 'vmgr1',
      listofPermission: ['INVITE_VENDOR']
    }
  };

  beforeEach(async () => {
    toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error')
    };

    vendorInviteSer = {
      requestRegistration: jasmine.createSpy('requestRegistration').and.returnValue(of({ status: 'Success', message: 'Invitation sent' }))
    };

    encryDecryService = {
      get: jasmine.createSpy('get').and.returnValue(JSON.stringify(mockLoggedUserData))
    };

    await TestBed.configureTestingModule({
      declarations: [VmgrVendorInvitationComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => undefined, detectChanges: () => undefined } },
        DatePipe,
        { provide: VendorInviteService, useValue: vendorInviteSer },
        { provide: ToastrService, useValue: toastr },
        { provide: EncryDecryService, useValue: encryDecryService },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(VmgrVendorInvitationComponent, '')
      .overrideComponent(VmgrVendorInvitationComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(VmgrVendorInvitationComponent);
    component = fixture.componentInstance;
  });

  it('should create and initialize form', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.invitationForm).toBeDefined();
    expect(component.f.orgName).toBeDefined();
  });

  it('should handle tempvendor toggle', () => {
    component.ngOnInit();

    // Checked true
    component.tempvendor({ target: { checked: true } });
    expect(component.invitationForm.get('hsncode').enabled).toBeTrue();

    // Checked false
    component.tempvendor({ target: { checked: false } });
    expect(component.invitationForm.get('hsncode').disabled).toBeTrue();
  });

  it('should handle onSubmit for invalid and valid forms (success, failure)', () => {
    component.ngOnInit();

    // Invalid form
    component.onSubmit();
    expect(vendorInviteSer.requestRegistration).not.toHaveBeenCalled();

    // Valid form -> Success
    component.invitationForm.patchValue({
      orgName: 'Acme Corp',
      phone: '1234567890',
      email: 'acme@test.com'
    });

    component.onSubmit();
    expect(vendorInviteSer.requestRegistration).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('Invitation sent', 'Success');

    // Valid form -> Failure
    vendorInviteSer.requestRegistration.and.returnValue(of({ status: 'Failure', errorMessage: 'Invitation failed' }));
    component.invitationForm.patchValue({
      orgName: 'Acme Corp',
      phone: '1234567890',
      email: 'acme@test.com'
    });
    component.onSubmit();
    expect(toastr.error).toHaveBeenCalledWith('Invitation failed', 'Failure');

    component.p({});
  });

  it('should cover reset behavior and alternate successful status code', () => {
    component.ngOnInit();
    component.tempvendor({ target: { checked: true } });
    component.invitationForm.patchValue({ hsncode: '1234', vendorcategory: 'Cat', validdate: new Date() });
    component.tempvendor({ target: { checked: false } });
    expect(component.invitationForm.get('hsncode').value).toBeNull();
    expect(component.validateValue).toBeFalse();

    component.invitationForm.patchValue({ orgName: 'Acme', phone: '1234567890', email: 'a@b.com' });
    vendorInviteSer.requestRegistration.and.returnValue(of({ statusCode: 'Success', message: 'Sent' }));
    component.onSubmit();
    expect(toastr.success).toHaveBeenCalledWith('Sent', 'Success');
  });

  it('should handle lowercase failure and success response statuses', () => {
    component.ngOnInit();
    component.invitationForm.patchValue({ orgName: 'Acme', phone: '1234567890', email: 'a@b.com' });

    vendorInviteSer.requestRegistration.and.returnValue(of({ status: 'failure', errorMessage: 'Rejected' }));
    component.onSubmit();
    expect(toastr.error).toHaveBeenCalledWith('Rejected', 'Failure');

    vendorInviteSer.requestRegistration.and.returnValue(of({ status: 'success', message: 'Accepted' }));
    component.onSubmit();
    expect(toastr.success).toHaveBeenCalledWith('Accepted', 'Success');
  });
});