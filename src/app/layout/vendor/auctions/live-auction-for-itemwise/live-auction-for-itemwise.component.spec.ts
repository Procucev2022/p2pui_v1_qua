import { ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks, flush } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { LiveAuctionForItemwiseComponent } from './live-auction-for-itemwise.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { EncryDecryService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { AuctionService } from 'src/app/layout/category-mgr/services/auction.service';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('LiveAuctionForItemwiseComponent', () => {
  let component: LiveAuctionForItemwiseComponent;
  let fixture: ComponentFixture<LiveAuctionForItemwiseComponent>;
  let encry: any;
  let toastr: any;
  let auctionService: any;
  let modal: any;

  const future = new Date(Date.now() + 3600_000).toISOString();
  const past = new Date(Date.now() - 3600_000).toISOString();

  function bidData(end = future, extras: any = {}) {
    return {
      selectData: { id: 'a1', acceptedTerms: false },
      bidAuctionVendorData: {
        id: 'bav1',
        bidType: 'item',
        currentRank: 1,
        bidAmount: 100,
        remainingBid: 5,
        bidItems: [
          { id: 'bi1', quantity: 2, bidAmount: 50, lastBidamount: 40, bidCount: 1, description: 'I' },
        ],
        auction: {
          id: 'a1',
          pageRefrestInterval: 1,
          rfqCurrentLeadingPrice: 90,
          bidsLimitForVendor: true,
          scrollingText: 's',
          auctionName: 'Lot',
          auctionStarttime: future,
          auctionEndtime: end,
          minimumBidReduction: true,
          minimumBidReductionPrice: 1,
          startPrice: true,
          startpricevalue: 10,
          conductAuctionForSingleOrWhole: 'single',
          auctionType: 'open',
          showLeadingPriceToVendor: true,
          auctionCategory: 'item wise',
          rfq: { id: 'rfq1' },
          ...extras.auction,
        },
        ...extras,
      },
    };
  }

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    (window as any).__intervalCbs = [];
    (window as any).__timeoutCbs = [];
    spyOn(window, 'setInterval').and.callFake((cb: any) => {
      (window as any).__intervalCbs.push(cb);
      return ((window as any).__intervalCbs.length) as any;
    });
    spyOn(window, 'clearInterval').and.stub();
    spyOn(window, 'setTimeout').and.callFake((cb: any) => {
      (window as any).__timeoutCbs.push(cb);
      return ((window as any).__timeoutCbs.length) as any;
    });
    spyOn(window, 'clearTimeout').and.stub();

    encry = autoMock('EncryDecryService');
    toastr = autoMock('ToastrService');
    auctionService = autoMock('AuctionService');
    modal = autoMock('MatDialog');
    encry.get.and.returnValue(
      JSON.stringify({
        details: { listofPermission: ['P1'], org: { id: 'vorg' }, role: { roleName: 'Vendor' } },
      })
    );
    auctionService.getBidsByAuctionIdAndVendorId.and.returnValue(of({ id: 'bav1', ...bidData().bidAuctionVendorData }));
    auctionService.submitBidByVendorForRFQwiseOrItemwise.and.returnValue(of({ status: 'Success', message: 'ok' }));
    auctionService.getAuctionAccept.and.returnValue(of({ statusCode: '200', message: 'ok' }));

    await TestBed.configureTestingModule({
      declarations: [LiveAuctionForItemwiseComponent],
      imports: [CommonModule, FormsModule],
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
        { provide: MAT_DIALOG_DATA, useValue: bidData() },
        { provide: ToastrService, useValue: toastr },
        { provide: AuctionService, useValue: auctionService },
        { provide: MatDialog, useValue: modal },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(LiveAuctionForItemwiseComponent, '')
      .overrideComponent(LiveAuctionForItemwiseComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(LiveAuctionForItemwiseComponent);
    component = fixture.componentInstance;
    component.data = bidData() as any;
    
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

  it('should init set panel and refresh paths', () => {
    component.ngOnInit();
    expect(component.auctionItemsList.length).toBe(1);
    expect(component.showLeadingPriceToVendor).toBe(true);
    component.onPage({ page: 1 });
    component.ongetTotalBid({});
    expect(component.isEditBidAmount).toBe(true);

    component.isEditBidAmount = false;
    component.refresh();
    expect(auctionService.getBidsByAuctionIdAndVendorId).toHaveBeenCalled();

    component.isEditBidAmount = true;
    component.refresh();
    expect(component.isEditBidAmount).toBe(false);

    auctionService.getBidsByAuctionIdAndVendorId.and.returnValue(of({ status: 'Failure' }));
    component.isEditBidAmount = false;
    component.refresh();
  });

  it('should submit bid success failure sealed and open', () => {
    component.ngOnInit();
    component.bidTotalAmount = 0;
    component.onSubmitBid();
    expect(toastr.warning).toHaveBeenCalled();

    component.bidTotalAmount = 100;
    component.onSubmitBid();
    expect(modal.closeAll).toHaveBeenCalled();

    auctionService.submitBidByVendorForRFQwiseOrItemwise.and.returnValue(
      of({ status: 'Failure', errorMessage: 'bad', id: 'bav1', ...bidData().bidAuctionVendorData })
    );
    component.auctionType = 'open';
    component.onSubmitBid();

    auctionService.submitBidByVendorForRFQwiseOrItemwise.and.returnValue(
      of({ status: 'Failure', errorMessage: 'bad' })
    );
    component.auctionType = 'sealed bid';
    component.onSubmitBid();

    component.auctionType = 'open';
    component.onSubmitBid();

    // rfq null branch
    component.auctionBidAndVendorData.auction.rfq = null;
    auctionService.submitBidByVendorForRFQwiseOrItemwise.and.returnValue(of({ status: 'Success', message: 'ok' }));
    component.bidTotalAmount = 10;
    component.onSubmitBid();
  });

  it('should accept terms finish destroy and expired auction', fakeAsync(() => {
    component.data = bidData(past) as any;
    component.auctionBidAndVendorData = component.data.bidAuctionVendorData;
    component.ngOnInit();
    component.onSubmit({} as any);
    expect(toastr.success).toHaveBeenCalled();
    auctionService.getAuctionAccept.and.returnValue(of({ statusCode: '500', message: 'err' }));
    component.successCallBack({ statusCode: '500', message: 'err' });

    component.counter = { restart: jasmine.createSpy('restart') } as any;
    (window as any).__timeoutCbs = [];
    component.finishTest();
    ((window as any).__timeoutCbs || []).forEach((cb: any) => cb && cb());
    component.counter = null;
    component.finishTest();

    component.intervalTime = 1;
    component.timer = 2;
    component.itemtimeoutinteval = 3;
    component.ngOnDestroy();

    component.auctionExpired = false;
    component.intervalTime = 9;
    component.autoRefreshPage();
    component.isEditBidAmount = false;
    component.onAutoRefreshInterval();
    component.isEditBidAmount = true;
    component.onAutoRefreshInterval();

    component.auctionExpired = true;
    component.autoRefreshPage();

    component.auctionItemsList = [
      { quantity: 2, bidAmount: null, lastBidamount: 1, bidCount: 0 },
    ];
    component.ongetTotalBid({});

    component.timer = 5;
    component.auctionBidAndVendorData = bidData(future).bidAuctionVendorData;
    component.auctionExpired = false;
    component.checkBidTime();
    component.onBidTimeInterval();

    component.auctionBidAndVendorData = bidData(past).bidAuctionVendorData;
    component.timer = 6;
    component.checkBidTime();
    component.onBidTimeInterval();
    component.onItemTimeoutRefresh();

    if (component.intervalTime) { try { clearInterval(component.intervalTime); } catch (e) {} }
    if (component.timer) { try { clearInterval(component.timer); } catch (e) {} }
    if (component.itemtimeoutinteval) { try { clearTimeout(component.itemtimeoutinteval); } catch (e) {} }
    component.intervalTime = 1;
    component.timer = 2;
    component.itemtimeoutinteval = 3;
    component.ngOnDestroy();
    discardPeriodicTasks();
    try { flush(); } catch (e) {}
  }));
});
