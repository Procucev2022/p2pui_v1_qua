import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef, SimpleChange } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { VendorChooseModalPopupComponent } from './vendor-choose-modal-popup.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { EncryDecryService } from 'src/app/shared/services';
import { FormValidatationsService } from 'src/app/shared/services/form-validatations.service';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('VendorChooseModalPopupComponent', () => {
  let component: VendorChooseModalPopupComponent;
  let fixture: ComponentFixture<VendorChooseModalPopupComponent>;
  let encry: any;
  let toaster: any;
  let dialogRef: any;
  let formValidator: any;

  const vendors = [
    { id: '1', companyName: 'Acme', email: 'a@x.com', mobileNo: '9876543210', city: 'Hyd' },
    { id: '2', companyName: 'Beta', email: 'b@x.com', mobileNo: '9123456780', city: 'Blr' },
  ];

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    encry = autoMock('EncryDecryService');
    toaster = autoMock('ToastrService');
    dialogRef = autoMock('MatDialogRef');
    formValidator = {
      alphabetValidator: () => null,
      pincodeValidator: () => null,
    };
    encry.get.and.returnValue(
      JSON.stringify({
        details: {
          role: { roleName: 'CategoryManager' },
          listofPermission: ['P1'],
        },
      })
    );

    await TestBed.configureTestingModule({
      declarations: [VendorChooseModalPopupComponent],
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
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: EncryDecryService, useValue: encry },
        { provide: ToastrService, useValue: toaster },
        { provide: FormValidatationsService, useValue: formValidator },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(VendorChooseModalPopupComponent, '')
      .overrideComponent(VendorChooseModalPopupComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(VendorChooseModalPopupComponent);
    component = fixture.componentInstance;
    component.parentData = { vendorHeaders: [{ field: 'companyName' }] };
    component.vendorList = [...vendors];
    component.cached_vendorList = [...vendors];
    component.cache_vendorList = [...vendors];
    component.vendorGridData = { gridValue: [] };
    
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

  it('should init form and ngOnChanges', () => {
    component.ngOnInit();
    expect(component.roleName).toBe('CategoryManager');
    expect(component.vendorForm).toBeTruthy();
    expect(component.vendorCtrls.companyName).toBeTruthy();
    component.ngOnChanges({
      vendorList: new SimpleChange(null, vendors, true),
    });
    expect(component.vendorCartTableHeaders.length).toBe(1);
    expect(component.cache_vendorList.length).toBe(2);
  });

  it('should inline search and criteria filters', () => {
    component.cache_vendorList = [...vendors];
    component.onInlineSearch('');
    expect(component.vendorList.length).toBe(2);
    component.onInlineSearch('   ');
    component.onInlineSearch('acme');
    expect(component.vendorList.length).toBe(1);

    component.cached_vendorList = [...vendors];
    component.searchVendorName = 'Ac';
    component.onSearchCriteriaChange1('vendorName', 'Ac');
    component.onSearchCriteriaChange1('emailId', '');
    component.onSearchCriteriaChange1('emailId', 'a@');
    component.searchEmailId = 'a@x.com';
    component.onSearchCriteriaChange1('mobile', '');
    component.searchMobileNo = '987';
    component.onSearchCriteriaChange1('mobile', '987');
    component.onSearchCriteriaChange1('city', '');
    component.onSearchCriteriaChange1('city', 'Hyd');
    component.onSearchCriteriaChange1('other', 'x');
    component.onSearchCriteriaChanges();
  });

  it('should add vendors via form and row with duplicate guard', () => {
    component.ngOnInit();
    component.onAddVendorsToCart();
    expect(toaster.warning).toHaveBeenCalled();

    component.vendorForm.setValue({
      companyName: 'N',
      city: 'Hyd',
      mobileNo: '9876543210',
      email: 'n@x.com',
      name: 'Name',
      gstin: 'G',
      products: 'P',
      pinCode: '500001',
    });
    component.onAddVendorsToCart();
    expect(dialogRef.close).toHaveBeenCalled();

    component.vendorGridData = { gridValue: [{ id: '1' }] };
    component.onAddVendor(vendors[0]);
    expect(toaster.warning).toHaveBeenCalled();

    component.vendorGridData = { gridValue: [] };
    component.onAddVendor(vendors[0]);
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should addToCart and page/search emitters', () => {
    spyOn(component.onPageChange, 'emit');
    spyOn(component.onSearchMode, 'emit');
    spyOn(component.globalSearch, 'emit');
    component.onPageChanges({ page: 1 });
    component.onSearchModes('mode');
    component.globalSearchs();
    expect(component.onPageChange.emit).toHaveBeenCalled();

    component.selectedData = [];
    component.addToCart();
    expect(toaster.error).toHaveBeenCalled();

    component.selectedData = [{ id: '1' }];
    component.vendorGridData = { gridValue: [{ id: '1' }] };
    component.addToCart();
    expect(toaster.warning).toHaveBeenCalled();

    component.vendorGridData = { gridValue: [] };
    component.addToCart();
    expect(dialogRef.close).toHaveBeenCalledWith({ action: 'addToCart' });
  });

  it('should openCreateVendorWithSearchDetails validation and success', () => {
    component.searchVendorName = '';
    component.openCreateVendorWithSearchDetails();
    expect(toaster.error).toHaveBeenCalled();

    component.searchVendorName = 'Ab';
    component.searchEmailId = '';
    component.openCreateVendorWithSearchDetails();

    component.searchEmailId = 'bad';
    component.searchMobileNo = '';
    component.openCreateVendorWithSearchDetails();

    component.searchMobileNo = '123';
    component.openCreateVendorWithSearchDetails();

    component.searchEmailId = 'bad-email';
    component.openCreateVendorWithSearchDetails();

    component.searchEmailId = 'ok@test.com';
    component.searchVendorName = 'Ab';
    component.openCreateVendorWithSearchDetails();

    component.searchVendorName = 'Abc Corp';
    component.searchMobileNo = '12345';
    component.openCreateVendorWithSearchDetails();

    component.searchMobileNo = '9876543210';
    component.searchCity = 'H';
    component.openCreateVendorWithSearchDetails();

    component.searchCity = 'Hyd';
    component.searchMobileNo = '98765abc10';
    component.openCreateVendorWithSearchDetails();

    component.searchMobileNo = '9876543210';
    component.openCreateVendorWithSearchDetails();
    expect(dialogRef.close).toHaveBeenCalled();

    expect(component.validateEmail('ok@test.com')).toBe(true);
    expect(component.validateEmail('nope')).toBe(false);
  });
});
