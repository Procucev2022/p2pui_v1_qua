import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
import { LiveAuctionModalComponent } from '../../vendor/auctions/live-auction-modal/live-auction-modal.component';
import swal from 'sweetalert2';
import { AuctionService } from '../services/auction.service';
import { SealedBidAuctionModalComponent } from '../../vendor/auctions/sealed-bid-auction-modal/sealed-bid-auction-modal.component';
import { CorrespondenceComponent } from 'src/app/shared/modules/common-share/components/correspondence/correspondence.component';
import { LiveAuctionForRfqWiseComponent } from '../../vendor/auctions/live-auction-for-rfq-wise/live-auction-for-rfq-wise.component';
import { LiveAuctionForItemwiseComponent } from '../../vendor/auctions/live-auction-for-itemwise/live-auction-for-itemwise.component';
import { CreateAuctionModalComponent } from 'src/app/shared/modules/common-share/components/create-auction-modal/create-auction-modal.component';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CatProcuRequestsService } from '../services/cat-procu-requests.service';
import {Chart} from 'chart.js';
import { ExportPdfService } from '../services/export-pdf.service';
import { ClientService } from '../../client/services/client-service.service';
import { CategoryService } from '../../category/services/category.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
@Component({
  selector: 'app-capex-auctions',
  templateUrl: './capex-auctions.component.html',
  styleUrls: ['./capex-auctions.component.scss']
})
export class CapexAuctionsComponent implements OnInit{

    selectedData: any = [];
    auctionsList: any = [];
    actDocList: any = [];
    pageRecordSize: any;
    pageOptions: any;
    auctionHeaders: any = [

        { field: 'auctionId', header: 'Auction ID', isLink: false, width: '280px', fieldType: 'text', isExceedContent: false },
        { field: 'auctionName', header: 'Auction Name', isLink: false, width: '170px', fieldType: 'text', isExceedContent: true },
        { field: 'auctionType', header: 'Type', isLink: false, width: '160px', fieldType: 'text' , isExceedContent: false},
        { field: 'auctionCategory', header: 'Method', isLink: false, width: '160px', fieldType: 'text', isExceedContent: false },
        { field: 'auctionstatus', header: 'Auction', isLink: false, width: '180px', fieldType: 'text' , isExceedContent: false},
        { field: 'auctionStarttime', header: 'Start Time', isLink: false, width: '230px', fieldType: 'date', isExceedContent: false },
        { field: 'auctionEndtime', header: 'End Time', isLink: false, width: '230px', fieldType: 'date' , isExceedContent: false},
        // { field: 'createdBy', header: 'Created By', isLink: false, width: '200px', fieldType: 'text' , isExceedContent: false},
        { field: 'noOfDoc', header: 'Documents', isLink: false, width: '150px' , isExceedContent: false}

    ];
    auctionBidTableHeaders: any = [
        { field: 'vendorName', header: 'Vendor Name', isLink: false, width: '166px' , isExceedContent: true},
        { field: 'bidAmount', header: 'Bid Amount', isLink: false, width: '165px', isExceedContent: false },
        { field: 'currentRank', header: 'Rank', isLink: false, width: '168px', isExceedContent: false}
    ];
    rfqwiseAuctionBidTableHeaders: any = [
        // { field: 'vendorName', header: 'Vendor Name'  , isLink: false, width: '166px'},
        // { field: 'bidAmount', header: 'Bid Amount'  , isLink: false, width: '165px'},
        // { field: 'currentRank', header: 'Current Rank'  , isLink: false, width: '168px'},
        { field: 'description', header: 'Description', isLink: false, width: '166px' , isExceedContent: true},
        { field: 'specification', header: 'Specification', isLink: false, width: '165px' , isExceedContent: true},
        { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '166px' , isExceedContent: false},
        { field: 'quantity', header: 'Quantity', isLink: false, width: '165px' , isExceedContent: false},
        { field: 'bidAmount', header: 'Bid Amount', isLink: false, width: '168px' , isExceedContent: false},
    ];

