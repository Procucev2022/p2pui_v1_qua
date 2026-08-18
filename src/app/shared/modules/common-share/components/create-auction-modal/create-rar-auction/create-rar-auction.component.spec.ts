import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef, SimpleChanges, SimpleChange } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { CreateRarAuctionComponent } from './create-rar-auction.component';
import { defaultAppConfig } from 'src/testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { ConvertToBase64Service } from '../../../services/convert-to-base64.service';
import { AuctionService } from 'src/app/layout/category-mgr/services/auction.service';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule, FormBuilder, NgForm } from '@angular/forms';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog } from '@angular/material/dialog';

describe('CreateRarAuctionComponent', () => {
  let component: CreateRarAuctionComponent;
  let fixture: ComponentFixture<CreateRarAuctionComponent>;
  let toastr: any;
  let auctionService: any;
  let procService: any;
  let convertSer: any;
  let modal: any;

  const mockPpoData = {
    prId: 'PR-100',
    isCapex: false,
    quotCompareCategory: 'Category Wise',
    prData: {
      id: 'pr-guid-1',
      prId: 'PR-100',
      orgId: 'org-1'
    },
    rfqList: [{ id: 'rfq-1', name: 'RFQ 1' }]
  };

  beforeEach(async () => {
    localStorage.setItem('orgId', 'cm-org-1');
    localStorage.setItem('userFullName', 'Test CM User');

    toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      warning: jasmine.createSpy('warning')
    };

    auctionService = {
      getItemsByRFQ: jasmine.createSpy('getItemsByRFQ').and.returnValue(of([
        { id: 'item-1', description: 'Item 1', brand: 'Brand 1', unitofMeasures: 'PCS', quantity: 10, totalamount: 1000 }
      ])),
      getQuoteVendorsByRFQ: jasmine.createSpy('getQuoteVendorsByRFQ').and.returnValue(of([
        { id: 'v1', companyId: 'V01', companyName: 'Vendor 1', quotationId: 'q1' },
        { id: 'v1', companyId: 'V01', companyName: 'Vendor 1', quotationId: 'q1' }, // duplicate to test filter
        { id: 'v2', companyId: 'V02', companyName: 'Vendor 2', quotationId: 'q2' }
      ])),
      createAuction: jasmine.createSpy('createAuction').and.returnValue(of({ status: 'Success', message: 'Auction created' })),
      createAuctionForCapex: jasmine.createSpy('createAuctionForCapex').and.returnValue(of({ statusCode: '200', message: 'Capex Auction created' }))
    };

    procService = {
      getRFQByPRId: jasmine.createSpy('getRFQByPRId').and.returnValue(of([{ id: 'rfq-1', name: 'RFQ 1' }])),
      getVendorsListByCapex: jasmine.createSpy('getVendorsListByCapex').and.returnValue([
        { id: 'v1', companyId: 'V01', companyName: 'Vendor 1', quotationId: 'q1' },
        { id: 'v1', companyId: 'V01', companyName: 'Vendor 1', quotationId: 'q1' },
        { id: 'v2', companyId: 'V02', companyName: 'Vendor 2', quotationId: 'q2' }
      ]),
      getLineItemsByPr: jasmine.createSpy('getLineItemsByPr').and.returnValue(of([
        { id: 'item-1', description: 'Line Item 1', brand: 'Brand A', unitofMeasures: 'PCS', quantity: 5, totalamount: 500 }
      ]))
    };

    convertSer = {
      getBase64: jasmine.createSpy('getBase64').and.returnValue(Promise.resolve('data:application/pdf;base64,QUJDRA=='))
    };

    modal = {
      closeAll: jasmine.createSpy('closeAll')
    };

    await TestBed.configureTestingModule({
      declarations: [CreateRarAuctionComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => undefined, detectChanges: () => undefined } },
        DatePipe,
        { provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: () => ({ attach: () => undefined, enable: () => undefined, disable: () => undefined, detach: () => undefined }) },
        { provide: ConvertToBase64Service, useValue: convertSer },
        { provide: AuctionService, useValue: auctionService },
        { provide: CatProcuRequestsService, useValue: procService },
        { provide: ToastrService, useValue: toastr },
        { provide: MatDialog, useValue: modal },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(CreateRarAuctionComponent, '')
      .overrideComponent(CreateRarAuctionComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(CreateRarAuctionComponent);
    component = fixture.componentInstance;
    component.ppoData = { ...mockPpoData };
  });

  it('should create and initialize for non-capex and Category Wise', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.selectedPrId).toBe('PR-100');
    expect(component.displaySelectedPrId).toBe('PR-100');
    expect(procService.getRFQByPRId).toHaveBeenCalledWith({ id: 'PR-100' });
    expect(component.rfqList.length).toBe(1);
  });

  it('should initialize for RFQ Wise category and for Capex', () => {
    // RFQ Wise
    component.ppoData = { ...mockPpoData, quotCompareCategory: 'RFQ Wise', rfqList: [{ id: 'rfq-2' }] };
    component.ngOnInit();
    expect(component.rfqList.length).toBe(1);

    // RFQ Wise with null rfqList
    component.ppoData = { ...mockPpoData, quotCompareCategory: 'RFQ Wise', rfqList: null };
    component.ngOnInit();
    expect(component.rfqList).toEqual([]);

    // Capex
    component.ppoData = { ...mockPpoData, quotCompareCategory: 'Other', isCapex: true };
    component.ngOnInit();
    expect(component.selectedPrId).toBe('pr-guid-1');

    // Non-array getRFQByPRId
    procService.getRFQByPRId.and.returnValue(of(null));
    component.ppoData = { ...mockPpoData, quotCompareCategory: 'Other', isCapex: false };
    component.ngOnInit();
  });

  it('should handle ngOnChanges for Capex and non-capex', () => {
    component.ppoData = { ...mockPpoData, isCapex: true };
    const changes: SimpleChanges = {
      ppoData: new SimpleChange(null, component.ppoData, true)
    };
    component.ngOnChanges(changes);
    expect(component.auctionCategory).toBe('rfq total wise');
    expect(component.leftGrid_vendorData.length).toBe(2);
    expect(component.auctionItemsList.length).toBe(1);

    // Non-capex ngOnChanges
    component.ppoData.isCapex = false;
    component.ngOnChanges(changes);
  });

  it('should handle buildCapexVendors non-array branches', () => {
    procService.getVendorsListByCapex.and.returnValue(null);
    procService.getLineItemsByPr.and.returnValue(of(null));
    component.ppoData = { ...mockPpoData, isCapex: true };
    component.buildCapexVendors();
    expect(component.leftGrid_vendorData).toEqual([]);
    expect(component.auctionItemsList).toEqual([]);
  });

  it('should warn when createAuction form is invalid', () => {
    const invalidForm = { valid: false } as NgForm;
    component.createAuction(invalidForm);
    expect(toastr.warning).toHaveBeenCalledWith('Please enter required fileds', 'Warning');
  });

  it('should warn if no vendors in right grid during buildAcutionData', () => {
    component.rightGrid_vendorData = [];
    const validForm = { valid: true } as NgForm;
    component.createAuction(validForm);
    expect(toastr.warning).toHaveBeenCalledWith('Please select atleast one vendor for auction', 'Warning');
  });

  it('should warn if no items available for auction in buildAcutionData', () => {
    component.rightGrid_vendorData = [{ id: 'v1', quotationId: 'q1' }];
    component.auctionCategory = 'rfq total wise';
    component.auctionItemsList = [];
    component.buildAcutionData();
    expect(toastr.warning).toHaveBeenCalledWith('No Items Available for Auction, Unable to create Auction', 'Warning');
  });

  it('should warn if start price is empty in item wise auction', () => {
    component.rightGrid_vendorData = [{ id: 'v1', quotationId: 'q1' }];
    component.leftGrid_vendorData = [{ id: 'v2', quotationId: 'q2' }];
    component.auctionCategory = 'item wise';
    component.startPrice = true;
    component.auctionItemsList = [
      { id: 'i1', startpricevalue: null },
      { id: 'i2', startpricevalue: '' },
      { id: 'i3', startpricevalue: 0 }
    ];
    component.buildAcutionData();
    expect(toastr.warning).toHaveBeenCalledWith('Please enter Start Price for all Items', 'Warning');
  });

  it('should execute createAuction for non-capex successfully and on failure', fakeAsync(() => {
    component.ppoData = { ...mockPpoData, isCapex: false };
    component.rightGrid_vendorData = [{ id: 'v1', quotationId: 'q1', invited: true }];
    component.leftGrid_vendorData = [{ id: 'v2', quotationId: 'q2', invited: false }];
    component.auctionCategory = 'rfq total wise';
    component.auctionItemsList = [{ id: 'i1', description: 'Item 1' }];
    component.termsAndConditions = 'Terms';
    component.commentNotInvited = 'Not invited reason';

    // Success
    auctionService.createAuction.and.returnValue(of({ status: 'Success', message: 'Auction Created' }));
    component.createAuction({ valid: true } as NgForm);
    tick(1500);
    expect(toastr.success).toHaveBeenCalledWith('Auction Created', 'Success');
    expect(modal.closeAll).toHaveBeenCalled();

    // Failure
    auctionService.createAuction.and.returnValue(of({ status: 'Error' }));
    component.createAuctionForCPXandOPEX([], [{ invited: true }]);
    expect(toastr.error).toHaveBeenCalledWith('Auction Creation Failed', 'Failed');

    flush();
  }));

  it('should execute createAuction for Capex successfully and on failure', fakeAsync(() => {
    component.ppoData = { ...mockPpoData, isCapex: true };
    component.rightGrid_vendorData = [{ id: 'v1', quotationId: 'q1', invited: true }];
    component.leftGrid_vendorData = [{ id: 'v2', quotationId: 'q2', invited: false }];
    component.auctionCategory = 'item wise';
    component.startPrice = true;
    component.auctionItemsList = [{ id: 'i1', description: 'Item 1', startpricevalue: 500 }];

    // Success
    auctionService.createAuctionForCapex.and.returnValue(of({ statusCode: '200', message: 'Capex Created' }));
    component.createAuction({ valid: true } as NgForm);
    tick(1500);
    expect(toastr.success).toHaveBeenCalledWith('Capex Created', 'Success');

    // Failure
    auctionService.createAuctionForCapex.and.returnValue(of({ status: 'Error' }));
    component.createAuctionForCPXandOPEX([], [{ invited: false }]);
    expect(toastr.error).toHaveBeenCalledWith('Auction Creation Failed', 'Failed');

    flush();
  }));

  it('should handle filesDropped and fileUploadEvent', fakeAsync(() => {
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

    // filesDropped
    component.attachments = [];
    component.filesDropped([file]);
    tick();
    expect(convertSer.getBase64).toHaveBeenCalledWith(file);
    expect(component.attachments.length).toBe(1);

    // fileUploadEvent
    component.fileUploadEvent({ target: { files: [file] } }, false);
    tick();
    expect(component.auctionFileData).toBe('QUJDRA==');
    expect(component.auctionFileType).toBe('test.pdf');
    expect(component.attachments.length).toBe(2);

    // deleteAttachments
    component.deleteAttachments(0);
    expect(component.attachments.length).toBe(1);

    // removeFile
    component.removeFile();
    expect(component.auctionFileData).toBeNull();
    expect(component.auctionFileType).toBeNull();

    flush();
  }));

  it('should handle vendorAddEvents: Add, Add All, Remove, Remove All, default', () => {
    const v1 = { id: 'v1', companyId: 'V1', companyName: 'Vendor 1' };
    const v2 = { id: 'v2', companyId: 'V2', companyName: 'Vendor 2' };

    // Add
    component.leftGrid_vendorData = [{ ...v1 }, { ...v2 }];
    component.leftSelected_vendorRows = [{ ...v1 }];
    component.rightGrid_vendorData = [];
    component.vendorAddEvents('Add');
    expect(component.rightGrid_vendorData.length).toBe(1);
    expect(component.leftGrid_vendorData.length).toBe(1);

    // Add with empty selection
    component.leftSelected_vendorRows = [];
    component.vendorAddEvents('Add');

    // Add All
    component.templeftGrid_vendorData = [{ ...v1 }, { ...v2 }];
    component.vendorAddEvents('Add All');
    expect(component.rightGrid_vendorData.length).toBe(2);
    expect(component.leftGrid_vendorData.length).toBe(0);

    // Remove
    component.rightSelected_vendorRows = [{ ...v1 }];
    component.vendorAddEvents('Remove');
    expect(component.leftGrid_vendorData.length).toBe(1);
    expect(component.rightGrid_vendorData.length).toBe(1);

    // Remove with empty selection
    component.rightSelected_vendorRows = [];
    component.vendorAddEvents('Remove');

    // Remove All
    component.templeftGrid_vendorData = [{ ...v1 }, { ...v2 }];
    component.vendorAddEvents('Remove All');
    expect(component.leftGrid_vendorData.length).toBe(2);
    expect(component.rightGrid_vendorData.length).toBe(0);

    // Default
    component.vendorAddEvents('Unknown');
  });

  it('should handle onAuctionTypeChange', () => {
    component.auctionType = 'reverse auction';
    component.onAuctionTypeChange();
    expect(component.auctionType).toBe('reverse auction');
  });

  it('should handle onCategoryChange item wise with startPrice and minimumBidReduction transitions', () => {
    component.auctionCategory = 'item wise';

    // startPrice true, minimumBidReduction true
    component.startPrice = true;
    component.minimumBidReduction = true;
    component.onCategoryChange();
    expect(component.itemHeader.some(h => h.field === 'startpricevalue')).toBeTrue();
    expect(component.itemHeader.some(h => h.field === 'minimumBidReductionPrice')).toBeTrue();

    // Call again to hit startPrice_index >= 0 branch
    component.onCategoryChange();

    // startPrice false, minimumBidReduction false
    component.startPrice = false;
    component.minimumBidReduction = false;
    component.onCategoryChange();
    expect(component.itemHeader.some(h => h.field === 'startpricevalue')).toBeFalse();
    expect(component.itemHeader.some(h => h.field === 'minimumBidReductionPrice')).toBeFalse();

    // non-item wise
    component.auctionCategory = 'rfq total wise';
    component.onCategoryChange();
    expect(component.itemHeader.length).toBe(5);
  });

  it('should handle onRFQChange with array and non-array responses', () => {
    component.selectedRFQ = 'rfq-1';
    component.onRFQChange();
    expect(auctionService.getItemsByRFQ).toHaveBeenCalledWith({ id: 'rfq-1' });
    expect(auctionService.getQuoteVendorsByRFQ).toHaveBeenCalledWith({ id: 'rfq-1' });
    expect(component.auctionItemsList.length).toBe(1);
    expect(component.leftGrid_vendorData.length).toBe(2);

    // non-array responses
    auctionService.getItemsByRFQ.and.returnValue(of(null));
    auctionService.getQuoteVendorsByRFQ.and.returnValue(of(null));
    component.onRFQChange();
    expect(component.auctionItemsList).toEqual([]);
    expect(component.leftGrid_vendorData).toEqual([]);
  });
});
