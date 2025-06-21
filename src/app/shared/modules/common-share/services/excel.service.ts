import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import * as FileSaver from 'file-saver';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    constructor(private http: HttpClient) { }

    public exportAsExcelFile(json: any[], excelFileName: string, hiddenColumnsList?: any): void {

        let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        console.log('worksheet', worksheet);



        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

        // worksheet.getColumn(4).eachCell((cell) => {
        //     cell.protection = { locked: true };  // Unprotect the 'Name' column
        //   });
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    public saveAsExcelFile(buffer: any, fileName: string): void {
        console.log('test', buffer)
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
         saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }
    getPRAuditHistory(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_APPROVAL_AUDIT_HISTORY, data, {});
    }
    getPPOAuditHistory(data) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_PPO_APPROVAL_AUDIT_HISTORY, data, {});
    }
}
