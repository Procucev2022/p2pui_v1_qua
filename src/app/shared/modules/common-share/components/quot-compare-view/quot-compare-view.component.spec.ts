import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef, ElementRef, SimpleChange } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of, Subject } from 'rxjs';
import { QuotCompareViewComponent } from './quot-compare-view.component';
import { defaultAppConfig } from 'src/testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from 'src/app/layout/client/services/client-service.service';
import { EncryDecryService } from 'src/app/shared/services';
import { LoaderService } from '../../services/loader.service';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog } from '@angular/material/dialog';

describe('QuotCompareViewComponent', () => {
  let component: QuotCompareViewComponent;
  let fixture: ComponentFixture<QuotCompareViewComponent>;
  let toastr: any;
  let procService: any;
  let clientService: any;
  let encryDecryService: any;
  let loaderService: any;
  let matDialog: any;

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');

    toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      warning: jasmine.createSpy('warning')
    };

    procService = {
      getPRIdsList: jasmine.createSpy('getPRIdsList').and.returnValue(of([{ id: 'pr-1', prId: 'PR-100' }])),
      getLineItemsByPr: jasmine.createSpy('getLineItemsByPr').and.returnValue(of([{ id: 'item-1', brand: 'B1', description: 'Desc1' }])),
      getCompareQuoteExcelByPR: jasmine.createSpy('getCompareQuoteExcelByPR').and.returnValue(of({})),
      getCompareQuoteExcelByRfq: jasmine.createSpy('getCompareQuoteExcelByRfq').and.returnValue(of({})),
      downloadCapexQuoteComparison: jasmine.createSpy('downloadCapexQuoteComparison').and.returnValue(of({}))
    };

    clientService = {
      getPrById: jasmine.createSpy('getPrById').and.returnValue(of({ id: 'pr-1' })),
      getSquareFeetPrById: jasmine.createSpy('getSquareFeetPrById').and.returnValue(of(500))
    };

    encryDecryService = {
      get: jasmine.createSpy('get').and.returnValue(JSON.stringify({
        details: { role: { roleName: 'CategoryManager' } }
      }))
    };

    loaderService = {
      isLoading: new Subject<boolean>()
    };

    matDialog = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of(true)
      })
    };

    await TestBed.configureTestingModule({
      declarations: [QuotCompareViewComponent],
      imports: [CommonModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => undefined, detectChanges: () => undefined } },
        { provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: () => ({ attach: () => undefined, enable: () => undefined, disable: () => undefined, detach: () => undefined }) },
        { provide: MatDialog, useValue: matDialog },
        { provide: CatProcuRequestsService, useValue: procService },
        { provide: ToastrService, useValue: toastr },
        { provide: ClientService, useValue: clientService },
        { provide: EncryDecryService, useValue: encryDecryService },
        { provide: LoaderService, useValue: loaderService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(QuotCompareViewComponent, '<table #exportTable></table>')
      .overrideComponent(QuotCompareViewComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(QuotCompareViewComponent);
    component = fixture.componentInstance;
    (component as any).procService = procService;
    (component as any).clientService = clientService;
    (component as any).encryDecryService = encryDecryService;
    (component as any).loaderService = loaderService;
    component.exportTable = { nativeElement: document.createElement('table') } as ElementRef;
  });

  it('should create and initialize default properties', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.selectedCategoryType).toBe('PR Wise');
    expect(component.roleName).toBe('CategoryManager');
  });

  it('should handle ngOnChanges, getPRDetails, getPrsList, and getQuotData', fakeAsync(() => {
    component.prId = 'pr-1';
    component.isCreatePR = false;
    component.quoteComparisionData = component.mockResponse;
    component.ngOnChanges({
      quoteComparisionData: new SimpleChange(null, component.mockResponse, true)
    });
    expect(clientService.getPrById).toHaveBeenCalledWith({ id: 'pr-1' });
    expect(clientService.getSquareFeetPrById).toHaveBeenCalledWith({ id: 'pr-1' });

    tick(500);

    // Test ngOnChanges branch with isCreatePR true
    component.isCreatePR = true;
    component.squreFeet = null;
    (component as any).quoteComparisionData = { totalSqft: 120, vendorHeaders: [], totalItems: [], itemsHeaders: [] };
    component.ngOnChanges({
      quoteComparisionData: new SimpleChange(null, component.quoteComparisionData, true)
    });
    expect(component.prSquareFeet).toBe(120);

    tick(500);

    // getPrsList
    component.getPrsList();
    expect(procService.getPRIdsList).toHaveBeenCalled();
    expect(component.prList.length).toBe(1);

    // getQuotData
    component.selectedPr = { id: 'pr-1' };
    component.getQuotData('PR');
    expect(procService.getLineItemsByPr).toHaveBeenCalledWith({ id: 'pr-1' });
    expect(component.prItemList.length).toBe(1);

    component.categoryChange();
    expect(component.selectedPr).toBeUndefined();

    component.resetContainer();
    expect(component.vendorColHeaders).toEqual([]);
    flush();
  }));

  it('should handle getQuoteComparison, getQuotTotal, and changeQuoteView', fakeAsync(() => {
    component.getQuoteComparison(component.mockResponse);
    expect(component.vendorColHeaders.length).toBeGreaterThan(0);
    component.arrayPrepare();
    component.itemClicked({}, {}, {}, {}, 0);

    component.selectedCategoryType = 'RFQ Wise';
    component.getQuotTotal();
    component.selectedCategoryType = 'PR Wise';
    component.getQuotTotal();
    expect(component.itemArray.length).toBeGreaterThan(0);

    component.changeQuoteView();
    tick(250);
    expect(component.isLoadedComparison).toBeTrue();
    flush();
  }));

  it('should handle calculateVendorBasesTotal, getVendorBasicTotal, and getVendorSquareFeetTotal', () => {
    component.itemArray = [
      { vendorId: 'v1', pricePerUnit: 100, itemId: 'item1' },
      { vendorId: 'v2', pricePerUnit: 50, itemId: 'item2' },
      { vendorId: 'v3', pricePerUnit: 200, itemId: 'item3' }
    ];
    (component as any).itemRowHeaders = [
      { itemId: 'item1', quantity: 1 },
      { itemId: 'item2', quantity: 1 },
      { itemId: 'item3', quantity: 1 }
    ];
    (component as any).prSquareFeet = 100;

    component.calculateVendorBasesTotal();
    expect(component.vendorWiseBasicTotalArray.length).toBe(3);

    expect(component.getVendorBasicTotal({ vendorId: 'v1' }, 'perUnit')).toBe(100);
    expect(component.getVendorBasicTotal({ vendorId: 'v1' }, 'total')).toBe(100);

    const sqftVal = component.getVendorSquareFeetTotal({ vendorId: 'v1', quoteId: 'quote_perUnit' }, 'total');
    expect(sqftVal).toBe('1.0');

    const sqftValOther = component.getVendorSquareFeetTotal({ vendorId: 'v1', quoteId: 'quote_other' }, 'total');
    expect(sqftValOther).toBe('');

    const sqftValQty = component.getVendorSquareFeetTotal({ vendorName: 'qty' }, 'total');
    expect(sqftValQty).toBe(100);

    const sqftValUom = component.getVendorSquareFeetTotal({ vendorName: 'uom' }, 'total');
    expect(sqftValUom).toBe(' ');

    component.itemArray = [{ vendorId: 'v1', pricePerUnit: NaN, itemId: 'item1' }];
    component.calculateVendorBasesTotal();
    expect(component.prEstimatedValue).toBe(0);

    component.itemArray = [];
    component.calculateVendorBasesTotal();
    expect(component.prEstimatedValue).toBe(0);
  });

  it('should handle getMinMaxValue for RFQ Wise and PR Wise', () => {
    (component as any).itemRowHeaders = [{ id: 'r1', itemId: 'i1' }];
    (component as any).vendorColHeaders = [{ vendorId: 'v1' }];
    component.itemArray = [
      { id: '1', vendorId: 'v1', rfqitemId: 'r1', itemId: 'i1', totalamount: 100, quantity: 1, unitprice: 100 }
    ];

    // RFQ Wise
    component.selectedCategoryType = 'RFQ Wise';
    component.getMinMaxValue();
    expect((component as any).itemRowHeaders[0].l1Value).toBe(100);

    // PR Wise
    component.selectedCategoryType = 'PR Wise';
    component.getMinMaxValue();
    expect((component as any).itemRowHeaders[0].l1Value).toBe(100);
  });

  it('should handle onCreate for PPO and Auction with L1 check validation and length check', fakeAsync(() => {
    (component as any).itemRowHeaders = [{ description: 'Item 1', l1Value: 100 }];
    (component as any).selectedPr = { id: 'pr-1' };
    (component as any).prList = [{ id: 'pr-1' }];
    (component as any).vendorColHeaders = [{ vendorId: 'v1' }];

    // Empty items warning
    component.itemArray = [];
    component.onCreate('PPO');
    expect(toastr.warning).toHaveBeenCalledWith('Please select the items & create PPO', 'Warning');

    // Populated items PPO with non-L1 item
    component.itemArray = [
      { id: '1', isActive: true, description: 'Item 1', unitprice: 150, totalamount: 150, excludetaxamount: 150 }
    ];
    component.onCreate('PPO');
    tick(150);
    expect(matDialog.open).toHaveBeenCalled();

    // Less items than itemRowHeaders - 3
    (component as any).itemRowHeaders = new Array(10).fill({ description: 'Item', l1Value: 100 });
    component.onCreate('PPO');
    tick(150);

    // Populated items Auction
    component.onCreate('Auction');
    expect(matDialog.open).toHaveBeenCalled();

    flush();
  }));

  it('should handle checkL1Selected', () => {
    (component as any).itemRowHeaders = [{ description: 'Item 1', l1Value: 100 }];
    expect(component.checkL1Selected({ description: 'Item 1', unitprice: 100 })).toBeTrue();
    expect(component.checkL1Selected({ description: 'Item 1', unitprice: 150 })).toBeFalse();
  });

  it('should handle exportToExcel and exportExcelComparison with table download', fakeAsync(() => {
    spyOn(component, 'excelDownload');
    (component as any).selectedPr = { id: 'pr-1' };
    (component as any).selectedRFQ = 'rfq-1';

    component.selectedCategoryType = 'PR Wise';
    component.exportToExcel();
    expect(procService.getCompareQuoteExcelByPR).toHaveBeenCalledWith({ id: 'pr-1' });
    tick(2100);
    expect(component.excelDownload).toHaveBeenCalled();

    component.selectedCategoryType = 'RFQ Wise';
    component.exportToExcel();
    expect(procService.getCompareQuoteExcelByRfq).toHaveBeenCalledWith({ id: 'rfq-1' });
    tick(2100);
    expect(component.excelDownload).toHaveBeenCalled();

    component.exportExcelComparison();
    expect(procService.downloadCapexQuoteComparison).toHaveBeenCalledWith({ id: 'pr-1' });
    tick(2100);
    expect(component.excelDownload).toHaveBeenCalled();

    flush();
  }));

  it('should handle direct excelDownload', () => {
    const table = document.createElement('table');
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.textContent = 'Data';
    tr.appendChild(td);
    table.appendChild(tr);
    component.exportTable = new ElementRef(table);
    component.excelDownload({});
    expect(component.exportTable).toBeDefined();
  });

  it('should handle filterPr', () => {
    (component as any).prList = [
      { prId: 'PR-100' },
      { prId: 'PR-200' }
    ];

    component.filterPr({ query: '100' });
    expect((component as any).filteredprList).toEqual([{ prId: 'PR-100' }]);
  });
});