    vendorTableHeaders: any = [
        { field: 'companyName', header: 'Vendor Name', isLink: false, width: '200px', fieldType: 'text', isExceedContent: true },
        { field: 'email', header: 'Vendor Email', isLink: false, width: '200px', fieldType: 'text' , isExceedContent: true},
        { field: 'phone', header: 'Vendor Phone', isLink: false, width: '200px', fieldType: 'text' , isExceedContent: false}
        // { field: 'createdTS', header: 'created Time'  , isLink: false, width:'205px', fieldType: 'date'},
        // { field: 'createdBy', header: 'Created By'  , isLink: false, width:'150px', fieldType: 'text'},
    ];
    aucvendorTableHeaders: any = [
        { field: 'companyId', header: 'Vendor ID', isLink: false, width: '200px', fieldType: 'text', isExceedContent: false },
        { field: 'companyName', header: 'Vendor Name', isLink: false, width: '200px', fieldType: 'text' , isExceedContent: true},
        { field: 'commentNotInvited', header: 'Remarks', isLink: false, width: '200px', fieldType: 'text' , isExceedContent: false}
        // { field: 'createdTS', header: 'created Time'  , isLink: false, width:'205px', fieldType: 'date'},
        // { field: 'createdBy', header: 'Created By'  , isLink: false, width:'150px', fieldType: 'text'},
    ];
    qoutationByRfqHeaders: any = [
        { field: 'companyName', header: 'Company Name', isLink: false, width: '200px', fieldType: 'text' , isExceedContent: true},
        { field: 'quotationId', header: 'Quotation ID', isLink: false, width: '200px', fieldType: 'text' , isExceedContent: false},
        { field: 'excludeTaxAmt', header: 'Total Amount', isLink: false, width: '200px', fieldType: 'text' , isExceedContent: false},
    ];
    qoutationByItemHeaders: any = [
        { field: 'vendorname', header: 'Company Name', isLink: false, width: '200px', fieldType: 'text' , isExceedContent: true},
        { field: 'totalamount', header: 'Amount', isLink: false, width: '200px', fieldType: 'text' , isExceedContent: false},
    ];
    auctionBidItemsList = {
        'items': [
            {
                'itemcode': null,
                'description': 'Dressing unit',
                'quantity': 9,
                'unitofMeasures': 'pc',
                'leadingPrice': 1200,
                'savings': 2000,
                'startPrice': 3200,
                'bids': [
                    {
                        'vendorName': 'soft world',
                        'bidAmount': 1200,
                        'currentRank': 1
                    },
                    {
                        'vendorName': 'Cloud comp',
                        'bidAmount': 1400,
                        'currentRank': 2
                    },
                    {
                        'vendorName': 'Cloud Inc',
                        'bidAmount': 1500,
                        'currentRank': 3
                    }
                ]
            },
            {
                'itemcode': null,
                'description': 'Table',
                'quantity': 9,
                'unitofMeasures': 'pc',
                'leadingPrice': 2800,
                'savings': 200,
                'startPrice': 3200,
                'bids': [
                    {
                        'vendorName': 'Cloud comp',
                        'bidAmount': 2800,
                        'currentRank': 1
                    },
                    {
                        'vendorName': 'soft world',
                        'bidAmount': 2900,
                        'currentRank': 2
                    },
                    {
                        'vendorName': 'Cloud Inc',
                        'bidAmount': 3000,
                        'currentRank': 3
                    }
                ]
            }
        ]
    };
    paginatoryDetails: any;
    loggedUserPermissions: any;
    loggedUserDetails: any;
    defaultPermissions;
    loggedUserType: any;
    auctionDetailsData: any;
    currentDate: Date;
    bidsList: any;
    bidItemsList: any;
    auctionId: any;
    auctionData: any;
    bidAuctionVendorData: Object;
    selectedAuctionData: any;
    viewAuctionResponseData: any;
    auctionDocList: any[] = [];
    @ViewChild('auctionBidDetailsTemplate') auctionBidDetailsTemplate: ElementRef;
    exportColumns: any;
    rfqBidWiseLists: any[] = [];
    refreshBtn = false;
    getBidVendorPdfDetails: any;
    vendordata: any[] = [];
    comparedata: any[] = [];
    aucvendors: any[] = [];
    exportColumnsTwo: any;
    aucvendorsdata: any[] = [];
    rfqwisedata: any[] = [];
    exportColumnsThree: any[] = [];
    auctionbidData: any[] = [];
    exportColumnsOne: any[] = [];
    qouteVendorHeaders: any[] = [];
    exportColumnsFour: any[] = [];
    qouteVendorData: any[] = [];
    exportColumnsFive: any[] = [];
    itemwiseAuctionData: any[] = [];
    qoutationByRfqData: any[] = [];
    quoteitemdata: any[] = [];
    exportColumnsSix: any[] = [];
    auction: Chart<'bar', any[], any>;
    viewPrByIdData: any;
    quoteComGeneratedData: any;
    showQuoteComp: boolean;
    itemArray: any[];
    vendorColHeaders: any[];
    itemRowHeaders: any[];
    itemData:any;
    postAuctionData: any;

    constructor(private modalDialog: MatDialog,
        private toaster: ToastrService,
        private auctionService: AuctionService,
        private encryDecryService: EncryDecryService,
        private catproc: CatProcuRequestsService,
        private exportPDFService: ExportPdfService,
        private clientService: ClientService,
        private catService: CategoryService,
        private procService: CatProcuRequestsService,
        private loaderService: LoaderService) { }

    ngOnInit() {
        this.currentDate = new Date();
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        const temp = JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')));
        console.log('lgo', temp.details);
        this.loggedUserDetails = temp.details;
        this.loggedUserType = temp.details.role.roleName;

        this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
        this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
        this.getAllAuctions();
    }

    refreshAuction() {
        this.getAllAuctions();
    }
    getEndDate(endDate) {
        return new Date(endDate);
    }

