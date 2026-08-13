import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { VendorLinkingToItemModalComponent } from './vendor-linking-to-item-modal.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { CategoryService } from '../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('VendorLinkingToItemModalComponent', () => {
  let component: VendorLinkingToItemModalComponent;
  let fixture: ComponentFixture<VendorLinkingToItemModalComponent>;
  let catService: any;
  let modalDialog: any;
  let toastr: any;
  let dialogRef: any;

  const itemData = {
    id: 'item1',
    description: 'Desc',
    itemNumber: 'IN-1',
    category: 'Cat',
    hsn: 'H1',
    sac: null,
  };

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    catService = autoMock('CategoryService');
    modalDialog = autoMock('MatDialog');
    toastr = autoMock('ToastrService');
    dialogRef = autoMock('MatDialogRef');

    await TestBed.configureTestingModule({
      declarations: [VendorLinkingToItemModalComponent],
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
        { provide: CategoryService, useValue: catService },
        { provide: MatDialog, useValue: modalDialog },
        { provide: ToastrService, useValue: toastr },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: itemData },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(VendorLinkingToItemModalComponent, '')
      .overrideComponent(VendorLinkingToItemModalComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(VendorLinkingToItemModalComponent);
    component = fixture.componentInstance;
    seedComponent(component as any);
  });

  it('should init form and expose getters', () => {
    component.ngOnInit();
    expect(component.type.value).toBe('hsn');
    expect(component.city.value).toBe('');
    expect(component.hsncode.value).toBe('');
    expect(component.saccode.value).toBe('');
    expect(component.companyName.value).toBe('');
  });

  it('should search vendors with empty and filled codes mapping status', () => {
    component.ngOnInit();
    catService.getVendorsSearch.and.returnValue(
      of([
        { id: 'v1', status: { uiDisplay: 'Approved' } },
        { id: 'v2', status: null },
      ])
    );
    component.searchVendor();
    expect(component.vendorList.length).toBe(2);
    expect(component.vendorList[0].status).toBe('Approved');
    expect(component.vendorList[0].isLinked).toBe(false);
    expect(component.vendorList[1].status).toBe('');

    component.hsncode.setValue('H99');
    component.saccode.setValue('S99');
    component.city.setValue('Hyd');
    component.companyName.setValue('Co');
    catService.getVendorsSearch.and.returnValue(of({ status: 'Failure' }));
    component.searchVendor();
    expect(catService.getVendorsSearch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        city: 'Hyd',
        companyName: 'Co',
        vendorCategory: [{ hsncode: 'H99' }],
        vendorserviceApprove: [{ saccode: 'S99' }],
      })
    );
  });

  it('should reset form to hsn type', () => {
    component.ngOnInit();
    component.city.setValue('x');
    component.resetForm();
    expect(component.type.value).toBe('hsn');
    expect(component.city.value).toBeNull();
  });

  it('should link unlink edit and modal paths', () => {
    component.ngOnInit();
    component.vendorList = [
      { id: 'v1', isLinked: false, isEdit: false, linkedVendorItemDetails: { uom: 'u1' } },
      { id: 'v2', isLinked: false, isEdit: false },
    ];
    component.linkUnLinkVendor(component.vendorList[0], 0, true, true);
    expect(component.vendorList[0].isLinked).toBe(true);
    expect(component.vendorList[0].isEdit).toBe(true);

    modalDialog.open.and.returnValue({
      afterClosed: () => of({ type: 'linked', data: { id: 'v1', isLinked: true } }),
    });
    component.linkUnLinkVendorModal({ id: 'v1' }, 0);
    expect(component.vendorList[0].isLinked).toBe(true);

    modalDialog.open.and.returnValue({
      afterClosed: () => of({ type: 'cancel' }),
    });
    component.editLinkedVendorData({ id: 'v2' }, 1);
    expect(component.vendorList[1].id).toBe('v2');

    modalDialog.open.and.returnValue({
      afterClosed: () => of({ type: 'linked', data: { id: 'v2', isLinked: true, edited: true } }),
    });
    component.editLinkedVendorData({ id: 'v2' }, 1);
    expect(component.vendorList[1].edited).toBe(true);

    component.unLinkVendor(component.vendorList[0], 0);
    expect(component.vendorList[0].isLinked).toBe(false);
    expect(component.vendorList[0].isEdit).toBe(false);
    expect(component.vendorList[0].linkedVendorItemDetails).toBeUndefined();
  });

  it('should submit linked vendors success and warn when none linked', () => {
    component.ngOnInit();
    component.selectedItemData = {
      id: 'item1',
      category: 'Cat',
      hsn: null,
      sac: 'SAC1',
      description: 'D',
      itemNumber: 'N',
    };
    component.vendorList = [
      {
        id: 'v1',
        isLinked: true,
        linkedVendorItemDetails: { uom: 'u1', price: 10 },
      },
    ];
    catService.LinkToVendorWithItem.and.returnValue(
      of({ status: 'Success', message: 'ok' })
    );
    component.submitForm();
    expect(toastr.success).toHaveBeenCalledWith('ok', 'Success');
    expect(dialogRef.close).toHaveBeenCalledWith({ event: 'linked' });

    catService.LinkToVendorWithItem.and.returnValue(
      of({ status: 'Failure', message: 'bad' })
    );
    component.submitForm();

    component.vendorList = [{ id: 'v2', isLinked: false }];
    component.submitForm();
    expect(toastr.warning).toHaveBeenCalledWith(
      'Please Link atleast one vendor with item',
      'Warning'
    );
  });

  it('should use hsn, sac, and empty fallbacks on submit', () => {
    component.ngOnInit();
    component.vendorList = [
      {
        id: 'v1',
        isLinked: true,
        linkedVendorItemDetails: { uom: 'u1' },
      },
    ];
    catService.LinkToVendorWithItem.and.returnValue(
      of({ status: 'Success', message: 'ok' })
    );

    component.selectedItemData = {
      id: 'item1',
      category: 'Cat',
      hsn: 'HSN1',
      sac: 'SAC1',
    };
    component.submitForm();
    expect(catService.LinkToVendorWithItem.calls.mostRecent().args[0][0].hsn).toBe('HSN1');

    component.selectedItemData = {
      id: 'item1',
      category: 'Cat',
      hsn: null,
      sac: 'SAC1',
    };
    component.submitForm();
    expect(catService.LinkToVendorWithItem.calls.mostRecent().args[0][0].hsn).toBe('SAC1');

    component.selectedItemData = {
      id: 'item1',
      category: 'Cat',
      hsn: null,
      sac: null,
    };
    component.submitForm();
    expect(catService.LinkToVendorWithItem.calls.mostRecent().args[0][0].hsn).toBe('');
    expect(component.checkAnyVendorLinkedOrNot()).toBe(true);
  });
});
