import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { CapexCatMgrQuoteComparComponent } from './capex-cat-mgr-quote-compar.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { CategoryService } from 'src/app/layout/category/services/category.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog } from '@angular/material/dialog';

describe('CapexCatMgrQuoteComparComponent', () => {
  let component: CapexCatMgrQuoteComparComponent;
  let fixture: ComponentFixture<CapexCatMgrQuoteComparComponent>;
  let procService: any;
  let catService: any;
  let modalDialog: any;

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    procService = autoMock('CatProcuRequestsService');
    catService = autoMock('CategoryService');
    modalDialog = autoMock('MatDialog');
    procService.getCapexPRidsList.and.returnValue(of([{ id: 'pr1', prId: 'PR-001', Status: 'Open' }]));
    procService.getVendorsByPRIdForCapex.and.returnValue(of([]));
    catService.createQuoteComparisionCAPEX.and.returnValue(
      of({
        vendorHeaders: [{ vendorId: 'v1', name: 'V1' }],
        itemsHeaders: [{ field: 'f1' }],
        totalItems: [
          { pricePerUnit: '10', quantity: '2', id: 'i1', isActive: true, pritemId: 'p1', totalamount: 20, excludetaxamount: 18 },
          { pricePerUnit: 'x', quantity: 'y', id: null, isActive: true, pritemId: 'quotTotId123', totalamount: 0, excludetaxamount: 0 },
          { pricePerUnit: '5', quantity: '1', id: 'i2', isActive: false, pritemId: 'p2', totalamount: 5, excludetaxamount: 4 },
        ],
      })
    );

    await TestBed.configureTestingModule({
      declarations: [CapexCatMgrQuoteComparComponent],
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
        { provide: MatDialog, useValue: modalDialog },
        { provide: CatProcuRequestsService, useValue: procService },
        { provide: ToastrService, useValue: autoMock('ToastrService') },
        { provide: CategoryService, useValue: catService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(CapexCatMgrQuoteComparComponent, '')
      .overrideComponent(CapexCatMgrQuoteComparComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(CapexCatMgrQuoteComparComponent);
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

  it('should load PR list array and non-array branches', () => {
    component.ngOnInit();
    expect(component.prList.length).toBe(1);
    expect(component.displayMessageTextBox).toBe(false);

    procService.getCapexPRidsList.and.returnValue(of({ status: 'Failure' }));
    component.getPrsListForAll();
    expect(component.prList_forAll).toEqual([]);
    expect(component.prList).toEqual([]);
  });

  it('should filterPr and auto-select single match', () => {
    component.prList = [
      { id: '1', prId: 'PR-100' },
      { id: '2', prId: 'PR-200' },
      { id: '3', prId: null },
    ];
    component.filterPr({ query: ' pr-1 ' });
    expect(component.filteredprList.length).toBe(1);
    expect(component.selectedPr.prId).toBe('PR-100');

    component.filterPr({ query: 'PR' });
    expect(component.filteredprList.length).toBe(2);
  });

  it('should createQuoteComparision and populate grids', fakeAsync(() => {
    component.selectedPr = { id: ' pr1 ' };
    component.createQuoteComparision();
    expect(catService.createQuoteComparisionCAPEX).toHaveBeenCalledWith({ id: 'pr1' });
    tick(300);
    expect(component.showQuoteComp).toBe(true);
    expect(component.itemArray.length).toBeGreaterThan(0);
    expect(component.vendorColHeaders).toBeTruthy();
    component.updateQuoteComparisonData({});
  }));

  it('should onCreate accumulate totals and open Auction dialog', () => {
    component.selectedPr = { id: 'pr1' };
    component.prList = [{ id: 'pr1', Status: 'Open', prId: 'PR-001' }];
    component.vendorColHeaders = [{ vendorId: 'v1' }];
    component.itemRowHeaders = [{ id: 'h1' }];
    component.itemArray = [
      { isActive: true, pritemId: 'p1', id: 'i1', totalamount: 100, excludetaxamount: 90 },
      { isActive: true, pritemId: 'quotTotId123', id: 't', totalamount: 999, excludetaxamount: 1 },
      { isActive: false, pritemId: 'p2', id: 'i2', totalamount: 5, excludetaxamount: 4 },
      { isActive: true, pritemId: 'p3', id: null, totalamount: 50, excludetaxamount: 40 },
    ];
    modalDialog.open.and.returnValue({ afterClosed: () => of(null) });
    component.onCreate('Auction');
    expect(component.displayMessageTextBox).toBe(true);
    expect(component.finalPPOData.length).toBe(2);
    expect(modalDialog.open).toHaveBeenCalled();

    component.onCreate('PPO');
    expect(component.displayMessageTextBox).toBe(true);
  });

  it('should prChange set status and reset containers', () => {
    component.prList = [
      { id: 'pr1', Status: 'Open' },
      { id: 'pr2', Status: 'Closed' },
    ];
    component.vendorColHeaders = [1];
    component.itemRowHeaders = [1];
    component.itemArray = [1];
    component.prChange({ id: 'pr2' });
    expect(component.selectedPrStatus).toBe('Closed');
    expect(procService.getVendorsByPRIdForCapex).toHaveBeenCalled();
    expect(component.itemArray).toEqual([]);
    component.resetContainer();
  });
});
