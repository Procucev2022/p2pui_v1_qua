import { Component, OnInit, ViewEncapsulation, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { AppConfig } from 'src/app/app.config';
import { ApprovePrService } from '../../services/approve-pr.service';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { swalConfirm } from 'src/app/shared/helpers/swal-confirm';
import { EncryDecryService } from 'src/app/shared/services';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import {NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AcceptPrViewComponent } from '../accept-pr-view/accept-pr-view.component';
import jsPDF from 'jspdf';
import {DatePipe} from '@angular/common';
import { ExportPdfService } from 'src/app/layout/category-mgr/services/export-pdf.service';
import { CategoryService } from 'src/app/layout/category/services/category.service';


@Component({
    selector: 'app-pr-view-modal',
    templateUrl: './pr-view-modal.component.html',
    styleUrls: ['./pr-view-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PrViewModalComponent implements OnInit {
    selectedIndex = 0;
    selectedFilesArray: any[];
    documentsArray: any[] = [];
    regId: any;
    createModel: any;
    documentsToBase64: any[] = [];
    estimatedPrvalue: any;
    singleVendor: boolean;
    suggestNewVendor: boolean;
    rateCardAvailable: boolean;
    rateCardArray: any[] = [];
    defaultPermissions: any  ;
    todayDate: Date = new Date();
    minDate: any;
    dialog_width = 80;
    @ViewChild('PRdata') prdata: ElementRef;
    dropdownSettings: IDropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true,
    };
    selectedCostCentreItems: any[] = [];
    costCentreList: any[] = [];
    priorities = ['High', 'Low', 'Medium'];
    selectedPriorty: any;
    loggedUserData: any;
    deptName: Date;
    BOQDocument: any;
    BOQDocToBase64: any = [];
    rateCardDocToBase64: any = [];
    rateCardDoc: any;
    loggedUserDetails: any;
    loggedUserPermissions: any;

    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    selectedData: any[] = [];
    prClosureDate: any;
    prLineItemsDetails: any = [
        { field: 'serialNo', header: 'S.No', isLink: false, width: '100px' },
        { field: 'description', header: 'Product/Service Description', isLink: false, width: '250px' },
        { field: 'brand', header: 'Specifications', isLink: false, width: '170px' },

        { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '170px' },

        { field: 'quantity', header: 'Quantity', isLink: false, width: '150px' },

      ];
    approveReject: string;
    isCapex: boolean = false;
    quoteComGeneratedData: any;
    itemArray: any[];
;
    showQuoteComp: boolean = false;


    numberOnly(event): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    public singleVendorform: any[] = [
        {
            companyName: '',
            contactPerson: '',
            email: '',
            phone: '',
        },
    ];

    public createPRformList: any[] = [
        {
            description: '',
            brand: '',
            unitofMeasures: '',
            quantity: '',
        },
    ];

    bindTurnOver() {
        console.log('createPRformList', this.viewPrByIdList.pritems);
        if (this.viewPrByIdList.pritems.length > 0) {
            this.createPRformList = this.viewPrByIdList.pritems || [];
        }
    }
    bindDeliverylocation() {
        console.log(
            'deliveryLocationList',
            this.viewPrByIdList.clientdeliverylocation
        );
        if (this.viewPrByIdList.clientdeliverylocation.length > 0) {
            this.deliveryLocationList =
                this.viewPrByIdList.clientdeliverylocation || [];
        }
    }

    bindPriorities() {
        console.log('priorities', this.viewPrByIdList.priority);
        if (this.viewPrByIdList.priority !== null) {
            this.priorities = this.viewPrByIdList.priority || '';
        }
    }
    bindSelectedCost() {
        console.log(
            'selectedCostCentreItems',
            this.viewPrByIdList.clientcostcentre
        );
        if (this.viewPrByIdList.clientcostcentre.length > 0) {
            this.selectedCostCentreItems =
                this.viewPrByIdList.clientcostcentre || [];
        }
    }

    public deliveryLocationList: any[] = [
        {
            address: '',
            city: '',
            state: '',
        },
    ];

    // selectedIndex =0;
    viewPrByIdList: any;

    addItem() {
        if (this.createPRformList.length < 10) {
            this.createPRformList.push({
                description: '',
                brand: '',
                unitofMeasures: '',
                quantity: '',
            });
        } else {
            this.toaster.error('You can add maximum 10 items only', 'Error');
        }
    }
    removeItem(i: number) {
        this.createPRformList.splice(i, 1);
    }

    addLocation() {
        if (this.deliveryLocationList.length < 10) {
            this.deliveryLocationList.push({
                description: '',
                brand: '',
                unitofMeasures: '',
                quantity: '',
            });
        } else {
            this.toaster.error(
                'You can add maximum 10 locations only',
                'Error'
            );
        }
    }
    removeLocation(i: number) {
        this.deliveryLocationList.splice(i, 1);
    }

    addNewVendor() {
        if (this.singleVendorform.length < 5) {
            this.singleVendorform.push({
                companyName: '',
                contactPerson: '',
                email: '',
                phone: '',
            });
        } else {
            this.toaster.error('You can add maximum 5 vendors only', 'Error');
        }
    }

    removing(i: number) {
        this.singleVendorform.splice(i, 1);
    }
    onItemSelect(item: any) {
        console.log(item);
    }
    onSelectAll(items: any) {
        console.log(items);
    }

    constructor(
        private toaster: ToastrService,
        private approvePrService: ApprovePrService,
        private dialogRef: MatDialogRef<PrViewModalComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private encryDecryService: EncryDecryService,
        private procuReqService: CatProcuRequestsService,
        private modalDialog: MatDialog,
        // private activeModal : NgbActiveModal,
        private modalService: NgbModal,
        private exportPDFService: ExportPdfService,
        private catService: CategoryService
    ) {
        this.viewPrByIdList = data;
        this.isCapex = this.viewPrByIdList.isCapex ? this.viewPrByIdList.isCapex: false;
        console.log(this.viewPrByIdList);
        // console.log(this.viewPrByIdList.rateCardDocument),
        // console.log(this.viewPrByIdList.),
        // console.log(this.viewPrByIdList.rateCardDocument)
    }

    ngOnInit() {

        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
        this.loggedUserDetails = temp.details;
        this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
        const date = new Date();

        // add a day
        date.setDate(date.getDate() + 1);
        const tomorrow = date.toLocaleDateString();
        // this.minDate = new Date(tomorrow);
        this.minDate = this.viewPrByIdList.dueDate;
        this.bindTurnOver();
        this.bindDeliverylocation();
        this.bindPriorities();
        this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
        if (this.viewPrByIdList.clientStatus.uiDisplay === 'Submitted' || (this.viewPrByIdList.userStatus && this.viewPrByIdList.userStatus.uiDisplay === 'ApprovalPending')) {
            this.approveReject = 'true';
        } else {
            this.approveReject = 'false';
        }

        if(this.isCapex){
            this.createQuoteComparision();
        }

    }


    createQuoteComparision() {

        this.showQuoteComp = false;
        this.itemArray = [];
        if (true) {
            const requestObj = {
                "id": this.viewPrByIdList.id
            }
            this.catService.createQuoteComparisionCAPEX(requestObj).subscribe((res: any) => {
                this.quoteComGeneratedData = res;
                this.quoteComGeneratedData.totalSqft =this.viewPrByIdList.totalSqft;
                this.quoteComGeneratedData.vendorHeaders.forEach(element => {
                    element['quoteId'] = 'quoteId_perUnit_' + element.vendorId; 2
                    const x = { ...element }
                    this.quoteComGeneratedData.vendorHeaders.push({ ...x, 'quoteId': 'quoteId_perQty_' + element.vendorId })
                    this.quoteComGeneratedData.totalItems.forEach((element: any) => {
                        element['pricePerUnit'] = isNaN(element['pricePerUnit']) ? 0 : parseInt(element['pricePerUnit']);
                        element['quantity'] = isNaN(element['quantity']) ? 0 : parseInt(element['quantity']);
                        // element['quantity'] = 10;
                    });
                });
                setTimeout(() => {
                    this.itemArray = this.quoteComGeneratedData.totalItems;
                    this.showQuoteComp = true;
                }, 300);
            })

        } else {
            // this.toastr.warning("Items OR Linked Vendors not selected/available..!", "Warning")
        }
    }
    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }

    next() {
        //   console.log(form.value)
        //   form.value['regId'] = this.regId;
        // this.createPrService.saveCreatePr(form.value.description, form.value.materialSpecifications,
        //     form.value.unit_of_Measures, form.value.quantity,form.value.fileupload);
        this.selectedIndex++;
    }

    back() {
        this.selectedIndex--;
    }

    approvePR() {
        swalConfirm.open({
            title: '<h5>Please Confirm!!</h5>',
            html: '<h3>Are you sure you want to approve?</h3>',
            type: 'warning',
            confirmButtonText: 'Yes',
            confirmButtonColor: '#006dd5',
            cancelButtonColor: '#d63636',
            showCancelButton: true,
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                const obj = {
                    id: this.viewPrByIdList.id,
                };
                // call the service
                const approverId = {
                    'id' : localStorage.getItem('loggedId')
                };
                this.viewPrByIdList['approverId'] =  {
                    'id' : localStorage.getItem('loggedId')
                };
                this.approvePrService
                    .approvePRService([this.viewPrByIdList])
                    .subscribe((res: any) => {
                        if (
                            res.status === 'Success' ||
                            res.status === 'success'
                        ) {
                            this.toaster.success(res.message, 'Success');
                            this.dialogRef.close({
                                event: 'Success' || 'success',
                            });
                        } else if (
                            res.status === 'Failure' ||
                            res.status === 'failure'
                        ) {
                            this.toaster.error(res.message, 'Failure');
                        }
                    });
            }
        });
    }
    rejectPR() {
        swalConfirm.open({
            title: '<h5>Please Confirm!!<h5>',
            html: '<h3>Are you sure you want to reject?</h3>',
            type: 'warning',
            confirmButtonText: 'Yes',
            confirmButtonColor: '#006dd5',
            cancelButtonColor: '#d63636',
            showCancelButton: true,
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                const obj = {
                    id: this.viewPrByIdList.id,
                    ids: localStorage.getItem('orgId'),
                };
                this.approvePrService
                    .rejectPRService([obj])
                    .subscribe((res: any) => {
                        if (res) {
                            this.toaster.success(
                                'PR Rejection done successfully',
                                'Success'
                            );
                            this.dialogRef.close({
                                event: 'Success' || 'success',
                            });
                        } else if (
                            res.status === 'Failure' ||
                            res.status === 'failure'
                        ) {
                            this.toaster.error(res.message, 'Failure');
                        }
                    });
            }
        });
    }
    acceptPR() {
        const dialogConfig = new MatDialogConfig();

        // dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = this.viewPrByIdList;
        dialogConfig.minWidth = 400;
        dialogConfig.minHeight = 500;
        dialogConfig.maxWidth = 'none';
        dialogConfig.width = '80%';
        const dialogRef = this.modalDialog.open(AcceptPrViewComponent, dialogConfig).afterClosed()
        .subscribe(result => {
        });
      }
    closePr() {
            swalConfirm.open({
                title: '<h5>Please Confirm!!<h5>',
                html: '<h3>Are you sure you want to Close PR?</h3>',
                type: 'warning',
                confirmButtonText: 'Yes',
                confirmButtonColor: '#006dd5',
                cancelButtonColor: '#d63636',
                showCancelButton: true,
                reverseButtons: true,
            }).then((result) => {
                if (result.value) {
                    const obj = {
                        id: this.viewPrByIdList.id,
                    };
                    this.approvePrService
                        .closePRService([obj])
                        .subscribe((res: any) => {
                            if (res.statusCode === 1021) {
                                this.toaster.success(res.message, 'Success');
                                this.dialogRef.close({
                                    event: 'Success' || 'success',
                                });
                            } else if (
                                res.status === 'Failure' ||
                                res.status === 'failure'
                            ) {
                                this.toaster.error(res.message, 'Failure');
                            }
                        });
                }
            });
      }

      downloadPR() {
            let y = 30;
            const z = 0;
            const doc = new jsPDF();
            const column_names = this.prLineItemsDetails.map(col => ({ title: col.header, dataKey: col.field }));
            doc.setLineWidth(0.3);
            const pageHeight = doc.internal.pageSize.height;
            doc.setLineWidth(0.3);
            doc.setFontSize(16);
            doc.setFont('helvetica');
            doc.setFontType('bold');
            doc.text(50, 15, 'Procurement Request Summary');
            const imgData = AppApiConfig.LOGO_IMG_BASE64_DATA;
            doc.addImage(imgData, 'png', 155, 8, 45, 20);
            doc.setFontSize(10);
            doc.setFont('helvetica');
            doc.setFontType('normal');
            doc.text('PR ID', 12, y);
            doc.text(': ' + ' ' + this.viewPrByIdList.prId, 75, y);
            doc.text('Department name', 12, y = y + 8);
            doc.text(': ' + ' ' + this.viewPrByIdList.deptName, 75, y);
            doc.text('Single vendor ?', 12, y = y + 8);
            if (this.viewPrByIdList.singleVendor === true) {
                doc.text(': ' + ' Yes', 75, y);
            } else {
                doc.text(': ' + ' No', 75, y);
            }
            doc.text('PR Corresponds', 12, y = y + 8);
            doc.text(': ' + ' ' + this.viewPrByIdList.prCorrespond, 75, y);
            doc.text('Project Description', 12, y = y + 8);
            doc.text(': ' + ' ' + this.viewPrByIdList.prDescription, 75, y);
            doc.text('suggested vendors ?', 12, y = y + 8);
            if (this.viewPrByIdList.suggestNewVendor === true) {
                doc.text(': ' + ' Yes', 75, y);
            } else {
                doc.text(': ' + ' No', 75, y);
            }
            doc.text('Quote/Rate Card Available ?', 12, y = y + 8);
            if (this.viewPrByIdList.rateCardAvailable === true) {
                doc.text(': ' + ' Yes', 75, y);
            } else {
                doc.text(': ' + ' No', 75, y);
            }
            doc.text('Priority', 12, y = y + 8);
            doc.text(': ' + ' ' + (this.viewPrByIdList.priority ? this.viewPrByIdList.priority : '-'), 75, y);
            doc.text('Estimated PR Value (in INR)', 12, y = y + 8);
            doc.text(': ' + ' ' + this.viewPrByIdList.estimatedPrvalue, 75, y);
            doc.text('Future Requirement Plan', 12, y = y + 8);
            doc.text(': ' + ' ' + ( this.viewPrByIdList.futureRequirement ? this.viewPrByIdList.futureRequirement : '-'), 75, y);
            doc.text('Expected Time', 12, y = y + 8);
            const datePipe = new DatePipe('en-US');
            const updated_date = this.viewPrByIdList.dueDate ? datePipe.transform(this.viewPrByIdList.dueDate, 'dd-MM-yyyy') : '-';
            doc.text(': ' + ' ' + updated_date, 75, y);

            if (this.viewPrByIdList.prVendors.length !== 0) {
                doc.setFontSize(12);
                doc.setFont('helvetica');
                doc.setFontType('bold');
                doc.text('Vendors', 12, y = y + 15);
                const vendors_matrix = [];
                const vendors_headers = ['companyName', 'contactPerson', 'email', 'phone'];

                this.viewPrByIdList.prVendors.forEach((item, index) => {
                    const row = [];
                    vendors_headers.forEach(element => {
                        row.push(item[element]);
                    });
                    vendors_matrix.push(row);
                });

                (doc as any).autoTable({
                    startY: y = y + 10 ,
                    head: [vendors_headers],
                    body: vendors_matrix

                });
                if (doc.lastAutoTable.finalY + 10 > pageHeight - 20) {
                    doc.addPage();
                    doc.lastAutoTable.finalY = 10;
                } else {}
                y = doc.lastAutoTable.finalY  + 10;
            } else {
                y = y + 10;
            }
            doc.setFontSize(12);
            doc.setFont('helvetica');
            doc.setFontType('bold');
            doc.text('Items :', 12, y + 5 );
            const headers = [];

            column_names.forEach(col => {
                headers.push(col.title);
            });
            const data_matrix = [];

            this.viewPrByIdList.pritems.forEach((item, index) => {
                const row = [];
                column_names.forEach(element => {
                    row.push(item[element.dataKey]);
                });
                data_matrix.push(row);

            });
            (doc as any).autoTable({
                startY: y = y + 10 ,
                head: [headers],
                body: data_matrix

            });
            if (doc.lastAutoTable.finalY + 10 > pageHeight - 20) {
                doc.addPage();
                doc.lastAutoTable.finalY = 10;
            } else {}
            y = doc.lastAutoTable.finalY  + 10;
            doc.setFontSize(12);
            doc.setFont('helvetica');
            doc.setFontType('bold');
            doc.text('Delivery Address Location :', 12, y + 5 );

            const address_headers = ['address', 'city', 'state'];
            const address_matrix = [];
            this.viewPrByIdList.clientdeliverylocation.forEach(item => {
                const row = [];
                address_headers.forEach(element => {
                    row.push(item[element]);
                });
                address_matrix.push(row);
            });
            (doc as any).autoTable({
                startY: y = y + 10 ,
                head: [address_headers],
                body: address_matrix

            });
            this.exportPDFService.addFooters(doc);
            doc.save(this.viewPrByIdList.prId + '.pdf');
      }




    zoomout() {
        this.dialogRef.updateSize('70%');
    }

    zoomin() {
        this.dialogRef.updateSize('90%');
    }
}
