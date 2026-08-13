import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
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
    seedComponent(component as any);
  });

  it('should select report and subreport', () => {
    component.viewReport(1);
    component.onReportSelect(component.reports[0]);
    expect(component.subReports.length).toBe(3);
    component.onSubReportSelect('sellerReport');
    expect(component.selectedSubReportId).toBe('sellerReport');
    component.onReportSelect({ subReports: null });
    expect(component.subReports).toEqual([]);
  });

  it('should warn when generateReport missing inputs or unknown type', () => {
    component.generateReport();
    expect(toast.warning).toHaveBeenCalled();

    component.selectedSubReportId = 'unknown';
    component.startDate = '2024-01-01';
    component.endDate = '2024-01-31';
    component.generateReport();
    expect(toast.warning).toHaveBeenCalledWith('This report is not yet implemented.');
  });

  it('should generate seller rfq and buyer reports with data', fakeAsync(() => {
    component.startDate = '2024-01-01';
    component.endDate = '2024-01-31';
    ['sellerReport', 'sellerSummary', 'sellerCategoryReport', 'rfqReport', 'rfqSummaryReport', 'buyerReport', 'buyerCategoryReport', 'buyerSummary'].forEach(
      (id) => {
        component.selectedSubReportId = id;
        createRfqService.getReportData.and.returnValue(of([{ col: 'x', missing: null }]));
        component.generateReport();
        tick(3000);
        expect(excelService.exportAsExcelFile).toHaveBeenCalled();
        expect(component.isReportExported).toBe(true);
      }
    );
  }));

  it('should handle empty report list without export timeout path', () => {
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
  });

  it('should exportAsXLSX fill missing null and stringify', () => {
    component.selectedSubReportId = 'sellerReport';
    component.reportDataList = [{ a: 1, b: null }, { a: 2 }];
    component.exportAsXLSX(['a', 'b', 'c']);
    expect(component.excelData[0].c).toBe('');
    expect(component.excelData[0].b).toBe('');
    expect(component.excelData[0].a).toBe('1');
    expect(excelService.exportAsExcelFile).toHaveBeenCalled();
  });
});
