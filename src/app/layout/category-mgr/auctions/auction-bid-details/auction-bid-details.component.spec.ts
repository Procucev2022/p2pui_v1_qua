import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { AuctionBidDetailsComponent } from './auction-bid-details.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { EncryDecryService } from 'src/app/shared/services';
import { AuctionService } from '../../services/auction.service';
import { MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';

describe('AuctionBidDetailsComponent', () => {
  let component: AuctionBidDetailsComponent;
  let fixture: ComponentFixture<AuctionBidDetailsComponent>;
  let auctionService: any;
  let encry: any;
  let setIntervalSpy: jasmine.Spy;

  const futureEnd = new Date(Date.now() + 3600_000).toISOString();
  const pastEnd = new Date(Date.now() - 3600_000).toISOString();

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    setIntervalSpy = spyOn(window, 'setInterval').and.returnValue(11 as any);
    spyOn(window as any, 'clearInterval').and.callThrough();
    auctionService = autoMock('AuctionService');
    encry = autoMock('EncryDecryService');
    encry.get.and.returnValue(
      JSON.stringify({ details: { role: { roleName: 'CategoryManager' } } })
    );
    auctionService.getBidsByAuctionId.and.returnValue(
      of({
        auctionendtime: futureEnd,
        auctionEndtime: futureEnd,
        pageRefrestInterval: 90,
      })
    );
    auctionService.getBidItemsByAuction.and.returnValue(
      of([{ description: 'ItemA', bids: [{ bidAmount: 1 }] }])
    );
    auctionService.getBidsByAuction.and.returnValue(
      of({ description: 'RFQ', bids: [{ bidAmount: 2 }] })
    );

    await TestBed.configureTestingModule({
      declarations: [AuctionBidDetailsComponent],
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
        { provide: AuctionService, useValue: auctionService },
        { provide: EncryDecryService, useValue: encry },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(AuctionBidDetailsComponent, '')
      .overrideComponent(AuctionBidDetailsComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(AuctionBidDetailsComponent);
    component = fixture.componentInstance;
    component.bidsData = { bids: [{ bidAmount: 1 }], description: 'ItemA' };
    component.selectedRowdata = {
      id: 'a1',
      auctionEndtime: futureEnd,
      pageRefrestInterval: 90,
      auctionCategory: 'item wise',
    };
    
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

  it('should init CategoryManager and Vendor headers and autoCheck', () => {
    component.ngOnInit();
    expect(component.auctionBidTableHeaders.length).toBe(5);
    expect(setIntervalSpy).toHaveBeenCalled();

    encry.get.and.returnValue(JSON.stringify({ details: { role: { roleName: 'Vendor' } } }));
    component.selectedRowdata = { ...component.selectedRowdata, auctionEndtime: pastEnd };
    component.ngOnInit();
    expect(component.auctionExpired).toBe(true);
    expect(component.auctionBidTableHeaders.length).toBe(3);
  });

  it('should getBidsByAuctionId refresh item wise and rfq wise', () => {
    component.ngOnInit();
    component.loggedUserType = 'CategoryManager';
    component.selectedRowdata = {
      id: 'a1',
      auctionEndtime: futureEnd,
      auctionCategory: 'item wise',
    };
    component.myInterval = 1;
    component.getBidsByAuctionId();
    expect(auctionService.getBidItemsByAuction).toHaveBeenCalled();
    expect(component.auctionBidsList.length).toBe(1);

    component.selectedRowdata = {
      id: 'a1',
      auctionEndtime: pastEnd,
      auctionCategory: 'rfq total wise',
    };
    component.getBidsByAuctionId();
    expect(clearInterval).toHaveBeenCalled();
    expect(auctionService.getBidsByAuction).toHaveBeenCalled();

    component.loggedUserType = 'Vendor';
    component.selectedRowdata.auctionCategory = 'item wise';
    component.refresh('ItemA');
    component.selectedRowdata.auctionCategory = 'other';
    component.refresh('x');
  });

  it('should start finishTest and destroy', fakeAsync(() => {
    component.counter = { begin: jasmine.createSpy('begin'), stop: jasmine.createSpy('stop') } as any;
    component.start();
    tick(10);
    expect(component.counter.begin).toHaveBeenCalled();

    const el = document.createElement('div');
    el.id = 'countdowntimer';
    document.body.appendChild(el);
    component.finishTest();
    expect(component.counter.stop).toHaveBeenCalled();

    component.myInterval = 5;
    component.ngOnDestroy();
    component.myInterval = null;
    component.ngOnDestroy();
    expect(component.auctionEndsInSeconds).toBe(0);
  }));
});

