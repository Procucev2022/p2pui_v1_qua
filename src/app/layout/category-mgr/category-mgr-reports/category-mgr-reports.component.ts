import { Component } from '@angular/core';
import { ExcelService } from 'src/app/shared/modules/common-share/services/excel.service';
import { CreateRfqService } from '../services/create-rfq.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-mgr-reports',
  templateUrl: './category-mgr-reports.component.html',
  styleUrls: ['./category-mgr-reports.component.scss']
})
export class CategoryMgrReportsComponent {
  excelData: any[];
  reportDataList: any;
  constructor(private excelService: ExcelService,
    private createRfqService: CreateRfqService,
    private datePipe: DatePipe,
    private toastService: ToastrService
  ) { }
  isReportGenerated: boolean = false;
  isReportExported: boolean = false;
  isReportGenrateInProgress: boolean = false;
  startDate: string = '';
  endDate: string = '';
  todayDate: Date = new Date();
  reports = [
    {
      id: 1, title: 'Seller', description: 'Description for Seller Reports',
      subReports: [
        { id: 'sellerReport', title: 'Seller Report', description: 'Description for Seller Performance' },
        { id: 'sellerSummary', title: 'Summary Report', description: 'Description for Seller Activity' },
        { id: 'sellerCategoryReport', title: 'Category Report', description: 'Description for Seller Category Activity' }
      ]
    },
    {
      id: 2, title: 'RFQ', description: 'Description for RFQ Reports',
      subReports: [
        { id: 'rfqReport', title: 'RFQ Report', description: 'Description for RFQ Performance' },
        { id: 'rfqSummaryReport', title: 'Summary Report', description: 'Description for RFQ Activity' }
      ]
    },
    {
      id: 3, title: 'Buyer', description: 'Description for Buyer Reports',
      subReports: [
        { id: 'buyerReport', title: 'Buyer Report', description: 'Description for Buyer Performance' },
        { id: 'buyerSummary', title: 'Buyer Summary Report', description: 'Description for Buyer Activity' },
        { id: 'buyerCategoryReport', title: 'Buyer Category Report', description: 'Description for Buyer Activity' }
      ]
    }
  ];

  subReports: any[] = [];
  selectedReport: any;
  selectedSubReportId: string = '';

  onSubReportSelect(subReportId: string) {
    // Logic to handle sub-report selection
    this.selectedSubReportId = subReportId;
    this.isReportExported = false; // Reset export status when a new sub-report is selected
    this.isReportGenerated = false; // Reset report generation status when a new sub-report is selected
    this.isReportGenrateInProgress = false; // Reset report generation started status when a new sub-report is selected
  }

  viewReport(reportId: number) {
    // Logic to view the report
  }

  onReportSelect(report: any) {
    // Logic to handle report selection
    this.selectedReport = report;
    this.subReports = (report && report.subReports) || [];
    this.selectedSubReportId = this.subReports.length > 0 ? this.subReports[0].id : null;
    this.isReportExported = false; // Reset export status when a new sub-report is selected
    this.isReportGenerated = false; // Reset report generation status when a new sub-report is selected
    this.isReportGenrateInProgress = false; // Reset report generation started status when a new sub-report is selected
  }
  formatSelectedDate(date: any): string {
    if (!date) {
      return '';
    }
    if (date instanceof Date && !isNaN(date.getTime())) {
      return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
    }
    if (typeof date === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      const parts = date.split(/[-/]/);
      if (parts.length === 3) {
        if (parts[0].length === 2 && parts[2].length === 4) {
          // dd-MM-yyyy -> yyyy-MM-dd
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        } else if (parts[0].length === 4 && parts[2].length === 2) {
          return `${parts[0]}-${parts[1]}-${parts[2]}`;
        }
      }
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return this.datePipe.transform(parsed, 'yyyy-MM-dd') || '';
      }
    }
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  generateReport() {
    if (!(this.selectedSubReportId && this.startDate && this.endDate)) {
      this.toastService.warning('Please select a sub-report and date range to generate the report.');
      return;
    }

    const startDateFormatted = this.formatSelectedDate(this.startDate);
    const endDateFormatted = this.formatSelectedDate(this.endDate);

    if (!startDateFormatted || !endDateFormatted) {
      this.toastService.warning('Please select a valid date range to generate the report.');
      return;
    }

    const reportData = {
      reportId: this.selectedSubReportId,
      startDate: startDateFormatted,
      endDate: endDateFormatted,
    };
    let reportType: any = ''
    switch (this.selectedSubReportId) {
      case 'sellerReport':
      case 'sellerSummary':
      case 'sellerCategoryReport':
        reportType = 'GET_REPORT_DATA_FOR_GMT';
        break;

      case 'rfqReport':
      case 'rfqSummaryReport':
        reportType = 'GET_REPORT_DATA_FOR_RFQREPORT';
        break;
      case 'buyerReport':
      case 'buyerCategoryReport':
      case 'buyerSummary':
        reportType = 'GET_REPORT_DATA_FOR_BUYERREPORT';
        break;

      default:
        this.toastService.warning('This report is not yet implemented.');
        return;
    }
    // Logic to generate the report based on selected report and date range
    console.log('Generating report with data:', reportData);
    this.isReportGenrateInProgress = true;
    this.isReportGenerated = false;
    this.isReportExported = false;

    this.createRfqService.getReportData(reportData, reportType).subscribe({
      next: (response) => {
        this.reportDataList = response || [];

        if (this.reportDataList && this.reportDataList.length > 0) {
          setTimeout(() => {
            this.isReportGenerated = true;
            this.isReportExported = false;
            this.isReportGenrateInProgress = false;
            const excelColumnHeaders: string[] = Array.from(
              new Set(this.reportDataList.flatMap((item: any) => Object.keys(item || {})))
            );
            this.exportAsXLSX(excelColumnHeaders);
          }, 3000);
        } else {
          this.isReportGenerated = true;
          this.isReportExported = false;
          this.isReportGenrateInProgress = false;
        }

        console.log('Report data received:', this.reportDataList);
      },
      error: (error) => {
        this.isReportGenrateInProgress = false;
        this.isReportGenerated = false;
        console.error('Error generating report:', error);
        this.toastService.error('Failed to generate report. Please try again.');
      }
    });

  }

  exportAsXLSX(excelColumnHeaders: string[]): void {
    this.excelData = [];
    this.reportDataList.forEach((data, i) => {
      excelColumnHeaders.forEach((header) => {
        if (!data.hasOwnProperty(header)) {
          data[header] = ''; // Add missing property with empty value
        } else if (data[header] === null || data[header] === undefined) {
          data[header] = ''; // Replace null or undefined values with empty string
        } else {
          data[header] = data[header].toString(); // Convert value to string for Excel export
        }
      });
      this.excelData.push(data);
    });
    this.excelService.exportAsExcelFile(this.excelData, this.selectedSubReportId + '_report');
    this.isReportExported = true;
  }
}
