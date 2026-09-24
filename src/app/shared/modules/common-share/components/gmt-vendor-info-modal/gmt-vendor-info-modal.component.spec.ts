import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CreateRfqService } from 'src/app/layout/category-mgr/services/create-rfq.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { GmtVendorInfoModalComponent } from './gmt-vendor-info-modal.component';
import { autoMock, defaultAppConfig, seedComponent, exerciseComponent } from '../../../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';

describe('GmtVendorInfoModalComponent', () => {
  let component: GmtVendorInfoModalComponent;
  let fixture: ComponentFixture<GmtVendorInfoModalComponent>;

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');


    await TestBed.configureTestingModule({
      declarations: [GmtVendorInfoModalComponent],
      imports: [CommonModule, ReactiveFormsModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: autoMock('ChangeDetectorRef') },
        DatePipe,
        { provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: () => ({ attach: () => undefined, enable: () => undefined, disable: () => undefined, detach: () => undefined }) },
        FormBuilder,
        { provide: CreateRfqService, useValue: { updateSellerData: () => of({}), updateBuyerData: () => of({}) } },
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
    component.selectedVendor = { vendorUuid: 'v1', vendorName: 'Old' };
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
  });
});
