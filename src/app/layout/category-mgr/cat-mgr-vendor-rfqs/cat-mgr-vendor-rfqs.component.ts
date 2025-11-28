import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { EncryDecryService } from 'src/app/shared/services';
import { RfqService } from '../../vendor/services/rfq.service';
import { ToastrService } from 'ngx-toastr';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { ViewRFQByIdModalComponent } from '../../vendor/components/view-rfq-by-id-modal/view-rfq-by-id-modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SystemViewConfig } from 'src/app/app.config';
import { OverlayPanel } from 'primeng/overlaypanel';
import { CreateRfqService } from '../services/create-rfq.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
@Component({
    selector: 'app-cat-mgr-vendor-rfqs',
    templateUrl: './cat-mgr-vendor-rfqs.component.html',
    styleUrls: ['./cat-mgr-vendor-rfqs.component.scss']
})
export class CatMgrVendorRfqsComponent implements OnInit {

    @ViewChild('raiseQueryRef') raiseQueryRef: any;
    @ViewChild('vendorInfoTemplate') vendorInfoTemplate: any;
    @ViewChild('clientInfoTemplate') clientInfoTemplate: any;

    rfqDataList: any = [];
    selectedData: any = [];
    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    defaultPermissions: any;
    loggedUserPermissions: any;
    viewRFQByIdData: any;
    rfqTableHeaders = [];
    expandedRows: any = {};
    queryList: any = [];
    categoryList: any = [];
    selectedStatus: string = '';
    statusList: any = [
        "New",
        "Requested",
        "In Progress",
        "Approved",
        "Quotation Received",
        "Ignored"

    ];
    rfqsTableHeadersForGMTVendor: any = [
        { field: 'rfqId', header: 'RFQ ID', isLink: false, width: '170px', fieldType: 'text', isExceedContent: false },
        { field: 'desc', header: 'Description', isLink: false, width: '160px', fieldType: 'text', isExceedContent: true },
        { field: 'category', header: 'Category', isLink: false, width: '160px', fieldType: 'text', isExceedContent: true },
        { field: 'createdTS', header: 'RFQ Date', isLink: false, fieldType: 'date', width: '180px', isExceedContent: false },
        { field: 'deliveryDate', header: 'Delivery Date', isLink: false, fieldType: 'date', width: '180px', isExceedContent: false },
        { field: 'deliveryLocation', header: 'Location', isLink: false, width: '150px', fieldType: 'text', isExceedContent: true },
        // { field: 'category', header: 'Category', isLink: false, width: '150px', fieldType: 'text', isExceedContent: true },
        // { field: 'division', header: 'Division', isLink: false, width: '150px', fieldType: 'text', isExceedContent: true },
        // { field: 'queryContent', header: 'Query', isLink: false, width: '160px', fieldType: 'text', isExceedContent: true },
        // { field: 'closureDate', header: 'Closure Date', isLink: false, width: '160px', fieldType: 'date', isExceedContent: false },
        // { field: 'rfqClosingDate', header: 'RFQ Due Date', isLink: false, fieldType: 'date',  width: '180px' , isExceedContent: false},
        { field: 'status_ui_display', header: 'Status', isLink: false, width: '100px', fieldType: 'text', isExceedContent: false }
    ];
    rfqsTableHeadersForCategoryManger: any = [
        // { field: 'rfqId', header: 'RFQ Id', isLink: false, width: '190px', fieldType: 'text', isExceedContent: false },
        // { field: 'description', header: 'Description', isLink: false, width: '150px', fieldType: 'text', isExceedContent: true },
        // { field: 'rfqClosingDate', header: 'Closure Date', isLink: false, width: '160px', fieldType: 'date', isExceedContent: false },
        // { field: 'createdTS', header: 'Creation Date', isLink: false, fieldType: 'date',  width: '180px', isExceedContent: false},
        // { field: 'status_ui_display', header: 'Status', isLink: false, width: '150px', fieldType: 'text', isExceedContent: false }


        // { field: 'rfqId', header: 'RFQ Id', isLink: false, width: '190px', fieldType: 'text', isExceedContent: false },
        // { field: 'projectDesc', header: 'Description', isLink: false, width: '150px', fieldType: 'text', isExceedContent: true },
        // { field: 'category', header: 'Category', isLink: false, width: '160px', fieldType: 'text', isExceedContent: false },
        // { field: 'deliveryDate', header: 'Delivery Date', isLink: false, fieldType: 'date', width: '180px', isExceedContent: false },
        // { field: 'quotationReceived', header: 'Quotation Received', isLink: false, width: '160px', fieldType: 'text', isExceedContent: false },

        // { field: 'createdTs', header: 'Creation Date', isLink: false, fieldType: 'date', width: '180px', isExceedContent: false },


        { field: 'rfqId', header: 'RFQ Id', isLink: false, width: '190px', fieldType: 'text', isExceedContent: false },
        { field: 'projectDesc', header: 'Description', isLink: false, width: '150px', fieldType: 'text', isExceedContent: true },
        { field: 'companyName', header: 'Company Name', isLink: false, width: '180px', fieldType: 'text', isExceedContent: true },
        { field: 'phoneNumber', header: 'Contact', isLink: false, width: '180px', fieldType: 'text', isExceedContent: true },
        { field: 'noOfVendors', header: 'No. Of Vendors', isLink: false, width: '160px', fieldType: 'text', isExceedContent: true },
        { field: 'noOfQuotes', header: 'No. Of Quotes', isLink: false, width: '160px', fieldType: 'text', isExceedContent: true },
        { field: 'createdTs', header: 'Creation Date', isLink: false, fieldType: 'date', width: '180px', isExceedContent: false },
        { field: 'status_ui_display', header: 'Status', isLink: false, width: '160px', fieldType: 'text', isExceedContent: false }
    ];

