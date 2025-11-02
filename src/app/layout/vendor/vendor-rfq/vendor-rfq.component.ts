import { Component, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { VendorQuotationModalComponent } from '../components/vendor-quotation-modal/vendor-quotation-modal.component';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
import { RfqService } from '../services/rfq.service';
import { ToastrService } from 'ngx-toastr';
import { CorrespondenceComponent } from 'src/app/shared/modules/common-share/components/correspondence/correspondence.component';
import { ViewRFQByIdModalComponent } from '../components/view-rfq-by-id-modal/view-rfq-by-id-modal.component';
import swal from 'sweetalert2';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
    selector: 'app-vendor-rfq',
    templateUrl: './vendor-rfq.component.html',
    styleUrls: ['./vendor-rfq.component.scss'],
    animations: [
        trigger('rowExpansionTrigger', [
            state('void', style({
                transform: 'translateX(-10%)',
                opacity: 0
            })),
            state('active', style({
                transform: 'translateX(0)',
                opacity: 1
            })),
            transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class VendorRFQComponent implements OnInit {

    rfqDataList: any = [];
    selectedData: any = [];
    rfqdetailsList: any = [];
    paginatoryDetails: any;
    selectedRFQData: any;
    pageRecordSize: any;
    pageOptions: any;
    rfqId: any;
    defaultPermissions: any;
    loggedUserPermissions: any;

    rfqsTableHeaders: any = [
        { field: 'rfqId', header: 'RFQ Id', isLink: false,  width: '190px', fieldType: 'text' },
        { field: 'desc', header: 'Description', isLink: false,  width: '150px', fieldType: 'text' },
        { field: 'numberOfItems', header: 'Item Count', isLink: false,  width: '160px', fieldType: 'text' },
        { field: 'createdTS', header: 'Creation Date', isLink: false, fieldType: 'date',  width: '180px' },
        { field: 'vendorResponseDate', header: 'RFQ Due Date', isLink: false, fieldType: 'date',  width: '180px' },
        { field: 'vendorStatus', header: 'Status', isLink: false,  width: '150px', fieldType: 'text' }
        // { field: 'rfqStatus', header: 'RFQ Status', isLink: false },
    ];
    selectedLineData: any;
    viewRFQByIdData: any;
    expandedRows: {} = {};
    loggedUserDetails: any;


    constructor(private dialog: MatDialog,
        private encryDecryService: EncryDecryService,
        private rfqservice: RfqService,
        private toastrService: ToastrService,
        private modalDialog: MatDialog) { }

    ngOnInit() {
        this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));

        this.loggedUserPermissions = temp.details.listofPermission;
        this.loggedUserDetails = temp.details;


        this.getRFQList();

    }

    // RFQ DATA FROM REST CALL
    getRFQList() {
        this.selectedData = [];
        const reqObj = {
            // "id": "c2328587-ee7b-447e-b08b-418cde1db42d"
            'id': localStorage.getItem('orgId')
        };
        this.rfqservice
            .getAllRFQdata(reqObj)
            .subscribe(data => {
                this.rfqDataList = data || [];
            });

    }

    // getRFQ Line Items list
    getRFQLineItems(selectedRowData, event) {
        this.expandedRows = {};
        const thisRef = this;
        thisRef.expandedRows[selectedRowData.id] = 1;

        this.selectedData = [selectedRowData];
        this.selectedRFQData = Object.assign({}, selectedRowData);
        this.rfqId = this.selectedRFQData.id;

    }

    getCloseRFQLineItems(selectedRowData, event) {
        this.expandedRows = {};
    }

    createQuotation() {
        if (this.selectedData.length) {
            const currentDate = new Date();
            if (this.selectedData[0].vendorStatus.uiDisplay === 'Accepted' && this.selectedData[0].vendorResponseDate >= currentDate.toISOString()) { // && this.selectedData[0].vendorResponseDate >= currentDate
                const req = {
                    'id': this.selectedData[0].rfquuid
                };
                this.rfqservice.getLineitemsById(req)
                    .subscribe(data => {
                        this.rfqdetailsList = data || [];
                        if (this.rfqdetailsList.length) {
                            this.openCreateQuotationModal(this.selectedData[0].rfquuid, this.selectedData[0].vendorResponseDate);
                        }
                    });
            } else {
                if (this.selectedData[0].vendorStatus.uiDisplay !== 'Accepted') {
                    this.toastrService.error('Only status with accepted is allowed !', 'Failure');
                }

                if (this.selectedData[0].vendorResponseDate < currentDate.toISOString()) {
                    this.toastrService.error('You can\'t submit quote ,after RFQ duedate', 'Failure');
                }
            }




        } else {
            this.toastrService.error('Please select a record!');
        }
    }

    openCreateQuotationModal(rfqId, rfqResDate) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            'rfqId': rfqId,
            'rfqDetails': this.rfqdetailsList,
            'rfqResDate': rfqResDate,
            'selectedRfqData': this.selectedData[0]
        };
        // dialogConfig.minWidth = 400;
        dialogConfig.minHeight = 500;
        dialogConfig.maxWidth = 'auto';

        const dialogRef = this.dialog.open(VendorQuotationModalComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if (result.event === 'submit') {
                this.getRFQList();
            }
        });
        this.selectedData = [];
    }

    // IF rfqDataList is available from rest call then comment below code
    // rfqDataList = [
    //     {
    //         "rfq_number":"1234",
    //         "rfqReceived_date":"15/05/2020",
    //         "status":"New",
    //         "rfqDue_date":"28/05/2020"
    //     },
    //     {
    //       "rfq_number":"4534",
    //       "rfqReceived_date":"14/05/2020",
    //       "status":"New",
    //       "rfqDue_date":"29/05/2020"
    //   }

    // ]

    getLineItems(event) {
        // alert('helel');
        console.log('clicked tab lienitmes', event);

    }

    onPage(event) {
        this.paginatoryDetails = event;
    }

    viewCorresspondance(rowData) {
        rowData['commentRootPath'] = 'RFQ-COMMENTS-MODAL';
        const dialog = this.modalDialog.open(CorrespondenceComponent, {  data: rowData,width: '60%', maxWidth: '40%',
        minHeight: 297 , maxHeight: '70vh'  });

        dialog.afterClosed().subscribe(result => {
            this.getRFQList();
        });
    }

    acceptQuotation() {

        if (this.selectedData.length) {
            const currentDate = new Date();
            if (this.selectedData[0].vendorResponseDate >= currentDate.toISOString()) {
                    const req = [];
                    this.selectedData.forEach(data => {
                        if(this.loggedUserDetails.role.roleName == "CategoryManager"){
                            req.push({'id': data.id, cmUser: this.loggedUserDetails.id});
                             }else{
                                req.push({'id': data.id, cmUser: this.selectedData[0].cmUser?this.selectedData[0].cmUser : null });
                        }

                    });

                    swal({
                        title: '<h5>Please Confirm!!<h5>',
                        html: '<h3>Are you sure you want to accept?</h3>',
                        confirmButtonText: 'Yes',
                        confirmButtonColor: '#006dd5',
                        cancelButtonColor: '#d63636',
                        showCancelButton: true,
                        reverseButtons: true
                    }).then((result) => {
                        if (result.value) {
                            this.rfqservice.acceptRfqByvendor(req)
                        .subscribe((res: any) => {
                            if (res.status === 'Success') {
                                this.toastrService.success(res.message, 'Success');
                                this.selectedData = [];
                                this.getRFQList();
                            } else if (res.status === 'Failure') {
                                this.toastrService.success(res.message, 'Failure');
                                this.selectedData = [];
                            }
                        });
                        }
                    });
            } else {
                if (this.selectedData[0].vendorResponseDate < currentDate.toISOString()) {
                    this.toastrService.error('Unable to process your request, deadline has passed', 'Failure');
                }
            }
        } else {
            this.toastrService.error('Please select atleast one record!');
        }
        this.getRFQList();
    }

    rejectQuotation() {
        if (this.selectedData.length) {
            const currentDate = new Date();
            if (this.selectedData[0].vendorResponseDate >= currentDate.toISOString()) {
                const req = [];
                this.selectedData.forEach(data => {
                    if(this.loggedUserDetails.role.roleName == "CategoryManager"){
                        req.push({'id': data.id, cmUser: this.loggedUserDetails.id});
                         }else{
                            req.push({'id': data.id, cmUser: this.selectedData[0].cmUser?this.selectedData[0].cmUser : null });
                    }
                });
                swal({
                    title: '<h5>Please Confirm!!<h5>',
                    html: '<h3>Are you sure you want to reject?</h3>',
                    confirmButtonText: 'Yes',
                    confirmButtonColor: '#006dd5',
                    cancelButtonColor: '#d63636',
                    showCancelButton: true,
                    reverseButtons: true
                }).then((result) => {
                    if (result.value) {
                        this.rfqservice.rejectRfqByvendor(req)
                                .subscribe((res: any) => {
                                        if (res.status === 'Success') {
                                        this.toastrService.success(res.message, 'Success');
                                        this.selectedData = [];
                                        this.getRFQList();
                                    } else if (res.status === 'Failure') {
                                        this.toastrService.success(res.message, 'Failure');
                                            this.selectedData = [];
                                        }
                                    });
                                }
                            });
                        } else {
                            if (this.selectedData[0].vendorResponseDate < currentDate.toISOString()) {
                                this.toastrService.error('Unable to process your request, deadline has passed', 'Failure');
                            }
        }
        } else {
            this.toastrService.error('Please select atleast one record!');
        }
    }

    viewRFQDetails(rowData) {
        console.log(rowData);
        // vendorResponseDate
        const temp = {
           // "id": rowData.id
           'id': rowData.rfquuid
          };
          this.rfqservice.fetchRfqById(temp).subscribe((res: any) => {

            if (res) {
                res['rfqClosingDate'] = rowData['vendorResponseDate'];
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
        dialogConfig.data = {...this.viewRFQByIdData, isShowAttachments: true};
        dialogConfig.minWidth = 400;
        dialogConfig.minHeight = 500;
        dialogConfig.maxWidth = 'none';
        dialogConfig.width = '80%';

        const dialogRef = this.dialog.open(ViewRFQByIdModalComponent, dialogConfig).afterClosed()
        .subscribe(result => {
            // if(result.event == 'Success' || 'success'){
            //     this.getPrSummaryData();
            // }
            console.log(result);
        });
    }

}
