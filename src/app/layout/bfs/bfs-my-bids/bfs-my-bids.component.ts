import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SystemViewConfig } from 'src/app/app.config';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';
import { EncryDecryService } from 'src/app/shared/services';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { BfsItemsService } from '../bfs-items.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bfs-my-bids',
  templateUrl: './bfs-my-bids.component.html',
  styleUrls: ['./bfs-my-bids.component.scss', '../bfs-custom.scss']
})
export class BfsMyBidsComponent implements OnInit {

    clientInitiatoreItemHeaders: any = [
         { field: 'description', header: 'Description', isLink: false, width: '120px', fieldType: 'text', isExceedContent: true },
        { field: 'askPrice', header: 'Sale Price(Per Unit)', isLink: false, width: '180px', fieldType: 'text', isExceedContent: false },
        // { field: 'discount', header: 'Discount', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        // { field: 'askPrice', header: 'Buyer Price(Per Unit)', isLink: false, width: '180px', fieldType: 'text', isExceedContent: false },
        { field: 'status', header: 'Status', isLink: false, width: '180px', fieldType: 'text', isExceedContent: false }
        ];
    itemHeaders: any = [
        { field: 'description', header: 'Description', isLink: false, width: '120px', fieldType: 'text', isExceedContent: true },
        { field: 'sellPrice', header: 'Sale Price(Per Unit)', isLink: false, width: '180px', fieldType: 'text', isExceedContent: false },
        // { field: 'discount', header: 'Discount', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        { field: 'askPrice', header: 'Buyer Price(Per Unit)', isLink: false, width: '180px', fieldType: 'text', isExceedContent: false },
        { field: 'status', header: 'Status', isLink: false, width: '180px', fieldType: 'text', isExceedContent: false }
    ];
    buyersHeaders: any = [
        { field: 'specification', header: 'Specification ', isLink: false, width: '220px', fieldType: 'text', isExceedContent: true },
        // { field: 'buyerCompanyName', header: 'Buyer Company Name', isLink: false, width: '120px', fieldType: 'text', isExceedContent: true },
        // { field: 'sellPrice', header: 'Sale Price(Per Unit)', isLink: false, width: '190px', fieldType: 'text', isExceedContent: true },
        { field: 'askPrice', header: 'Buyer Price(Per Unit)', isLink: false, width: '180px', fieldType: 'text', isExceedContent: false },
        { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '130px', fieldType: 'text', isExceedContent: false },
        { field: 'quantity', header: 'Quantity', isLink: false, width: '190px', fieldType: 'text', isExceedContent: true },
        { field: 'status', header: 'Status', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        // { field: 'buyerDiscount', header: 'Buyer Discount', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false }
    ]; 
    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    itemList: any = [];
    roleName: any = '';
    selectedData: any = [];
    selectedRowData :any;
    loggedUserOwnPermissions: any = [];
    loggedUserDetails: any;
    defaultPermissions: { PC_PR_PAGE: { VIEW: string; RFQ_TAB_VIEW: string; RFQ_CREATE: string; RFQ_TAB_VIEW_COMMENTS: string; VENDOR_SEARCH: string; RFQ_SEND_TO_VENDORS: string; QUOTE_TAB_VIEW: string; QUOTE_TAB_COMMENTS: string; VENDOR_TAB_VIEW: string; VENDOR_TAB_COMMENTS: string; AUCTION_VIEW: string; AUCTION_EDIT: string; AUCTION_DETAILS_VIEW: string; AUCTION_CANCEL: string; AUCTION_CREATE: string; AUCTION_REPORTS: string; }; CLIENT_VENDOR_PAGE: { VIEW: string; }; PC_PR_CLIENT_REGISTER_PAGE: { VIEW: string; CREATE_CLIENT_REGISTER: string; UPDATE_CLIENT_REGISTER: string; CLIENT_REGISTER_DATA_VIEW: string; }; PC_QUOTE_PAGE: { VIEW: string; COMMENTS_VIEW: string; PR_TAB_VIEW: string; PR_TAB_COMMENTS: string; }; PC_V_REG_PAGE: { VIEW: string; SAVE: string; SUBMIT: string; }; PC_V_QUOTE_PAGE: { VIEW: string; }; PC_VENDOR_DASHBOARD_PAGE: { VIEW: string; VENDORS_TAB_VIEW: string; APPROVE_PENDING_TAB_VIEW: string; APPROVE_PENDING_TAB_APPROVE: string; APPROVE_PENDING_TAB_PROFILE_VIEW: string; APPROVE_PENDING_TAB_REJECT: string; REG_PENDING_VIEW: string; PC_CLIENT_VENDORS_VIEW: string; }; PC_VENDOR_INVITE_PAGE: { VIEW: string; SEND_INVITE: string; }; PC_VENDOR_APPROVALS_PAGE: { VIEW: string; }; PC_VENDOR_SEARCH_PAGE: { VIEW: string; }; PC_PRE_VENDOR_PAGE: { VIEW: string; }; PC_C_DASHBOARD_PAGE: { VIEW: string; }; PC_C_PR_PAGE: { VIEW: string; CREATE: string; CANCEL: string; APPROVE: string; REJECT: string; VIEW_PR: string; CLOSE_PR: string; ACCEPT_PR: string; }; PC_C_PPO_PAGE: { VIEW: string; ACCEPT: string; REJECT: string; }; PC_C_PPO_TABS: { QUOTECOMPARISSION: string; POSTAUC: string; }; PC_C_PROFILE_PAGE: { VIEW: string; }; PC_QUOTE_COMPARE_PAGE: { VIEW: string; }; PC_CLIENT_PAGE: { INVOICE_VIEW: string; PO_VIEW: string; ITEMS_VIEW: string; ANALYTICS_VIEW: string; PAYMENT_VIEW: string; RFQS_VIEW: string; }; PC_PPO_PAGE: { VIEW: string; APPROVE: string; REJECT_P: string; REJECT: string; ACCEPT: string; CREATE: string; DETAILS: string; QUOT_COMPARISON_VIEW: string; PR_DETAILS_VIEW: string; }; PC_V_DASHBOARD_PAGE: { VIEW: string; }; PC_V_RFQ_PAGE: { VIEW: string; }; PC_V_QUOTES_PAGE: { VIEW: string; }; PC_V_PROFILE_PAGE: { VIEW: string; }; PC_V_REGRISTRATION_PAGE: { VIEW: string; }; PC_VR_PAGE: { VIEW: string; CREATE_REQ: string; REQ_COMPLETED: string; CLOSE_REQ: string; REQ_IN_PROGRESS: string; BID_LIVE_VIEW: string; }; PC_RI_PAGE: { VIEW: string; }; PC_ITEM_PAGE: { VIEW: string; CREATE_ITEM: string; LINK_ITEM_TO_VENDOR_BY_VENDOR_MGR: string; EDIT_ITEM_FOR_VENDOR: string; LINK_ITEM_TO_CLIENT_BY_VENDOR_MGR: string; }; PC_CATEGORY_PAGE: { VIEW: string; CREATE_ITEM: string; }; PC_PO_PAGE: { VIEW: string; CREATE_PO: string; EDIT_PO: string; APPROVE_PO: string; ACCEPT_PO: string; REJECT_PO: string; }; PC_INVOICE_PAGE: { VIEW: string; CREATE_INVOICE: string; EDIT_INVOICE: string; APPROVE_INVOICE: string; ACCEPT_INVOICE: string; REJECT_INVOICE: string; }; ITEM_CATALOGUE_PAGE: { PR_VIEW: string; CAT_MGR_VIEW: string; }; REPORTS_PAGE: { REPORTS_VIEW: string; PR_REPORTS_VIEW: string; PPO_REPORTS_VIEW: string; }; CREATE_RFQ_PAGE: { RFQ_PAGE_VIEW: string; RFQ_PAGE_EDIT: string; }; };
    currentView: any;
    isBFSView: boolean;
    expandedRows:any= {};
    @ViewChild('viewItemDetailsTemplate')viewItemDetailsTemplate:any;
    bfsBuyersList: any[];
    isShowGrid: boolean;
    editBFSItemData: any;
    bfsForm = new FormGroup({
        quantity: new FormControl('', [  Validators.required,   , Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)]),
        discount: new FormControl('', [  Validators.required,   , Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)]),
        buyPrice: new FormControl('', [  Validators.required,   , Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)]),
        askPrice: new FormControl('', [  Validators.required,   , Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)]),
        availableQuantity: new FormControl('')

    });
    selectedBFSBuyerRowData: any;

    @ViewChild('editBFSItemTemplate') editBFSItemTemplate: any;
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
        if(this.roleName === 'ClientInitiator'){
            this.itemHeaders = this.clientInitiatoreItemHeaders;
        }
        this.getItemsList();
        this.currentView = !localStorage.getItem('system-view') ? JSON.parse(localStorage.getItem('system-view')): localStorage.getItem('system-view');
        this.isBFSView = [SystemViewConfig.BFS_PRO].includes(this.currentView)? true: false;

    }
    getItemsList() {
        this.itemList =[];

            this.bfsItemService.getReqItemsByBuyer({id: this.loggedUserDetails.id}).subscribe((res:any)=>{
                this.itemList = Array.isArray(res) ?  res.map((ele: any) => {
                    return { ...ele, status: ele.status.uiDisplay}
                }): [];
            })


    }



     onViewItemDetails(rowData:any){
        const dialogConfig = new MatDialogConfig();
        this.selectedRowData = rowData;
        this.selectedRowData['bfsDocuments'] = [];
        this.bfsItemService.getDocsByBFSId({id: rowData.id}).subscribe((res:any)=>{
            if(Array.isArray(res)){
                this.selectedRowData['bfsDocuments'] = [...res]
            }
        })
        // dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = null;
        dialogConfig.minWidth = 400;
        dialogConfig.minHeight = 500;
        dialogConfig.maxWidth = 'none';
        dialogConfig.width = '55%';
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
        this.expandedRows = rowData;
        this.getBuyerByBFS(rowData);
    }
    get expandedRowKeys() {
        return this.expandedRows?.id ? { [this.expandedRows.id]: true } : {};
    }
    reloadGridComponent() {
        this.isShowGrid = false;
        setTimeout(() => {
            this.isShowGrid = true;
        }, 100)
    }
    getBuyerByBFS(rowData) {
            this.bfsItemService.getBuyersByBidItems({
                "user":{
                  "id": this.loggedUserDetails.id
                },
                "items":{
                  "id": rowData.id
                }
              }).subscribe((res:any) =>{
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


    onEditBFSBuyerItem(rowData: any) {
        if(!(rowData.status == 'Approval Rejected')){
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
        this.bfsForm.patchValue({buyPrice: rowData.sellPrice, availableQuantity: rowData.availableQuantity})
        const dialogRef = this.dialog.open(this.editBFSItemTemplate, dialogConfig).afterClosed().subscribe(result => {

        });
    }

    sendBidAgain(){
        if(!this.bfsForm.valid){
            this.toaster.warning("Please Enter Valid  Quantity", "Warning");
            return;
        }
        let obj = this.bfsForm.getRawValue();
        delete obj.availableQuantity;
        this.bfsItemService.reBidByBuyerWithNewQtyPrice({id: this.selectedBFSBuyerRowData.id,...obj, buyPrice: obj.askPrice}).subscribe((res:any)=>{
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

    onPriceDiscountChange() {
        const sellPrice = this.bfsForm.value['askPrice'] ? this.bfsForm.value['askPrice'] : 0;
        const discount_ = (((Number(this.selectedBFSBuyerRowData.sellPrice) - Number(sellPrice))* 100)/ Number(this.selectedBFSBuyerRowData.sellPrice)).toFixed(2)
        const _discount =  Number(discount_) > 0 ? discount_ : 0
        this.bfsForm.patchValue({ 'discount':_discount.toString()});

    }
}
