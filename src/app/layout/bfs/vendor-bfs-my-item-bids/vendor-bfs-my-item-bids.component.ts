import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SystemViewConfig } from 'src/app/app.config';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';
import { EncryDecryService } from 'src/app/shared/services';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { BfsItemsService } from '../bfs-items.service';

@Component({
  selector: 'app-vendor-bfs-my-item-bids',
  templateUrl: './vendor-bfs-my-item-bids.component.html',
  styleUrls: ['./vendor-bfs-my-item-bids.component.scss']
})
export class VendorBfsMyItemBidsComponent implements OnInit{ 

    itemHeaders: any = [
        { field: 'description', header: 'Description', isLink: false, width: '120px', fieldType: 'text', isExceedContent: true },
        { field: 'itemNumber', header: 'Item Number', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        { field: 'availableQuantity', header: 'Available Qty.', isLink: false, width: '130px', fieldType: 'text', isExceedContent: false },
        { field: 'buyPrice', header: 'Buy Price(Per Unit)', isLink: false, width: '180px', fieldType: 'text', isExceedContent: false },
        // { field: 'discount', header: 'Discount(%)', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        { field: 'askPrice', header: 'Sale Price(Per Unit)', isLink: false, width: '180px', fieldType: 'text', isExceedContent: false },
          { field: 'status', header: 'Status', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
    ]
    userHeaders: any = [
        // { field: 'companyName', header: 'Buyer Name', isLink: false, width: '120px', fieldType: 'text', isExceedContent: true },
        { field: 'askPrice', header: 'Buyer Price(Per Unit)', isLink: false, width: '180px', fieldType: 'text', isExceedContent: false },
        { field: 'buyPrice', header: 'Sale Price(Per Unit)', isLink: false, width: '180px', fieldType: 'text', isExceedContent: false },
        { field: 'quantity', header: 'Quantity', isLink: false, width: '130px', fieldType: 'text', isExceedContent: false },
        { field: 'discount', header: 'Discount(%)', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        { field: 'city', header: 'City', isLink: false, width: '120px', fieldType: 'text', isExceedContent: true },
        { field: 'status', header: 'Status', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false }
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
    defaultPermissions: any;
    currentView: any;
    isBFSView: boolean;
    expandedRows: any = {};
    @ViewChild('viewItemDetailsTemplate') viewItemDetailsTemplate: any;
    requestedUsers: any = [];
    isShowGrid: boolean;
    editBFSItemData: any;
    bfsForm = new FormGroup({
        quantity: new FormControl('', [
            Validators.required,
            , Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/) // Only digits allowed
        ]),
    });
    selectedBFSBuyerRowData: any;

    get numberInput() {
        return this.bfsForm.get('numberInput');
    }
    @ViewChild('editBFSItemTemplate') editBFSItemTemplate: any;
    constructor(private encryDecryService: EncryDecryService, private converSer: ConvertToBase64Service, private bfsItemService: BfsItemsService, private toaster: ToastrService, private loaderService: LoaderService, private bfsItemsService: BfsItemsService,
        private dialog: MatDialog) {

        const temp = JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')));
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

        this.bfsItemService.getSellerBidMyItems().subscribe((res: any) => {
            this.itemList = Array.isArray(res) ? [...res] : [];
            this.itemList = this.itemList.map((ele: any) => {
                return { ...ele, status: ele.status.uiDisplay}
            })
          });



    }


    onAcceptBid(rowData: any) {
        if (['Bid Accepted', 'Bid Rejected'].includes(rowData.status)) {
            this.toaster.warning("Sorry! You're not allowed at this moment due its Approved/Rejected already!!", "Warning")
            return;
        }
        this.bfsItemService.bfsAcceptedBySeller({ id: rowData.id }).subscribe((res: any) => {
            if (res && res.status == 'Success') {
                this.toaster.success(res.message, 'Success');
                this.getItemsList();
                this.getRFQs(this.selectedRowData,{});
            } else {
                this.toaster.error(res.errorMessage, 'Error');

            }
        })

    }

    onRejectBid(rowData: any) {
        if (['Bid Accepted', 'Bid Rejected'].includes(rowData.status)) {
            this.toaster.warning("Sorry! You're not allowed at this moment due its Approved/Rejected already!!", "Warning")
            return;
        }
        this.bfsItemService.bfsRejectedBySeller({ id: rowData.id }).subscribe((res: any) => {
            if (res && res.status == 'Success') {
                this.toaster.success(res.message, 'Success');
                this.getItemsList();
                this.getRFQs(this.selectedRowData,{});
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
        this.expandedRows = rowData;
        this.requestedUsers  =[];
        this.bfsItemService.getRequestedUsersByBFSForSeller({ id: rowData.id }).subscribe((res: any) => {
            if (res && Array.isArray(res)) {
                this.requestedUsers = res.map((ele: any) => {
                    return { ...ele, status: ele.status.uiDisplay, companyName: ele.status.uiDisplay == 'Bid Accepted'? ele.companyName: 'XXXXXXXXXXX' }
                }) 
                this.reloadGridComponent();
            }else{
                this.requestedUsers = []; 
                this.reloadGridComponent();
            }
        });
           
    }
      get expandedRowKeys() {
        return this.expandedRows && this.expandedRows.id != null
          ? { [this.expandedRows.id]: true }
          : {};
    }

    reloadGridComponent() {
        this.isShowGrid = false;
        setTimeout(() => {
            this.isShowGrid = true;
        }, 100)
    }

    onViewItemDetails(rowData: any) {
        const dialogConfig = new MatDialogConfig(); 
        this.selectedRowData ={'bfsDocuments' :[]}
         this.bfsItemService.getItemDetails({ id: rowData.id }).subscribe((res: any) => {
            if (res && res.id) {
                this.selectedRowData = { ...this.selectedRowData, ...res }
            }else{
                this.selectedRowData = { ...this.selectedRowData, ...rowData }
            }
        })
        this.bfsItemService.getDocsByBFSId({ id: rowData.id }).subscribe((res: any) => {
            if (Array.isArray(res)) {
                this.selectedRowData['bfsDocuments'] = [...res]
            }
        })
        // dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = null;
        dialogConfig.minWidth = 400;
        dialogConfig.minHeight = 500;
        dialogConfig.maxWidth = 'none';
        dialogConfig.width = '35%';
        const dialogRef = this.dialog.open(this.viewItemDetailsTemplate, dialogConfig).afterClosed().subscribe(result => {

        });
    } 

    onGridAction(event: any) {
        this[event.eventData['eventName']](event.rowData);
    }

    onEditBFSBuyerItem(rowData: any) {
        if(!(rowData.status == 'Bid Rejected')){
            this.toaster.warning("Edit Quantity Allowed When Bid Rejected", "Warning");
            return
        }
        // editBFSBuyerItemBySeller
        this.selectedBFSBuyerRowData = rowData;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = null;
        dialogConfig.minWidth = 200;
        dialogConfig.minHeight = 200;
        dialogConfig.maxWidth = 'none';
        dialogConfig.width = '25%';
        const dialogRef = this.dialog.open(this.editBFSItemTemplate, dialogConfig).afterClosed().subscribe(result => {

        });
    }

    updateQuantity(){
        if(!this.bfsForm.valid){
            this.toaster.warning("Please Enter Valid  Quantity", "Warning");
            return;
        }
        this.bfsItemService.editBFSBuyerItemBySeller({id: this.selectedBFSBuyerRowData.id, quantity: this.bfsForm.value.quantity}).subscribe((res:any)=>{
            if (res && res.status == 'Success') {
                this.toaster.success(res.message, 'Success');
                this.getRFQs(this.selectedRowData, {})
                this.dialog.closeAll();
                this.bfsForm.reset();
            } else {
                this.toaster.error(res.errorMessage, 'Error');

            }
        })
    }

}