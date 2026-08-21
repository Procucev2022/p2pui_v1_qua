import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { ItemListByVendorComponent } from './item-list-by-vendor.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { CategoryService } from '../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';

describe('ItemListByVendorComponent', () => {
  let component: ItemListByVendorComponent;
  let fixture: ComponentFixture<ItemListByVendorComponent>;
  let catService: any;
  let toastr: any;
  let setIntervalSpy: jasmine.Spy;

  const nowHHmm = () => {
    const d = new Date();
    const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    setIntervalSpy = spyOn(window, 'setInterval').and.returnValue(1 as any);
    catService = autoMock('CategoryService');
    toastr = autoMock('ToastrService');
    catService.getItemsByVendorRef.and.returnValue(of([]));
    catService.editItemByVendorRef.and.returnValue(of({ status: 'Success', message: 'ok' }));

    await TestBed.configureTestingModule({
      declarations: [ItemListByVendorComponent],
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
        { provide: CategoryService, useValue: catService },
        { provide: ToastrService, useValue: toastr },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(ItemListByVendorComponent, '')
      .overrideComponent(ItemListByVendorComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(ItemListByVendorComponent);
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

  it('should load items and map status branches', () => {
    catService.getItemsByVendorRef.and.returnValue(
      of([
        { itemId: '1', vendorId: 'v1', status: { uiDisplay: 'Open' }, vendorDynamicPricingEnabled: false },
        { itemId: '2', vendorId: 'v1', status: null, vendorDynamicPricingEnabled: false },
      ])
    );
    component.ngOnInit();
    expect(component.itemList.length).toBe(2);
    expect(component.itemList[0].status).toBe('Open');
    expect(component.itemList[1].status).toBe('Approved');
    expect(setIntervalSpy).toHaveBeenCalled();

    catService.getItemsByVendorRef.and.returnValue(of({ status: 'Failure' }));
    component.getItemsByVendor();
    expect(component.itemList).toEqual([]);
  });

  it('should enableEdit for weekly daily and disabled pricing', () => {
    const day = component.weekday[new Date().getDay()];
    const t = nowHHmm();
    component.itemList = [
      {
        vendorDynamicPricingEnabled: true,
        dynamicPricingType: 'Weekly',
        dynamicPricingDay: day,
        startTime: '00:00',
        endTime: '23:59',
      },
      {
        vendorDynamicPricingEnabled: true,
        dynamicPricingType: 'Weekly',
        dynamicPricingDay: 'NotADay',
        startTime: '00:00',
        endTime: '23:59',
      },
      {
        vendorDynamicPricingEnabled: true,
        dynamicPricingType: 'Daily',
        startTime: '00:00',
        endTime: '23:59',
      },
      {
        vendorDynamicPricingEnabled: true,
        dynamicPricingType: 'Daily',
        startTime: '00:00',
        endTime: '00:01',
      },
      { vendorDynamicPricingEnabled: false },
    ];
    component.enableEdit();
    expect(component.itemList[0].editCheck).toBe(false);
    expect(component.itemList[1].editCheck).toBe(true);
    expect(component.itemList[2].editCheck).toBe(false);
    expect(component.itemList[4].editCheck).toBe(true);
    expect(component.dateFormat(t)).toContain(t + ':00');
  });

  it('should editVendorData warn and switch actions', () => {
    const rows = [
      { editCheck: true, isEdit: false, isSaved: false, itemId: '1', vendorId: 'v1', pricePerUnit: 5 },
      { editCheck: false, isEdit: false, isSaved: false, itemId: '2', vendorId: 'v1', pricePerUnit: 9 },
    ];
    component.itemList = rows;
    expect(component.editVendorData(component.itemList[0], 0, 'edit')).toBe(true);
    expect(toastr.warning).toHaveBeenCalledWith('Please Contact Procucev Associate.');

    component.editVendorData(component.itemList[1], 1, 'edit');
    expect(component.itemList[1].isEdit).toBe(true);
    // Keep list intact after Success refresh so later actions still have index 1
    catService.getItemsByVendorRef.and.returnValue(of([{ ...rows[1], status: { uiDisplay: 'Open' } }]));
    catService.editItemByVendorRef.and.returnValue(of({ status: 'Success', message: 'ok' }));
    component.editVendorData(component.itemList[1], 1, 'save');
    expect(catService.editItemByVendorRef).toHaveBeenCalled();

    component.itemList = [
      { editCheck: false, isEdit: true, isSaved: false, itemId: '2', vendorId: 'v1', pricePerUnit: 9 },
    ];
    component.editVendorData(component.itemList[0], 0, 'reset');
    expect(component.itemList[0].isEdit).toBe(false);
    component.editVendorData(component.itemList[0], 0, 'unknown');
  });

  it('should bulkSave warn or save edited rows and handle failure', () => {
    component.itemList = [{ isEdit: false }];
    component.bulkSave();
    expect(toastr.warning).toHaveBeenCalledWith('No Records is edit mode', 'Warning');

    component.itemList = [
      { isEdit: true, itemId: '1', vendorId: 'v1', pricePerUnit: 3 },
    ];
    catService.editItemByVendorRef.and.returnValue(of({ status: 'Failure' }));
    component.bulkSave();
    expect(catService.editItemByVendorRef).toHaveBeenCalled();

    catService.editItemByVendorRef.and.returnValue(of({ status: 'Success', message: 'saved' }));
    catService.getItemsByVendorRef.and.returnValue(of([]));
    component.saveItemData(component.itemList[0]);
    expect(toastr.success).toHaveBeenCalledWith('saved', 'Success');
  });
});