    vendorTableHeaders: any = [
        { field: 'vendorId', header: 'Company Id', isLink: false, width: '140px', fieldType: 'text', isExceedContent: false },
        { field: 'vendorName', header: 'Name', isLink: false, width: '150px', fieldType: 'text', isExceedContent: true },
        { field: 'query', header: 'Query', isLink: false, width: '160px', fieldType: 'text', isExceedContent: true },
        { field: 'status_ui_display', header: 'Status', isLink: false, width: '100px', fieldType: 'text', isExceedContent: false },
        { field: 'createdTS', header: 'Submitted Date', isLink: false, fieldType: 'date', width: '140px', isExceedContent: false },
    ];
    itemsTableHeaders: any = [
        { field: 'description', header: 'Item Description', isLink: false, width: '190px', fieldType: 'text', isExceedContent: true },
        { field: 'brand', header: 'Specifications', isLink: false, width: '150px', fieldType: 'text', isExceedContent: true },
        { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '160px', fieldType: 'text', isExceedContent: false },
        { field: 'quantity', header: 'Quantity', isLink: false, width: '160px', fieldType: 'text', isExceedContent: false }, 
        { field: 'createdTS', header: 'Creation Date', isLink: false, fieldType: 'date', width: '180px', isExceedContent: false },
    ];
    loggedUserDetails: any;
    currentRole: any = '';
    selectedRfqData: any;
    rfqId: any;
    vendorsList: any = [];
    itemsList: any = [];
    dialogRef: any;
    queryDescContent: string = '';
    isChildGridShow: boolean;
    isGMTView: boolean;
    SYSTEM_VIEW_CONFIG: any = SystemViewConfig;
    GMT_VIEWS = [this.SYSTEM_VIEW_CONFIG.GMT_BASIC, this.SYSTEM_VIEW_CONFIG.GMT_BASIC_PLUS, this.SYSTEM_VIEW_CONFIG.GMT_PROF]

    @ViewChild('op') op: OverlayPanel;
    selectedCategory: string = '';
    selectedDivision: string = '';
    divisionsList: any = [];
    cache_rfqDataList: any = [];
    vendorInfo: any;
    selectedVendor: any;
    clientInfo: any;
    constructor(private dialog: MatDialog,
        private encryDecryService: EncryDecryService,
        private rfqservice: RfqService,
        private toastrService: ToastrService,
        private createRfqService: CreateRfqService,
        private authService: AuthenticationService) { }

    // @HostListener('click', ['$event'])
    // onHide($event){
    //     if(this.op.visible){
    //         console.log('showing .')
    //         this.op.toggle($event);
    //     }
    // }
    ngOnInit() {
        this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
        this.loggedUserDetails = temp.details;
        this.loggedUserPermissions = temp.details.listofPermission;
        this.currentRole = this.loggedUserDetails.role.roleName;
        this.intialCall();
        this.isGMTView = localStorage.getItem('system-view') ? this.GMT_VIEWS.includes(localStorage.getItem('system-view')) : false;

    }

