import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { LinkedVendorListComponent } from './linked-vendor-list.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { EncryDecryService } from '../../../shared/services/encry-decry.service';
import { CategoryService } from '../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog } from '@angular/material/dialog';

describe('LinkedVendorListComponent', () => {
  let component: LinkedVendorListComponent;
  let fixture: ComponentFixture<LinkedVendorListComponent>;
  let encry: any;
  let catService: any;
  let modalDialog: any;
  let toaster: any;

  const logDetails = (roleName: string) =>
    JSON.stringify({
      details: {
        role: { roleName },
        ownPermissions: ['OWN1'],
        listofPermission: ['P1'],
      },
    });

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    encry = autoMock('EncryDecryService');
    catService = autoMock('CategoryService');
    modalDialog = autoMock('MatDialog');
    toaster = autoMock('ToastrService');

    encry.get.and.returnValue(logDetails('CategoryManager'));
    catService.getLinkedVendorByItemId.and.returnValue(of([]));
    catService.getClientsListByItemAndVendor.and.returnValue(of([]));
    catService.delinkVendor.and.returnValue(of({ status: 'Success', message: 'ok' }));
    catService.editItemByVendorRef.and.returnValue(of({ status: 'Success', message: 'saved' }));

    await TestBed.configureTestingModule({
      declarations: [LinkedVendorListComponent],
      imports: [CommonModule],
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
        { provide: EncryDecryService, useValue: encry },
        { provide: MatDialog, useValue: modalDialog },
        { provide: CategoryService, useValue: catService },
        { provide: ToastrService, useValue: toaster },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(LinkedVendorListComponent, '')
      .overrideComponent(LinkedVendorListComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(LinkedVendorListComponent);
    component = fixture.componentInstance;
    component.itemData = { id: 'item1', description: 'Item' };
    seedComponent(component as any);
  });

  it('should init for CategoryManager and VendorManager analytics flag', () => {
    component.ngOnInit();
    expect(component.isAnalyticsScreenShow).toBe(true);
    expect(component.roleName).toBe('CategoryManager');
    expect(catService.getLinkedVendorByItemId).toHaveBeenCalled();

    encry.get.and.returnValue(logDetails('VendorManager'));
    component.ngOnInit();
    expect(component.isAnalyticsScreenShow).toBe(true);

    encry.get.and.returnValue(logDetails('Client'));
    component.ngOnInit();
    expect(component.isAnalyticsScreenShow).toBe(false);
  });

  it('should map linked vendor list with status and empty status', () => {
    catService.getLinkedVendorByItemId.and.returnValue(
      of([
        {
          vendorId: 'v1',
          uom: { description: 'KG' },
          status: { uiDisplay: 'Active' },
          pricePerUnit: 10,
        },
        {
          vendorId: 'v2',
          uom: { description: 'EA' },
          status: null,
          pricePerUnit: 2,
        },
      ])
    );
    component.getLinkedVendorListByItemId();
    expect(component.vendorList.length).toBe(2);
    expect(component.vendorList[0].uom).toBe('KG');
    expect(component.vendorList[0].status).toBe('Active');
    expect(component.vendorList[1].status).toBe('');

    catService.getLinkedVendorByItemId.and.returnValue(of({ status: 'Failure' }));
    component.getLinkedVendorListByItemId();
    expect(component.vendorList).toEqual([]);
  });

  it('should open link modals and refresh on linked event', () => {
    const afterClosed = jasmine.createSpy('afterClosed').and.returnValue(of({ event: 'linked' }));
    modalDialog.open.and.returnValue({ afterClosed });
    catService.getLinkedVendorByItemId.calls.reset();
    catService.getLinkedVendorByItemId.and.returnValue(of([]));

    component.linkNewVendorToItems();
    expect(modalDialog.open).toHaveBeenCalled();
    expect(catService.getLinkedVendorByItemId).toHaveBeenCalled();

    afterClosed.and.returnValue(of({ event: 'linked' }));
    component.onLinkTo({ id: 'c1' });
    expect(modalDialog.open).toHaveBeenCalled();
  });

  it('should load clients by vendor and set grid data', () => {
    catService.getClientsListByItemAndVendor.and.returnValue(
      of([{ companyName: 'Acme', city: 'HYD', createdTS: '2020-01-01' }])
    );
    component.onVendorClientClick({ vendorId: 'v9' });
    expect(component.selectedData.length).toBe(1);
    expect(component.linkedVendorsList.length).toBe(1);

    catService.getClientsListByItemAndVendor.and.returnValue(of({ status: 'Failure' }));
    component.onVendorClientClick({ vendorId: 'v9' });
    expect(Array.isArray(component.linkedVendorsList)).toBe(true);

    component.setclientsListByItem([{ companyName: 'X' }]);
    expect(component.clientsListByItem.gridColumnData.length).toBe(1);
    component.setclientsListByItem(null);
    expect(component.clientsListByItem.gridColumnData).toEqual([]);
  });

  it('should delink success and failure toaster paths', () => {
    component.selectedDataOne = [{ itemId: 'i1' }, { itemId: 'i2' }];
    catService.delinkVendor.and.returnValue(of({ status: 'Success', message: 'done' }));
    component.delink();
    expect(toaster.success).toHaveBeenCalledWith('done', 'Success');

    catService.delinkVendor.and.returnValue(of({ status: 'Failure', message: 'nope' }));
    component.delink();
    expect(toaster.error).toHaveBeenCalledWith('nope', 'Error');

    component.successCallBack({ status: 'Success', message: 'ok' });
    component.successCallBack({ status: 'Error', message: 'bad' });
  });

  it('should editVendorData actions and saveItemData', () => {
    component.vendorList = [
      { vendorId: 'v1', pricePerUnit: 5, isEdit: false, isSaved: false },
      { vendorId: 'v2', pricePerUnit: 7, isEdit: false, isSaved: false },
    ];
    component.editVendorData(component.vendorList[0], 0, 'edit');
    expect(component.vendorList[0].isEdit).toBe(true);

    catService.getLinkedVendorByItemId.and.returnValue(of([]));
    catService.editItemByVendorRef.and.returnValue(of({ status: 'Success', message: 'saved' }));
    component.editVendorData(component.vendorList[0], 0, 'save');
    expect(catService.editItemByVendorRef).toHaveBeenCalled();
    expect(toaster.success).toHaveBeenCalledWith('saved', 'Success');

    component.vendorList = [{ vendorId: 'v1', pricePerUnit: 5, isEdit: true, isSaved: false }];
    component.editVendorData(component.vendorList[0], 0, 'reset');
    expect(component.vendorList[0].isEdit).toBe(false);
    component.editVendorData(component.vendorList[0], 0, 'unknown');

    catService.editItemByVendorRef.and.returnValue(of({ status: 'Failure', message: 'x' }));
    component.saveItemData({ vendorId: 'v1', pricePerUnit: 1 });
  });

  it('should open analytics for item and vendor levels', () => {
    const afterClosed = jasmine.createSpy('afterClosed').and.returnValue(of(null));
    modalDialog.open.and.returnValue({ afterClosed });

    component.showAnalyticsForSelectedItem(
      { id: 'i1', vendorName: 'V', price: 10, priceFlag: 'Y' },
      false
    );
    expect(modalDialog.open).toHaveBeenCalled();

    component.showAnalyticsForSelectedItem(
      { vendorId: 'v1', vendorName: 'V', pricePerUnit: 12, priceFlag: 'N' },
      true
    );
    expect(modalDialog.open).toHaveBeenCalled();
  });
});
