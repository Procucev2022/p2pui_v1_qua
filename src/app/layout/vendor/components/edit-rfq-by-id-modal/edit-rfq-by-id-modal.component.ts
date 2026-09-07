import { Component, HostListener, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from 'src/app/app.config';
import { CreateRfqService } from 'src/app/layout/category-mgr/services/create-rfq.service';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';
import { EncryDecryService } from 'src/app/shared/services';
import { swalConfirm } from 'src/app/shared/helpers/swal-confirm';
@Component({
    selector: 'app-edit-rfq-by-id-modal',
    templateUrl: './edit-rfq-by-id-modal.component.html',
    styleUrls: ['./edit-rfq-by-id-modal.component.scss']
})
export class EditRfqByIdModalComponent implements OnInit {
    fileData: any;
    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    selectedData: any;
    viewRFQbyIDdetails: any;
    isShowItemsSectionOnly: boolean = false;
    dragAreaClass: string;
    commentFileData: string;
    commentFileType: any;
    commentFilesDataList: any = [];
    loggedUserPermissions: any;
    loggedUserDetails: any;
    loggedUserName: any;
    roleName: any;
    categoryList: any = [];
    filtered_categoryList: any = [];
    divisionsList: any = [];
    selectedItem: any;
    selectedItemIndex: number;
   @ViewChild('itemModal') itemModal!: TemplateRef<any>;
    itemDialogRef: MatDialogRef<any> | null = null;
    selectedItemCategory: string = '';
    minDate: Date = new Date();



    constructor(private dialogRef: MatDialogRef<EditRfqByIdModalComponent>, private encryDecryService: EncryDecryService,
        @Inject(MAT_DIALOG_DATA) data, private convertSer: ConvertToBase64Service, private createRfqService: CreateRfqService,
        private toaster: ToastrService,
        private dialog: MatDialog

    ) {
        this.viewRFQbyIDdetails = data;
        const deliveryDate = this.viewRFQbyIDdetails.deliveryDate ? new Date(this.viewRFQbyIDdetails.deliveryDate) : null;
        this.viewRFQbyIDdetails.deliverDate1 = deliveryDate ? deliveryDate.toLocaleDateString("en-GB") : '';
        this.viewRFQbyIDdetails.deliveryDate = deliveryDate;
        if (!this.viewRFQbyIDdetails.clientdeliverylocationrfq || this.viewRFQbyIDdetails.clientdeliverylocationrfq.length === 0) {
            this.viewRFQbyIDdetails.clientdeliverylocationrfq = [{
                city: '',
                state: '',
                pincode: '',
                address: '',
                isValidPincode: true
            }];
        } else {
            this.viewRFQbyIDdetails.clientdeliverylocationrfq = this.viewRFQbyIDdetails.clientdeliverylocationrfq.map(loc => ({ ...loc, isValidPincode: true }));
        }
        console.log(this.viewRFQbyIDdetails);
    }

    isEmailRfq(): boolean {
        const source = (this.viewRFQbyIDdetails?.sourceType || '').toUpperCase().trim();
        return source === 'EMAIL' || source === 'E' || source === 'MAIL';
    }

    rfqDetailsHeaders: any = [

        { field: 'description', header: 'Description', isLink: false, fieldType: 'text', width: '120px' },
        { field: 'brand', header: 'Specification', isLink: false, fieldType: 'text', width: '120px' },

        { field: 'quantity', header: 'Quantity', isLink: false, fieldType: 'number', width: '120px' },
        { field: 'unitofMeasures', header: 'UOM', isLink: false, fieldType: 'text', width: '120px' },
        // { field: 'unitprice', header: 'Unit Price', isLink: false },
    ];

    ngOnInit() {
        this.isShowItemsSectionOnly = this.viewRFQbyIDdetails.showItemsOnly;
        this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
        const temp = JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')));
        this.loggedUserPermissions = temp.details.listofPermission;
        this.loggedUserDetails = temp.details;
        this.loggedUserName = this.loggedUserDetails.username;
        this.roleName = this.loggedUserDetails.role.roleName;
        if (this.roleName == 'ClientInitiator') {
            // this.rfqDetailsHeaders.splice(2, 0, { field: 'division', header: 'Division', isLink: false, fieldType: 'list' },);
            this.createRfqService.getGMTDivisions().subscribe((res: any) => {
                this.divisionsList = res || [];
            });
        } else {
            // this.rfqDetailsHeaders.splice(2, 0, { field: 'category', header: 'Category', isLink: false , fieldType: 'list'},);
            this.rfqDetailsHeaders.splice(4, 0, { field: 'remarks', header: 'Remarks', isLink: false, fieldType: 'text', width: '120px' },);

            this.createRfqService.getGMTDivisions().subscribe((res: any) => {
                this.divisionsList = res || [];
            });
            // if(this.viewRFQbyIDdetails.division){
            //     this.onChangeDivision(true);
            // }
            // if(this.viewRFQbyIDdetails.isCreateRFQScreen){
            console.log("...called...")
            this.createRfqService.getGMTCategories().subscribe((res: any) => {
                this.categoryList = res || [];
                this.filtered_categoryList = [];
            });

            // }

        }
    }

    onChangeDivision(isInitial: boolean) {
        const obj = { "division": this.viewRFQbyIDdetails.division };
        this.createRfqService.getGMTCategoriesByDivision(obj).subscribe((res: any) => {
            this.categoryList = res || [];
            if (!isInitial) {
                this.viewRFQbyIDdetails.category = '';
            }
            this.filtered_categoryList = [];
        });
    }
    filterAutoCompleteData(event, inputArrayName, outputArrayName, isStringType) {

        let filtered: any[] = [];
        this[outputArrayName] = [];
        const query = isStringType ? event.query.toLowerCase() : event.query;

        this.filtered_categoryList = this[inputArrayName].filter(ele => ele != null && (ele.toLowerCase().includes(query)));
    }

    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }

    zoomout() {
        this.dialogRef.updateSize('70%');
    }

    zoomin() {
        this.dialogRef.updateSize('90%');
    }

    getImageURL(file: any) {
        let url = '';
        if (file['fileName'].split('.').splice(-1) == 'xlsx' || file['fileName'].split('.').splice(-1) == 'xls' || file['fileName'].split('.').splice(-1) == 'csv') {
            url = '/assets/images/export-excel.png'
        } else if (file['fileName'].split('.').splice(-1) == 'pdf') {
            url = '/assets/images/new/download-pdf.svg'
        } else if (file['fileName'].split('.').splice(-1) == 'png' || file['fileName'].split('.').splice(-1) == 'PNG' || file['fileName'].split('.').splice(-1) == 'JPG' || file['fileName'].split('.').splice(-1) == 'jpeg' || file['fileName'].split('.').splice(-1) == 'jpg') {
            url = '/assets/images/new/download-img.png'
        } else {
            url = '/assets/images/new/download-file.png'
        }
        return url;
    }
    fileUploadEvent(files) {
        const fileData = event;
        // console.log('event1', event);
        const file = files[0];
        this.convertSer.getBase64(file).then((data: string) => {
            const temp = {
                fileName: file.name,
                file: data.split(',')[1],
            };

            // For Single files upload
            this.commentFileData = data.split(',')[1];
            this.commentFileType = file.name;

            // For Muliple files upload
            this.commentFilesDataList.push(temp);
        });
    }

    onupdatePincodeValidationStatus(event: any, index: number) {
        console.log('Pincode validation status event:', event);
        if (!this.viewRFQbyIDdetails.clientdeliverylocationrfq || !this.viewRFQbyIDdetails.clientdeliverylocationrfq[index]) {
            return;
        }
        if (event && event.pincodeIsValid) {
            this.viewRFQbyIDdetails.clientdeliverylocationrfq[index].isValidPincode = true;
            if (event.pincode) {
                this.viewRFQbyIDdetails.clientdeliverylocationrfq[index].pincode = event.pincode;
            }
            if (event.state) {
                this.viewRFQbyIDdetails.clientdeliverylocationrfq[index].state = event.state;
            }
            if (event.city) {
                this.viewRFQbyIDdetails.clientdeliverylocationrfq[index].city = event.city;
            }
        } else {
            this.viewRFQbyIDdetails.clientdeliverylocationrfq[index].isValidPincode = false;
            if (event && event.pincode) {
                this.viewRFQbyIDdetails.clientdeliverylocationrfq[index].pincode = event.pincode;
            }
        }
    }

    @HostListener('dragover', ['$event']) onDragOver(event: any) {
        this.dragAreaClass = 'droparea';
        event.preventDefault();
    }
    @HostListener('dragenter', ['$event']) onDragEnter(event: any) {
        this.dragAreaClass = 'droparea';
        event.preventDefault();
    }
    @HostListener('dragend', ['$event']) onDragEnd(event: any) {
        this.dragAreaClass = 'dragarea';
        event.preventDefault();
    }
    @HostListener('dragleave', ['$event']) onDragLeave(event: any) {
        this.dragAreaClass = 'dragarea';
        event.preventDefault();
    }
    @HostListener('drop', ['$event']) onDrop(event: any) {
        console.log('in the ondrop');
        this.dragAreaClass = 'dragarea';
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files) {
            const files: FileList = event.dataTransfer.files;
            this.fileUploadEvent(files);
        }
    }

    removeFile(index) {
        this.commentFileData = null;
        this.commentFileType = null;
        this.commentFilesDataList.splice(index, 1)
    }


    saveAndAccept() {
        if (!this.viewRFQbyIDdetails.projectDesc) {
            this.toaster.warning("Please Enter Project Description/Reference", 'Warning')
            return;
        }
        if (this.viewRFQbyIDdetails.rfqItem.some(item => !item.category || item.category.trim() === '')) {
            this.toaster.warning("Please enter Category for all items", 'Warning')
            return;
        }

        console.log('reod data', this.viewRFQbyIDdetails)
        this.viewRFQbyIDdetails['rfqDocument'] = [...(this.viewRFQbyIDdetails['rfqDocument'] || []), ...this.commentFilesDataList];
        this.viewRFQbyIDdetails['fromClient'] = this.loggedUserDetails.role.roleName == 'ClientInitiator';
        this.createRfqService.editRFQByClient(this.viewRFQbyIDdetails).subscribe((res: any) => {
            if (res.status == 'Success') {
                this.toaster.success(res.message, 'Success');
                this.dialogRef.close({ success: true });
            } else {
                this.toaster.error(res.message, 'Failed')
            }
        })
    }
    onSaveAndSend() {
        if (!this.viewRFQbyIDdetails.projectDesc) {
            this.toaster.warning("Please Enter Project Description/Reference", 'Warning')
            return;
        }
        console.log('reod data', this.viewRFQbyIDdetails)
        if (this.viewRFQbyIDdetails.rfqItem.some(item => !item.category || item.category.trim() === '')) {
            this.toaster.warning("Please enter Category for all items", 'Warning')
            return;
        }
        if (!this.viewRFQbyIDdetails.vendors || this.viewRFQbyIDdetails.vendors.length == 0) {
            this.toaster.warning("Without  Vendor assignment, Not able to send RFQ", 'Warning')
            return;
        }
        this.viewRFQbyIDdetails['rfqDocument'] = [...(this.viewRFQbyIDdetails['rfqDocument'] || []), ...this.commentFilesDataList];
        this.viewRFQbyIDdetails['fromClient'] = this.loggedUserDetails.role.roleName == 'ClientInitiator';
        this.createRfqService.onSaveAndSend(this.viewRFQbyIDdetails).subscribe((res: any) => {
            if (res.status == 'Success') {
                this.toaster.success(res.message, 'Success');
                this.dialogRef.close({ success: true });
            } else {
                this.toaster.error(res.message, 'Failed')
            }
        })
    }
    onSaveRFQByClientInitiator() {
        if (!this.isValidationPassed()) {
            return;
        }
        this.viewRFQbyIDdetails['rfqDocument'] = [...this.viewRFQbyIDdetails['rfqDocument'], ...this.commentFilesDataList];
        this.viewRFQbyIDdetails['fromClient'] = this.loggedUserDetails.role.roleName == 'ClientInitiator';
        this.createRfqService.editRFQByClient(this.viewRFQbyIDdetails).subscribe((res: any) => {
            if (res.status == 'Success') {
                this.toaster.success(res.message, 'Success');
                this.dialogRef.close({ success: true });
            } else {
                this.toaster.error(res.message, 'Failed')
            }
        })
    }

    isValidationPassed() {
        if (!this.viewRFQbyIDdetails.projectDesc) {
            this.toaster.warning("Please Enter Project Description/Reference", 'Warning')
            return false;
        }
        // if (!this.viewRFQbyIDdetails.division) {
        //     this.toaster.warning("Please assign Division to RFQ", 'Warning')
        //     return false;
        // }
        //viewRFQbyIDdetails.rfqItem
        for (const item of this.viewRFQbyIDdetails.rfqItem) {
            if (!item.description || !item.brand || !item.quantity || !item.unitofMeasures) {
                this.toaster.warning("Please Enter all fields for all items", 'Warning')
                return false;
            }
            if (isNaN(item.quantity) || item.quantity <= 0) {
                this.toaster.warning("Please Enter valid Quantity for all items", 'Warning')
                return false;
            }
            if (!isNaN(item.description)) {
                this.toaster.warning("Please Enter valid Description for all items", 'Warning')
                return false;
            }
            if (!isNaN(item.brand)) {
                this.toaster.warning("Please Enter valid Specification for all items", 'Warning')
                return false;
            }
            if (!isNaN(item.unitofMeasures)) {
                this.toaster.warning("Please Enter valid UOM for all items", 'Warning')
                return false;
            }
            //unitofMeasures not contains number
            if (/\d/.test(item.unitofMeasures)) {
                this.toaster.warning("Please Enter valid UOM for all items", 'Warning')
                return false;
            }

        }
        //viewRFQbyIDdetails.clientdeliverylocationrfq
        for (const loc of this.viewRFQbyIDdetails.clientdeliverylocationrfq) {

            if (!isNaN(loc.city)) {
                this.toaster.warning("Please Enter valid City for all Delivery Location", 'Warning')
                return false;
            }
            if (!isNaN(loc.state)) {
                this.toaster.warning("Please Enter valid State for all Delivery Location", 'Warning')
                return false;
            }
            if (!loc.pincode) {
                this.toaster.warning("Please Enter valid Pincode for all Delivery Location", 'Warning')
                return false;
            }
            if (!loc.isValidPincode && loc.pincode) {
                this.toaster.warning("Please Validate Pincode for all Delivery Location", 'Warning')
                return false;
            }
            const value = loc.pincode;


            // Check for exactly 6 digits
            const pinRegex = /^[1-9][0-9]{5}$/;
            if (!pinRegex.test(value)) {
                this.toaster.warning("Please Enter valid Pincode for all Delivery Locations", 'Warning');
                return false;
            }

            // Check if all digits are the same
            const repeated = /^(\d)\1{5}$/.test(value);
            if (repeated) {
                this.toaster.warning("Same digit repeated, Please enter a valid Pincode for all Delivery Locations", 'Warning');
                return false;
            }
        }
        return true;
    }

    closeModal() {
        swalConfirm.open({
            title: '<h6>Are you sure you want to Close the RFQ!<h6>',
            html: '<h4>You will be lost Unsaved changes?</h4>',
            confirmButtonText: 'Yes',
            confirmButtonColor: '#006dd5',
            cancelButtonColor: '#d63636',
            showCancelButton: true,
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                console.log('value', result);
                this.dialogRef.close();
            }
        });
    }

    onDeleteExistedAttachment(index) {
        this.viewRFQbyIDdetails.rfqDocument = this.viewRFQbyIDdetails.rfqDocument.filter((ele, i) => i != index)
    }

    onSelectCategoryModal(rowData: any, index: number, templateRef: any) {
        const dialogConfig = new MatDialogConfig();
        this.selectedItem = rowData;
        this.selectedItemIndex = index;
        this.selectedItemCategory = this.selectedItem.category || '';
        // dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = { ...this.selectedItem };
        dialogConfig.minWidth = 300;
        dialogConfig.minHeight = 200;
        dialogConfig.maxWidth = 'none';
        dialogConfig.width = '30%';
        this.itemDialogRef  = this.dialog.open(this.itemModal, {
            width: '30%',
            height: '400px',
            disableClose: true,
            autoFocus: true,
            data: { ...this.selectedItem }
        });

    }

    closeModalItemModal() {
        if (this.itemDialogRef)
            this.itemDialogRef.close(); 

    }

    saveCategory() {
        if (this.selectedItemCategory && this.selectedItemCategory.trim() !== '') {
            this.viewRFQbyIDdetails.rfqItem[this.selectedItemIndex].category = this.selectedItemCategory;
            this.closeModalItemModal();
        }else{
            this.toaster.warning("Please select Category", 'Warning')
        }
    }

}