    intialCall() {
        this.selectedCategory = '';
        if (this.currentRole == "CategoryManager2" || this.currentRole == "CategoryManager") {
            this.rfqTableHeaders = this.rfqsTableHeadersForCategoryManger;
            this.getRfqsByCategoryManager();
        } else {
            this.rfqTableHeaders = this.rfqsTableHeadersForGMTVendor;
            this.getRFQListByGMTVendor();
        }
        this.getAllCategories();
    }
    getRfqsByCategoryManager() {
        this.selectedData = [];
        const req = { "id": this.loggedUserDetails.org.id };
        this.rfqservice.getAllRFQsByGMTCategory().subscribe(data => {
            if (Array.isArray(data)) {
                this.rfqDataList = data.map((ele: any) => {
                    const status_display = ele['status'] && ele['status']['uiDisplay'] ? ele.status.uiDisplay : ele.uiDisplay;

                    return { ...ele, status_ui_display: status_display, quotationReceived: ele.quotationReceived == true ? 'YES' : 'WIP' }
                }) || [];
            } else {
                this.rfqDataList = [];
            }
            this.cache_rfqDataList = [...this.rfqDataList];
        });
    }

    onViewRFQDetails(rowData) {
        console.log(rowData);
        const temp = {
            'id': rowData.id
        };
        this.rfqservice.fetchRfqById(temp).subscribe((res: any) => {
            if (res) {
                this.viewRFQByIdData = res || {};
                this.viewRFQByIdModal();
            } else {
                this.toastrService.error('Failed to Fetch data', 'Failure');
            }
        });
    }

    viewRFQByIdModal() {
        const dialogConfig = new MatDialogConfig();

        // dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = { ...this.viewRFQByIdData, hiddenCategory: true, showItemsOnly: false, hideSpecialRFQClosingDate: true, isShowAttachments: false };
        dialogConfig.minWidth = 400;
        dialogConfig.minHeight = 500;
        dialogConfig.maxWidth = 'none';
        dialogConfig.width = '80%';
        this.dialogRef = this.dialog.open(ViewRFQByIdModalComponent, dialogConfig).afterClosed().subscribe(result => {
            //this.intialCall()
        });
    }
    getRFQListByGMTVendor() {
        this.createRfqService.getGMTDivisions().subscribe((res: any) => {
            this.divisionsList = res || [];
        });
        this.selectedData = [];
        const req = { "id": this.loggedUserDetails.org.id };
        this.rfqservice.getAllCategoryRFQByGMTVendors(req).subscribe(data => {
            // const data =[
            //     {
            //     "id": "a4de0d8b-7e62-49b3-951b-eab71c55379e",
            //     "rfqId": "ONE231107140613-R1002",
            //     "desc": "TestPR2_07_11",
            //     "closureDate": null,
            //     "status":{"id": "6", "createdBy": "venu", "lastModifiedBy": null, "createdTS": null, uiDisplay: 'New'},
            //     "deliveryLocation": null
            //     },
            //     {
            //     "id": "78b7172f-27a7-4f43-a415-c41c2cd31522",
            //     "rfqId": "ONE231107140613-R1001",
            //     "desc": "TestPR2_07_11",
            //     "closureDate": null,
            //     "status":{"id": "6", "createdBy": "venu", "lastModifiedBy": null, "createdTS": null, uiDisplay: 'New'},
            //     "deliveryLocation": null
            //     }] 
            if (Array.isArray(data)) {
                this.rfqDataList = data.map((ele: any) => {
                    const desc = ele.query ? ele.query.split('|').join(" ") : '';
                    const status_display = ele['status'] && ele['status']['uiDisplay'] ? ele.status.uiDisplay : ele.status;
                    // if (!!ele.category && !this.categoryList.includes(ele.category)) {
                    //     this.categoryList.push(ele['category'])
                    // }
                    return { ...ele, status_ui_display: status_display, queryContent: desc }
                }) || [];
            } else {
                this.rfqDataList = [];
            }
            this.cache_rfqDataList = [...this.rfqDataList];
        });


    }

  

   
    getAllCategories() {
        this.createRfqService.getGMTCategories().subscribe((res: any) => {
            this.categoryList = res || [];
        });
    }
 


