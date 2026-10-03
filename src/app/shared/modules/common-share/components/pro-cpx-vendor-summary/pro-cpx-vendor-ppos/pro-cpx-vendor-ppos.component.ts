import { map } from 'rxjs/operators';
import { Component, OnInit, ElementRef, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core'; 
import { ToastrService } from 'ngx-toastr';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { PpoViewModalComponent } from 'src/app/shared/modules/common-share/components/ppo-view-modal/ppo-view-modal.component';
import { EncryDecryService } from 'src/app/shared/services';
import swal from 'sweetalert2';
import { CorrespondenceComponent } from 'src/app/shared/modules/common-share/components/correspondence/correspondence.component';
import { ExcelService } from 'src/app/shared/modules/common-share/services/excel.service';
import { DatePipe } from '@angular/common';
import { PposService } from 'src/app/layout/ppos/services/ppos.service';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services'; 
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
    selector: 'pro-cpx-vendor-ppos',
    templateUrl: './pro-cpx-vendor-ppos.component.html',
    styleUrls: ['./pro-cpx-vendor-ppos.component.scss']
})
export class ProCpxVendorPPOsComponent implements OnInit, OnChanges {

    selectedData: any = [];
    pposList: any = [];
    pageRecordSize: any;
    pageOptions: any;
    pposHeaders: any = [
        { field: 'ppoId', header: 'PPO ID', isLink: false, width: '220px', fieldType: 'text', isExceedContent: false },
        { field: 'desc', header: 'Description', isLink: false, width: '190px', fieldType: 'text', isExceedContent: true },
        // { field: 'prId', header: 'PR ID', isLink: false ,width:'150px',fieldType: 'text', isExceedContent: false},
        { field: 'ppoValue', header: 'PPO Value', isLink: false, width: '140px', fieldType: 'text', isExceedContent: true },
        { field: 'createdTS', header: 'Creation Date', isLink: false, width: '205px', fieldType: 'date', isExceedContent: false },
        { field: 'feedback', header: 'Remarks', isLink: false, width: '200px', fieldType: 'text', isExceedContent: false },
        { field: 'rating', header: 'Rank', isLink: false, width: '360px', fieldType: 'text', isExceedContent: false }
        // { field: 'clientStatus', header: 'Client Status', isLink: false ,width:'150px', fieldType: 'text', isExceedContent: false},
    ];
    paginatoryDetails: any;
    loggedUserPermissions: any;
    loggedUserDetails: any;
    defaultPermissions;
    ppoItemsById: any;
    excelData: any[] = [];
    isShowCheckbox: boolean;
    isShowPPOView: boolean;
    rating = 5;
    @Input('vendorData') vendorData: any;
    @Input('clientData') clientData: any;
    roleName: any;

    @ViewChild('viewRemarksTemplate') viewRemarksTemplate: any;
    selectedRowData: any;


    constructor(private modalDialog: MatDialog,
        private toaster: ToastrService,
        private ppoSer: PposService,
        private encryDecryService: EncryDecryService, private excelService: ExcelService, private datePipe: DatePipe  ) { }

    ngOnInit() {
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;

        this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;


    }

    ngOnChanges(changes: SimpleChanges): void {
        const temp = JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')));
        this.loggedUserDetails = temp.details;
        this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
        this.roleName = this.loggedUserDetails.role.roleName;
        if (changes && changes.vendorData && changes.vendorData.currentValue !== changes.vendorData.previousValue) {
            this.getAllPPOs();
        }
    }

    onRate(event?: any, rowData?: any) {
        if (!rowData) {
            return;
        }
        if (event && event.value !== undefined) {
            rowData.rating = event.value;
        }
    }

    editRating(rowData, flag) {
        rowData.isCancelEditRating = flag;
        rowData.isEditRating = flag;
    }

    getFInalRating(rowData: any) {
        return Math.round(((rowData.quality ? rowData.quality : 0) + (rowData.timeline ? rowData.timeline : 0) + (rowData.responsiveness ? rowData.responsiveness : 0)) / 3);
    }

    saveRating(rowData, flag) {
        const reqObject = {
            "id": rowData.id,
            "quality": rowData.quality,
            "timeline": rowData.timeline,
            "responsiveness": rowData.responsiveness,
            "finalRating": this.getFInalRating(rowData)

        }
        this.ppoSer.saveRatingForPPO(reqObject).subscribe((res: any) => {
            if (res && res.status == 'Success') {
                rowData.isCancelEditRating = false;
                rowData.isEditRating = false;
                this.toaster.success(res.message, 'Success')
            } else {
                this.toaster.success(res.message, 'Error')
            }

        });

    }




    getAllPPOs() {
        let reqObj;
        if(this.roleName == "ClientApprover" || this.roleName === "ClientInitiator"){
            reqObj = {
                 client: this.loggedUserDetails.org.id,
                 "vendor": this.vendorData.vendorId,
                 "initiator":this.loggedUserDetails.id,
                 "masterStatus"  :  ["PPO_SUBMIT", "PPO_CLIENT_ACCEPT", "PPO_CLIENT_REJECT"]
            }
        }else{
            reqObj = {
                "vendor": this.vendorData.vendorId,
                "client": this.clientData.id,
                "masterStatus"    :   ["PPO_SUBMIT", "PPO_CLIENT_ACCEPT", "PPO_CLIENT_REJECT"]
            }
        }



        this.ppoSer.getAllPPOsByVendorAndClient(reqObj).subscribe((res: any) => {
            if (Array.isArray(res)) {
                this.pposList = res;
                this.selectedData = [];
                console.log(res);
                for (const item of this.pposList) {
                    item['filterDate'] = this.datePipe.transform(new Date(item['createdTS']), 'dd-MMM-yyyy hh:mm a');
                }

            }
        });
    }

