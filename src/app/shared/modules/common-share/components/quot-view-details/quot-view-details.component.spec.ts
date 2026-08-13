import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { QuotViewDetailsComponent } from './quot-view-details.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { GridPdfService } from '../../services/grid-pdf.service';
import { ExportPdfService } from 'src/app/layout/category-mgr/services/export-pdf.service';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { pdfExport } from 'src/app/shared/helpers/pdf-export';

describe('QuotViewDetailsComponent', () => {
  let component: QuotViewDetailsComponent;
  let fixture: ComponentFixture<QuotViewDetailsComponent>;
  let procuReqService: any;
  let dialogRef: any;
  let exportPDFService: any;

  const successQuot = {
    quotationId: 'Q1',
    gstSum: 10,
    totalAmount: 100,
    paymentTerms: 'Net30',
    deliveryTerms: 'FOB',
    otherTerms: 'x',
    createdTS: new Date().toISOString(),
    createdBy: 'U',
    orgId: {
      companyName: 'Acme',
      email: 'a@x.com',
      organizationPhonenumber: '999',
      address1: 'Addr',
      city: 'Hyd',
    },
    quotationItems: [
      {
        description: 'I',
        brand: 'B',
        quantity: 1,
        unitofMeasures: 'EA',
        unitprice: 10,
        gstPercentage: 18,
        gstValue: 1.8,
        totalamount: 11.8,
      },
    ],
    quotationDocuments: [{ name: 'd.pdf' }],
  };

  function docStub(withPrev = true) {
    return {
      internal: { pageSize: { height: 800 } },
      autoTable: withPrev ? { previous: { finalY: 20 } } : { previous: null },
      setLineWidth: jasmine.createSpy('setLineWidth'),
      setTextColor: jasmine.createSpy('setTextColor'),
      text: jasmine.createSpy('text'),
      setFontSize: jasmine.createSpy('setFontSize'),
      setFont: jasmine.createSpy('setFont'),
      setFontType: jasmine.createSpy('setFontType'),
      save: jasmine.createSpy('save'),
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

    procuReqService = autoMock('CatProcuRequestsService');
    dialogRef = autoMock('MatDialogRef');
    exportPDFService = autoMock('ExportPdfService');
    procuReqService.getQuotationDetails.and.returnValue(of(successQuot));

    spyOn(pdfExport, 'createJsPdf').and.returnValue(docStub());
    spyOn(pdfExport, 'runAutoTable').and.stub();

    await TestBed.configureTestingModule({
      declarations: [QuotViewDetailsComponent],
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
        { provide: CatProcuRequestsService, useValue: procuReqService },
        { provide: GridPdfService, useValue: autoMock('GridPdfService') },
        { provide: ExportPdfService, useValue: exportPDFService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { id: 'q1' } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(QuotViewDetailsComponent, '')
      .overrideComponent(QuotViewDetailsComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(QuotViewDetailsComponent);
    component = fixture.componentInstance;
    seedComponent(component as any);
  });

  it('should load quotation success and failure', () => {
    component.ngOnInit();
    expect(component.quotDetails.quotationId).toBe('Q1');
    procuReqService.getQuotationDetails.and.returnValue(of({ status: 'Failure' }));
    component.ngOnInit();
    expect(component.quotDetails).toBeNull();
    procuReqService.getQuotationDetails.and.returnValue(of({ statusCode: 'Failure' }));
    component.ngOnInit();
  });

  it('should navigate close zoom and page', () => {
    component.selectedIndex = 1;
    component.back();
    component.next();
    component.onItemPage({ page: 1 });
    component.closeDialog();
    component.zoomout();
    component.zoomin();
    expect(dialogRef.updateSize).toHaveBeenCalled();
  });

  it('should safeText helpers and exportAsPDF', () => {
    expect(component.safeText(null)).toBe('');
    expect(component.safeText(undefined)).toBe('');
    expect(component.safeText('x')).toBe('x');
    expect(component.safeDateText(null)).toBe('');
    expect(component.safeDateText(new Date().toISOString()).length).toBeGreaterThan(0);

    component.ngOnInit();
    component.exportAsPDF();
    expect(pdfExport.createJsPdf).toHaveBeenCalled();
    expect(pdfExport.runAutoTable).toHaveBeenCalled();
    expect(exportPDFService.addFooters).toHaveBeenCalled();

    (pdfExport.createJsPdf as jasmine.Spy).and.returnValue(docStub(false));
    component.quotDetails = {
      ...successQuot,
      paymentTerms: null,
      deliveryTerms: null,
      otherTerms: null,
      createdTS: null,
      createdBy: null,
      orgId: {
        companyName: 'Acme',
        email: null,
        organizationPhonenumber: null,
        address1: null,
        city: null,
      },
    };
    component.quotsItemTableData = successQuot.quotationItems;
    component.exportAsPDF();
  });
});
