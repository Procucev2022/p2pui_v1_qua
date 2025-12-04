import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from 'src/app/app.config';
import { VendorMgrService } from '../../services/vendor-mgr.service';
import { VendorReqService } from 'src/app/layout/vendor-request/services/vendor-req.service';
import { RfqService } from 'src/app/layout/vendor/services/rfq.service';

@Component({
    selector: 'app-gmt-vendors-list',
    templateUrl: './gmt-vendors-list.component.html',
    styleUrls: ['./gmt-vendors-list.component.scss']
})
export class GmtVendorsListComponent implements OnInit {

    vendorRegPendingList: any = [];
    selectedVendor:any;
    vendorInfo: any;
    @ViewChild('vendorInfoTemplate') vendorInfoTemplate: any;
    vendorRegPendingHeaders: any = [
        { field: 'companyId', header: 'Vendor ID', width: '135px', fieldType: 'text' },
        { field: 'companyName', header: 'Name', isLink: false, width: '215px', fieldType: 'text' },
        { field: 'email', header: 'Email', isLink: false, width: '115px', fieldType: 'text' },
        { field: 'phoneNumber', header: 'Phone Number', isLink: false, width: '165px', fieldType: 'text' } 
    ];
    selectedData: any;
    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    otp: string = '';
    subscriptionDays: any = 180;
    @ViewChild('otpTemplate') otpTemplate: any;

    constructor(private vendMgrSer: VendorReqService, private toaster: ToastrService,
        private dialog: MatDialog,   private rfqservice: RfqService) { }

    ngOnInit() {
        this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
        this.getVendorPendingRegistrationData();
    }

    getDaysCount(data: any) {
        let date1 = new Date(data['upgradeStartDate']);
        let date2 = new Date(data['upgradeEndDate']);
        let Difference_In_Time =
            date2.getTime() - date1.getTime();
        return Math.round(Difference_In_Time / (1000 * 3600 * 24));
    }

    getVendorPendingRegistrationData() {
        this.vendorRegPendingList = [];
        this.rfqservice.fetchGMTSummary().subscribe((res: any) => {
            if (res && Array.isArray(res.data)) { 
                this.vendorRegPendingList = res.data || [];
            } else {
                this.toaster.error(res.message, 'Failure')
            }
        })
    }


    onPage(event) {
        this.paginatoryDetails = event;
    }

    onChangeCheckBoxValue(rowData: any) {
        this.otp = '';
        this.subscriptionDays = 180;
        this.vendMgrSer.sendOtpForGMTVendorUpgrade({ id: rowData.id }).subscribe((res: any) => {
            if (res && res.status == 'Success') {
                this.toaster.success(res.message, 'Success');
                this.selectedData = rowData;
                this.dialog.closeAll();
                this.dialog.open(this.otpTemplate, {
                    width: "30%",
                    minHeight: "250px",
                    data: "Su",
                }).afterClosed().subscribe((res: any) => {
                    this.otp = ''
                       this.getVendorPendingRegistrationData();
                })
            } else {

            }

        })

    }

    onVerifyAndUpdate() {
        if(!this.otp || this.otp.toString().trim() == '' || this.otp.toString().length !=6){
            this.toaster.error('Please enter valid OTP','Error');
            return;
        }
        this.vendMgrSer.validateVmOtp({ "id":  this.selectedData.id, userOtp: this.otp }).subscribe((res: any) => {
            if (res && res.status == 'Success') {
                this.toaster.success(res.message, 'Success');
                this.upgradeVendor();
            } else {
                this.toaster.error(res.message, 'Error');
            }
        });
    }

    upgradeVendor() {
        this.vendMgrSer.upgradeGmtVendor({
            "id": this.selectedData.id 

        }).subscribe((res: any) => {
            if (res && res.status == 'Success') {
                this.toaster.success(res.message, 'Success');
                this.dialog.closeAll();
                this.getVendorPendingRegistrationData();

            } else {
                this.toaster.error(res.message, 'Error');
            }
        });
    }

    resetForm() {
        this.otp = '';
    }

    getVendorInfo(rowData:any){
        this.selectedVendor = rowData;
        this.rfqservice.getVendorInfoById({id: rowData.id}).subscribe((res:any)=>{
            if(res ){
                this.dialog.closeAll();
                this.vendorInfo = res;
                this.selectedVendor = {...rowData, 'vendorName':  rowData['companyName']}
                this.dialog.open(this.vendorInfoTemplate, {
                    width: "30%",
                    minHeight: "250px",
                    data: "Su",
                }).afterClosed().subscribe((res: any) => {
                    this.vendorInfo = null;
                    this.selectedVendor = null;
                })
            }
        })
    }
}

