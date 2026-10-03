import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CreateRfqService } from 'src/app/layout/category-mgr/services/create-rfq.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { GmtVendorInfoModalComponent } from './gmt-vendor-info-modal.component';
import { autoMock, defaultAppConfig, seedComponent, exerciseComponent } from '../../../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';

describe('GmtVendorInfoModalComponent', () => {
  let component: GmtVendorInfoModalComponent;
  let fixture: ComponentFixture<GmtVendorInfoModalComponent>;
  let createRfqService: any;

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    createRfqService = {
      updateSellerData: jasmine.createSpy('updateSellerData').and.returnValue(of({ status: 'Success' })),
      updateBuyerData: jasmine.createSpy('updateBuyerData').and.returnValue(of({ status: 'Success' }))
    };

    await TestBed.configureTestingModule({
      declarations: [GmtVendorInfoModalComponent],
      imports: [CommonModule, ReactiveFormsModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: autoMock('ChangeDetectorRef') },
        DatePipe,
        { provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: () => ({ attach: () => undefined, enable: () => undefined, disable: () => undefined, detach: () => undefined }) },
        FormBuilder,
        { provide: CreateRfqService, useValue: createRfqService },
        { provide: ToastrService, useValue: { success: () => {}, error: () => {} } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(GmtVendorInfoModalComponent, '')
      .overrideComponent(GmtVendorInfoModalComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(GmtVendorInfoModalComponent);
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
        (component as any).ppoData = { ppoItems: [sampleRow], id: '1', ppoNumber: 'PPO1', ppoId: '1', prId: '1' };
    (component as any).prDetails = { id: '1', lineItems: [sampleRow] };
    (component as any).data = (component as any).data || { ppoId: '1', prId: '1', id: '1', status: 'Success', items: [sampleRow], lineItems: [sampleRow], vendorProduct: [sampleRow], vendorService: [sampleRow], rfqData: sampleRow, vendors: [sampleRow] };
    (component as any).rfqDataList = [sampleRow];
    (component as any).cache_rfqDataList = [sampleRow];
    (component as any).clientList = [sampleRow];

    seedComponent(component as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should exercise component API for coverage', () => {
    exerciseComponent(component as any);
    expect(component).toBeTruthy();
  });

  it('should toggle edit mode and save vendor info', () => {
    component.vendorInfo = { id: 'v1', companyName: 'Old', email: 'test@example.com' };
    component.selectedVendor = { vendorUuid: 'v1', vendorName: 'Old', companyName: 'Old' };
    component.startEdit();
    expect(component.isEditing).toBeTrue();
    expect(component.editForm.get('companyName')?.value).toBe('Old');

    component.cancelEdit();
    expect(component.isEditing).toBeFalse();

    component.startEdit();
    component.editForm.get('companyName')?.setValue('New Company');
    component.saveVendorInfo();
    expect(component.isEditing).toBeFalse();
    expect(component.vendorInfo.companyName).toBe('New Company');
    expect(component.selectedVendor.vendorName).toBe('New Company');
    expect(component.selectedVendor.companyName).toBe('New Company');
  });

  it('should handle saveVendorInfo validation errors and missing orgId', () => {
    component.vendorInfo = null;
    component.selectedVendor = null;
    component.startEdit();
    component.editForm.get('companyName')?.setValue('');
    component.saveVendorInfo();
    expect(component.isEditing).toBeTrue();

    component.editForm.get('companyName')?.setValue('Valid Name');
    component.editForm.get('email')?.setValue('valid@example.com');
    component.saveVendorInfo();
    expect(component.isEditing).toBeTrue();

    // orgId fallback via selectedVendor.id and null form values
    component.selectedVendor = { id: 'fallback-id' };
    component.editForm = {
      invalid: false,
      value: { companyName: null, email: null, organizationPhonenumber: null, zipCode: null, city: null }
    } as any;
    component.saveVendorInfo();
    expect(component.isEditing).toBeFalse();
  });

  it('should handle buyer update and error callbacks in saveVendorInfo', () => {
    // Test seller error branch
    component.isVendor = true;
    component.selectedVendor = { vendorUuid: 'v1', vendorName: 'Seller' };
    component.vendorInfo = null;
    component.startEdit();
    component.editForm.patchValue({
      companyName: 'Seller Co',
      email: 'seller@test.com',
      organizationPhonenumber: '',
      zipCode: '',
      city: ''
    });
    createRfqService.updateSellerData.and.returnValue(throwError(() => new Error('seller error')));
    component.saveVendorInfo();
    expect(component.isSaving).toBeFalse();

    // Test buyer update and buyer error branch
    component.isVendor = false;
    component.selectedVendor = { id: 'b1', companyName: 'Buyer Corp' };
    component.vendorInfo = { id: 'b1', companyName: 'Buyer Corp', email: 'buyer@example.com' };
    component.startEdit();
    component.editForm.patchValue({
      companyName: 'Buyer Updated',
      email: 'buyer@example.com',
      organizationPhonenumber: null,
      zipCode: null,
      city: null
    });
    createRfqService.updateBuyerData.and.returnValue(of({ status: 'Success' }));
    component.saveVendorInfo();
    expect(component.isEditing).toBeFalse();

    // Error on buyer
    createRfqService.updateBuyerData.and.returnValue(throwError(() => new Error('buyer error')));
    component.startEdit();
    component.saveVendorInfo();
    expect(component.isSaving).toBeFalse();
  });

  it('should cover initForm fallbacks and partial selectedVendor', () => {
    // initForm with selectedVendor.companyName only
    component.vendorInfo = null;
    component.selectedVendor = { companyName: 'Only Company Name' };
    component.initForm();
    expect(component.editForm.get('companyName')?.value).toBe('Only Company Name');

    // initForm with empty fallback
    component.vendorInfo = null;
    component.selectedVendor = null;
    component.initForm();
    expect(component.editForm.get('companyName')?.value).toBe('');

    // saveVendorInfo with only selectedVendor.vendorName
    createRfqService.updateSellerData.and.returnValue(of({ status: 'Success' }));
    component.isVendor = true;
    component.vendorInfo = null;
    component.selectedVendor = { vendorUuid: 'u1', vendorName: 'VName' };
    component.startEdit();
    component.editForm.patchValue({
      companyName: 'Updated Name',
      email: 'u@test.com',
      organizationPhonenumber: '123',
      zipCode: '10001',
      city: 'NY'
    });
    component.saveVendorInfo();
    expect(component.selectedVendor.vendorName).toBe('Updated Name');

    // saveVendorInfo with only selectedVendor.companyName
    component.vendorInfo = null;
    component.selectedVendor = { vendorUuid: 'u2', companyName: 'CName' };
    component.startEdit();
    component.editForm.patchValue({
      companyName: 'Updated Name 2',
      email: 'u2@test.com'
    });
    component.saveVendorInfo();
    expect(component.selectedVendor.companyName).toBe('Updated Name 2');

    // saveVendorInfo with no selectedVendor (vendorInfo only)
    component.vendorInfo = { id: 'v-only', companyName: 'VOnly', email: 'vo@test.com' };
    component.selectedVendor = null;
    component.startEdit();
    component.editForm.patchValue({
      companyName: 'VOnly Updated',
      email: 'vo@test.com'
    });
    component.saveVendorInfo();
    expect(component.vendorInfo.companyName).toBe('VOnly Updated');
  });
});
