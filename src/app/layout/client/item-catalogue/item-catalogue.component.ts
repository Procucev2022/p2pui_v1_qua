import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from 'src/app/app.config';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
import { InvoicesService } from '../../invoices/invoices.service';
import { ApprovePrService } from '../services/approve-pr.service';
import { ClientService } from '../services/client-service.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Chart } from 'chart.js'
import { OverlayPanel } from 'primeng/overlaypanel';
import { PriceAnalyticsGraphModalComponent } from 'src/app/shared/modules/common-share/price-analytics-graph-modal/price-analytics-graph-modal.component';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';
@Component({
    selector: 'app-item-catalogue',
    templateUrl: './item-catalogue.component.html',
    styleUrls: ['./item-catalogue.component.scss'],
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
export class ItemCatalogueComponent implements OnInit {


    @ViewChild('op') op: OverlayPanel;
    itemUploadType: string = 'single'
    itemList: any = [];
    selectedData: any = [];
    vendorsList: any = [];
    selectedVendorData: any = [];
    itemHeaders: any = [
        { field: 'description', header: 'Item Description', isLink: false, width: '155px', fieldType: 'text', isExceedContent: true },
        { field: 'clientItemCode', header: 'Item Code', isLink: false, width: '135px', fieldType: 'text', isExceedContent: false },
        { field: 'specification', header: 'Specification', isLink: false, width: '135px', fieldType: 'text', isExceedContent: true },
        { field: 'price', header: 'Price', isLink: false, width: '135px', fieldType: 'text', isExceedContent: false },
        { field: 'subCategory', header: 'Sub Category', isLink: false, width: '135px', fieldType: 'text', isExceedContent: true },

    ];
    linkedVendorHeaders: any = [
        { field: 'vendorName', header: 'Vendor Name', isLink: false, width: '135px', fieldType: 'text', isExceedContent: true },
        { field: 'vendorMaskedId', header: 'Vendor Id', isLink: false, width: '135px', fieldType: 'text', isExceedContent: false },
        { field: 'pricePerUnit', header: 'Price Per Unit', isLink: false, width: '135px', fieldType: 'text', isExceedContent: false },
        { field: 'city', header: 'City', isLink: false, width: '135px', fieldType: 'text', isExceedContent: true },
    ];
    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    secondPaginatoryDetails: any;
    secondPageRecordSize: any;
    secondPageOptions: any;
    loggedUserPermissions: any;
    loggedUserDetails: any;
    defaultPermissions: any;
    userModel: any = {};
    editItemModel: any = {};
    cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];
    selectedCity: any;
    expandedRows: {} = {};
    itemList_cache: any[];
    chartGraph: any;
    isShowChart: boolean;
    chartData: any;
    options: any;
    isVendorLevel: boolean = true;
    isAnalyticsScreenShow: any = false;
    commentFileData: string;
    commentFileType: any;
    commentFilesDataList: any = [];
    fileData: any;
    dragAreaClass: string;
    sampleCatalogueFormatFile = AppApiConfig.SAMLE_CATALOGUE_ITEM_EXCEL_BASE_64;
    isEditable: boolean;
    constructor(private clientService: ClientService,
        private dialog: MatDialog,
        private toaster: ToastrService,
        private encryDecryService: EncryDecryService,
        private client: ClientService,
        private invoiceService: InvoicesService,
        private modalDialog: MatDialog,
        private convertSer: ConvertToBase64Service) { }

    ngOnInit() {
        this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;

        this.secondPageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.secondPageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;

        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
        this.loggedUserDetails = temp.details;
        console.log(this.loggedUserDetails);
        this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
        this.isAnalyticsScreenShow = this.loggedUserDetails.role.roleName == 'ClientInitiator' || this.loggedUserDetails.role.roleName == "PRApprover" ||
            this.loggedUserDetails.role.roleName == "VendorManager";
        this.getAllItems();
        this.options = {
            title: {
                display: true,
                text: 'Price Trend',
                fontSize: 16
            },
            legend: {
                position: 'bottom'
            },
            showAllTooltips: true,
            tooltips: {
                enabled: true,
                callbacks: {
                    label: function (tooltipItem, data) {
                        return (data.tooltips[tooltipItem.index]).split('#');
                    },
                }
            }
        };




    }
    getAllItems() {
        this.itemList = [];
        this.itemList_cache = [];
        const obj = {
            'id': this.loggedUserDetails.org.id
        };
        this.client.getItemCatalogue(obj).subscribe((data) => {
            let itemsArray = [];
            if (Array.isArray(data)) {
                data.forEach(ele => {
                    if (!ele.status) {
                        ele.status = 'Available';
                    }
                    itemsArray.push(ele);
                });
            }
            this.itemList = [...itemsArray]
            this.itemList_cache = [...itemsArray]
        });
    }
    onPage(event) {
        this.paginatoryDetails = event;
    }
    onSecondPage(event) {
        this.secondPaginatoryDetails = event;
    }
    ngOnDestroy() {
        this.clientService.$_prData.next(null);
    }
    newItemRequest(item) {
        this.userModel = {};
        const config: MatDialogConfig = {
            width: ' 762px'
        };
        this.commentFilesDataList =[];
        this.fileData = null;
        const dialog = this.dialog.open(item, config);
        //   this.getAllClientUsers();
        dialog.afterClosed().subscribe(result => {
            //  this.getAllClients();
        });
    }
    onAddNewItemSubmit(form: NgForm) {
        this.userModel['client'] = { 'id': this.loggedUserDetails.org.id };
        this.userModel['boqfile'] = null;
        this.userModel['documents']= this.commentFilesDataList;
        this.client.createItemCatalogue(this.userModel).subscribe((data) => this.successCallBack(data));
    }
    successCallBack(data: any) {
        if (data.statusCode === '200') {
            this.toaster.success(data.message, 'Success');
        } else {
            this.toaster.error(data.message, 'Error');
        }
        this.dialog.closeAll();
        this.getAllItems();
    }

    getCloseVendorByItem(rowData) {
        this.expandedRows = {};
    }


    onSubCategoryChange(eve: any) {
        if (eve) {
            this.itemList = this.itemList_cache.filter(ele => ele.subCategoryId === eve.subCategoryId);
        } else {
            this.itemList = this.itemList_cache;
        }
    }

    getVendorByItem(rowData) {
        this.expandedRows = {};
        const thisRef = this;
        thisRef.expandedRows[rowData.id] = 1;

        this.vendorsList = [];
        const obj = {
            'id': rowData.id
        };
        if (this.loggedUserDetails.role.roleName == 'ClientInitiator' || this.loggedUserDetails.role.roleName == "PRApprover") { // for only client initiator/Approver
            const reqObj = {
                'id': rowData.id,
                'client': this.loggedUserDetails.org.id
            };
            this.client.getVendorsByItemForClientInitiator(reqObj).subscribe((data: any) => {
                if (Array.isArray(data)) {
                    this.vendorsList = data.map(ele => {
                        const maskedId = ((ele.companyId).slice(11, (ele.companyId).length));
                        console.log('maskedId', ele.companyId, maskedId);
                        if (ele.linked === true) {
                            return ele;
                        } else {
                            return { ...ele, ...{ 'vendorName': 'Confidentional Vendor', vendorMaskedId: 'XXXXXXXXXX' + maskedId } };
                        }
                    });
                    this.successChilds(this.vendorsList, rowData);
                } else {
                    this.toaster.error(data.errorMessage, 'Error');
                }
            });
        } else {
            this.client.getVendorsByItem(obj).subscribe((data: any) => {
                if (Array.isArray(data)) {
                    this.vendorsList = data.map(ele => {
                        const maskedId = ((ele.companyId).slice(11, (ele.companyId).length));
                        console.log('maskedId', ele.companyId, maskedId);
                        if (ele.linked === true) {
                            return ele;
                        } else {
                            return { ...ele, ...{ 'vendorName': 'Confidentional Vendor', vendorMaskedId: 'XXXXXXXXXX' + maskedId } };
                        }
                    });
                    this.successChilds(this.vendorsList, rowData);
                } else {
                    this.toaster.error(data.errorMessage, 'Error');
                }
            });
        }

    }
    successChilds(data, rowData) {
        this.itemList.forEach(element => {
            if (rowData.id === element.id) {
                element['childs'] = data;
            }
        });
    }

    generateChart(rowData, isVendorLevel: boolean) {

    }




    showAnalyticsForSelectedItem(rowData: any, isVendorLevel, parentRowData?: any) {
        let chartData;
        if (!isVendorLevel) {
            chartData = {
                'itemId': rowData.id,
                'graphTitle': 'Price Trend For : ' + rowData.description,
                'graphSubTitle': '',
                'isVendorLevel': isVendorLevel,
                'currentPrice': rowData.price,
                'priceFlag': rowData.priceFlag
            }
        } else {
            chartData = {
                'itemId': parentRowData.id,
                'vendorId': rowData.vendorId,
                'graphTitle': 'Price Trend For : ' + rowData.vendorName,
                'graphSubTitle': '',
                'isVendorLevel': isVendorLevel,
                'currentPrice': rowData.pricePerUnit,
                'priceFlag': rowData.priceFlag
            }
        }
        const dialog = this.modalDialog.open(PriceAnalyticsGraphModalComponent, {
            width: '60%',
            minHeight: '80vh', data: chartData
        });

        dialog.afterClosed().subscribe(result => {

        });


    }

    fileUploadEvent(files, isAllowAny: boolean) {
        const fileData = event;
        // console.log('event1', event);

        const file = files[0];
        if (!isAllowAny && !(file.name.split('.')[1] == 'xls' || file.name.split('.')[1] == 'xlsx')) {
            this.toaster.warning('Invalid File format, pls upload excel file only', 'warning')
            return;
        }
        this.convertSer.getBase64(file).then((data: string) => {
            const temp = {
                fileName: file.name,
                file: data.split(',')[1],
            };

            // For Single files upload
            this.commentFileData = data.split(',')[1];
            this.commentFileType = file.name;

            // For Muliple files upload
            this.commentFilesDataList.push(temp)
        });
    }
    filesDropped(event, isAllowAny: boolean) {
        const fileData = event;
        console.log('event', event);
        const file = event[0];
        if (!isAllowAny && !(file.name.split('.')[1] == 'xls' || file.name.split('.')[1] == 'xlsx')) {
            this.toaster.warning('Invalid File format, pls upload excel file only', 'warning')
            return;
        }
        this.convertSer.getBase64(file).then((data: string) => {
            const temp = {
                fileName: file.name,
                file: data.split(',')[1],
            };
            this.commentFileData = data.split(',')[1];
            this.commentFileType = file.name;

            this.commentFilesDataList.push(temp)
        });
    }



    removeFile() {
        this.commentFileData = null;
        this.commentFileType = null;
        this.commentFilesDataList = [];
    }

    createItemCatalogueByRequestBOQFile() {
        if (this.commentFileData) {
            const req = {
                'client': { id: this.loggedUserDetails.org.id },
                'boqfile': this.commentFilesDataList[0].file
            };
            this.client.createItemCatalogueByRequestBOQFile(req).subscribe((res: any) => {
                this.successCallBack(res);
                this.removeFile();
            });
        }
    }

    uploadItemCatalogueByRequest() {
        if (!!this.editItemModel.description) {
            const documentsExisted = this.editItemModel.documents.length>0? [...this.editItemModel.documents, ...this.commentFilesDataList]: [...this.commentFilesDataList]
            this.clientService.updateItemCatalogueByRequest({
                'id': this.editItemModel.id,
                'description': this.editItemModel.description,
                'documents': documentsExisted
            }).subscribe((res: any) => {
                console.log('res', res);
                this.successCallBack(res);
                this.removeFile();
            })
        }
    }

    viewItemData(rowData: any, itemTemplateRef) {
        const config: MatDialogConfig = {
            width: ' 762px'
        };
        this.isEditable = rowData.clientItemFlag == true? true: false;
        this.client.getItemDetailsById({ "id": rowData.id }).subscribe((res: any) => {
            this.editItemModel = {...res, ...{'clientItemFlag':rowData.clientItemFlag }};
            console.log(this.editItemModel)
            const dialog = this.dialog.open(itemTemplateRef, config);
            //   this.getAllClientUsers();
            dialog.afterClosed().subscribe(result => {
                //  this.getAllClients();
            });


        })

    }

    removeFileFromList(index: number) {
        this.commentFilesDataList.splice(index, 1)
    }

    closeModal(){
        this.modalDialog.closeAll();
    }
}
