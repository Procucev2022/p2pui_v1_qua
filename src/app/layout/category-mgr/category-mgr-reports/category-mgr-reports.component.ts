import { Component } from '@angular/core';
import { ExcelService } from 'src/app/shared/modules/common-share/services/excel.service';
import { CreateRfqService } from '../services/create-rfq.service';
import { DatePipe } from '@angular/common';

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
    private datePipe: DatePipe
  ) { }
  isReportGenerated: boolean = false;
  isReportExported: boolean = false;
  startDate: string = '';
  endDate: string = '';
  todayDate: Date = new Date();
  reports = [
    {
      id: 1, title: 'Seller', description: 'Description for Seller Reports',
      subReports: [
        { id: 'sellerReport', title: 'Seller Report', description: 'Description for Seller Performance' },
        { id: 'sellerSummary', title: 'Summary Report', description: 'Description for Seller Activity' }
      ]
    },
    {
      id: 2, title: 'RFQ', description: 'Description for RFQ Reports',
      subReports: [
        { id: 'rfq', title: 'RFQ Report', description: 'Description for RFQ Performance' },
        { id: 'rfq-summary', title: 'Summary Report', description: 'Description for RFQ Activity' }
      ]
    },
    {
      id: 3, title: 'Buyer', description: 'Description for Buyer Reports',
      subReports: [
        { id: 'buyer', title: 'Buyer Report', description: 'Description for Buyer Performance' },
        { id: 'buyer-summary', title: 'Summary Report', description: 'Description for Buyer Activity' }
      ]
    }
  ];

  subReports: any[] = [];
  selectedReport: any;
  selectedSubReportId: string;

  onSubReportSelect(subReportId: string) {
    // Logic to handle sub-report selection
    this.selectedSubReportId = subReportId;
    this.isReportExported = false; // Reset export status when a new sub-report is selected
    this.isReportGenerated = false; // Reset report generation status when a new sub-report is selected
  }

  viewReport(reportId: number) {
    // Logic to view the report
  }

  onReportSelect(report: any) {
    // Logic to handle report selection
    this.selectedReport = report;
    this.subReports = report.subReports || [];
    this.selectedSubReportId = null; // Reset sub-report selection when a new report is selected
      this.isReportExported = false; // Reset export status when a new sub-report is selected
    this.isReportGenerated = false; // Reset report generation status when a new sub-report is selected
  }
  generateReport() {

// https://p2pv1servicesdev-etfrcte5fhdvfrd4.centralindia-01.azurewebsites.net/rest/reports/seller-report?reportType=sellerReport&startDate=2026-04-01&endDate=2026-05-14

// /procucev/rest/reports/seller-report?startDate=2026-01-01&endDate=2026-05-01&requestType=sellerReport

    if(!(this.selectedSubReportId && this.startDate && this.endDate)){
      alert('Please select a sub-report and date range to generate the report.');
      return;
    }
    const reportData = {
      reportId: this.selectedSubReportId,
      startDate:  this.datePipe.transform(new Date(this.startDate), 'yyyy-MM-dd'),
      endDate:  this.datePipe.transform(new Date(this.endDate), 'yyyy-MM-dd'),
    };
    // Logic to generate the report based on selected report and date range
    console.log('Generating report with data:', reportData);
    this.createRfqService.getReportData(reportData).subscribe((response) => {
      this.reportDataList = response || [];
      this.isReportGenerated = true;
      this.isReportExported = false;
      if(this.reportDataList && this.reportDataList.length > 0){
        const excelColumnHeaders = Object.keys(this.reportDataList[0]);
        this.exportAsXLSX(excelColumnHeaders);
      }
      console.log('Report data received:', this.reportDataList);
    });

  }

  exportAsXLSX(excelColumnHeaders: string[]): void {
    this.excelData = [];
    this.reportDataList.forEach((data, i) => {
      excelColumnHeaders.forEach((header) => {
        if (!data.hasOwnProperty(header)) {
          data[header] = ''; // Add missing property with empty value
        }else if (data[header] === null || data[header] === undefined) {
          data[header] = ''; // Replace null or undefined values with empty string
        }else
        {
          data[header] = data[header].toString(); // Convert value to string for Excel export
        }
      });
      this.excelData.push(data);
    });
    this.excelService.exportAsExcelFile(this.excelData,  this.selectedSubReportId + '_report'  );
    this.isReportExported = true;
  }
}
