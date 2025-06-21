// import { SelectItem } from 'primeng/api';
import { Component, OnInit, ViewEncapsulation, Input, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';
import { AppConfig } from 'src/app/app.config';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VendorQuotService } from '../../services/vendor-quot.service';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';
import swal from 'sweetalert2';


@Component({
    selector: 'app-vendor-quotation-modal',
    templateUrl: './vendor-quotation-modal.component.html',
    styleUrls: ['./vendor-quotation-modal.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VendorQuotationModalComponent implements OnInit {

    //   @Input('rfqData') rfqData: any;
    //   @Input('rfqId') rfqId: any;
    rfqdetailsList: any = [];
    selectedData: any;
    selectedRFQData: any;
    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    dialog_width = 90;
    modalGridpageOptions: any;
    modalGridpageRecordSize: any;
    loggedUserPermissions: any;
    defaultPermissions;
    discountTypes: any[];
    autocal_totalValue;
    selectedIndex = 0;
    DiscountTypes = ['Percentage', 'Rupees'];
    selectedFilesArray: any[];
    documentsArray: any[] = [];


    rfqDetailHeaders: any = [
        { field: 'serialNo', header: 'S.No', isLink: false, width: '5%', fieldType: 'text' },
        { field: 'description', header: 'Desc', isLink: false, width: '25%', fieldType: 'text' },
        { field: 'brand', header: 'Specifications', isLink: false, width: '15%', fieldType: 'text' },
        // { field: 'category', header: 'Category', isLink: false },
        { field: 'itemcode', header: 'Item Code', isLink: false, width: '10%', fieldType: 'text' },
        { field: 'quantity', header: 'QTY', isLink: false, width: '5%', fieldType: 'text' },
        { field: 'unitofMeasures', header: 'UOM ', width: '5%', fieldType: 'text' },
        { field: 'unitprice', header: 'Unit Price', isLink: false, width: '10%', fieldType: 'text' },
       // { field: 'cgstPercentage', header: 'CGST %', isLink: false },
       // { field: 'cgstValue', header: 'CGST Value', isLink: false },
        { field: 'gstPercentage', header: 'GST %', isLink: false , width: '5%px', fieldType: 'text'},
        { field: 'gstValue', header: 'Total GST Value', isLink: false, width: '10%', fieldType: 'text' },
        // { field: 'discountType', header: 'Discount Type(%/Rs)', isLink: false },
        // { field: 'discountValue', header: 'Discount', isLink: false },
        { field: 'totalamount', header: 'Total Price ' , width: '10%', fieldType: 'text'}

    ];
    rfqId: any;
    loggedUser: any;
    deliveryTerms: any;
    otherTerms: any;
    paymentTerms: any;
    total: any = 0;
    rfqResDate: any;
    loggedUserDetails: any;


    constructor(private tostrService: ToastrService,
        private convertSer: ConvertToBase64Service,
        private encryDecryService: EncryDecryService,
        private venodorQuoteSer: VendorQuotService,
        private dialogRef: MatDialogRef<VendorQuotationModalComponent>,
        @Inject(MAT_DIALOG_DATA) data) {
        this.rfqId = data.rfqId;
        this.rfqResDate = data.rfqResDate;
        this.rfqdetailsList = data.rfqDetails;
        this.selectedRFQData = data.selectedRfqData;
        dialogRef.disableClose = true;
    }

    ngOnInit() {
        this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
        this.loggedUser = temp.details;
        this.loggedUserPermissions = temp.details.listofPermission;
        this.modalGridpageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
         this.loggedUserDetails =temp.details;
        this.modalGridpageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;

        this.discountTypes = this.DiscountTypes.map((name) => {
            return { label: name, value: name };
        });
    }

    refresh() {
        this.total = 0;
        this.rfqdetailsList.forEach(element => {
            this.total = this.roundTo(this.total + element.totalamount, 2);
        });
    }

    // rfqdetailsList from rest call
    getRfqsByPr() {

    }


    onSubmit(data) {
        swal({
            title: '<h5>Please Confirm!!<h5>',
            html: '<h3>Are you sure you want to submit?</h3>',
            confirmButtonText: 'Yes',
            confirmButtonColor: '#006dd5',
            cancelButtonColor: '#d63636',
            showCancelButton: true,
            reverseButtons: true
           }).then((result) => {
            if (result.value) {

                this.QuotationSubmit(data);
            }
          });
    }

    uploadFile($event) {
        console.log($event);

    }

    uploadDocuments(files) {
        console.log(files);

        Array.from(files).forEach((file: any) => {
            this.convertSer.getBase64(file).then((data: string) => {
                const temp = {
                    fileName: file.name,
                    file: data.split(',')[1]
                };
                this.documentsArray.push(temp);
            });
        });


    }
    deleteAttachment(index, type) {
        this[type].splice(index, 1);
    }

    removeFile(index) {
        this.selectedFilesArray.splice(index, 1);
    }
    next() {
        this.selectedIndex++;
    }

    back() {
        this.selectedIndex--;
    }

    QuotationSubmit(data) {

        const quotitems = [];
        data.forEach(d => {
            d['rfqitemId'] = d['id'];
            delete d.id;
            quotitems.push(d);
        });
        console.log(quotitems);
        let finalAmount = 0;

        quotitems.forEach(item => {
            finalAmount += item.totalamount;
        });

        let req = {
            'rfq': {
                'id': this.rfqId
            },
            'orgId': {
                'id': this.loggedUser.org.id
            },
            'quotationItems': quotitems,
            'deliveryTerms': this.deliveryTerms || '',
            'otherTerms': this.otherTerms || '',
            'paymentTerms': this.paymentTerms || '',
            'totalAmount' : Math.round(finalAmount * 100) / 100,
            'quotationDocuments' : this.documentsArray,
            'vendorResponseDate': this.rfqResDate


        };
        if(this.loggedUserDetails.role.roleName == "CategoryManager"){
            req['cmUser'] = this.loggedUserDetails.id;
             }else{
            req['cmUser'] = this.selectedRFQData && this.selectedRFQData.cmUser  ?this.selectedRFQData.cmUser : null ;
        }
        console.log(req);
        this.venodorQuoteSer.uploadQuotation(req).subscribe((res: any) => {
            if (res.status === 'Success') {
                this.tostrService.success(res.message, 'Success');
                this.dialogRef.close({ event: 'submit' });
            } else if (res.status === 'Failure') {
                this.tostrService.error(res.message, 'Failure');
            }

        });
    }

    // decimalCheck(e:any){
    //     var val = e.target.value
    //     e.target.value = (val.indexOf(".") >= 0) ? (val.substr(0, val.indexOf(".")) + val.substr(val.indexOf("."), 3)) : val;
    // }

    roundTo(num: number, places: number) {
        const factor = 10 ** places;
        return Math.round(num * factor) / factor;
    }

    onUnitPriceChange(rowData) {
        console.log(rowData);
        if (rowData.unitprice != null) {
            if (rowData.unitprice >= 0) {
                rowData.unitprice = this.roundTo(rowData.unitprice, 2);
                if (!isNaN(rowData.unitprice)) {
                    this.onGstPercentageChange(rowData) ;
                    this.onGstPercentageChange(rowData) ;
                    this.calculateTotal(rowData);
                }
            } else {
                this.tostrService.error('Negative values are not allowed', 'Failure');
            }
        } else {
            rowData.totalamount = 0;
        }

    }

    // onCgstPercentageChange(rowData) {
    //     if (rowData.cgstPercentage != null) {
    //         if (rowData.cgstPercentage >= 0) {
    //             if (!isNaN(rowData.cgstPercentage)) {
    //                 if(rowData.cgstPercentage <= 100){
    //                     this.calCgstValue(rowData)
    //                 }else{
    //                     this.tostrService.error('CGST Percentage should not be more than 100', 'Failure')
    //                 }

    //             }
    //         }
    //         else {
    //             this.tostrService.error('Negative values are not allowed', 'Failure')
    //         }
    //     }
    // }


    onGstPercentageChange(rowData) {
        // if (rowData.gstPercentage != null) {
            rowData.gstPercentage == null ? rowData.gstPercentage = 0 : rowData.gstPercentage;
            if (rowData.gstPercentage >= 0) {
                if (!isNaN(rowData.gstPercentage)) {
                    if (rowData.gstPercentage <= 100) {
                        this.calGstValue(rowData);
                    } else {
                        this.tostrService.error('GST Percentage should not be more than 100', 'Failure');
                    }
                }
            } else {
                this.tostrService.error('Negative values are not allowed', 'Failure');
            }
        // }
    }

    calGstValue(rowData) {
        rowData.gstValue = this.roundTo(((rowData.quantity * rowData.unitprice * rowData.gstPercentage ) / 100), 2);
        this.calculateTotal(rowData);
    }

    // calGstValue(rowData){
    //     rowData.cgstValue = (rowData.quantity * rowData.unitprice * rowData.cgstPercentage )/100;
    //     this.calculateTotal(rowData);
    // }


    onDiscountValueChange(rowData) {
        console.log(rowData);
        if (rowData.discountValue != null) {
            if (rowData.discountValue >= 0) {
                if (!isNaN(rowData.discountValue)) {
                    this.calculateTotal(rowData);
                }
            } else {
                this.tostrService.error('Negative values are not allowed', 'Failure');
            }
        }
    }

    onDiscountTypeChange(rowData) {
        rowData.discountValue = 0;
        this.calculateTotal(rowData);
    }

    calculateTotal(rowData) {
        if (rowData.unitprice > 0 || rowData.discountValue > 0) {
            if (rowData.unitprice != null && rowData.quantity != null) {

                if (!isNaN(rowData.gstValue)) {


                        const total = (rowData.quantity * rowData.unitprice);

                        const gstValue = isNaN(rowData.gstValue) ? 0 : rowData.gstValue ;
                        rowData.totalamount = this.roundTo(total + gstValue, 2);

                        if (!isNaN(rowData.unitprice) && !isNaN(rowData.discountValue)) {
                            if (!isNaN(rowData.quantity)) {
                                if (rowData.discountType === 'Percentage') {
                                    if (rowData.discountValue <= 100) {
                                        const valBeforePercentage = (rowData.quantity * rowData.unitprice);

                                        const gstValue = isNaN(rowData.gstValue) ? 0 : rowData.gstValue ;
                                        // var sgstValue = isNaN(rowData.sgstValue) ? 0 : rowData.sgstValue ;
                                        rowData.totalamount = valBeforePercentage + gstValue  ;
                                        rowData.totalamount = rowData.totalamount - ((rowData.totalamount * rowData.discountValue) / 100);

                                    } else {
                                        this.tostrService.error('Percentage should not be more than 100', 'Failure');
                                    }

                                } else {
                                    const total = (rowData.quantity * rowData.unitprice);

                                    const gstValue = isNaN(rowData.gstValue) ? 0 : rowData.gstValue ;
                                    // var sgstValue = isNaN(rowData.sgstValue) ? 0 : rowData.sgstValue ;
                                    rowData.totalamount = Math.round(parseFloat(total + gstValue ) );
                                    rowData.totalamount =  rowData.totalamount - rowData.discountValue;
                                }
                            }
                        }
                    } else {
                        rowData.totalamount = 0;
                    }

            } else {
                rowData.totalamount = 0;
            }
        } else {
            rowData.totalamount = 0;
            if (rowData.unitprice === 0) {
                this.tostrService.warning('Unit price is 0', 'Warning');
            } else {
                this.tostrService.error('Negative values are not allowed', 'Failure');
            }

        }
        this.refresh();
    }

    close() {
        this.dialogRef.close();
    }

    zoomout() {
        if (this.dialog_width >= 70) {
            this.dialog_width = this.dialog_width - 5;
        }
        this.dialogRef.updateSize(this.dialog_width + '%');
    }

    zoomin() {

        if (this.dialog_width <= 85) {
            this.dialog_width = this.dialog_width + 5;
        }
        this.dialogRef.updateSize(this.dialog_width + '%');
        console.log(this.dialog_width);
    }

}
