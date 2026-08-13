import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { CapexCatMgrPostAuctionComparComponent } from './capex-cat-mgr-post-auction-compar.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from 'src/app/layout/client/services/client-service.service';
import { EncryDecryService } from 'src/app/shared/services';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog } from '@angular/material/dialog';

describe('CapexCatMgrPostAuctionComparComponent', () => {
  let component: CapexCatMgrPostAuctionComparComponent;
  let fixture: ComponentFixture<CapexCatMgrPostAuctionComparComponent>;
  let procService: any;
  let clientService: any;
  let modalDialog: any;
  let toastr: any;
  let encry: any;

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    procService = autoMock('CatProcuRequestsService');
    clientService = autoMock('ClientService');
    modalDialog = autoMock('MatDialog');
    toastr = autoMock('ToastrService');
    encry = autoMock('EncryDecryService');
    encry.get.and.returnValue(
      JSON.stringify({
        details: {
          listofPermission: ['P1'],
          org: { id: 'o1' },
          role: { roleName: 'CategoryManager' },
        },
      })
    );
    procService.getCapexPRidsList.and.returnValue(of([{ id: 'pr1', prId: 'PR-001', Status: 'Open' }]));
    clientService.getPrById.and.returnValue(of({ id: 'pr1', prId: 'PR-001' }));
    clientService.getRfqwiseAuctionIdsByPR.and.returnValue(
      of([
        { id: 'a1', auctionCategory: 'rfq total wise' },
        { id: 'a2', auctionCategory: 'item wise' },
      ])
    );
    clientService.getCapexExcelSummary.and.returnValue(
      of({
        headers: [
          { vid: 'v1-auctionprice', vendorId: 'VEND1', selected: false },
          { vid: 'v2-other', vendorId: 'VEND2', selected: false },
        ],
        items: [
          {
            description: 'Item',
            unitofMeasures: 'EA',
            quantity: 2,
            pritemId: 'pi1',
            data: [
              { vendorid: 'v1-auctionprice', totalamount: '10', serialNo: 1 },
              { vendorid: 'v2-other', totalamount: '9', serialNo: 2 },
            ],
          },
        ],
      })
    );

    await TestBed.configureTestingModule({
      declarations: [CapexCatMgrPostAuctionComparComponent],
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
        { provide: ToastrService, useValue: toastr },
        { provide: ClientService, useValue: clientService },
        { provide: EncryDecryService, useValue: encry },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(CapexCatMgrPostAuctionComparComponent, '')
      .overrideComponent(CapexCatMgrPostAuctionComparComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(CapexCatMgrPostAuctionComparComponent);
    component = fixture.componentInstance;
    seedComponent(component as any);
  });

  it('should init and load PR list branches', () => {
    component.ngOnInit();
    expect(component.prList.length).toBe(1);
    procService.getCapexPRidsList.and.returnValue(of({ status: 'Failure' }));
    component.getPrsListForAll();
    expect(component.prList).toEqual([]);
  });

  it('should filterPr and prChange/getData success and failure', () => {
    component.prList = [
      { id: 'pr1', prId: 'PR-001', Status: 'Open' },
      { id: 'pr2', prId: 'PR-XYZ', Status: 'Closed' },
      { id: 'pr3', prId: null, Status: 'X' },
    ];
    component.filterPr({ query: 'pr-0' });
    expect(component.filteredprList.length).toBe(1);

    component.prChange({ id: 'pr2' });
    expect(component.selectedPrStatus).toBe('Closed');
    expect(clientService.getPrById).toHaveBeenCalled();
    expect(component.auctionCategoryList.length).toBe(2);

    clientService.getPrById.and.returnValue(of(null));
    component.getData();
    expect(toastr.error).toHaveBeenCalledWith('Failed to Fetch data', 'Failure');
  });

  it('should auctionIdChange for rfq total wise and item wise', () => {
    component.auctionCategoryList = [
      { id: 'a1', auctionCategory: 'rfq total wise' },
      { id: 'a2', auctionCategory: 'item wise' },
    ];
    component.selectedAucCategoryId = 'a1';
    component.auctionIdChange({});
    expect(component.selectedAucType).toBe('rfq total wise');
    expect(clientService.getCapexExcelSummary).toHaveBeenCalled();

    component.selectedAucCategoryId = 'a2';
    component.auctionIdChange({});
    expect(clientService.getCapexExcelSummary).toHaveBeenCalled();

    component.successCallBack([{ id: 'z' }]);
    expect(component.auctionCategoryList[0].id).toBe('z');
  });

  it('should showCheckBox and selectVendor branches', () => {
    expect(component.showCheckBox({ vid: 'x-auctionprice' })).toBe(true);
    expect(component.showCheckBox({ vid: 'x-other' })).toBe(false);
    expect(component.showCheckBox(null)).toBeFalsy();

    component.itemData = {
      headers: [
        { vid: 'v1-auctionprice', selected: false },
        { vid: 'v2-other', selected: false },
      ],
      items: [],
    };
    component.selectVendor({ vid: 'v1-auctionprice', vendorId: 'V1' });
    expect(component.selectedVendor.vendorId).toBe('V1');
    expect(component.itemData.headers[0].selected).toBe(true);
    expect(component.itemData.headers[1].selected).toBe(false);

    component.selectVendor({ vid: 'nope', vendorId: 'V2' });
    expect(toastr.warning).toHaveBeenCalled();
  });

  it('should onCreatePPO when selection complete and warn otherwise', fakeAsync(() => {
    component.selectedAucType = 'rfq total wise';
    component.selectedAucCategoryId = 'a1';
    component.selectedPr = { id: 'pr1' };
    component.selectedVendor = { vid: 'v1-auctionprice', vendorId: 'VEND1' };
    component.itemData = {
      headers: [],
      items: [
        {
          description: 'Item',
          unitofMeasures: 'EA',
          quantity: 2,
          pritemId: 'pi1',
          data: [
            { vendorid: 'v1-auctionprice', totalamount: '10', serialNo: 1 },
            { vendorid: 'other', totalamount: '1', serialNo: 2 },
          ],
        },
      ],
    };
    modalDialog.open.and.returnValue({ afterClosed: () => of(null) });
    component.onCreatePPO();
    tick(200);
    expect(modalDialog.open).toHaveBeenCalled();

    component.selectedVendor = null;
    component.onCreatePPO();
    expect(toastr.warning).toHaveBeenCalled();
  }));

  it('should exportAsXLSX using table element', () => {
    const table = document.createElement('table');
    table.innerHTML = '<tr><td>a</td></tr>';
    component.exportTable = { nativeElement: table } as any;
    expect(() => component.exportAsXLSX()).not.toThrow();
  });
});