    filterRFQsBYCategory() {
        this.selectedStatus = ''
        if (this.selectedCategory  ) {
            this.rfqDataList = this.cache_rfqDataList.filter((ele: any) => {
                return ele.category == this.selectedCategory ;
            });
        } else {
            this.rfqDataList = [...this.cache_rfqDataList];
        }
    }

    filterRFQsBYStatus() { 
            this.rfqDataList = this.cache_rfqDataList.filter((ele: any) => {
                if (  this.selectedCategory && this.selectedStatus) {
                    return ele.status_ui_display == this.selectedStatus &&   ele.category == this.selectedCategory;
                } else if ( this.selectedCategory && !this.selectedStatus) {
                    return   ele.category == this.selectedCategory;
                } else if ( this.selectedStatus) {
                    return ele.status_ui_display == this.selectedStatus;
                } else {
                    return true;
                }
            }); 
    }

    onResetFilters() {
        this.selectedCategory = '';
        this.selectedDivision = '';
        this.selectedStatus = '';
        this.rfqDataList = [...this.cache_rfqDataList]
    }

    requestEnability(rowData: any) {
        return ['New', 'Ignored'].includes(rowData.status_ui_display)
    }

    queryEnability(rowData: any) {
        return !(['Ignored'].includes(rowData.status_ui_display))
    }

    ignoreEnability(rowData: any) {
        return (['New'].includes(rowData.status_ui_display))
    }
    onSelectSystem(sysValue) {
        this.authService.onSelectedSubscriptions(sysValue, this.loggedUserDetails, true)
    }

    onRequestForRFQ(rowData: any) {
        if (!this.requestEnability(rowData)) {
            this.toastrService.warning("Sorry, You're not allowed at this moment!", 'Warning')
            return false;
        }
        const currentDateTimeStamp = new Date();
        const currentMonth = currentDateTimeStamp.getMonth();

        const cr = this.rfqDataList.filter(ele => {
            // return ele.requestedDate && ((new Date(ele.requestedDate)).getMonth() == currentMonth || (new Date(ele.requestedDate)).getMonth() == currentMonth) && ele.status_ui_display == 'Requested'
            return ele.status_ui_display == 'Requested'; // only for 3 RFQ Requested check
        })
        if (cr.length >= 3 && localStorage.getItem('system-view') != SystemViewConfig.GMT_PROF) {
            this.toastrService.warning("you have reached your monthly limit. Please become a premium member to continue with RFQs", "Warning");
            return;
        }
        const req = [{
            "vendor": {
                "id": this.loggedUserDetails.org.id
            },
            "rfq": {
                "id": rowData.id
            }
        }]
        this.rfqservice.requestForRFQByGMTVendor(req).subscribe((res: any) => {
            if (res.status == 'Success') {
                this.toastrService.success(res.message, 'Success');
                this.intialCall();
            } else {
                this.toastrService.error(res.message, 'Error')
            }
        });

    }

    viewRFQDetails(rowData) {
        console.log(rowData);
        const temp = {
            'id': rowData.id
        };
        this.rfqservice.fetchRfqById(temp).subscribe((res: any) => {
            if (res) {
                this.viewRFQByIdData = res || {};
                this.viewRFQByIdModal();
            } else {
                this.toastrService.error('Failed to Fetch data', 'Failure');
            }
        });
    }



    viewCorresspondance(rowData) {
        // rowData['commentRootPath'] = 'CAT-RFQ-COMMENTS-MODAL';
        // const dialog = this.dialog.open(CorrespondenceComponent, { data: rowData });

        // dialog.afterClosed().subscribe(result => {
        //     // this.getRfqsByPr();
        // });
    }

    getLineItems(event) {

    }

    getRFQs(event) {
        this.expandedRows = {};
        const thisRef = this;
        thisRef.expandedRows[event.data.id] = 1;
        thisRef.expandedRows[event.data.id] = true;
        this.vendorsList = [];
        this.itemsList = [];
        this.selectedData = [event.data];
        this.selectedRfqData = Object.assign({}, event.data);
        this.rfqId = event.data.rfqId;
        this.getVendorsByRfq();
        this.getLineItemsByRFQ();
        //   this.h1.nativeElement.scrollIntoView({behavior: 'smooth'});
    }

    getCloseRFQs(event) {
        this.expandedRows[event.data.id] = false;
        this.expandedRows = {};
    }

