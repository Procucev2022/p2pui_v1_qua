import { Component, OnInit, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { CatProcuRequestsService } from '../services/cat-procu-requests.service';

import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AppConfig } from 'src/app/app.config';
import { CorrespondenceComponent } from 'src/app/shared/modules/common-share/components/correspondence/correspondence.component';
import { CatMgrVendorSearchComponent } from '../cat-mgr-vendor-search/cat-mgr-vendor-search.component';
import { ToastrService } from 'ngx-toastr';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
import { VendorSearchComponent } from 'src/app/shared/modules/common-share/components/vendor-search/vendor-search.component';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';
import { swalConfirm } from 'src/app/shared/helpers/swal-confirm';
// import * as moment from 'moment';

@Component({
    selector: 'app-cat-mgr-rfq-tab',
    templateUrl: './cat-mgr-rfq-tab.component.html',
    styleUrls: ['./cat-mgr-rfq-tab.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CatMgrRfqTabComponent implements OnInit, OnChanges {
    @Input('prData') prData: any;
    @Input('prId') prId: any;
    rfqsList: any = [];

    selectedData: any;
    selectedRFQData: any;
    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    modalGridpageOptions: any;
    modalGridpageRecordSize: any;
    isNext = false;
    fileData: any;
    selectedFileData: any;
    selectedFileName: any;
    isFileFormatValid: boolean;
    prLineItemsList: any = [];
    categoryList1: any[];
    selectedCreateRfqItems = [];
    attachedPrDocsList = [];
    prAdresses = [];
    selectedPrAddresses = [];
    selectedAttachedPrDocs = [];
    rfqId: any;
    loggedUserPermissions: any;
    defaultPermissions;
    selectedDocsData: any = [];
    selectedRFQList: any = [];
    loggedUserData: any;
    uploadedbase64Array: any;
    specialInstruction: any;
    rfqClosingDate: any;
    minDate = new Date();
    documentsArray: any[] = [];
    rfqDocumentsBase64: any[] = [];
    selectedFilesArray: any[];
    dailogRef: any;


    // public date: moment.Moment;

    //   public showSpinners = true;
    //   public showSeconds = false;
    //   public touchUi = false;
    //   public enableMeridian = false;
    //   public stepHour = 1;
    //   public stepMinute = 1;
    //   public stepSecond = 1;




    constructor(
        private procuReqService: CatProcuRequestsService,
        private modalDialog: MatDialog,
        private tostrService: ToastrService,
        private encryDecryService: EncryDecryService,
        private convertSer: ConvertToBase64Service
    ) { }
    rfqsTableHeaders: any = [
        { field: 'rfqId', header: 'RFQ Id', isLink: true , width: '170px', fieldType: 'text'},
        { field: 'createdBy', header: 'created By', isLink: false , width: '130px', fieldType: 'text'},
        { field: 'numberOfItems', header: 'No. Of Items', isLink: false , width: '135px', fieldType: 'text'},
        { field: 'status', header: 'Status' , width: '120px', fieldType: 'text'},
        // { field: 'rfqClosingDate', header: 'RFQ Due Date' , width: '205px', fieldType: 'date'},
        // { field: 'vendorsSent', header: 'Vendors Sent', isLink: false },
        // { field: 'vendorsResponded', header: 'Vendor Resp.', isLink: false },
        // { field: 'quotationReceived', header: 'Quotation Recv.', isLink: false }
    ];


    prLineItemHeaders: any = [
        { field: 'serialNo', header: 'S.No', isLink: false , width: '50px', fieldType: 'text'},
        { field: 'description', header: 'Item Description', isLink: false , width: '256px', fieldType: 'text'},
        { field: 'brand', header: 'Specifications', isLink: false , width: '120px', fieldType: 'text'},

        { field: 'unitofMeasures', header: 'UOM', isLink: false , width: '100px', fieldType: 'text'},
        { field: 'quantity', header: 'Quantity', isLink: false , width: '100px', fieldType: 'text'},
        // { field: 'createdTS', header: 'Creation Date.', isLink: false , width: '205px', fieldType: 'date'},
        // { field: 'createdBy', header: 'created By', isLink: false , width: '140px', fieldType: 'text'},
    ];



    attachedPrDocsHeaders: any = [
        // { field: 'id', header: 'File Id', isLink: false , fieldType: 'text'},
        { field: 'fileName', header: 'File Name', isLink: false , fieldType: 'text'},
        // { field: 'createdTs', header: 'Creation Date', isLink: false , fieldType: 'text'}
    ];

    prAddressesHeaders: any = [
        // { field: 'id', header: 'File Id', isLink: false , fieldType: 'text'},
        { field: 'address', header: 'Address', isLink: false , fieldType: 'text'},
        { field: 'city', header: 'City', isLink: false , fieldType: 'text'},
        { field: 'state', header: 'State', isLink: false , fieldType: 'text'},
        // { field: 'createdTs', header: 'Creation Date', isLink: false , fieldType: 'text'}
    ];


    ngOnInit() {
        this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));

        this.loggedUserPermissions = temp.details.listofPermission;
        this.loggedUserData = temp.details;
        console.log(this.prData.procucevStatus.uiDisplay + 'HII');

        this.modalGridpageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
        this.modalGridpageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
        this.getRfqsByPr();
        this.getPrLineItems();
        this.getAttachedPrDocs();
        this.getPrAdresses();

        this.documentsArray = [];
    }


    getRfqsByPr() {
        console.log('this.prData.prId', this.prData.id);

        // this.procuReqService.getRfqsList().subscribe((data: any[]) => {
        //     this.rfqsList = data || [];
        // });
        this.procuReqService.getRfqsByPr({ 'id': this.prData.id }).subscribe((response) => {
            if (Array.isArray(response)) {
                this.rfqsList = response || [];

            } else {
                this.tostrService.warning('Failed', response.errorMessage);
                this.rfqsList = [];
            }
        });
    }

    ngOnChanges() {
        if (this.prId) {
            this.getRfqsByPr();
            this.getPrLineItems();
            this.getAttachedPrDocs();
            this.getPrAdresses();
        }
    }

    getRFQs(rowData, event) {
        this.selectedRFQData = rowData;
        this.selectedRFQList = [rowData];
        this.rfqId = event.srcElement.lastChild.data;
    }

    getThirdTab(event) { }

    onCreateRfqs(rfqModal) {
        this.selectedCreateRfqItems = [];
        this.documentsArray = [];
        // swal({
        //     title: "<h5>Please Confirm!!</h5>",
        //     html: "<h3>Are you sure you want to create rfq?</h3>",
        //     type: "warning",
        //     confirmButtonText: "Yes",
        //     confirmButtonColor: "#006dd5",
        //     cancelButtonColor: "#d63636",
        //     showCancelButton: true,
        //     reverseButtons: true,
        // }).then((result) => {
        //     if (result.value) {
                this.isNext = false;
                this.fileData = null;
                this.selectedFileName = null;
                this.selectedAttachedPrDocs = [];
                this.selectedCreateRfqItems = [];
                this.selectedPrAddresses = [];
                this.dailogRef =this.modalDialog.open(rfqModal, {
                    data: {
                        animal: 'panda'
                    },
                    width: '80%',
                });
        //     }
        // })

    }

    onPage(event) {
        this.paginatoryDetails = event;
    }
 // file upload
 uploadDocuments(files) {
    console.log('files', files);
    Array.from(files).forEach(file => {
        this.documentsArray.push(file);
    });
    this.getrfqDocuments();
}
dragAndDropDocs($event) {
    console.log($event);
    alert('drag and drop not yet implemented');

}
deleteAttachment(index, type) {
    this[type].splice(index, 1);
    this.getrfqDocuments();
}

removeFiles(index) {
    this.selectedFilesArray.splice(index, 1);
}

getrfqDocuments() {
    this.rfqDocumentsBase64  = [];
    this.documentsArray.forEach(element => {
            console.log('elem', element);

        this.convertSer.getBase64(element).then((data: string) => {
            const temp = {
              fileName: element.name,
              file: data.split(',')[1]
            };
            this.rfqDocumentsBase64.push(temp);
          });
    });

    console.log('rfq docs', this.rfqDocumentsBase64);

}

    filesDropped(event): void {
        console.log('event', event);

        this.fileUploadEvent(event, true);

        if (event[0].name.includes('xls') || event[0].name.includes('xlsx')) {
            // this.removeFileUploadValidity();
            this.convertSer.getBase64(event[0]).then((data: string) => {
                const temp = {
                    fileName: event[0].name,
                    file: data.split(',')[1]
                };
                this.uploadedbase64Array.push(temp);
            });
        }
    }

    fileUploadEvent(event, dragAndDrop) {
        this.uploadedbase64Array = [];
        this.selectedFileName = null;
        this.isFileFormatValid = true;
        this.selectedFileData = null;
        let selectedFileData;
        if (dragAndDrop) {
            selectedFileData = event[0];
        } else {
            selectedFileData = event.target.files[0];
        }

        // console.log('evnet', event);
        this.selectedFileData = selectedFileData;
        console.log('excel file', this.selectedFileData);

        const validFormatFile = this.selectedFileData?.name ? this.selectedFileData.name.split('.') : [];
        if (
            validFormatFile.indexOf('xlsx') === -1 &&
            validFormatFile.indexOf('xls') === -1
        ) {
            alert('Please upload a valid Excel File');
            this.isFileFormatValid = false;
            this.selectedFileName = null;
        } else {
            if (dragAndDrop) {
                this.selectedFileName = event[0]?.name || null;
            } else {
                this.selectedFileName = event.target?.files?.[0]?.name || null;
                this.selectedFileData = event.target.files[0];
                this.convertSer.getBase64(this.selectedFileData).then((data: string) => {
                    const temp = {
                        fileName: this.selectedFileData.name,
                        file: data.split(',')[1]
                    };
                    this.uploadedbase64Array.push(temp);
                });
            }

            this.isFileFormatValid = true;
        }
    }

    removeFile() {
        this.selectedFileData = null;
        this.selectedFileName = null;
        this.fileData = null;
        this.isFileFormatValid = false;
        this.uploadedbase64Array = [];
    }

    viewCorresspondance(rowData) {
        rowData['commentRootPath'] = 'CAT-RFQ-COMMENTS-MODAL';
        rowData.dropDownFlag = true;
        const dialog = this.modalDialog.open(CorrespondenceComponent, { data: rowData,width: '60%', maxWidth: '40%',
        minHeight: 297 , maxHeight: '70vh'  });

        dialog.afterClosed().subscribe(result => {
            this.getRfqsByPr();
        });
    }


    vendorSearch() {
        const rowData = this.selectedRFQList[0];
        console.log('this.selectedRFQList[0]', this.selectedRFQList[0]);
        this.dailogRef = this.modalDialog.open(VendorSearchComponent, { data: this.selectedRFQList[0] });
        this.dailogRef.afterClosed().subscribe(result => {
            this.rfqId = null;
           setTimeout(() => {
            this.rfqId = rowData.id;
           }, 500);
        });
    }


    getPrLineItems() {
        const req = {
            'id': this.prData.id
        };
        this.procuReqService.getLineItemsByPr(req).subscribe((data: any[]) => {
            if (Array.isArray(data)) {
                this.prLineItemsList = [];
                // data.forEach((res) => {
                //     if (res.linkedItemStatus === false) {
                //         this.prLineItemsList.push(res);
                //     }
                // });
                this.prLineItemsList =data;
            } else {
                this.prLineItemsList = [];
            }
        });
    }

    getVendorsByCategory() {
        const req = {};
        this.procuReqService.getVendorsByCategory(req).subscribe((response) => {
            if (Array.isArray(response)) {
                this['categoryList1'] = response;
            }
        });
    }

    getAttachedPrDocs() {
        this.procuReqService.getPrAttachments({ 'id': this.prData.id }).subscribe((response) => {
            if (Array.isArray(response)) {
                this.attachedPrDocsList = response;
            }
        });
    }

    getPrAdresses() {
        this.procuReqService.getPrAdresses({ 'id': this.prData.id }).subscribe((response) => {
            if (Array.isArray(response)) {
                this.prAdresses = response;
            }
        });
    }

    createRfq() {
            swalConfirm.open({
                title: '<h5>Please Confirm!!</h5>',
                html: '<h3>Are you sure you want to create RFQ?</h3>',
                type: 'warning',
                confirmButtonText: 'Yes',
                confirmButtonColor: '#006dd5',
                cancelButtonColor: '#d63636',
                showCancelButton: true,
                reverseButtons: true,
                }).then((result) => {
                    if (result.value) {

                        const rfqItems = [];
                        const docItems = [];
                        const prAddresses = [];
                        if (this.selectedCreateRfqItems.length > 0) {
                            this.selectedCreateRfqItems.forEach(element => {
                                // element['pritemId'] = element['id'];
                                // delete element['id'];
                                const reqObj = {
                                    'brand': element.brand,
                                    'category': element.category,
                                    'createdBy': element.createdBy,
                                    'createdTS': element.createdTS,
                                    'description': element.description,
                                    'itemcode': element.itemcode,
                                    'lastModifiedBy': element.lastModifiedBy,
                                    'lastModifiedTS': element.lastModifiedTS,
                                    'pritemId': element.id,
                                    'quantity': element.quantity,
                                    'status': element.status,
                                    'unitofMeasures': element.unitofMeasures,
                                    'serialNo': element.serialNo
                                };
                                rfqItems.push(reqObj);
                            });
                            console.log(rfqItems);
                        }
                        if (this.selectedAttachedPrDocs.length > 0) {
                            this.selectedAttachedPrDocs.forEach(element => {
                                docItems.push({ 'file': element['file'], 'fileName': element['fileName'] });
                            });
                        }
                        this.rfqDocumentsBase64.forEach((data) => {
                            docItems.push(data);
                        });
                        if (this.selectedPrAddresses.length > 0) {
                            this.selectedPrAddresses.forEach(element => {
                                prAddresses.push({'address': element['address'], 'city': element['city'], 'state': element['state']});
                            });
                        }

                        // if (this.uploadedbase64Array) {
                        //     docItems.push(this.uploadedbase64Array[0]);
                        // }

                        const req = {
                            'pr':
                            {
                                'id': this.prData.id
                            },
                            'org': {
                                'id': localStorage.getItem('orgId')
                            },
                            'rfqItem': rfqItems,
                            'rfqDocument':  docItems,
                            'rfqQuotation': [],
                            'rfqQuery': [],
                            'rfqVendor': [],
                            'rfqComment': [],
                            'clientdeliverylocationrfq': prAddresses,
                           // 'rfqClosingDate': this.rfqClosingDate || '', // .toLocaleString()
                            'specialInstruction': this.specialInstruction || '',
                            'createdBy': this.loggedUserData.fullName
                        };

                        this.procuReqService.createRfq(req).subscribe((response) => {
                            if (response.status === 'Success') {
                                this.tostrService.success(response.message, 'Success');
                                this.getRfqsByPr();
                                this.modalDialog.closeAll();
                                // this.rfqClosingDate = undefined;
                                this.specialInstruction = '';

                            }
                        }, (error) => {

                        });





                    }
                });
    }


    zoomout() {
        this.dailogRef.updateSize('70%');
    }

    zoomin() {
        this.dailogRef.updateSize('90%');
    }


}