    getClientPPOS() {
        this.selectedData = [];
        let reqObj: any;
        console.log('logged---' + this.loggedUserDetails.org.id);


        if (this.loggedUserDetails.role.roleName === 'ClientInitiator' || this.loggedUserDetails.role.roleName === 'clientInitiator1.1') {

            reqObj = {
                'client': this.loggedUserDetails.org.id,
                'masterStatus': ['PPO_SUBMIT', 'PPO_CLIENT_ACCEPT', 'PPO_CLIENT_REJECT'],
                "initiator": this.loggedUserDetails.id,
                "fromInitiator": true,
                "department": this.loggedUserDetails.department.id,
                "approverId": this.loggedUserDetails.id, //ASK_H
            };
        }

        if (this.loggedUserDetails.role.roleName === 'PRApprover') {
            reqObj = {
                'client': this.loggedUserDetails.org.id,
                'masterStatus': ['PPO_SUBMIT', 'PPO_CLIENT_ACCEPT', 'PPO_CLIENT_REJECT'],
                'approverId': this.loggedUserDetails.id,
                "initiator": this.loggedUserDetails.id,
                "fromInitiator": false,
                "department": this.loggedUserDetails.department.id,
            };
        }
        if (this.loggedUserDetails.role.roleName === 'PRApprover2') {
            reqObj = {
                'client': this.loggedUserDetails.org.id,
                'masterStatus': ['PPO_SUBMIT', 'PPO_CLIENT_ACCEPT', 'PPO_CLIENT_REJECT'],
                'approverId': this.loggedUserDetails.id,
                "initiator": this.loggedUserDetails.id,
                "fromInitiator": false,
                "department": this.loggedUserDetails.department.id,
            };
        }
        reqObj['approverId'] = this.loggedUserDetails.id;

        // this.ppoSer.getClientPPOS(reqObj).subscribe((res: any) => {
        //     if (Array.isArray(res)) {
        //         this.pposList = res ? res.map(ele => {
        //             return { ...ele, 'userStaus_display' : ( ele['userStatus'] ?  ele['userStatus']['uiDisplay'] : '') }
        //         }): [];
        //         console.log(res);

        //     }
        // });
    }

    viewPPO(rowData) {
        this.selectedData = [rowData]
        const reqObj = {
            'id': rowData.id
        };
        // this.clientService.getPpoItems(reqObj).subscribe(response => this.successCallback(response))
        this.ppoSer.PPOByCm(reqObj).subscribe((res: any) => {
            this.viewSuccessCallBack(res, rowData);
            // this.ppoitems = res;
            // console.log(res);
            // this.ppoItemsById = res
            // rowData['ppoitems'] = res
        });

    }



    viewSuccessCallBack(res, rowData) {
        this.isShowPPOView = true;
        rowData['ppoitems'] = res;
        const dialog = this.modalDialog.open(PpoViewModalComponent, {
            width: '80%',
            minHeight: '400px',
            data: rowData
        });

        dialog.afterClosed().subscribe(result => {
            //  if (result.event === 'Cancel') {
            // this.getAllPPOs();
            //  }
        });
    }



    onPage(event) {
        this.paginatoryDetails = event;
    }



    viewCorresspondance(rowData) {
        rowData['commentRootPath'] = 'PPO-COMMENTS-MODAL';
        const dialog = this.modalDialog.open(CorrespondenceComponent, { data: rowData ,width: '60%', maxWidth: '40%',
        minHeight: 297 , maxHeight: '70vh' });

        dialog.afterClosed().subscribe(result => {
            this.getAllPPOs();
        });
    }

    exportAsXLSX(): void {
        this.excelData = [];
        this.pposList.forEach((data, i) => {
            const obj = {
                'PPO ID': data.ppoId,
                'Description': data.desc,
                'PPO Value': data.ppoValue,
                'Created Time': data.createdTS,
                'Status': data.procucevStatus.uiDisplay,
            };
            this.excelData.push(obj);
        });
        this.excelService.exportAsExcelFile(this.excelData, 'PPO\'s_Data');
    }

    onEditRemarks(rowData:any){
        this.selectedRowData = rowData;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = null;
        dialogConfig.minWidth = 300;
        dialogConfig.minHeight = 300;
        dialogConfig.maxWidth = 'none';
        dialogConfig.width = '35%';
        const dialogRef = this.modalDialog.open(this.viewRemarksTemplate, dialogConfig).afterClosed().subscribe(result => {

        });
    }

    updateRemarks(){
        if(!this.selectedRowData.feedback){
            this.toaster.warning("Please Enter Remarks..", "warning");
            return;
        }
        this.saveRemarks();

    }

    saveRemarks() {
        const reqObject = {
            "id": this.selectedRowData.id,
            'feedback': this.selectedRowData.feedback

        }
        this.ppoSer.saveRatingForPPO(reqObject).subscribe((res: any) => {
            if (res && res.status == 'Success') {
                this.toaster.success(res.message, 'Success')
                this.modalDialog.closeAll();
                this.getAllPPOs();
            } else {
                this.toaster.success(res.message, 'Error')
            }

        });

    }

}
