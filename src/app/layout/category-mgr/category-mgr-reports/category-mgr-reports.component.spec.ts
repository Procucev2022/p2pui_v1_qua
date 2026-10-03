import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of, throwError } from 'rxjs';
import { CategoryMgrReportsComponent } from './category-mgr-reports.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { ExcelService } from 'src/app/shared/modules/common-share/services/excel.service';
import { CreateRfqService } from '../services/create-rfq.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';

describe('CategoryMgrReportsComponent', () => {
  let component: CategoryMgrReportsComponent;
  let fixture: ComponentFixture<CategoryMgrReportsComponent>;
  let excelService: any;
  let createRfqService: any;
  let toast: any;

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    excelService = autoMock('ExcelService');
    createRfqService = autoMock('CreateRfqService');
    toast = autoMock('ToastrService');
    createRfqService.getReportData.and.returnValue(of([{ a: 1, b: null, c: undefined }]));

    await TestBed.configureTestingModule({
      declarations: [CategoryMgrReportsComponent],
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
        { provide: ExcelService, useValue: excelService },
        { provide: CreateRfqService, useValue: createRfqService },
        { provide: ToastrService, useValue: toast },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(CategoryMgrReportsComponent, '')
      .overrideComponent(CategoryMgrReportsComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(CategoryMgrReportsComponent);
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

  it('should format selected dates correctly across various input types', () => {
    expect(component.formatSelectedDate(null)).toBe('');
    expect(component.formatSelectedDate(undefined)).toBe('');
    expect(component.formatSelectedDate('')).toBe('');
    expect(component.formatSelectedDate(new Date('2024-05-15T12:00:00'))).toBe('2024-05-15');
    expect(component.formatSelectedDate(new Date('invalid date'))).toBe('');
    expect(component.formatSelectedDate('2024-05-15')).toBe('2024-05-15');
    expect(component.formatSelectedDate('15-05-2024')).toBe('2024-05-15');
    expect(component.formatSelectedDate('15/05/2024')).toBe('2024-05-15');
    expect(component.formatSelectedDate('2024/05/15')).toBe('2024-05-15');
    expect(component.formatSelectedDate('not-a-valid-date')).toBe('');
    expect(component.formatSelectedDate(1715731200000)).toBeTruthy();
    expect(component.formatSelectedDate({})).toBe('');
  });

  it('should select report and subreport with null safety', () => {
    component.viewReport(1);
    component.onReportSelect(component.reports[0]);
    expect(component.subReports.length).toBe(3);
    expect(component.selectedSubReportId).toBe('sellerReport');

    component.onSubReportSelect('sellerReport');
    expect(component.selectedSubReportId).toBe('sellerReport');
    expect(component.isReportExported).toBe(false);
    expect(component.isReportGenerated).toBe(false);
    expect(component.isReportGenrateInProgress).toBe(false);

    component.onReportSelect({ subReports: null });
    expect(component.subReports).toEqual([]);
    expect(component.selectedSubReportId).toBeNull();

    component.onReportSelect(null);
    expect(component.subReports).toEqual([]);
    expect(component.selectedSubReportId).toBeNull();
  });

  it('should warn when generateReport missing inputs or invalid dates or unknown type', () => {
    component.selectedSubReportId = '';
    component.startDate = '';
    component.endDate = '';
    component.generateReport();
    expect(toast.warning).toHaveBeenCalledWith('Please select a sub-report and date range to generate the report.');

    component.selectedSubReportId = 'sellerReport';
    component.startDate = 'invalid-date';
    component.endDate = '2024-01-31';
    component.generateReport();
    expect(toast.warning).toHaveBeenCalledWith('Please select a valid date range to generate the report.');

    component.startDate = '2024-01-01';
    component.endDate = 'invalid-date';
    component.generateReport();
    expect(toast.warning).toHaveBeenCalledWith('Please select a valid date range to generate the report.');

    component.selectedSubReportId = 'unknown';
    component.startDate = '2024-01-01';
    component.endDate = '2024-01-31';
    component.generateReport();
    expect(toast.warning).toHaveBeenCalledWith('This report is not yet implemented.');
  });

  it('should generate seller rfq and buyer reports with data and null items in list', fakeAsync(() => {
    component.startDate = '2024-01-01';
    component.endDate = '2024-01-31';
    const reportIds = [
      'sellerReport', 'sellerSummary', 'sellerCategoryReport',
      'rfqReport', 'rfqSummaryReport',
      'buyerReport', 'buyerCategoryReport', 'buyerSummary'
    ];

    reportIds.forEach((id) => {
      component.selectedSubReportId = id;
      createRfqService.getReportData.and.returnValue(of([{ col: 'x', missing: null }, null, { col: 'y', extra: 'z' }]));
      component.generateReport();
      tick(3000);
      expect(excelService.exportAsExcelFile).toHaveBeenCalled();
      expect(component.isReportExported).toBe(true);
    });
  }));

  it('should handle API error when generating report', () => {
    component.selectedSubReportId = 'sellerReport';
    component.startDate = '2024-01-01';
    component.endDate = '2024-01-31';
    createRfqService.getReportData.and.returnValue(throwError(() => new Error('API failure')));
    component.generateReport();

    expect(component.isReportGenrateInProgress).toBe(false);
    expect(component.isReportGenerated).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Failed to generate report. Please try again.');
  });

  it('should handle empty or null report list without export timeout path', () => {
    component.selectedSubReportId = 'sellerReport';
    component.startDate = '2024-01-01';
    component.endDate = '2024-01-31';
    createRfqService.getReportData.and.returnValue(of([]));
    component.generateReport();
    expect(component.isReportGenerated).toBe(true);
    expect(component.isReportGenrateInProgress).toBe(false);

    createRfqService.getReportData.and.returnValue(of(null));
    component.generateReport();
    expect(component.reportDataList).toEqual([]);
    expect(component.isReportGenerated).toBe(true);
  });

  it('should exportAsXLSX fill missing, null, undefined, and stringify values', () => {
    component.selectedSubReportId = 'sellerReport';
    component.reportDataList = [
      { a: 1, b: null, c: undefined },
      { a: 2 }
    ];
    component.exportAsXLSX(['a', 'b', 'c', 'd']);
    expect(component.excelData[0].a).toBe('1');
    expect(component.excelData[0].b).toBe('');
    expect(component.excelData[0].c).toBe('');
    expect(component.excelData[0].d).toBe('');
    expect(component.excelData[1].a).toBe('2');
    expect(component.excelData[1].d).toBe('');
    expect(component.isReportExported).toBe(true);
    expect(excelService.exportAsExcelFile).toHaveBeenCalledWith(component.excelData, 'sellerReport_report');

    component.reportDataList = null;
    component.exportAsXLSX([]);
    expect(component.excelData).toEqual([]);
  });
});