    getStartDate(startDate) {
        return new Date(startDate);
    }
    getAllAuctions() {
        this.selectedData = [];

        if (this.loggedUserType === 'CategoryManager' || this.loggedUserType === 'CategoryManagerBasic' || this.loggedUserType === 'CategoryManagerBasic2') {
            this.auctionService.getAllAuctionsForCapex().subscribe((res: any) => {
                if (Array.isArray(res)) {
                    this.auctionsList = this.processAuctionList(res);
                    console.log(res);

                }
            });
        } else if (this.loggedUserType === 'Vendor' || this.loggedUserType === 'PartialVendor') {
            this.auctionService.getAllAuctionsByVendorForCapex({ id: this.loggedUserDetails.org.id }).subscribe((res: any) => {
                if (Array.isArray(res)) {
                    this.auctionsList = this.processAuctionList(res);
                    console.log(res);

                }
            });
        } else if (this.loggedUserType === 'ClientInitiator' || this.loggedUserType === 'clientInitiator1.1' || this.loggedUserType === 'PRApprover') {
            let req ;
            if(this.loggedUserType === 'ClientInitiator' || this.loggedUserType === 'clientInitiator1.1' ){
                req = {
                    org: { id: this.loggedUserDetails.org.id },
                    id: this.loggedUserDetails.id,
                    "fromInitiator": true
                };
            }
            if( this.loggedUserType === 'PRApprover'){
                req = {
                    org: {
                        id: this.loggedUserDetails.org.id
                    },
                    id: this.loggedUserDetails.id,
                    "fromInitiator": false,
                    "department": {
                        "id": this.loggedUserDetails.department.id
                    }
                };
            }
            this.auctionService.getAuctionsByClientIdForCapex(req).subscribe((res: any) => {
                if (Array.isArray(res)) {
                    this.auctionsList = this.processAuctionList(res);
                    console.log(res);
                }
            });
        } else {

        }


        // console.log('after updating ' + this.auctionsList);

    }

    processAuctionList(res) {

        for (let i = 0; i < res.length; i++) {
            const auction_id_array =  res[i].auctionId ? res[i].auctionId.split('-') :[];
            const auction_id =auction_id_array? auction_id_array[auction_id_array.length - 1]: '';
            res[i]['displayAuctionId'] = auction_id;
            if (auction_id_array.length === 2) {
                res[i]['tooltiptext'] = auction_id_array[0];
            } else {
                res[i]['tooltiptext'] = '';
            }
        }

        return res;

    }

    onCancelAuction() {
        if (this.selectedData.length <= 0) {
            this.toaster.warning('Please Select atleast One Auction', 'Warning');
            return;
        } else {
            const cancelItems = this.selectedData.filter(element => {
                return this.getEndDate(element.auctionEndtime) > this.currentDate && this.getStartDate(element.auctionStarttime) > this.currentDate && element['auctionstatus']['status'] !== 'AUCTION_CANCEL';
            });
            console.log('cancelItems', cancelItems);
            if (cancelItems.length > 0) {
                this.auctionService.cancelledAuctions(cancelItems).subscribe((response) => {
                    if (response['status'] === 'Success' || response['statusCode'] === '200') {
                        this.toaster.success(response['message'], 'Success');
                        this.getAllAuctions();
                    } else {
                        this.toaster.error('Auction Cancellation Failed', 'Failed');
                    }
                });
            } else {
                this.toaster.warning('Sorry, Selected Auctions Can\'t be Cancelled due to they may be Closed Or going as Live Or Already its cancelled', 'Warning'); '';
            }
        }
    }

    getBidsByAuctionId(rowData, event) {
        this.auctionId = event.srcElement.lastChild.data;
        this.selectedData = [rowData];
        console.log('id', this.auctionId);
        this.auctionData = rowData;
    }

    getBidItems(event) {

    }
    getAuctionDetails(rowData) {
        this.auctionService.getAuctionDetails({ id: rowData.id, 'auctionCategory': rowData.auctionCategory }).subscribe((res) => {
            console.log(res, 'res');
            if (res['id']) {
                this.auctionDetailsData = res;
            } else {

            }
        });
    }

    getAuctionVendorsByAuction(rowData) {
        // this.auctionService.getAuctionVendorsByAuction({ id: rowData.id }).subscribe((res) => {
        //     console.log(res, 'res');
        //     if (Array.isArray(res)) {
        //         this.aucvendors = res;
        //       } else {
        //         this.toaster.error('Failed to Fetch data', 'Failure');
        //       }
        //     });
    }

    getBids(itemData) {

    }
    rfqwiseListForGridMethod() {
        this.rfqBidWiseLists = [];
        let rfqwiseListForGrid;
        const reqObj = {
            'auction': { 'id': this.selectedAuctionData['id'] },
            'vendor': { 'id': this.loggedUserDetails.org.id }
        };
        this.auctionService.getBidByVendorPdf(reqObj).subscribe((res: any) => {
            if (res) {
                // this.rfqBidWiseLists = res;
                this.getBidVendorPdfDetails = res;
                res.bidItems.forEach(element => {
                    rfqwiseListForGrid = {
                        'vendorName': res.vendorName,
                        'bidAmount': element.bidAmount,
                        'currentRank': res.currentRank,
                        'description': element.description,
                        'specification': element.specification,
                        'unitofMeasures': element.unitofMeasures,
                        'quantity': element.quantity,
                        'rank': element.rank
                    };
                    this.rfqBidWiseLists.push(rfqwiseListForGrid);
                });
            } else {

            }
            console.log(this.rfqBidWiseLists + 'hii');

        });
    }
    viewBidDetails(rowData, templateName) {
        this.selectedAuctionData = null;
        this.selectedAuctionData = Object.assign({}, rowData);
        this.viewAuctionResponseData = null;
        if (this.selectedAuctionData['auctionCategory'] === 'item wise') {
            if (this.loggedUserType === 'CategoryManager' || this.loggedUserType === 'ClientInitiator' || this.loggedUserType === 'clientInitiator1.1' || this.loggedUserType === 'PRApprover') {
                if (this.getEndDate(rowData.auctionEndtime) > this.currentDate && this.getStartDate(rowData.auctionStarttime) <= this.currentDate) {
                    this.refreshBtn = true;
                } else {
                    this.refreshBtn = false;
                }
                this.auctionService.getBidItemsByAuction({ 'id': rowData['id'] }).subscribe((res) => {
                    this.viewAuctionResponseData = res;
                });
            }
            if (this.loggedUserType === 'Vendor' || this.loggedUserType === 'PartialVendor') {
                this.auctionService.getBidItemsByAuctionForVendor({
                    'auction': { 'id': rowData['id'] },
                    'vendor': { 'id': this.loggedUserDetails.org.id }
                }).subscribe((res) => {
                    this.viewAuctionResponseData = res;
                });
            }
        } else {
            if (this.loggedUserType === 'CategoryManager' || this.loggedUserType === 'ClientInitiator' || this.loggedUserType === 'clientInitiator1.1' || this.loggedUserType === 'PRApprover') {
                if (this.getEndDate(rowData.auctionEndtime) > this.currentDate && this.getStartDate(rowData.auctionStarttime) <= this.currentDate) {
                    this.refreshBtn = true;
                } else {
                    this.refreshBtn = false;
                }
                this.auctionService.getBidsByAuction({ 'id': rowData['id'] }).subscribe((res) => {
                    this.viewAuctionResponseData = res;
                });
            }
            if (this.loggedUserType === 'Vendor' || this.loggedUserType === 'PartialVendor') {
                this.auctionService.getBidsByAuctionForVendor({
                    'auction': { 'id': rowData['id'] },
                    'vendor': { 'id': this.loggedUserDetails.org.id }
                }).subscribe((res) => {
                    this.viewAuctionResponseData = res;
                });
                this.rfqwiseListForGridMethod();
            }
        }

        setTimeout(() => {
            console.log('viewAuctionResponseData', this.viewAuctionResponseData);
            const dialog = this.modalDialog.open(templateName, {
                width: '100%',
                minHeight: '200px',
                maxWidth: 'none',
                data: rowData
            });
        }, 600);

    }

