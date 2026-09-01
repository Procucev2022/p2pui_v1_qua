import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { PposService } from '../../services/ppos.service';
import { PpoViewModalComponent } from 'src/app/shared/modules/common-share/components/ppo-view-modal/ppo-view-modal.component';
import { EncryDecryService } from 'src/app/shared/services';
import { swalConfirm } from 'src/app/shared/helpers/swal-confirm';
import { CorrespondenceComponent } from 'src/app/shared/modules/common-share/components/correspondence/correspondence.component';
import { ExcelService } from 'src/app/shared/modules/common-share/services/excel.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-generated-ppos',
    templateUrl: './generated-ppos.component.html',
    styleUrls: ['./generated-ppos.component.scss']
})
export class GeneratedPposComponent implements OnInit {

    selectedData: any = [];
    pposList: any = [];
    pageRecordSize: any;
    pageOptions: any;
    pposHeaders: any = [
        { field: 'ppoId', header: 'PPO ID', isLink: false  , width: '220px', fieldType: 'text', isExceedContent: false},
        { field: 'desc', header: 'Description', isLink: false  , width: '190px', fieldType: 'text', isExceedContent: true},
        // { field: 'prId', header: 'PR ID', isLink: false ,width:'150px',fieldType: 'text', isExceedContent: false},
        { field: 'ppoValue', header: 'PPO Value', isLink: false , width: '140px', fieldType: 'text', isExceedContent: true},
        { field: 'createdTS', header: 'Creation Date', isLink: false , width: '205px', fieldType: 'date', isExceedContent: false},
        { field: 'procucevStatus', header: 'Status', isLink: false , width: '160px', fieldType: 'text', isExceedContent: false},
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

    constructor(private modalDialog: MatDialog,
        private toaster: ToastrService,
        private  ppoSer: PposService,
        private encryDecryService: EncryDecryService, private excelService: ExcelService, private datePipe: DatePipe ) { }

    ngOnInit() {
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        const temp =  JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')) );
        this.loggedUserDetails = temp.details;

        if(this.loggedUserDetails.role.roleName == 'PRApprover2'  || this.loggedUserDetails.role.roleName == 'PRApprover'){
            this.pposHeaders.push( { field: 'userStaus_display', header: 'User Status ', isLink: false , width: '140px', fieldType: 'text', isExceedContent: false})

        }

        this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
        this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
        this.getPPOs();
        this.ppoSer.acceptPPOViaService().subscribe((res:any)=>{
            if(res == true){
                this.getPPOs();
            }
        });
    }

    getPPOs(){
        this.getAllPPOs();
        this.getClientPPOS();
    }

    getAllPPOs() {
        let reqObj;
        if (this.loggedUserDetails.role.roleName === 'CategoryManager' || this.loggedUserDetails.role.roleName === 'CategoryManagerBasic') {
            reqObj = {'masterStatus': ['PPO_SUBMIT', 'PPO_NEW', 'PPO_CLIENT_ACCEPT',
                 'PPO_CLIENT_REJECT', 'PPO_REJECT']};
        }
        this.isShowCheckbox = false;
        if( this.loggedUserDetails.role.roleName === 'CategoryManager' ||this.loggedUserDetails.role.roleName === 'CategoryManager2'
        || this.loggedUserDetails.role.roleName === 'PRApprover'){
            this.isShowCheckbox = true;
        }

        // if(this.loggedUserDetails.role.roleName == 'ClientInitiator'){
        //     reqObj =
        // {"masterStatus":["PPO_SUBMIT","PPO_CLIENT_ACCEPT",
        //          "PPO_CLIENT_REJECT"]}
        // }

        // if(this.loggedUserDetails.role.roleName == 'PRApprover'){
        //     reqObj =
        // {"masterStatus":["PPO_SUBMIT","PPO_CLIENT_ACCEPT",
        //          "PPO_CLIENT_REJECT"]}
        // }
        // if(this.loggedUserDetails.role.roleName == 'PRApprover2'){
        //     reqObj =
        // {"masterStatus":["PPO_SUBMIT","PPO_CLIENT_ACCEPT",
        //          "PPO_CLIENT_REJECT"]}
        // }
        if (this.loggedUserDetails.role.roleName === 'CategoryManager2' || this.loggedUserDetails.role.roleName === 'CategoryManagerBasic2') {
            reqObj = {'masterStatus': ['PPO_SUBMIT', 'PPO_NEW', 'PPO_CLIENT_ACCEPT',
                 'PPO_CLIENT_REJECT', 'PPO_REJECT']};
        }
        this.ppoSer.getAllPPOS(reqObj).subscribe((res: any) => {
            if (Array.isArray(res)) {
                this.pposList = res;
                this.selectedData  =[];
                console.log(res);
                for (const item of this.pposList) {
                    item['filterDate'] =  this.datePipe.transform(new Date(item['createdTS']), 'dd-MMM-yyyy hh:mm a');
                }

            }
        });
    }

    getClientPPOS() {
        this.selectedData = [];
        let reqObj: any = {};
        console.log('logged---' + this.loggedUserDetails?.org?.id);


        if (this.loggedUserDetails && this.loggedUserDetails.role && (this.loggedUserDetails.role.roleName === 'ClientInitiator' || this.loggedUserDetails.role.roleName === 'clientInitiator1.1')) {

            reqObj = {
                'client': this.loggedUserDetails.org.id,
                'masterStatus': ['PPO_SUBMIT', 'PPO_CLIENT_ACCEPT', 'PPO_CLIENT_REJECT'],
                "initiator": this.loggedUserDetails.id,
                "fromInitiator": true,
                "department": this.loggedUserDetails.department.id,
                "approverId": this.loggedUserDetails.id, //ASK_H
            };
        }

        if (this.loggedUserDetails && this.loggedUserDetails.role && this.loggedUserDetails.role.roleName === 'PRApprover') {
            reqObj = {
                    'client': this.loggedUserDetails.org.id,
                    'masterStatus': ['PPO_SUBMIT', 'PPO_CLIENT_ACCEPT', 'PPO_CLIENT_REJECT'],
                    'approverId': this.loggedUserDetails.id,
                    "initiator": this.loggedUserDetails.id,
                    "fromInitiator":false,
                    "department": this.loggedUserDetails.department.id,
                };
            }
        if (this.loggedUserDetails && this.loggedUserDetails.role && this.loggedUserDetails.role.roleName === 'PRApprover2') {
            reqObj = {
                'client': this.loggedUserDetails.org.id,
                'masterStatus': ['PPO_SUBMIT', 'PPO_CLIENT_ACCEPT', 'PPO_CLIENT_REJECT'],
                'approverId': this.loggedUserDetails.id,
                "initiator": this.loggedUserDetails.id,
                "fromInitiator":false,
                "department": this.loggedUserDetails.department.id,
            };
        }
        if (this.loggedUserDetails) {
            reqObj['approverId'] = this.loggedUserDetails.id;
        }

        this.ppoSer.getClientPPOS(reqObj).subscribe((res: any) => {
            if (Array.isArray(res)) {
                this.pposList = res ? res.map(ele => {
                    return { ...ele, 'userStaus_display' : ( ele['userStatus'] ?  ele['userStatus']['uiDisplay'] : '') }
                }): [];
                console.log(res);

            }
        });
    }

    viewPPO(rowData) {
        this.selectedData = [rowData]
        const reqObj = {
            'id' : rowData.id
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
                 this.getAllPPOs();
            //  }
         });
    }

