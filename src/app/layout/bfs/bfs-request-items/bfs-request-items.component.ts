import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SystemViewConfig } from 'src/app/app.config';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';
import { EncryDecryService } from 'src/app/shared/services';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { BfsItemsService } from '../bfs-items.service';

@Component({
    selector: 'app-bfs-request-items',
    templateUrl: './bfs-request-items.component.html',
    styleUrls: ['./bfs-request-items.component.scss', '../bfs-custom.scss']
})
export class BfsRequestItemsComponent implements OnInit {

    @ViewChild('viewItemDetailsTemplate') viewItemDetailsTemplate: any;


    itemHeaders: any = [
        { field: 'description', header: 'Description', isLink: false, width: '190px', fieldType: 'text', isExceedContent: true },
        // { field: 'itemNumber', header: 'Item Number', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        { field: 'specification', header: 'Specification', isLink: false, width: '130px', fieldType: 'text', isExceedContent: false },
        // { field: 'sellerCompanyName', header: 'Seller Org.', isLink: false, width: '130px', fieldType: 'text', isExceedContent: false },
        { field: 'sellPrice', header: 'Seller Price(Per Unit)', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        // { field: 'discount', header: 'Seller Discount', isLink: false, width: '130px', fieldType: 'text', isExceedContent: false },
        // { field: 'buyerCompanyName', header: 'Buyer Org.', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        { field: 'askPrice', header: 'Buyer Price(Per Unit)', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        // { field: 'buyerDiscount', header: 'Buyer Discount', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false }
    ];
    buyersHeaders: any = [
        { field: 'companyName', header: 'Company Name', isLink: false, width: '120px', fieldType: 'text', isExceedContent: true },
        // { field: 'itemNumber', header: 'Item Number', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        { field: 'buyPrice', header: 'Seller Price(Per Unit)', isLink: false, width: '130px', fieldType: 'text', isExceedContent: false },
        { field: 'askPrice', header: 'Buyer Price(Per Unit)', isLink: false, width: '190px', fieldType: 'text', isExceedContent: true },
        // { field: 'sellerCompanyName', header: 'Seller Org.', isLink: false, width: '130px', fieldType: 'text', isExceedContent: false },
        { field: 'quantity', header: 'Quantity', isLink: false, width: '130px', fieldType: 'text', isExceedContent: false },
        { field: 'status', header: 'Status', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        // { field: 'buyerDiscount', header: 'Buyer Discount', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false }
    ];
    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    itemList: any = [];
    roleName: any = '';
    selectedData: any = [];
    selectedRowData: any;
    loggedUserOwnPermissions: any = [];
    loggedUserDetails: any;
    isBFSView: boolean;
    currentView: any = '';
    expandedRows: any = {};
    defaultPermissions: any;
    isShowGrid: boolean;
    bfsBuyersList: any =[];

    constructor(private encryDecryService: EncryDecryService, private converSer: ConvertToBase64Service, private bfsItemService: BfsItemsService, private toaster: ToastrService, private loaderService: LoaderService, private bfsItemsService: BfsItemsService,
        private dialog: MatDialog) {

        const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
        this.loggedUserDetails = temp.details;
        this.roleName = this.loggedUserDetails.role.roleName;
        this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    }


    ngOnInit() {
        this.getItemsList();
        this.currentView = !localStorage.getItem('system-view') ? JSON.parse(localStorage.getItem('system-view')) : localStorage.getItem('system-view');
        this.isBFSView = [SystemViewConfig.BFS_PRO].includes(this.currentView) ? true : false;

    }
    getItemsList() {
        this.itemList = [];
        this.bfsItemService.getRequestedItemstoCM().subscribe((res: any) => {
            this.itemList = Array.isArray(res) ? res.map((ele: any) => {
                return { ...ele, status: 'New' }
            }) : [];
        })

    }
    onViewItemDetails(rowData: any) {
        const dialogConfig = new MatDialogConfig();
        this.selectedRowData = rowData;
        this.selectedRowData['bfsDocuments'] = [];
        this.bfsItemService.getDocsByBFSId({ id: rowData.id }).subscribe((res: any) => {
            if (Array.isArray(res)) {
                this.selectedRowData['bfsDocuments'] = [...res]
            }
        })
        // dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = null;
        dialogConfig.minWidth = 400;
        dialogConfig.minHeight = 550;
        dialogConfig.maxWidth = 'none';
        dialogConfig.width = '45%';
        const dialogRef = this.dialog.open(this.viewItemDetailsTemplate, dialogConfig).afterClosed().subscribe(result => {

        });
    }


    approveOrReject(rowData: any, isApproved: boolean) {
        this.bfsItemService.approveBFSItemByCM({ id: rowData.id, approval: isApproved }).subscribe((res: any) => {
            if (res.status == "Success") {
                this.toaster.success(res.message, 'Success');
                this.getItemsList();
            } else {
                this.toaster.error(res.errorMessage, 'Error');
            }
        })
    }

    getCloseRFQs(rowData, $event) {
        console.log('closed')
        this.expandedRows = {};
    }
    getRFQs(rowData, $event) {
        console.log('closed1')
        this.selectedRowData = rowData;
        this.expandedRows = {};
        const thisRef = this;
        thisRef.expandedRows[rowData.id] = 1;
        this.getBuyerByBFS(rowData);
    }
    reloadGridComponent() {
        this.isShowGrid = false;
        setTimeout(() => {
            this.isShowGrid = true;
        }, 100)
    }
    getBuyerByBFS(rowData) {

            this.bfsItemService.getRequestedUsersByBFSForCM({ id: rowData.id }).subscribe((res: any) => {
                if (res && Array.isArray(res)) {
                    this.bfsBuyersList = res.map((ele: any) => {
                        return { ...ele, status: ele.status.uiDisplay }
                    })
                    this.reloadGridComponent();
                }
            })


    }

    onAcceptOrRejectVendor(rowData:any, isAccepted){

    }
}