    bidAuction(rowData) {
        if (new Date() > new Date(rowData.auctionEndtime)) {
            this.toaster.warning('Sorry Auction Already closed', 'Warning');
            return;
        }
        this.bidAuctionVendorData = null;
        let isSealedBidSubmitted = [];
        let bidLimitArray = [];
        let isBIdSubmittedList = [];
        this.auctionService.getBidsByAuctionIdAndVendorId({ auction: { id: rowData.id }, vendor: { id: this.loggedUserDetails.org.id } }).subscribe((res) => {
            console.log('0394093409', res);
            if (res['id']) {
                this.bidAuctionVendorData = res;
            }
            if (this.bidAuctionVendorData) {
                if (this.bidAuctionVendorData['auctionType'] === 'sealed bid') {
                    if (this.bidAuctionVendorData['auction']['auctionVendors'] && this.bidAuctionVendorData['auction']['auctionVendors'].length > 0) {
                        isSealedBidSubmitted = this.bidAuctionVendorData['auction']['auctionVendors'].filter(element => {
                            return element['vendor']['id'] === this.loggedUserDetails.org.id && element.bidSubmitted;
                        });
                    }

                    if (isSealedBidSubmitted.length > 0) {
                        this.toaster.warning('Sorry, Already you submitted your bid', 'Warning');
                        return false;
                    }
                }

                if (this.bidAuctionVendorData['auctionType'] === 'reverse auction') {
                    if (this.bidAuctionVendorData['auction']['auctionVendors'] && this.bidAuctionVendorData['auction']['auctionVendors'].length > 0 && this.bidAuctionVendorData['auction']['bidsLimitForVendor']) {

                        console.log('vendor ID', this.loggedUserDetails.org.id);
                        bidLimitArray = this.bidAuctionVendorData['auction']['auctionVendors'].filter(element => {
                            console.log(' element.bidCount', element.remainingBid);
                            return (element['vendor']['id'] === this.loggedUserDetails.org.id && element.remainingBid <= 0);
                        });
                    }

                    if (this.bidAuctionVendorData['auction']['auctionVendors'] && this.bidAuctionVendorData['auction']['auctionVendors'].length > 0) {
                        isBIdSubmittedList = this.bidAuctionVendorData['auction']['auctionVendors'].filter(element => {
                            console.log(' element.bidCount', element.remainingBid);
                            return (element['vendor']['id'] === this.loggedUserDetails.org.id && element.bidSubmitted);
                        });
                    }

                    if (bidLimitArray.length > 0) {
                        this.toaster.warning('Sorry, Your bid count completed or exceeded. ', 'Warning');
                        return false;
                    }
                }



                const modalData = {
                    'bidAuctionVendorData': this.bidAuctionVendorData,
                    'selectData': rowData
                };
                if (this.bidAuctionVendorData['auction']['auctionCategory'] === 'rfq total wise') {
                    const dialog = this.modalDialog.open(LiveAuctionForRfqWiseComponent, {
                        width: '100%',
                        minHeight: '200px',
                        data: modalData
                    });
                    dialog.afterClosed().subscribe(result => {
                        this.getAllAuctions();
                    });
                }
                if (this.bidAuctionVendorData['auction']['auctionCategory'] === 'item wise') {
                    const dialog = this.modalDialog.open(LiveAuctionForItemwiseComponent, {
                        width: '100%',
                        minHeight: '200px',
                        data: modalData
                    });
                    dialog.afterClosed().subscribe(result => {
                        this.getAllAuctions();
                    });
                }

            }
        });
    }

