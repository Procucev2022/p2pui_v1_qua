import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { VendorRegComponent } from './vendor-reg.component';
import { defaultAppConfig } from 'src/testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { CountriesService } from 'src/app/vendor-registration/services/countries.service';
import { VendorRegistrationService } from 'src/app/vendor-registration/services/vendor-registration.service';
import { VendorService } from 'src/app/vendor-registration/services/vendor-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';
import { FormBuilder, ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog } from '@angular/material/dialog';

describe('VendorRegComponent', () => {
  let component: VendorRegComponent;
  let fixture: ComponentFixture<VendorRegComponent>;
  let toastr: any;
  let vendorRegService: any;
  let vendorService: any;
  let countriesService: any;
  let convertSer: any;
  let encryDecryService: any;
  let matDialog: any;

  const mockVendor = {
    id: 'v-100',
    companyName: 'Acme Supplies',
    pan: 'ABCDE1234F',
    gstin: '22ABCDE1234F1Z5',
    msme: 'MSME123',
    address1: '123 Tech Park',
    city: 'Bangalore',
    state: 'Karnataka',
    zipCode: '560001',
    acceptedTerms: true,
    clientRefference: true,
    tempapproval: false,
    validdate: '2026-12-31',
    orgBranches: [{ address1: 'B1', city: 'City1', state: 'State1', zipCode: '111111' }],
    vendorProduct: [{ id: 'p1', productName: 'Prod 1' }],
    vendorService: [{ id: 's1', serviceName: 'Serv 1' }],
    vendorContact: [
      { name: 'Contact 1', email: 'c1@test.com', phone: '1234567890' },
      { name: 'Contact 2', email: 'c2@test.com', phone: '0987654321' }
    ],
    clientReference: [{ clientName: 'Client 1', contactPerson: 'John', email: 'j@test.com', phone: '123' }],
    orgBankDetails: [{ bankName: 'HDFC', accountNumber: '123456', branchName: 'Main', ifscCode: 'HDFC0001', pinCode: '560001' }],
    orgTurnOver: [{ year: '2025', amount: '1000000' }],
    documents: [{ fileName: 'doc1.pdf', file: 'QUJD' }],
    certificates: [{ fileName: 'cert1.pdf', file: 'QUJD' }],
    distributors: [{ name: 'Dist 1' }]
  };

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('orgId', 'v-100');

    toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      warning: jasmine.createSpy('warning')
    };

    vendorRegService = {
      getVendorById: jasmine.createSpy('getVendorById').and.returnValue(of(JSON.parse(JSON.stringify(mockVendor)))),
      submitVendorRegistration: jasmine.createSpy('submitVendorRegistration').and.returnValue(of({ status: 'Success', message: 'Submitted' })),
      getUpdateOrgTc: jasmine.createSpy('getUpdateOrgTc').and.returnValue(of(true)),
      saveVendorRegistration: jasmine.createSpy('saveVendorRegistration').and.returnValue(of({ status: 'Success', message: 'Saved' }))
    };

    convertSer = {
      getBase64: jasmine.createSpy('getBase64').and.returnValue(Promise.resolve('data:application/pdf;base64,QUJD'))
    };

    encryDecryService = {
      get: jasmine.createSpy('get').and.returnValue(JSON.stringify({
        details: {
          org: { companyId: 'COMP-100' }
        }
      }))
    };

    matDialog = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of(true)
      }),
      closeAll: jasmine.createSpy('closeAll')
    };

    await TestBed.configureTestingModule({
      declarations: [VendorRegComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => undefined, detectChanges: () => undefined } },
        DatePipe,
        { provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: () => ({ attach: () => undefined, enable: () => undefined, disable: () => undefined, detach: () => undefined }) },
        { provide: MatDialog, useValue: matDialog },
        { provide: CountriesService, useValue: {} },
        { provide: VendorRegistrationService, useValue: vendorRegService },
        { provide: VendorService, useValue: {} },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ regId: 'v-100' })
          }
        },
        { provide: Router, useValue: { navigateByUrl: jasmine.createSpy('navigateByUrl') } },
        { provide: ConvertToBase64Service, useValue: convertSer },
        { provide: ToastrService, useValue: toastr },
        { provide: EncryDecryService, useValue: encryDecryService },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(VendorRegComponent, '')
      .overrideComponent(VendorRegComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(VendorRegComponent);
    component = fixture.componentInstance;
  });

  it('should create, initialize form arrays and bind vendor data from API', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(vendorRegService.getVendorById).toHaveBeenCalledWith({ id: 'v-100' });
    expect(component.generalModel.companyName).toBe('Acme Supplies');
    expect(component.productsList.length).toBe(1);
    expect(component.servicesList.length).toBe(1);
    expect(component.contactsList.length).toBe(2);
    expect(component.documentsArray.length).toBe(1);
    expect(component.certificatesArray.length).toBe(1);
  });

  it('should handle getStatesArray, downloadFile, and getBase64', async () => {
    const states = component.getStatesArray();
    expect(states.length).toBeGreaterThan(20);

    component.downloadFile({});

    const blob = new Blob(['hello'], { type: 'text/plain' });
    const b64 = await component.getBase64(blob);
    expect(b64).toBeTruthy();
  });

  it('should handle document and image uploads and deletions', fakeAsync(() => {
    const file = new File(['data'], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file] } };

    component.uploadPanCard(event);
    tick();
    expect(component.isPanCardDocSaved).toBeTrue();
    expect(component.panDocTOBase64.length).toBe(1);

    component.uploadGSTIN(event);
    tick();
    expect(component.isGSTINDocSaved).toBeTrue();

    component.uploadMSME(event);
    tick();
    expect(component.isMSMEDocSaved).toBeTrue();

    component.uploadCheque(event);
    tick();
    expect(component.isChequeDocSaved).toBeTrue();

    component.uploadCertificates([file]);
    expect(component.certificatesArray.length).toBe(1);

    component.uploadDocuments([file]);
    expect(component.documentsArray.length).toBe(1);

    // Delete single doc types
    component.deletefiles('pancardDoc');
    expect(component.isPanCardDocSaved).toBeFalse();
    component.deletefiles('gstinDoc');
    expect(component.isGSTINDocSaved).toBeFalse();
    component.deletefiles('msmeDoc');
    expect(component.isMSMEDocSaved).toBeFalse();
    component.deletefiles('chequeDoc');
    expect(component.isChequeDocSaved).toBeFalse();

    // Delete attachment
    component.vendorRegObj = JSON.parse(JSON.stringify(mockVendor));
    component.deleteAttachment(0, 'certificatesArray');
    component.deleteAttachment(0, 'documentsArray');
    flush();
  }));

  it('should handle tab navigation and save methods with validations', () => {
    component.ngOnInit();

    // saveGeneral valid and invalid
    component.saveGeneral('Branches', { valid: true, value: {} } as NgForm);
    expect(component.moveTBranches).toBeFalse();

    component.saveGeneral('Branches', { valid: false, value: {} } as NgForm);
    expect(toastr.error).toHaveBeenCalledWith('Please enter all required fields', 'Failure');

    // saveBranches
    component.saveBranches('Products', { valid: true, value: {} });
    expect(component.moveTProducts).toBeFalse();

    component.saveBranches('Products', { valid: false, value: {} });

    // saveProducts & saveServices
    component.saveProducts('Services', []);
    expect(component.moveTServices).toBeFalse();

    component.saveServices('Contacts', []);
    expect(component.moveTContacts).toBeFalse();

    // saveContacts with >= 2 and < 2
    component.contactsList = [{ id: 1 }, { id: 2 }];
    component.saveContacts('ClientReferences', []);
    expect(component.moveTClentREf).toBeFalse();

    component.contactsList = [{ id: 1 }];
    component.saveContacts('ClientReferences', []);
    expect(toastr.error).toHaveBeenCalledWith('Atleast two Contacts Should be there');

    // saveClientReferences
    component.vendorRegObj = { clientRefference: true };
    component.saveClientReferences('BankDetails', []);
    expect(component.moveTBankdts).toBeFalse();
  });

  it('should handle regFormSubmit (terms accepted vs not accepted, success vs failure)', fakeAsync(() => {
    component.ngOnInit();

    // Terms not accepted -> open terms dialog
    component.vendorRegObj.acceptedTerms = false;
    component.regFormSubmit({} as NgForm, {});
    expect(matDialog.open).toHaveBeenCalled();

    // Terms accepted -> submit form
    component.vendorRegObj.acceptedTerms = true;
    component.branchesForm = new FormBuilder().group({ orgBranches: [[]] });
    component.authorizedForm = new FormBuilder().group({ isAuthorizedDistributor: false, distributors: [[]] });

    component.regFormSubmit({} as NgForm, {});
    tick(250);
    expect(vendorRegService.submitVendorRegistration).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('Submitted', 'Success');

    // Failure branch
    vendorRegService.submitVendorRegistration.and.returnValue(of({ status: 'Failure', errorMessage: 'Submit failed' }));
    component.regFormSubmit({} as NgForm, {});
    tick(250);
    expect(toastr.error).toHaveBeenCalledWith('Submit failed', 'Failure');

    // onAcceptSubmit
    component.onAcceptSubmit({});
    expect(vendorRegService.getUpdateOrgTc).toHaveBeenCalled();
    expect(matDialog.closeAll).toHaveBeenCalled();

    flush();
  }));
});
