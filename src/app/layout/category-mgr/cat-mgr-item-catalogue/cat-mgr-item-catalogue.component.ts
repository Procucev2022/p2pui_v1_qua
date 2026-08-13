import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from 'src/app/app.config';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { ExcelService } from 'src/app/shared/modules/common-share/services/excel.service';
import { EncryDecryService } from 'src/app/shared/services';
import * as Swal from 'sweetalert2';
import { CatProcuQuotationsService, CatProcuRequestsService } from '../services';
import { ClientService } from '../../client/services/client-service.service';

@Component({
  selector: 'app-cat-mgr-item-catalogue',
  templateUrl: './cat-mgr-item-catalogue.component.html',
  styleUrls: ['./cat-mgr-item-catalogue.component.scss']
})
export class CatMgrItemCatalogueComponent implements OnInit {

    itemList: any = [];
    selectedData: any = [];
    itemHeaders: any = [
        { field: 'clientName', header: 'Customer Name', isLink: false, width: '135px' , fieldType: 'text', isExceedContent: true},
        { field: 'description', header: 'Item Description', isLink: false, width: '135px' , fieldType: 'text', isExceedContent: true},
        { field: 'specification', header: 'Specification', isLink: false, width: '135px' , fieldType: 'text', isExceedContent: true},
        { field: 'uom', header: 'UOM', isLink: false, width: '125px' , fieldType: 'text', isExceedContent: false},
        { field: 'procucevItemCode', header: 'Procucev Item Code', isLink: false, width: '135px' , fieldType: 'text', isExceedContent: false}
    ];
    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    loggedUserPermissions: any;
    loggedUserDetails: any;
    defaultPermissions: any;
    userModel : any = {};
    excelData: any[] = [];
    editItemModel: any;
    constructor(
        private dialog: MatDialog,
        private toaster: ToastrService,
        private encryDecryService: EncryDecryService,
        private catItems : CatProcuRequestsService,
        private excelService : ExcelService,
        private client : ClientService) { }

    ngOnInit() {
        this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
        this.loggedUserDetails = temp.details;
        console.log(this.loggedUserDetails);
        this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
        this.getAllItems()
    }
    getAllItems() {
        this.itemList = []
        let obj = {
            "id" : this.loggedUserDetails.org.id
        }
        this.catItems.getAllItemCatalogues().subscribe((data) => {
            if (Array.isArray(data)) {
                data.forEach(ele => {
                    if(!ele.status){
                        ele.status = "Available"
                    }
                    this.itemList.push(ele);
                })
            }
        })
    }
    promptCloseRequest(): any {
        return (Swal as any).default({
            title: '<h6>Please Confirm!!<h6>',
            html: '<h4>Are you sure you want to Close Request?</h4>',
            confirmButtonText: 'Yes',
            confirmButtonColor: '#006dd5',
            cancelButtonColor: '#d63636',
            showCancelButton: true,
            reverseButtons: true
        });
    }

    onCloseRequestDialogResult(result: any, data: any) {
        if (result?.value) {
            this.closeRequestFun(data);
        }
    }

    closeRequest(data){
        this.promptCloseRequest().then((result) => this.onCloseRequestDialogResult(result, data));
    }
    /** Invoked after close-request confirmation (also used directly by unit tests). */
    confirmCloseRequest(data) {
        this.closeRequestFun(data);
    }
    closeRequestFun(data){
        let obj = {
            "id":data.id,
            "procucevItemCode": data.procucevItemCode
        }
        this.catItems.closeItemReq(obj).subscribe((res) => {
            this.successCallBack(res)
        })
    }
    successCallBack(res:any) {
        if(res.status == "Success"){
            this.toaster.success(res.message, 'Success')
        }else{
            this.toaster.error(res.message, 'Error')
        }
        this.getAllItems()
    }
    onPage(event) {
        this.paginatoryDetails = event;
    }
    exportAsXLSX():void {
        this.excelData = []
        this.itemList.forEach((data,i) => {
          let obj = {
            "Customer Name" : data.clientName,
            "Item Description" : data.description,
            "Specification" : data.specification,
            "UOM" : data.uom,
            "Procucev Item Code" : data.procucevItemCode,
          }
          this.excelData.push(obj)
        })
        this.excelService.exportAsExcelFile(this.excelData, 'Item_List');
    }

    viewItemData(rowData: any, itemTemplateRef) {
        const config: MatDialogConfig = {
            width: ' 762px'
        };
        this.client.getItemDetailsById({ "id": rowData.id }).subscribe((res: any) => {
            this.editItemModel = res;
            const dialog = this.dialog.open(itemTemplateRef, config);
            //   this.getAllClientUsers();
            dialog.afterClosed().subscribe(result => {
                //  this.getAllClients();
            });


        })

    }
}
