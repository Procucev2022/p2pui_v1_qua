import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of, throwError } from 'rxjs';
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
      getVendorTc: jasmine.createSpy('getVendorTc').and.returnValue(of([{ fileName: 'terms.pdf' }])),
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

    vendorService = {
      getProductsData: jasmine.createSpy('getProductsData').and.returnValue(of([{ id: 'p2' }])),
      getServicesData: jasmine.createSpy('getServicesData').and.returnValue(of([{ id: 's2' }])),
      getVendorContactsData: jasmine.createSpy('getVendorContactsData').and.returnValue(of([{ id: 'c2' }])),
      getClientRefData: jasmine.createSpy('getClientRefData').and.returnValue(of([{ id: 'r2' }]))
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
        { provide: CountriesService, useValue: {
          allCountries: jasmine.createSpy('allCountries').and.returnValue(of({ Countries: [{ States: [{ Cities: ['Bengaluru'] }] }] }))
        } },
        { provide: VendorRegistrationService, useValue: vendorRegService },
        { provide: VendorService, useValue: vendorService },
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
    countriesService = TestBed.inject(CountriesService);
    // The component subscribes synchronously before generating these forms in ngOnInit.
    component.generateBranchesForm();
    component.generateAuthorizedForm();
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
    component.branchesForm = new FormBuilder().group({ orgBranches: new FormBuilder().array([]) });
    component.authorizedForm = new FormBuilder().group({ isAuthorizedDistributor: false, distributors: new FormBuilder().array([]) });

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

    // onAcceptSubmit error branch
    vendorRegService.getUpdateOrgTc.and.returnValue(of({ errorMessage: 'Terms update failed' }));
    component.onAcceptSubmit({});
    expect(toastr.error).toHaveBeenCalledWith('Terms update failed', 'Failure');

    flush();
  }));

  it('should cover form helpers, country changes, and service getter methods', () => {
    component.generalModel = { city: 'City', gstin: 'GST', address1: 'Address', state: 'State', zipCode: '12345' };
    component.generateBranchesForm();
    const initialBranches = component.branchesForm.get('orgBranches') as any;
    component.addBranch();
    component.addBranchWithData({ branchName: 'Branch', gstin: 'G', address1: 'A', state: 'S', city: 'C', zipCode: 'Z', others: 'O' });
    expect(initialBranches.length).toBe(3);
    component.orgBranches = initialBranches;
    component.removeBranch(0);
    expect(initialBranches.length).toBe(2);
    expect(component.createBranchWithData({ branchName: 'B' }).value.branchName).toBe('B');

    component.generateAuthorizedForm();
    const distributors = component.authorizedForm.get('distributors') as any;
    component.addAuthorized();
    component.addAuthorizedWithData({ company: 'Company', type: 'Type', description: 'Description' });
    expect(distributors.length).toBe(3);
    component.distributors = distributors;
    component.removeauthorized(0);
    expect(distributors.length).toBe(2);
    expect(component.f).toBe(component.authorizedForm.controls);
    expect(component.createAuthorizedWithData({ company: 'C' }).value.company).toBe('C');

    component.getCountries();
    expect(component.countryInfo.length).toBe(1);
    component.onChangeCountry(0);
    expect(component.stateInfo.length).toBe(1);
    expect(component.cityInfo).toEqual(['Bengaluru']);
    component.onChangeCountry(99);
    component.onChangeState(0);
    expect(component.cityInfo).toEqual(['Bengaluru']);
    component.onChangeState(99);

    component.getProductsData();
    component.getServicesData();
    component.getVendorContactsData();
    component.getClientRefData();
    expect(component.productsList).toEqual([{ id: 'p2' }]);
    expect(component.servicesList).toEqual([{ id: 's2' }]);
    expect(component.contactsList).toEqual([{ id: 'c2' }]);
    expect(component.clientRefList).toEqual([{ id: 'r2' }]);
  });

  it('should handle upload null guards, upload file helpers, and failed base64 calls', fakeAsync(() => {
    const file = new File(['data'], 'test.png', { type: 'image/png' });
    expect(() => component.uploadingFiles(null)).not.toThrow();
    component.uploadingFiles({ target: { files: [file] } });
    expect(component.selectedFilesArray).toEqual([file]);
    component.removeFile(0);
    expect(component.selectedFilesArray.length).toBe(0);
    component.removeFile(0);
    component.selectedFilesArray = null;
    component.removeFile(0);

    component.uploadCertificates(null);
    component.uploadDocuments(null);
    expect(component.certificatesArray).toEqual([]);
    expect(component.documentsArray).toEqual([]);
    expect(() => component.uploadGSTIN(null)).not.toThrow();
    expect(() => component.uploadGSTIN({ target: { files: [] } })).not.toThrow();
    expect(() => component.uploadMSME(null)).not.toThrow();
    expect(() => component.uploadCheque(null)).not.toThrow();

    convertSer.getBase64.and.returnValue(Promise.reject(new Error('conversion failed')));
    component.uploadGSTIN({ target: { files: [file] } });
    component.uploadMSME({ target: { files: [file] } });
    component.uploadCheque({ target: { files: [file] } });
    tick();
    expect(component.isGSTINDocSaved).toBeTrue();
    expect(component.isMSMEDocSaved).toBeTrue();
    expect(component.isChequeDocSaved).toBeTrue();

    const oldConverter = (component as any).convertSer;
    (component as any).convertSer = null;
    expect(() => component.uploadGSTIN({ target: { files: [file] } })).not.toThrow();
    (component as any).convertSer = oldConverter;
  }));

  it('should cover dialog submit and non-submit callbacks', () => {
    const dialogResult = { event: 'submit', data: { id: 'new' } };
    matDialog.open.and.returnValue({ afterClosed: () => of(dialogResult) });
    component.productsList = [];
    component.servicesList = [];
    component.contactsList = [];
    component.clientRefList = [];
    component.onAddProduct('add', null);
    component.onAddService('add', null);
    component.onAddContact('add', null);
    component.onAddClientRef('add', null);
    expect(component.productsList).toEqual([dialogResult.data]);
    expect(component.servicesList).toEqual([dialogResult.data]);
    expect(component.contactsList).toEqual([dialogResult.data]);
    expect(component.clientRefList).toEqual([dialogResult.data]);

    matDialog.open.and.returnValue({ afterClosed: () => of({ event: 'cancel', data: { id: 'ignored' } }) });
    component.onAddProduct('edit', {});
    component.onAddService('edit', {});
    component.onAddContact('edit', {});
    component.onAddClientRef('edit', {});
    expect(component.productsList.length).toBe(1);
    expect(component.servicesList.length).toBe(1);
    expect(component.contactsList.length).toBe(1);
    expect(component.clientRefList.length).toBe(1);
  });

  it('should filter selected records and alert when nothing is selected', () => {
    spyOn(window, 'alert');
    component.productsList = [{ id: 1 }, { id: 2 }, null];
    component.selectedData = [{ id: 1 }, { id: 99 }];
    component.onDelete('productsList');
    expect(component.productsList).toEqual([{ id: 2 }]);
    expect(component.selectedData).toEqual([]);
    component.selectedData = [];
    component.onDelete('productsList');
    expect(window.alert).toHaveBeenCalledWith('please select atleast one record');
    component.selectedData = [{ id: 2 }];
    component.onDelete('missingList');
    expect(component.selectedData).toEqual([]);
  });

  it('should cover financial, turnover, authorized, and document saves', fakeAsync(() => {
    component.ngOnInit();
    spyOn(component, 'saveData').and.stub();
    spyOn(component, 'moveToSelectedTab').and.stub();
    component.vendorRegObj = { clientRefference: false, orgBranches: [{}] };

    const financialForm: any = { invalid: true, value: {} };
    component.saveFinancials('TurnOver', financialForm);
    expect(toastr.error).toHaveBeenCalledWith('Please enter all required fields', 'Failure');
    financialForm.invalid = false;
    component.saveFinancials('TurnOver', financialForm);
    expect(component.moveTOTurnOver).toBeFalse();
    expect(financialForm.value.id).toBe('v-100');

    component.saveTurnOver('Authorized', {});
    expect(component.moveTOAuthorized).toBeFalse();
    component.saveAuthorized('Documents', { invalid: true, value: { isAuthorizedDistributor: true } });
    expect(toastr.error).toHaveBeenCalledWith('Please enter all required fields', 'Failure');
    component.saveAuthorized('Documents', { invalid: false, value: { isAuthorizedDistributor: false } });
    expect(component.moveTDocuments).toBeFalse();

    component.documentsArray = [new File(['1'], 'one.pdf'), new File(['2'], 'two.pdf')];
    component.saveDocuments('Certificates', { valid: true } as NgForm);
    expect(component.moveTCertificates).toBeFalse();
    component.documentsArray = [];
    component.saveDocuments('Certificates', { valid: false } as NgForm);
    expect(toastr.error).toHaveBeenCalledWith('Pancard and GST documents are mandatory');
    tick(300);

    component.turnOver = [{ year: '', amount: '' }];
    component.addTurnOver();
    expect(component.turnOver.length).toBe(2);
    component.turnOver.push({ year: '1', amount: '1' });
    component.turnOver.push({ year: '2', amount: '2' });
    component.addTurnOver();
    expect(toastr.error).toHaveBeenCalledWith('Only last 3 years are accepted', 'Error');
    component.removeTurnOver(0);
    expect(component.turnOver.length).toBe(3);
  }));

  it('should cover binding helpers, navigation, and saveData branches', fakeAsync(() => {
    component.ngOnInit();
    component.vendorRegObj = JSON.parse(JSON.stringify(mockVendor));
    component.bindData();
    expect(component.financialModel.bankName).toBe('HDFC');
    expect(component.turnOver.length).toBe(1);
    component.moveToNextTab({ valid: true } as NgForm);
    expect(component.selectedIndex).toBe(1);
    component.moveToNextTab({ valid: false } as NgForm);
    component.moveToBackTab();
    component.onTabClick({ index: 3 });
    expect(component.selectedIndex).toBe(3);
    expect(component.prepareBranches([{ id: 1 }])).toEqual([{ id: 1 }]);
    component.generateBranchesForm();
    component.patchBranches([
      [{ branchName: 'Branch 1', city: 'City 1' }],
      [{ branchName: 'Branch 2', city: 'City 2' }]
    ]);

    component.documentsArray = [{ name: 'new.pdf' }, { name: 'old.pdf', isOldDocs: true }];
    component.certificatesArray = [{ name: 'new-cert.pdf', isOldCertificate: false }, { name: 'old-cert.pdf', isOldCertificate: true }];
    component.authorizedForm.patchValue({ isAuthorizedDistributor: true });
    component.saveData();
    tick(250);
    expect(vendorRegService.saveVendorRegistration).toHaveBeenCalled();
    expect(component.documentsArray[0].isOldDocs).toBeTrue();
    expect(component.contactsList.every(contact => contact.organization.id === 'v-100')).toBeTrue();

    // regFormSubmit with new certificates and authorized distributor
    component.vendorRegObj.acceptedTerms = true;
    component.regFormSubmit({} as NgForm, {});
    tick(300);
    expect(vendorRegService.submitVendorRegistration).toHaveBeenCalled();

    component.authorizedForm.patchValue({ isAuthorizedDistributor: false });
    component.saveData();
    tick(250);
    expect(vendorRegService.saveVendorRegistration).toHaveBeenCalled();
    expect(component.selectedIndex).toBeGreaterThan(3);
  }));

  it('should handle getBase64 rejection with MockFileReader', async () => {
    const origFileReader = (window as any).FileReader;
    class MockErrorFileReader {
      onload: any;
      onerror: any;
      readAsDataURL(file: any) {
        setTimeout(() => {
          if (this.onerror) this.onerror(new Error('Read failed'));
        }, 0);
      }
    }
    (window as any).FileReader = MockErrorFileReader;
    try {
      await component.getBase64(new Blob(['bad']));
      fail('should reject');
    } catch (e) {
      expect(e).toBeDefined();
    } finally {
      (window as any).FileReader = origFileReader;
    }
  });

  it('should handle empty binding data and service errors', () => {
    component.vendorRegObj = {
      clientReference: [], documents: [], certificates: [], vendorProduct: null,
      vendorService: null, vendorContact: null, orgBankDetails: [], orgBranches: [],
      distributors: [], orgTurnOver: []
    };
    component.bindClientRefAndDocs();
    component.bindProducts();
    component.bindServices();
    component.bindContacts();
    component.bindFinancialModelData();
    component.bindBranches();
    component.bindAuthorized();
    component.bindTurnOver();
    expect(component.productsList).toEqual([]);
    expect(component.servicesList).toEqual([]);
    expect(component.contactsList).toEqual([]);

    vendorRegService.getVendorById.and.returnValue(throwError(() => new Error('load failed')));
    expect(() => component.getVendorById('missing')).not.toThrow();
    expect(component.vendorRegObj).toBeNull();
  });

  it('should cover getFileName, country error callback, saveGeneral undefined branches, and upload edge cases', fakeAsync(() => {
    component.getFileName('test-file.pdf');

    // Country error callback
    countriesService.allCountries.and.returnValue(throwError(() => new Error('country error')));
    component.getCountries();

    // Ensure loggedUserDetails is set before saveGeneral
    component.loggedUserDetails = { org: { companyId: 'COMP-1' } };

    // saveGeneral with orgBranches[0] == undefined
    component.vendorRegObj = { orgBranches: [] };
    component.saveGeneral('Branches', { valid: true, value: {} } as NgForm);

    // saveClientReferences with clientRefference: false and true
    component.vendorRegObj = { clientRefference: false };
    component.saveClientReferences('BankDetails', {});
    component.vendorRegObj = { clientRefference: true };
    component.saveClientReferences('BankDetails', {});

    // Upload with data having no comma and file without name/extension
    const namelessFile = { size: 10 } as any;
    convertSer.getBase64.and.returnValue(Promise.resolve('RAWBASE64'));
    component.uploadGSTIN({ target: { files: [namelessFile] } });
    component.uploadMSME({ target: { files: [namelessFile] } });
    component.uploadCheque({ target: { files: [namelessFile] } });
    tick();

    // Upload with empty data
    convertSer.getBase64.and.returnValue(Promise.resolve(''));
    component.uploadGSTIN({ target: { files: [new File([''], 'test.png')] } });
    component.uploadMSME({ target: { files: [new File([''], 'test.png')] } });
    component.uploadCheque({ target: { files: [new File([''], 'test.png')] } });
    tick();
    flush();
  }));

  it('should cover null service responses, regFormSubmit failure status, and turnover empty branches', fakeAsync(() => {
    // Null service responses
    vendorService.getProductsData.and.returnValue(of(null));
    vendorService.getServicesData.and.returnValue(of(null));
    vendorService.getVendorContactsData.and.returnValue(of(null));
    vendorService.getClientRefData.and.returnValue(of(null));
    component.getProductsData();
    component.getServicesData();
    component.getVendorContactsData();
    component.getClientRefData();
    expect(component.productsList).toEqual([]);
    expect(component.servicesList).toEqual([]);
    expect(component.contactsList).toEqual([]);
    expect(component.clientRefList).toEqual([]);

    // regFormSubmit with failure status
    component.loggedUserDetails = { org: { companyId: 'COMP-100' } };
    component.vendorRegObj = JSON.parse(JSON.stringify(mockVendor));
    component.vendorRegObj.acceptedTerms = true;
    component.contactsList = [{ id: 'c1', organization: { id: 'v-100' } }];
    vendorRegService.submitVendorRegistration.and.returnValue(of({ status: 'failure', errorMessage: 'Validation error' }));
    component.regFormSubmit({} as NgForm, {});
    tick(300);
    expect(toastr.error).toHaveBeenCalledWith('Validation error', 'Failure');

    // saveData with empty turnover and null base64 lists
    component.turnOver = [{ amount: '', year: '' }];
    component.certificatesToBase64 = null as any;
    component.documentsToBase64 = null as any;
    component.authorizedForm.patchValue({ isAuthorizedDistributor: false });
    component.saveData();
    tick(250);

    // saveData with non-empty turnover
    component.turnOver = [{ amount: '500', year: '2022' }];
    component.saveData();
    tick(250);
    flush();
  }));
});