    editAuction(rowData) {
        this.auctionService.getAuctionById({ id: rowData.id }).subscribe((res) => {
            if (res['id']) {
                const auctionData = {
                    'auctionData': res,
                    'isAdd': false
                };
                const config: MatDialogConfig = {
                    width: '80%',
                    maxWidth: 'none',
                    data: auctionData
                };
                const actionDialogue = this.modalDialog.open(CreateAuctionModalComponent, config);
                actionDialogue.afterClosed().subscribe(result => {
                    console.log(result);

                    this.getAllAuctions();
                });

            } else {
                this.toaster.error('Failed to edit auction details', 'Failed');
            }

        });
    }

    ppoActions(actionType) {
        let ppos = [];
        if (this.selectedData.length > 0) {
            if (actionType === 'Submit' || actionType === 'Reject') {
                this.selectedData.forEach(element => {
                    ppos.push({ 'id': element.id });
                });
            }
            if (actionType === 'Accept') {
                ppos = [...this.selectedData];
            }

        }



    }

    onPage(event) {
        this.paginatoryDetails = event;
    }



    viewCorresspondance(rowData) {
        rowData['commentRootPath'] = 'PPO-COMMENTS-MODAL';
        const dialog = this.modalDialog.open(CorrespondenceComponent, { data: rowData,width: '60%', maxWidth: '40%',
        minHeight: 297 , maxHeight: '70vh'  });

        dialog.afterClosed().subscribe(result => {
            this.getAllAuctions();
        });
    }
    getAuctionDocByAuction(data) {
        const reqObj = {
            'id': data
        };
        this.auctionService.getAuctionDocByAuction(reqObj).subscribe(res => {
            if (res) {
                this.actDocList = res;
            } else {

            }
        });
    }
    documents(modalData, data) {
        console.log(data);
        this.getAuctionDocByAuction(data.id);
        const config: MatDialogConfig = {
            width: ' 762px'
        };
        const dialog = this.modalDialog.open(modalData, config);
        dialog.afterClosed().subscribe(result => {
            //  this.getAllClients();
        });
    }
    auctionChart(modalData, data) {
        if (this.auction) {
            this.auction.destroy();
          }
        if (this.selectedData.length === 1) {
            this.auctionService.getAuctionChartData({ id: data[0].id }).subscribe((res: any) => {
                if (res) {
                    let labels: any[] = [];
                    const minValues: any[] = [];
                    const maxValues: any[] = [];
                    labels = res.vendor;
                    res.prices.forEach((el, i) => {
                        minValues.push(el.minBidAmount);
                        maxValues.push(el.maxBidAmount);
                    });
                    setTimeout(() => {
                        this.auction = new Chart('ctx', {
                            type: 'bar',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: 'Min',
                                    backgroundColor: '#caf270',
                                    data: minValues,
                                },
                                {
                                    label: 'Max',
                                    backgroundColor: '#2e5468',
                                    data: maxValues,
                                }],
                            },
                            options: {
                                scales: {
                                    // xAxes: [{
                                    //   stacked: false,
                                    //   id: 'bar-x-axis1',
                                    //   categoryPercentage: 0.8,
                                    //   barPercentage: 0.8
                                    // }, {
                                    //   display: false,
                                    //   stacked: true,
                                    //   id: 'bar-x-axis2',
                                    //   // these are needed because the bar controller defaults set only the first x axis properties
                                    //   type: 'category',
                                    //   categoryPercentage: 1.0,
                                    // //   barPercentage: 1.0,
                                    //   gridLines: {
                                    //     offsetGridLines: true
                                    //   },
                                    //   offset: true
                                    // }],
                                    // yAxes: [
                                    //   {
                                    //   stacked: false,
                                    //   ticks: {
                                    //     beginAtZero: true
                                    //   },
                                    // }]

                                  }
                            }
                        });
                    }, 1000);
                }
                const config: MatDialogConfig = {
                    width: '60%'
                };
                const dialog = this.modalDialog.open(modalData, config);
                dialog.afterClosed().subscribe(result => {
                    //  this.getAllClients();
                });
            });
        } else {
            this.toaster.warning('Please Select atleast One Auction', 'Warning');
        }
    }
    exportPdf() {
        const self = this;
        const doc = new jsPDF();
        this.exportColumns = self.rfqwiseAuctionBidTableHeaders.map(col => ({ title: col.header, dataKey: col.field }));
        const pageHeight = doc.internal.pageSize.height;
        doc.setLineWidth(0.3);
        // doc.rect(5, 5, 200, pageHeight - 10);
        doc.setTextColor(255, 165, 0);
        doc.text('Bid Details', 12, 15);

        doc.setFontSize(12);
        doc.setFontSize(10);
        doc.setFont('helvetica');
        doc.setTextColor(0, 0, 0);
        doc.setFontType('normal');
        doc.text('Auction Name', 12, 30);
        doc.text(this.selectedAuctionData.auctionName, 12, 40);
        doc.text('Auction Start Date', 50, 30);
        doc.text(new Date(this.selectedAuctionData.auctionStarttime).toLocaleString(), 50, 40);
        doc.text('Auction End Date', 110, 30);
        doc.text(new Date(this.selectedAuctionData.auctionEndtime).toLocaleString(), 110, 40);
        doc.text('Auction Status', 180, 30);
        doc.text(this.selectedAuctionData.auctionstatus.uiDisplay, 180, 40);
        doc.text('Vendor Name', 12, 60);
        doc.text(this.getBidVendorPdfDetails.vendorName == null ? '' : this.getBidVendorPdfDetails.vendorName.toString(), 12, 70);
        doc.text('Total Bid Ammount', 60, 60);
        doc.text(this.getBidVendorPdfDetails.bidAmount == null ? '' : this.getBidVendorPdfDetails.bidAmount.toString(), 60, 70);
        doc.text('Current Rank', 110, 60);
        doc.text(this.getBidVendorPdfDetails.currentRank == null ? '' : this.getBidVendorPdfDetails.currentRank.toString(), 110, 70);
        // doc.text('Savings', 180, 60);
        // doc.text(this.viewAuctionResponseData.savings == null ? '' :this.viewAuctionResponseData.savings.toString(), 180, 70);
        const headers = [];
        this.exportColumns.forEach(col => {
            headers.push(col.title);
        });
        const finalY = doc.autoTable.previous.finalY || 10;
        const body = [];
        self.rfqBidWiseLists.forEach(each => {
            const eachRow = [];
            this.exportColumns.forEach(col => {
                eachRow.push(each[col.dataKey]);
            });
            body.push(eachRow);
        });
        autoTable(doc, {
            startY: 80,
            head: [headers],
            body: body
        });
        doc.setLineWidth(0.3);
        // doc.rect(5, 5, 200, pageHeight - 10);
        this.exportPDFService.addFooters(doc);

        doc.save(new Date().getTime().toString() + '.pdf');

    }

    itemWiseExportPdf() {
        const self = this;
        const doc = new jsPDF();
        this.exportColumns = self.auctionBidTableHeaders.map(col => ({ title: col.header, dataKey: col.field }));
        const pageHeight = doc.internal.pageSize.height;
        doc.setLineWidth(0.3);
        // doc.rect(5, 5, 200, pageHeight - 10);
        doc.setTextColor(255, 165, 0);
        doc.text('Bid Details', 12, 15);

        doc.setFontSize(12);
        doc.setFontSize(10);
        doc.setFont('helvetica');
        doc.setTextColor(0, 0, 0);
        doc.setFontType('normal');
        doc.text('Auction Name', 12, 30);
        doc.text(this.selectedAuctionData.auctionName, 12, 40);
        doc.text('Auction Start Date', 50, 30);
        doc.text(new Date(this.selectedAuctionData.auctionStarttime).toLocaleString(), 50, 40);
        doc.text('Auction End Date', 110, 30);
        doc.text(new Date(this.selectedAuctionData.auctionEndtime).toLocaleString(), 110, 40);
        doc.text('Auction Status', 180, 30);
        doc.text(this.selectedAuctionData.auctionstatus.uiDisplay, 180, 40);

        const headers = [];
        this.exportColumns.forEach(col => {
            headers.push(col.title);
        });
        self.viewAuctionResponseData.forEach((bid, index) => {
            const finalY = doc.autoTable.previous.finalY || 10;
            doc.setTextColor(255, 165, 0);
            doc.text(bid.description == null ? '' : bid.description.toString(), 12, index !== 0 ? finalY + 20 : 50);
            doc.setTextColor(0, 0, 0);
            doc.text('Start Price', 12, index !== 0 ? finalY + 30 : 60);
            doc.text(bid.startpricevalue == null ? '' : bid.startpricevalue.toString(), 12, index !== 0 ? finalY + 40 : 70);
            doc.text('Bid Difference', 60, index !== 0 ? finalY + 30 : 60);
            doc.text(bid.minimumBidReductionPrice == null ? '' : bid.minimumBidReductionPrice.toString(), 60, index !== 0 ? finalY + 40 : 70);
            doc.text('Leading Price', 110, index !== 0 ? finalY + 30 : 60);
            doc.text(bid.leadingPrice == null ? '' : bid.leadingPrice.toString(), 110, index !== 0 ? finalY + 40 : 70);
            doc.text('Savings', 180, index !== 0 ? finalY + 30 : 60);
            doc.text(bid.savings == null ? '' : bid.savings.toString(), 180, index !== 0 ? finalY + 40 : 70);
            const body = [];
            bid.bids.forEach(each => {
                const eachRow = [];
                this.exportColumns.forEach(col => {
                    eachRow.push(each[col.dataKey]);
                });
                body.push(eachRow);
            });
            autoTable(doc, {
                startY: index !== 0 ? finalY + 50 : 80,
                head: [headers],
                body: body
            });
            const pageHeight = doc.internal.pageSize.height;
            doc.setLineWidth(0.3);
            // doc.rect(5, 5, 200, pageHeight - 10);
        });
        this.exportPDFService.addFooters(doc);
        doc.save(new Date().getTime().toString() + '.pdf');

    }
    //       refresh(){
    //           this.viewAuctionResponseData=[];
    //         if (this.selectedAuctionData['auctionCategory'] === 'item wise') {
    //             if (this.loggedUserType === 'CategoryManager') {
    //         this.auctionService.getBidItemsByAuction({'id': this.selectedAuctionData['id']}).subscribe((res) => {
    //             this.viewAuctionResponseData = res;
    //         });
    //       }
    //     } else {
    //         if (this.loggedUserType === 'CategoryManager') {
    //             this.auctionService.getBidsByAuction({'id': this.selectedAuctionData['id']}).subscribe((res) => {
    //                 this.viewAuctionResponseData = res;
    //             });
    //         }
    //     }
    //    }

    viewAuctionReports(rowData) {
        console.log('entered rep');
        this.auctionbidData = [];
        this.vendordata = [];
        this.quoteitemdata = [];
        this.rfqwisedata = [];
        this.qouteVendorHeaders = [];
        this.qouteVendorData = [];
        this.aucvendorsdata = [];
        this.itemwiseAuctionData = [];

        this.qoutationByRfqData = [];

        this.viewPrbyId({id: rowData.prid});
        this.getCompareQuoteExcelByPR({'id': rowData.prid}, rowData);

        setTimeout(() => {
            this.loaderService.isLoading.next(true);
            this.auctionbid(rowData);
        }, 3000);
    }


    getCompareQuoteExcelByPR(req, rowData) {
        this.procService.downloadCapexQuoteComparison(req).subscribe((res:any) => {
            if (res) {
                console.log('response---' ,res);

                if(res && Array.isArray(res.headers) ){

                    const excelData = {items: res.items, headers: res.headers, sqft: res.sqft}
                    this.itemData = excelData;


                    }
                }
        });

        this.clientService.getCapexExcelSummary({
            "auctionId": rowData.auctionId,
            "auctionCategory":  rowData.auctionCategory,
            "id": rowData.id
        }).subscribe((res:any)=>{
                this.postAuctionData = res;
        })
    }

    viewPrbyId(rowData) {
        const temp = {
            id: rowData.id,
            approverId: {
                'id': localStorage.getItem('loggedId')
              }
          };
          this.clientService.getPrById(temp).subscribe((res: any) => {
            if (res) {
              this.viewPrByIdData = res || {};
            } else {
              this.toaster.error('Failed to Fetch data', 'Failure');
            }
          });

    }
    auctionbid(rowData) {

        const self = this;
        const doc = new jsPDF(
            {
                orientation: 'landscape',
                unit: 'mm', // Millimeters (other options: 'pt', 'cm', 'in')
                format: 'a4' // A4 size
            }
        );
        let cellHeaders = [];

        this.itemData.headers.forEach((ele:any) => {
                cellHeaders.push(ele.vname+ ' - Per Unit');
                cellHeaders.push(ele.vname+ ' - Qty * Per Unit');
        });
        let postAucCellHeaders = ['Item/Vendor','UOM','Qty.'];
        this.postAuctionData.headers.forEach((ele:any) => {
            postAucCellHeaders.push(ele.vname+ ' -'+ ele.qid);
        });

        // has to write logic from here
        let postAuction_tableData = [];
        this.postAuctionData.items.forEach((ele:any, index:any) => {

            if(Array.isArray(ele.data)){
                postAuction_tableData.push(ele.data.map((ele1:any) =>{
                    return ele1.totalamount;
                }) );
                postAuction_tableData[index].unshift(ele.description);
                postAuction_tableData[index].splice(1, 0,  ele .unitofMeasures);
                postAuction_tableData[index].splice(2, 0,   ele.quantity );

                // if(index == this.itemData.items.length-1){

                //     postAuction_tableData.push(ele.data.map((ele1:any) =>{
                //         if(ele1.cellName == "pricePerUnit"){
                //             return " "
                //          }
                //          else {
                //             return this.itemData.sqft && parseInt(this.itemData.sqft) > 0 ? parseInt(ele1.totalamount)/this.itemData.sqft : 'NA'
                //          }
                //     }) );
                //     tableData[index+1].unshift('Cost Per SQFT');
                //     tableData[index+1].splice(1, 0,  this.itemData.sqft);
                //     tableData[index+1].splice(2, 0,  '');
                // }

            }
        });

        // end logic here
        const pageHeight = doc.internal.pageSize.height;
        if (doc.autoTable.previous.finalY) {
            doc.autoTable.previous.finalY = 40;
        }
        doc.setLineWidth(0.3);
        // doc.rect(5, 5, 200, pageHeight - 10);
        let currentPos = 0;
        doc.setTextColor(255, 165, 0);
        doc.setFontType('bold');

        doc.text('Auction Report', 120, 20);
        doc.setFontSize(12);
        doc.setFontSize(10);
        doc.text('Auction Details :', 12, 35);
        doc.text('PR Details :', 12, 55);

        doc.setFont('helvetica');
        doc.setTextColor(0, 0, 0);
        doc.setFontType('bold');


        doc.text('Auction Name', 18, 40);
        doc.text('Auction Start Date', 60, 40);
        doc.text('Auction End Date', 120, 40);
        doc.text('Auction Status', 170, 40);

        // For PR Details
        doc.text('PR Description', 18, 60);
        doc.text('PR Start Date', 60, 60);
        doc.text('PR Due Date', 120, 60);
        doc.text('Estimated PR Value', 170, 60);
        doc.setFontType('normal');
        doc.text(rowData['auctionStarttime'] ? new Date(rowData['auctionStarttime']).toLocaleString() : '', 60, 45);
        doc.text(new Date(rowData['auctionEndtime']).toLocaleString(), 120, 45);
        doc.text(rowData['auctionName'] ? rowData['auctionName'] : '', 18, 45);
        doc.text(rowData['auctionstatus'].uiDisplay, 170, 5450);

        doc.text(this.viewPrByIdData.prDescription, 18, 65);
        doc.text(new Date(this.viewPrByIdData.createdTS).toLocaleString(), 60, 65);
        doc.text(new Date(this.viewPrByIdData.dueDate).toLocaleString(), 120, 65);
        doc.text((this.viewPrByIdData.estimatedPrvalue).toString(), 170, 65);
        doc.setFontType('bold');

        doc.text('Auction Terms&Conditions', 12, 90);
        doc.setFontType('normal');
        doc.text(': '+ (rowData.termsAndConditions == null ? 'N/A' : rowData.termsAndConditions), 100, 90);



        doc.setFontType('normal');
        doc.setLineWidth(0.3);
        this.exportPDFService.addFooters(doc);

        const headeNames = cellHeaders.map(ele => ele )
        const headers = [['Item Name','uom', 'Qty', ...headeNames]];
        let tableData = [];
        this.itemData.items.forEach((ele:any, index:any) => {

            if(Array.isArray(ele.data)){
                tableData.push(ele.data.map((ele1:any) =>{
                    if(ele1.cellName == "pricePerUnit"){
                        return ele1.unitPrice
                     }
                     else {
                        return ele.description !='Total Amount'? ele1.totalamount: ''
                     }
                }) );
                tableData[index].unshift(ele.description);
                tableData[index].splice(1, 0,  ele.data[0].uom);
                tableData[index].splice(2, 0,  ele.description !='Total Amount' ? ele.data[0].quantity: '');

                if(index == this.itemData.items.length-1){

                    tableData.push(ele.data.map((ele1:any) =>{
                        if(ele1.cellName == "pricePerUnit"){
                            return " "
                         }
                         else {
                            return this.itemData.sqft && parseInt(this.itemData.sqft) > 0 ? parseInt(ele1.totalamount)/this.itemData.sqft : 'NA'
                         }
                    }) );
                    tableData[index+1].unshift('Cost Per SQFT');
                    tableData[index+1].splice(1, 0,  this.itemData.sqft);
                    tableData[index+1].splice(2, 0,  '');
                }

            }
        });

        console.log("data. headers.", headers)
        console.log("data..", tableData)
        doc.setFontType('normal');

        doc.setLineWidth(0.3);
        this.exportPDFService.addFooters(doc);
            // Add Table using autoTable
            doc.addPage(); doc.setLineWidth(0.3);
            this.exportPDFService.addFooters(doc);
            doc.setTextColor(255, 165, 0);
            doc.setFontType('bold');
            doc.setFontSize(14);
            doc.text('cpx Quote Comparison: ', 12,22);
            doc.setFontSize(12);
                autoTable(doc, {
                    head: headers,
                    body: tableData,
                    startY: 40, // Start table below the title
                });


                this.loaderService.isLoading.next(false);
            //    doc.save(new Date().getTime().toString() + '.pdf');


            doc.addPage(); doc.setLineWidth(0.3);
            this.exportPDFService.addFooters(doc);
            doc.setTextColor(255, 165, 0);
            autoTable(doc, {
                head: [ postAucCellHeaders],
                body: postAuction_tableData,
                startY: 40, // Start table below the title
            });
            doc.setFontType('bold');
            doc.setFontSize(14);
            doc.text('cpx Post Auction Comparison: ', 12,22);
            doc.setFontSize(12);
            setTimeout(() => {
                const pdfURL = doc.output('bloburl'); // Get the Blob URL
                window.open(pdfURL, '_blank'); // Open in a new tab
                }, 500);


    // Save PDF

    }

    refresh() {
        if (this.auction) {
            this.auction.destroy();
          }
        this.auctionService.getAuctionChartData({ id: this.selectedData[0].id }).subscribe((res: any) => {
            if (res) {
                let labels: any[] = [];
                const minValues: any[] = [];
                const maxValues: any[] = [];
                labels = res.vendor;
                res.prices.forEach((el, i) => {
                    minValues.push(el.minBidAmount);
                    maxValues.push(el.maxBidAmount);
                });
                setTimeout(() => {
                    this.auction = new Chart('ctx', {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Min',
                                backgroundColor: '#caf270',
                                data: minValues,
                            },
                            {
                                label: 'Max',
                                backgroundColor: '#2e5468',
                                data: maxValues,
                            }],
                        },
                        options: {
                            scales: {
                                // xAxes: [{
                                //     stacked: false,
                                //     id: 'bar-x-axis1',
                                //     categoryPercentage: 0.8,
                                //     barPercentage: 0.8
                                //   }, {
                                //     display: false,
                                //     stacked: true,
                                //     id: 'bar-x-axis2',
                                //     // these are needed because the bar controller defaults set only the first x axis properties
                                //     type: 'category',
                                //     categoryPercentage: 1.0,
                                //   //   barPercentage: 1.0,
                                //     gridLines: {
                                //       offsetGridLines: true
                                //     },
                                //     offset: true
                                //   }],
                                  // yAxes: [
                                  //   {
                                  //   stacked: false,
                                  //   ticks: {
                                  //     beginAtZero: true
                                  //   },
                                  // }]
                                // xAxes: [{
                                //   stacked: false,
                                //   id: 'bar-x-axis1',
                                // }, {
                                //   display: false,
                                //   stacked: true,
                                //   id: 'bar-x-axis2',
                                //   // these are needed because the bar controller defaults set only the first x axis properties
                                //   type: 'category',
                                //   categoryPercentage: 0.8,
                                //   barPercentage: 0.9,
                                //   gridLines: {
                                //     offsetGridLines: true
                                //   },
                                //   offset: true
                                // }],
                                // yAxes: [
                                //   {
                                //   stacked: true,
                                //   ticks: {
                                //     beginAtZero: true
                                //   },
                                // }]

                              }
                        }
                    });
                }, 1000);
            }
        });
    }


}