    getVendorsByRfq() {
        const obj = { "id": this.selectedRfqData.id }
        this.isChildGridShow = false;
        this.vendorsList = [];
        this.rfqservice.getVendorsByRFQIdForGMT(obj).subscribe((res: any) => {
            if (Array.isArray(res)) {
                this.vendorsList = res.map((ele: any) => {
                    const status_display = ele['status'] && ele['status']['uiDisplay'] ? ele.status.uiDisplay : ele.status;
                    return { ...ele, status_ui_display: status_display }
                }) || [];
            }
        });
        setTimeout(() => {
            this.isChildGridShow = true;
        }, 50);

        // this.vendorsList = [
        //     {
        //         "id": "140bb2f2-7154-4686-a7b6-03ca082ff153",
        //         "createdBy": null,
        //         "lastModifiedBy": null,
        //         "createdTS": null,
        //         "lastModifiedTS": null,
        //         "vendor": null,
        //         "rfq": null,
        //         "vendorUuid": "3b601125-e39d-483a-ada7-bed8794bc504",
        //         "vendorName": "soft world",
        //         "vendorId": "SOF220508165630",
        //         "status_ui_display": "New",
        //         "status": { "id": "102", "createdBy": "Harshitha", "lastModifiedBy": null, "createdTS": null, uiDisplay: 'New' }
        //     }, {
        //         "id": "140bb2f2-7154-4686-a7b6-03ca082ff154",
        //         "createdBy": null,
        //         "lastModifiedBy": null,
        //         "createdTS": null,
        //         "lastModifiedTS": null,
        //         "vendor": null,
        //         "rfq": null,
        //         "vendorUuid": "3b601125-e39d-483a-ada7-bed8794bc504",
        //         "vendorName": "soft world ltd",
        //         "vendorId": "SOF220508165632", "status_ui_display": "In Progress",
        //         "status": { "id": "102", "createdBy": "Harshitha", "lastModifiedBy": null, "createdTS": null, uiDisplay: 'New' }
        //     },
        // ]
    }

