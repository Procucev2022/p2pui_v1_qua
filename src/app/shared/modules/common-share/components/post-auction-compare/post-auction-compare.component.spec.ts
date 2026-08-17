import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { PostAuctionCompareComponent } from './post-auction-compare.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { ClientService } from 'src/app/layout/client/services/client-service.service';
import { ExcelService } from '../../services/excel.service';
import { MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';

describe('PostAuctionCompareComponent', () => {
  let component: PostAuctionCompareComponent;
  let fixture: ComponentFixture<PostAuctionCompareComponent>;
  let clientService: any;

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    clientService = autoMock('ClientService');
    clientService.getRfqwiseAuctionIdsByPR.and.returnValue(
      of([
        { id: 'a1', auctionCategory: 'rfq total wise' },
        { id: 'a2', auctionCategory: 'item wise' },
      ])
    );
    clientService.getPrById.and.returnValue(of({ id: 'pr1', isCapex: false }));
    clientService.getRFQWiseSummary.and.returnValue(of({ headers: [], items: [] }));
    clientService.getItemWiseSummary.and.returnValue(of({ headers: [], items: [] }));
    clientService.getCapexExcelSummary.and.returnValue(of({ headers: [], items: [] }));

    await TestBed.configureTestingModule({
      declarations: [PostAuctionCompareComponent],
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
        { provide: ClientService, useValue: clientService },
        { provide: ExcelService, useValue: autoMock('ExcelService') },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(PostAuctionCompareComponent, '')
      .overrideComponent(PostAuctionCompareComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(PostAuctionCompareComponent);
    component = fixture.componentInstance;
    component.prId = 'pr1';
        
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

  it('should init load auctions and pr', () => {
    component.ngOnInit();
    expect(component.auctionCategoryList.length).toBe(2);
    expect(component.viewPrByData.id).toBe('pr1');

    clientService.getPrById.and.returnValue(of(null));
    component.ngOnInit();
  });

  it('should auctionIdChange for rfq and item wise opex and capex', () => {
    spyOn(component.auctionDetails, 'emit');
    component.auctionCategoryList = [
      { id: 'a1', auctionCategory: 'rfq total wise' },
      { id: 'a2', auctionCategory: 'item wise' },
    ];
    component.viewPrByData = { isCapex: false };
    component.selectedAucCategoryId = 'a1';
    component.auctionIdChange({});
    expect(clientService.getRFQWiseSummary).toHaveBeenCalled();
    expect(component.auctionDetails.emit).toHaveBeenCalled();

    component.selectedAucCategoryId = 'a2';
    component.auctionIdChange({});
    expect(clientService.getItemWiseSummary).toHaveBeenCalled();

    component.viewPrByData = { isCapex: true };
    component.selectedAucCategoryId = 'a1';
    component.auctionIdChange({});
    expect(clientService.getCapexExcelSummary).toHaveBeenCalled();

    component.selectedAucCategoryId = 'a2';
    component.auctionIdChange({});
    expect(clientService.getCapexExcelSummary).toHaveBeenCalled();

    component.successCallBack([{ id: 'z' }]);
    expect(component.auctionCategoryList[0].id).toBe('z');
  });

  it('should exportAsXLSX', () => {
    const table = document.createElement('table');
    table.innerHTML = '<tr><td>a</td></tr>';
    component.exportTable = { nativeElement: table } as any;
    expect(() => component.exportAsXLSX()).not.toThrow();
  });
});