    ppoActions(actionType) {
        const ppos = [];
        let check = false;
        if (this.selectedData.length > 0) {
            this.selectedData.forEach((data) => {
                if (data?.procucevStatus?.uiDisplay === 'Client Accepted' || data?.procucevStatus?.uiDisplay === 'Client Rejected') {
                    this.toaster.error('The following request cant be process as it has already Selected or Rejected PRs. Please unselect selected or rejected PRs', 'Failed');
                    check = true;
                }
            });

            if (check) {
                return;
            }

            if (actionType === 'Submit' || actionType === 'Reject' || actionType === 'Reject_p') {
                this.selectedData.forEach(element => {
                    if (this.loggedUserDetails && this.loggedUserDetails.role && this.loggedUserDetails.role.roleName === 'CategoryManager2') {
                        ppos.push({'id': element.id, 'submittedBy': localStorage.getItem('userFullName')});
                    } else {
                        ppos.push({'id': element.id, approverId: this.loggedUserDetails ? this.loggedUserDetails.id : null});
                    }
                });
            }
            if (actionType === 'Accept') {
                this.selectedData.forEach((data) => {
                    if (data?.procucevStatus?.uiDisplay === 'Submitted') {
                        data.approvedBy = localStorage.getItem('userFullName');
                        data.approverId = this.loggedUserDetails ? this.loggedUserDetails.id : null;
                        ppos.push(data);
                    }
                });
            }
        }

        if (check) {
            return;
        }
        if (actionType === 'Submit') {
            swalConfirm.open({
                title: '<h6>Please Confirm!!<h6>',
                html: '<h4>Are you sure you want to submit ppo?</h4>',
                confirmButtonText: 'Yes',
                confirmButtonColor: '#006dd5',
                cancelButtonColor: '#d63636',
                showCancelButton: true,
                reverseButtons: true
               }).then((result) => {
                if (result.value) {
                    this.ppoSer.submitPPO(ppos).subscribe((res) => {
                        if (res['status'] === 'Success' || res['statusCode'] === 'Success') {
                            this.toaster.success(res.message, 'Success');
                            this.getAllPPOs();
                        } else {
                            this.toaster.error('PPO submission failed', 'Failed');
                        }
                    });
                }
            });
        }
        if (actionType === 'Accept') {
            swalConfirm.open({
                title: '<h6>Please Confirm!!<h6>',
                html: '<h4>Are you sure you want to accept ppo?</h4>',
                confirmButtonText: 'Yes',
                confirmButtonColor: '#006dd5',
                cancelButtonColor: '#d63636',
                showCancelButton: true,
                reverseButtons: true
               }).then((result) => {
                if (result.value) {
                    this.ppoSer.acceptPPO(ppos).subscribe((res) => {
                        if (res['status'] === 'Success' || res['statusCode'] === 'Success') {
                            this.toaster.success(res.message, 'Success');
                            this.getClientPPOS();
                        } else {
                            this.toaster.error('PPO Acceptance failed', 'Failed');
                        }
                    });
                }
              });
        }

        if (actionType === 'Reject') {
            swalConfirm.open({
                title: '<h6>Please Confirm!!<h6>',
                html: '<h4>Are you sure you want to reject ppo?</h4>',
                confirmButtonText: 'Yes',
                confirmButtonColor: '#006dd5',
                cancelButtonColor: '#d63636',
                showCancelButton: true,
                reverseButtons: true
               }).then((result) => {
                if (result.value) {
                    this.ppoSer.rejectPPO(ppos).subscribe((res) => {
                        if (res['status'] === 'Success' || res['statusCode'] === 'Success') {
                            this.toaster.success(res.message, 'Success');
                            this.getClientPPOS();
                        } else {
                            this.toaster.error('PPO Rejection failed', 'Failed');
                        }
                    });
                }
              });
        }

        if (actionType === 'Reject_p') {
            swalConfirm.open({
                title: '<h6>Please Confirm!!<h6>',
                html: '<h4>Are you sure you want to reject ppo?</h4>',
                confirmButtonText: 'Yes',
                confirmButtonColor: '#006dd5',
                cancelButtonColor: '#d63636',
                showCancelButton: true,
                reverseButtons: true
               }).then((result) => {
                if (result.value) {
                    this.ppoSer.rejectPPOByCm(ppos).subscribe((res) => {
                        if (res['status'] === 'Success' || res['statusCode'] === 'Success') {
                            this.toaster.success(res.message, 'Success');
                            this.getAllPPOs();
                        } else {
                            this.toaster.error('PPO Rejection failed', 'Failed');
                        }
                    });
                }
              });
        }


    }

    onPage(event) {
        this.paginatoryDetails = event;
    }



    viewCorresspondance(rowData) {
        rowData['commentRootPath'] = 'PPO-COMMENTS-MODAL';
       const dialog =  this.modalDialog.open(CorrespondenceComponent, { data: rowData ,width: '60%', maxWidth: '40%',
       minHeight: 297 , maxHeight: '70vh' });

       dialog.afterClosed().subscribe(result => {
             this.getAllPPOs();
        });
    }

    exportAsXLSX(): void {
        this.excelData = [];
        this.pposList.forEach((data, i) => {
          const obj = {
            'PPO ID' : data.ppoId,
            'Description' : data.desc,
            'PPO Value' : data.ppoValue,
            'Created Time' : data.createdTS,
            'Status' : data.procucevStatus.uiDisplay,
          };
          this.excelData.push(obj);
        });
        this.excelService.exportAsExcelFile(this.excelData, 'PPO\'s_Data');
      }

}