    getVendorInfo(rowData: any) {
        this.selectedVendor = rowData;
        this.rfqservice.getVendorInfoById({ id: rowData.vendorUuid }).subscribe((res: any) => {
            if (res) {
                this.dialog.closeAll();
                this.vendorInfo = res;
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

    showClientInfoIcon(rowData: any) {
        return !rowData.acceptedDate ? false : this.getDifferenceInHours((new Date()), new Date(rowData.acceptedDate))
    }

    getDifferenceInHours(date1: Date, date2: Date): boolean {
        // Get the difference in milliseconds
        const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime());

        // Convert milliseconds to hours
        const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
        // console.log('diffInHours', diffInHours)
        return diffInHours > 0 && diffInHours <= 48;
    }

    getClientInfo(rowData: any) {
        this.selectedRfqData = rowData;
        this.rfqservice.getClientInfoById({ id: rowData.userId }).subscribe((res: any) => {
            if (res) {
                this.dialog.closeAll();
                this.clientInfo = res;
                this.dialog.open(this.clientInfoTemplate, {
                    width: "30%",
                    minHeight: "250px",
                    data: "Su",
                }).afterClosed().subscribe((res: any) => {
                    this.clientInfo = null;
                    this.selectedVendor = null;
                })
            }
        })
    }
    getLineItemsByRFQ() {

        const obj = { "id": this.selectedRfqData.id }

        this.rfqservice.getItemsByRFQIdForGMT(obj).subscribe((res: any) => {
            if (Array.isArray(res)) {
                this.itemsList = res || [];
            }
        });

        // this.itemsList = [
        //     {
        //         brand
        //             :
        //             "Siemens",
        //         category
        //             :
        //             null,
        //         createdBy
        //             :
        //             null,
        //         createdTS
        //             :
        //             "2023-04-14T10:49:42.000+0000",
        //         description
        //             :
        //             "MCB 4POLE 30AMP-PR 592 - 15/07/2022 - 5170501005",
        //         id
        //             :
        //             "dc3565d7-895e-43cc-9609-0ea412787f3b",
        //         itemcode
        //             :
        //             null,
        //         lastModifiedBy
        //             :
        //             null,
        //         lastModifiedTS
        //             :
        //             "2023-04-14T10:49:42.000+0000",
        //         pritemId
        //             :
        //             "09f7f37f-4884-4bef-b548-5fb2553e89b1",
        //         quantity
        //             :
        //             25,
        //         remarks
        //             :
        //             null,
        //         serialNo
        //             :
        //             1001,
        //         totalamount
        //             :
        //             0,
        //         unitofMeasures
        //             :
        //             "Nos",
        //         unitprice
        //             :
        //             0
        //     }
        // ]
    }

    // Accept or Reject Vendor by CM
    onAcceptOrRejectVendor(rowData: any, isAccepted) {
        if (rowData.status_ui_display == 'New') {
            this.toastrService.error("You're not allowed at this moment!", 'Warning');
            return;
        }
        const obj = {
            "vendor": {
                "id": rowData.vendorUuid
            },
            "rfq": {
                "id": this.selectedRfqData.id
            },
        }
        if(isAccepted && (rowData.status_ui_display == 'New' || rowData.status_ui_display == 'Approved')){
            this.toastrService.error("You can't approve a vendor!", 'Warning');
            return;
        }
        if(!isAccepted && (rowData.status_ui_display == 'New' || rowData.status_ui_display == 'Rejected')){
            this.toastrService.error("You can't reject a vendor!", 'Warning');
            return;
        }
        if (isAccepted) {
            this.rfqservice.acceptVendorByCM(obj).subscribe((res: any) => {
                if (res && res.status == 'Success') {
                    this.toastrService.success('Vendor Request Accepted Successfully!', 'Success');
                    this.getVendorsByRfq();
                } else {
                    this.toastrService.error(res.message, 'Error');
                }
            })
        } else {
            this.rfqservice.rejectVendorByCM(obj).subscribe((res: any) => {
                if (res && res.status == 'Success') {
                    this.toastrService.success('Vendor Request Rejected', 'Success');
                    this.getVendorsByRfq();
                } else {
                    this.toastrService.error(res.message, 'Error');
                }
            })
        }
    }

    // ngOnDestroy(){
    //     this.dialogRef.afterCloseAll();
    // }

    onRiaseQueryOrIgnoreRFQ(rowData: any, isIgnored: boolean = false) {
        if (!(this.queryEnability(rowData)) && !isIgnored) {
            this.toastrService.warning("You're Not allowed at this moment!", 'Warning')
            return false;
        }
        if (!(this.ignoreEnability(rowData)) && isIgnored) {
            this.toastrService.warning("You're Not allowed at this moment!", 'Warning')
            return false;
        }
        this.selectedRfqData = rowData;
        if (isIgnored == true) {
            const obj = [{
                id: this.loggedUserDetails.id,
                "vendor": {
                    "id": this.loggedUserDetails.org.id
                },
                "rfq": {
                    "id": this.selectedRfqData.id
                }
            }]

            this.rfqservice.ignoreRFQByGTMVendor(obj).subscribe((res: any) => {
                this.intialCall();
            })
        } else {
            this.selectedRfqData = rowData;
            this.queryDescContent = ''
            console.log('queryList', this.selectedRfqData.queryContent.split("|"))
            this.queryList = this.selectedRfqData.query ? this.selectedRfqData.query.split("|") : [];
            // this.queryList = "Hello|HI|How|Are|You!".split("|")

            this.dialog.open(this.raiseQueryRef, {
                width: "30%",
                minHeight: "250px",
                data: "Su",
            }).afterClosed().subscribe((res: any) => {
                this.queryDescContent = ''
            })

        }

    }

    onRaiseQuery() {
        if (!this.queryDescContent) {
            this.toastrService.warning("Please Enter Query Details", 'Warning');
            return;
        }
        const queryData: string = "Hello|HI|How|Are|You!"
        const newQueryCont = this.selectedRfqData.query ? this.selectedRfqData.query.concat("|").concat(this.queryDescContent) : this.queryDescContent;
        const newQueryCont1 = queryData ? (queryData + '|') + (this.queryDescContent) : queryData;
        const obj = {
            id: this.loggedUserDetails.id,
            "vendor": {
                "id": this.loggedUserDetails.org.id
            },
            "rfq": {
                "id": this.selectedRfqData.id
            },
            "query": newQueryCont
        };


        this.rfqservice.riaseQueryRFQByGTMVendor(obj).subscribe((res: any) => {
            if (res.status == 'Success') {
                this.toastrService.success(res.message, 'Success');
                this.dialog.closeAll();
                this.intialCall();
            } else {
                this.toastrService.warning(res.message, 'Warning');

            }
        })


    }
}
