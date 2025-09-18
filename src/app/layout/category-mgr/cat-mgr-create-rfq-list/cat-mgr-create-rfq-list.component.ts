import { ToastrService } from 'ngx-toastr';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { RfqService } from '../../vendor/services/rfq.service';
import { EncryDecryService } from './../../../shared/services/encry-decry.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateRfqService } from '../services/create-rfq.service';
import { CatProcuRequestsService } from '../services';
import { ViewRFQByIdModalComponent } from '../../vendor/components/view-rfq-by-id-modal/view-rfq-by-id-modal.component';
import { ExcelService } from 'src/app/shared/modules/common-share/services/excel.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { AuthenticateLoggedUserComponent } from './../../../shared/modules/common-share/components/authenticate-logged-user/authenticate-logged-user.component';
import { SystemViewConfig } from 'src/app/app.config';
import { EditRfqByIdModalComponent } from '../../vendor/components/edit-rfq-by-id-modal/edit-rfq-by-id-modal.component';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
    selector: 'app-cat-mgr-create-rfq-list',
    templateUrl: './cat-mgr-create-rfq-list.component.html',
    styleUrls: ['./cat-mgr-create-rfq-list.component.scss']
})
export class CatMgrCreateRfqListComponent implements OnInit {

    rfqDataList: any = [];
    isCreateRFQView: boolean = false;
    selectedData: any = [];
    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    defaultPermissions: any;
    loggedUserPermissions: any;
    stepsList = [ ];
    rfqsTableHeadersForCM: any = [
        { field: 'rfqId', header: 'RFQ Id', isLink: false, width: '190px', fieldType: 'text', isExceedContent: false },
        { field: 'projectDesc', header: 'Description', isLink: false, width: '240px', fieldType: 'text', isExceedContent: true },
        { field: 'category', header: 'Category', isLink: false, width: '240px', fieldType: 'text', isExceedContent: true },
        { field: 'division', header: 'Division ', isLink: false, width: '190px', fieldType: 'text', isExceedContent: false },
        { field: 'noOfVendors', header: 'Vendors', isLink: false, fieldType: 'text', width: '180px', isExceedContent: false },
        // { field: 'noOfQuotes', header: 'Quotes', isLink: false, width: '160px', fieldType: 'text', isExceedContent: false },
        { field: 'createdTS', header: 'Created Date', isLink: false, fieldType: 'date', width: '225px', isExceedContent: false },
        { field: 'createdBy', header: 'Created By', isLink: false, width: '190px', fieldType: 'text', isExceedContent: true }
    ];
    rfqsTableHeadersForClientInitiator: any = [
        { field: 'rfqId', header: 'RFQ Id', isLink: false, width: '190px', fieldType: 'text', isExceedContent: false },
        { field: 'projectDesc', header: 'Description', isLink: false, width: '240px', fieldType: 'text', isExceedContent: true },
        { field: 'division', header: 'Division ', isLink: false, width: '240px', fieldType: 'text', isExceedContent: false },
        // { field: 'noOfVendors', header: 'Vendors', isLink: false, fieldType: 'text', width: '180px', isExceedContent: false },
        // { field: 'noOfQuotes', header: 'Quotes', isLink: false, width: '160px', fieldType: 'text', isExceedContent: false },
        { field: 'createdTS', header: 'Created Date', isLink: false, fieldType: 'date', width: '195px', isExceedContent: false },
        { field: 'createdBy', header: 'Created By', isLink: false, width: '195px', fieldType: 'text', isExceedContent: true },
        { field: 'quotationReceived', header: 'Quotation Received', isLink: false, width: '205px', fieldType: 'text', isExceedContent: false },
        { field: 'status_display', header: 'Status', isLink: false, fieldType: 'text', width: '180px', isExceedContent: false }

    ];

    itemCartTableHeaders: any = [
        { field: 'description', header: 'Description', isLink: false, width: '120px', fieldType: 'text', isExceedContent: true },
        { field: 'specification', header: 'Specification', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        { field: 'quantity', header: 'Quantity', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        { field: 'remarks', header: 'Remarks', isLink: false, width: '120px', fieldType: 'text', isExceedContent: true },
    ];

    vendorCartList = [];
    vendorCartTableHeaders = [
        { field: 'companyName', header: 'Vendor Name', isLink: false, width: '220px', fieldType: 'text', isExceedContent: true },
        { field: 'email', header: 'Email', isLink: false, width: '120px', fieldType: 'text', isExceedContent: true },
        { field: 'city', header: 'City', isLink: false, width: '150px', fieldType: 'text', isExceedContent: true },
        { field: 'mobileNo', header: 'Mobile Number', isLink: false, width: '150px', fieldType: 'text', isExceedContent: true },
        { field: 'otherEmails', header: 'other Email', isLink: false, width: '150px', fieldType: 'text', isExceedContent: true },
    ];

    deilveryCartTableHeaders = [
        { field: 'date', header: 'Delivery Date', isLink: false, width: '220px', fieldType: 'text', isExceedContent: true },
        { field: 'address', header: 'Address', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        { field: 'city', header: 'City', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        { field: 'state', header: 'State', isLink: false, width: '200px', fieldType: 'text', isExceedContent: false }
    ];
    itemCartList: any = [];
    BOQDocument: any;
    boqFile: { fileName: any; file: string; };
    isEditForm: boolean;
    currentStep = 1;
    itemForm: FormGroup;
    vendorForm: FormGroup;
    deliveryForm: FormGroup;
    projectForm: FormGroup;
    rfqForm: FormGroup;
    isShowCounterDialog: boolean = false;
    itemGridData: { gridHeaders: Array<any>, gridValue: Array<any>, actionsList: Array<any>, isMultiSelectAllows: boolean, gridEmptyMsg: string } = {
        gridHeaders: this.itemCartTableHeaders,
        gridValue: [],
        actionsList: [
            { 'eventName': 'onEditItem', 'eventImg': 'edit-data', 'eventDesc': 'Edit Item' }
            , { 'eventName': 'onDeleteItem', 'eventImg': 'delete', 'eventDesc': 'Delete Item' }
        ],
        isMultiSelectAllows: false, gridEmptyMsg: 'No Items Avaliable in Cart'
    }

    vendorGridData: { gridHeaders: Array<any>, gridValue: Array<any>, actionsList: Array<any>, isMultiSelectAllows: boolean, gridEmptyMsg: string } = {
        gridHeaders: this.vendorCartTableHeaders,
        gridValue: [],
        actionsList: [
            { 'eventName': 'onEditVendor', 'eventImg': 'edit-data', 'eventDesc': 'Edit Vendor' },
            { 'eventName': 'onDeleteVendor', 'eventImg': 'delete', 'eventDesc': 'Delete Vendor' }
        ],
        isMultiSelectAllows: false, gridEmptyMsg: 'No Vendors Avaliable in Cart'
    }
    preVendorsGridData: { gridHeaders: Array<any>, gridValue: Array<any>, actionsList: Array<any>, isMultiSelectAllows: boolean, gridEmptyMsg: string } = {
        gridHeaders: this.vendorCartTableHeaders,
        gridValue: [],
        actionsList: [
            { 'eventName': 'onAddVendorToCart', 'eventImg': 'cart', 'eventDesc': 'Add to Cart' },
        ],
        isMultiSelectAllows: false, gridEmptyMsg: 'No Vendors Avaliable for the selected Category'
    }

    deliveryGridData: { gridHeaders: Array<any>, gridValue: Array<any>, actionsList: Array<any>, isMultiSelectAllows: boolean, gridEmptyMsg: string } = {
        gridHeaders: this.deilveryCartTableHeaders,
        gridValue: [],
        actionsList: [
            { 'eventName': 'onEditDelivery', 'eventImg': 'edit-data', 'eventDesc': 'Edit Delivery' },
            { 'eventName': 'onDeleteDelivery', 'eventImg': 'delete', 'eventDesc': 'Delete Delivery' }
        ],
        isMultiSelectAllows: false, gridEmptyMsg: 'No Delivery Details avaliable in Cart'
    }
    isShowGrid: boolean = true;
    categoryList: any = [];
    filtered_categoryList: any = [];
    descriptionList: any = [];
    filtered_descriptionList: any = [];
    loggedUserDetails: any;
    vendorList: any = [];
    filtered_vendorList: any = [];
    statesList = AppApiConfig.STATES;
    minDate: any = new Date();
    vendorListObjs: any[];
    isAutoPopulated: boolean = false;
    findIndex: number = -1;
    expandedRows = {};
    selectedRFQData: any;
    rfqId: any;
    @ViewChild('childGridEle') childGridEle: ElementRef;
    isSendRFQToVendorScreen: boolean = false;
    viewRFQByIdData: any;
    isNoActionsRequired = true;
    quotationCounter: number;
    attachements: any =[];
    remarks: string = '';
    loggedUserName: any ='';
    authenticateData: {};
    currentView: any;
    isGMTView: boolean;
    roleName: any;
    rfqsTableHeaders: { field: string; header: string; isLink: boolean; width: string; fieldType: string; isExceedContent: boolean; }[];
    divisionsList: any =[];
    filtered_divisionsList =[];
    isIndian: any = true;

    constructor(
        private encryDecryService: EncryDecryService,
        private rfqservice: RfqService,
        private toaster: ToastrService,
        private converSer: ConvertToBase64Service,
        private fb: FormBuilder,
        private modalDialog: MatDialog,
        private createRFQService: CreateRfqService,
        private catprocService: CatProcuRequestsService,
        private dialog: MatDialog,
        private excelService: ExcelService,
        private loaderService: LoaderService,
        private atuhService: AuthenticationService) {

    }

    getColSpan(){
        return  this.roleName == 'ClientInitiator' ? 6 : 9;
    }

    ngOnInit() {
        this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
        this.loggedUserPermissions = temp.details.listofPermission;
        this.loggedUserDetails = temp.details;
        this.loggedUserName = this.loggedUserDetails.username;
        const is_Authenticated = this.loggedUserDetails.auth? this.loggedUserDetails.auth: false;
        this.isIndian = this.loggedUserDetails.org.india == true || this.loggedUserDetails.org.india == 'true'? true: false;;
        this.roleName = this.loggedUserDetails.role.roleName;
        this.authenticateData = {
            isAuthenticated: is_Authenticated,
            status: is_Authenticated? 'Authenticated': 'Not Authenticated',
            imgURL: is_Authenticated? 'assets/images/new/auth-green.svg' : 'assets/images/new/auth-red.svg'
        }
        this.currentView = !localStorage.getItem('system-view') ? JSON.parse(localStorage.getItem('system-view')): localStorage.getItem('system-view');
        this.isGMTView = [SystemViewConfig.GMT_BASIC , SystemViewConfig.GMT_BASIC_PLUS].includes(this.currentView)? true: false;
        if(this.roleName == 'ClientInitiator'){
           this.stepsList = [
                { label: 'Project & Delivery Details' }
            ];
            this.rfqsTableHeaders = this.rfqsTableHeadersForClientInitiator;
        }else{
            this.rfqsTableHeaders = this.rfqsTableHeadersForCM;
            this.stepsList = [
                { label: 'Project & Delivery Details' },
                { label: 'Vendor Details' },
            ];
        }
        this.getRfqData();

        this.initialCalls();
        this.buildRFQForms();
    }

    getRfqData(){
        if(this.loggedUserDetails.role.roleName == 'ClientInitiator'){
            this.getRFQsForClient();
        }else{
            this.getRFQList();
        }
    }



    initialCalls() {
        // this.createRFQService.getAllSubCategoriesForRFQ().subscribe((res: any) => {
        //     this.categoryList = res || [];
        // });
        if(this.roleName == 'ClientInitiator'){
            this.createRFQService.getGMTDivisions().subscribe((res: any) => {
                this.divisionsList = res || [];
            });
        }
        if(this.roleName != 'ClientInitiator'){
            this.createRFQService.getGMTCategories().subscribe((res: any) => {
                this.categoryList = res || [];
            });

            this.createRFQService.getAllVendorsList().subscribe((res: any) => {
                if (Array.isArray(res)) {
                    this.vendorListObjs = res;
                    this.vendorList = res.map(ele => ele.companyName);
                }
            })
        }
        this.createRFQService.getAllItemsDescriptionsForRFQ().subscribe((res: any) => {
            this.descriptionList = res || [];
        });

    }

    filterAutoCompleteData(event, inputArrayName, outputArrayName, isStringType) {

        let filtered: any[] = [];
        this[outputArrayName] = [];
        const query = isStringType ? event.query.toLowerCase() : event.query;

        this[outputArrayName] = this[inputArrayName].filter(ele => ele != null && (ele.toLowerCase().includes(query)));

        console.log('x', this[outputArrayName])
        if (inputArrayName == 'vendorList') {
            this.vendorForm.controls['mobileNo'].setValue('');
            this.vendorForm.controls['city'].setValue('');
            this.vendorForm.controls['email'].setValue('');
            this.vendorForm.controls['id'].setValue('');
            this.vendorForm.enable();
            this.isEditForm = false;
        }
        this.isAutoPopulated = false;
    }

    onSelectedVendor(event, item) {
        console.log('event', event, item);
        const findIndex = this.vendorListObjs.findIndex(ele => ele.companyName === event.value)
        if (findIndex > -1) {
            this.vendorForm.setValidators([]);
            this.isAutoPopulated = true;
            Object.keys(this.vendorForm.controls).forEach((ctrl: any) => {
                if (!(ctrl == 'companyName' || ctrl == 'otherEmails')) {
                    this.vendorForm.controls[ctrl].disable();
                }
            })
        } else {
            this.fb.group({
                id: new FormControl('MANUALENTRYID_' + Math.random()),
                companyName: new FormControl(event.value, Validators.required),
                city: new FormControl('', Validators.required),
                mobileNo: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
                email: new FormControl('', [Validators.required, Validators.email]),
                otherEmails: new FormControl('')
            });
            this.isAutoPopulated = false;
        }
        // if(this.filtered_vendorList.length>0){
        this.vendorForm.patchValue(this.vendorListObjs[findIndex]);
        // }else{

        // }
    }

    getAllVendorByCategory() {
        this.createRFQService.getAllVendorByCategory({ 'vendorcategory': this.projectForm.value.category }).subscribe((res: any) => {
            this.preVendorsGridData.gridValue = Array.isArray(res) ? res : [];
            this.reloadGridComponent();
        });
    }


    getRFQList() {
        this.selectedData = [];
        this.rfqservice.getAllRFQsForNoPR().subscribe(data => { this.rfqDataList = data || []; });
    }
    onSelectSystem(sysValue) {
        this.atuhService.onSelectedSubscriptions(sysValue, this.loggedUserDetails, true)
    }
    getRFQsForClient(){
        this.selectedData = [];
        const obj = {"id": this.loggedUserDetails.id};
        this.rfqservice.getAllRFQsForNoPRForClientInitiatorGMT(obj).subscribe(data => {
            if(Array.isArray(data)){
                this.rfqDataList = data.map((ele:any) => {
                    const statusDisplay =  ele.clientStatus ?  ele.clientStatus.uiDisplay: '-';
                    let status_display = statusDisplay;
                    if(statusDisplay){
                        status_display = statusDisplay =='New'? 'In Progress': (statusDisplay =='Accepted'? 'Published': statusDisplay)
                    }
                   const obj ={...ele, 'status_display':status_display,quotationReceived: ele.quotationReceived == true? 'YES': 'WIP'}
                   return obj;
                });
            }
            });
    }

    onCreateRfq() {
        this.isCreateRFQView = true;
        this.currentStep =1;
        this.isSendRFQToVendorScreen = false;
        this.resetScreen();
    }

    resetScreen() {
        this.itemForm.reset();
        this.projectForm.reset();
        this.vendorForm.reset();
        this.deliveryForm.reset();
       this.resetGrids();
        this.isSendRFQToVendorScreen = false;
    }

    resetGrids(){
        this.itemGridData.gridValue = [];
        this.vendorGridData.gridValue = [];
        this.preVendorsGridData.gridValue = [];
        this.reloadGridComponent();
        this.attachements = [];
    }


    onSendRFQ(rowData: any) {

        this.selectedRFQData = { ...rowData };

        this.isSendRFQToVendorScreen = true;
        this.currentStep = 2;
        this.projectForm.controls['category'].setValue(this.selectedRFQData.category);
        this.projectForm.controls['projectDesc'].setValue(this.selectedRFQData.projectDescription);
        this.getAllVendorByCategory();
        this.catprocService.getVendorsByRfq({ 'id': this.selectedRFQData['id'] }).subscribe((result) => {
            const gridValue = Array.isArray(result) ? result : [];
            this.vendorGridData.gridValue = gridValue.map(ele => {return {...ele,isSendRFQToVendorScreen: this.isSendRFQToVendorScreen? true: false}})
        });
        this.isCreateRFQView = true;
    }


    //For View RFQ Details - ReadOnly

    onViewRFQDetails(rowData, isEdit) {
        if(isEdit && this.roleName == 'ClientInitiator' && rowData.status_display == 'Accepted' || rowData.status_display == 'Published'){
            this.toaster.warning("RFQ Already  Accepted. \n You're not allowed at this moment!", "Warning")
            return;
        }
        console.log(rowData);
        const temp = {
            'id': rowData.id
        };

        this.rfqservice.fetchRfqById(temp).subscribe((res: any) => {
            if (res) {
                this.viewRFQByIdData = res || {};
                if(isEdit){

                    this.onEditRfqDetails();
                }else{
                    this.viewRFQByIdModal();
                }

            } else {
                this.toaster.error('Failed to Fetch data', 'Failure');
            }
        });
    }
    onEditRfqDetails(){
        const dialogConfig = new MatDialogConfig();

        // dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {...this.viewRFQByIdData , isCreateRFQScreen: this.roleName == 'ClientInitiator'};
        dialogConfig.minWidth = 400;
        dialogConfig.minHeight = 500;
        dialogConfig.maxWidth = 'none';
        dialogConfig.width = '80%';
        const dialogRef = this.dialog.open(EditRfqByIdModalComponent, dialogConfig).afterClosed().subscribe(result => {
            console.log(result);
            if(result && result.success){
                // this.initialCalls(); //NTC
                this.getRfqData();
            }
        });

    }

    viewRFQByIdModal() {
        const dialogConfig = new MatDialogConfig();

        // dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {...this.viewRFQByIdData };
        dialogConfig.minWidth = 400;
        dialogConfig.minHeight = 500;
        dialogConfig.maxWidth = 'none';
        dialogConfig.width = '80%';
        const dialogRef = this.dialog.open(ViewRFQByIdModalComponent, dialogConfig).afterClosed().subscribe(result => { console.log(result); });
    }


    sendRFQToVendors() {
        if(this.isSendRFQToVendorScreen){
            const newVendors = this.vendorGridData.gridValue.filter(ele => !ele.isSendRFQToVendorScreen)
            if(newVendors.length<=0){
                    this.toaster.warning('Sorry!, Pls add new Vendors ', 'Warning');
                    return;
            }
        }


        const obj = {
            id: this.selectedRFQData.id,
            vendors: this.buildVendorsForAPI()
        };

        this.createRFQService.forwardRFQ(obj).subscribe((res: any) => {
            if (res.status == 'Success') {
                this.isCreateRFQView = false;
                this.isSendRFQToVendorScreen = false;
                this.resetScreen();
                this.toaster.success(res.message, 'Success');
                this.getRfqData();
            } else {
                this.toaster.error(res.message, 'Failed')
            }
        });
    }

    onCreateItemForm() {
        this.rfqForm = this.fb.group({
            itemForm: this.itemForm,
            vendorForm: this.vendorForm,
            deliveryForm: this.deliveryForm,
            projectForm: this.projectForm
        })

        this.rfqForm.valueChanges.subscribe((val: any) => {
            console.log(val, this.rfqForm)
        })
    }

    get rfqFormControls() {
        return this.rfqForm.controls;
    }

   get isInvalidDescription(){
     let description = this.itemForm.controls.description.value?.trim();
        if(description && description.split(' ').length >1){
           description = description.replace(/\s+/g, '');
        }
        return (this.itemForm.controls.description.dirty) &&
            (   this.isOnlySpecialCharacters(description) ||
            this.startsWithSpecialChar(description));
    }

    get isEmptyDescription(){
        return this.itemForm.controls.description.dirty && this.itemForm.controls.description.value.trim() == '';
    }

    isOnlySpecialCharacters(description) {
        const regex = /^[^a-zA-Z0-9\s]+$/;
       
        return regex.test(description);
    }

    startsWithSpecialChar(str) {
        const regex = /^[^a-zA-Z0-9]/;
        return regex.test(str);
    }



    buildRFQForms() {
        this.projectForm = this.fb.group({
            projectDesc: new FormControl('', Validators.required),

        });
        this.itemForm = this.fb.group({
            id: new FormControl('MANUALENTRYID_' + Math.random()),
            description: new FormControl('', Validators.required),
            quantity: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)]),
            unitofMeasures: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
            specification: new FormControl('', Validators.required),
            remarks: new FormControl('')
        });
        this.vendorForm = this.fb.group({
            id: new FormControl('MANUALENTRYID_' + Math.random()),
            companyName: new FormControl('', Validators.required),
            city: new FormControl('', Validators.required),
            mobileNo: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
            email: new FormControl('', [Validators.required, Validators.email]),
            otherEmails: new FormControl('')
        });
        this.deliveryForm = this.fb.group({
            id: new FormControl('MANUALENTRYID_' + Math.random()),
            date: new FormControl('', Validators.required),
            // address: new FormControl('', Validators.required),
            state: new FormControl(null, Validators.required),
            city: new FormControl('', Validators.required),
            pincode : new FormControl('', Validators.required)
        });

        if(this.isIndian){
           this.deliveryForm.controls.state.clearValidators();
           this.deliveryForm.controls.state.clearValidators();
        }
        this.onCreateItemForm();

        if(this.roleName == 'ClientInitiator'){
            this.projectForm.addControl('division', this.fb.control('', Validators.required));
        }else{
            this.projectForm.addControl('category', this.fb.control('', Validators.required));
        }
    }

    //from Prevendor Grid - adding vendor to cart
    onAddVendorToCart(rowData) {
        if (this.vendorGridData.gridValue.findIndex(ele => ele.id == rowData.id) > -1) {
            this.toaster.warning("Already this vendor added to Cart, Pls Check!", 'Warning');
            return;
        }
        this.vendorGridData.gridValue.push(rowData);
        this.toaster.success('Vendor added to Cart!', 'Success');
    }

    onAddVendorsToCart() {
        if (this.vendorForm.invalid) {
            this.toaster.warning('Pls fill the required fields', 'Warning');
            return;
        }
        if (this.isEditForm) {
            const index = this.vendorGridData.gridValue.findIndex(ele => {
                return (ele.id == this.vendorForm.value['id'])
            })
            this.vendorGridData.gridValue[index] = this.vendorForm.getRawValue();
            this.preVendorsGridData.gridValue[index] = this.vendorForm.getRawValue();

            this.toaster.success('Vendor Details Updated in Cart!', 'Success');


        } else {
            const vendorFormData = this.vendorForm.getRawValue();
            if (!vendorFormData.id || (vendorFormData.id.split('_').includes('MANUALENTRYID'))) {
                this.vendorForm.controls.id.setValue('MANUALENTRYID_' + Math.random());
            }

            this.vendorGridData.gridValue.push(this.vendorForm.getRawValue());

            this.toaster.success('Vendor added to Cart!', 'Success');
        }
        this.reloadGridComponent();
        this.isEditForm = false;
        this.vendorForm.reset();
        this.vendorForm.enable();
    }

    onAddItemsToCart() {
        if (this.itemForm.invalid) {
            this.toaster.warning('Pls fill the required fields');
            return;
        }
        if(this.itemForm.controls.description.value.trim() == ''){
            this.toaster.warning('Description is required', 'Warning');
            return;
        }
        if(this.itemForm.controls.quantity.value == 0) {
            this.toaster.warning('Quantity must be greater than 0', 'Warning');
            return;
        }
        if (this.isEditForm) {
            const index = this.itemGridData.gridValue.findIndex(ele => {
                return (ele.id == this.itemForm.value['id'])
            })
            this.itemGridData.gridValue[index] = this.itemForm.getRawValue();
            this.toaster.success('Item Details updated in Cart!', 'Success');
            this.reloadGridComponent();
        } else {
            this.itemForm.controls.id.setValue('MANUALENTRYID_' + Math.random());
            this.itemGridData.gridValue.push({ ...this.itemForm.getRawValue(), description: this.itemForm.controls.description.value.trim() });
            this.toaster.success('Item added to Cart!', 'Success');
        }
        this.reloadGridComponent();
        this.isEditForm = false;
        this.itemForm.reset();

    }

    onAddDeliveryToCart() {
        if (this.deliveryForm.invalid) {
            this.toaster.warning('Pls fill the required fields');
            return;
        }
        if (this.isEditForm) {
            const index = this.deliveryGridData.gridValue.findIndex(ele => {
                return ele.id == this.deliveryForm.value['id']
            })
            this.deliveryGridData.gridValue[index] = this.deliveryForm.getRawValue();
            this.reloadGridComponent();

        } else {
            this.deliveryForm.controls.id.setValue('MANUALENTRYID_' + Math.random())
            this.deliveryGridData.gridValue.push(this.deliveryForm.getRawValue());
        }
        this.isEditForm = false;
        this.deliveryForm.reset();
    }

    get ctrls() {
        return this.itemForm.controls;
    }

    get vendorCtrls() {
        return this.vendorForm.controls;
    }

    get deilveryCtrls(){
        return this.deliveryForm.controls;
    }


    onEditItem(rowData) {
        if (this.itemForm) {
            this.isEditForm = true;
            this.itemForm.patchValue(rowData);

        }
    }

    onDeleteItem(rowData: any) {
        this.itemGridData.gridValue = [...this.itemGridData.gridValue.filter(ele => ele.id != rowData.id)];
        this.reloadGridComponent();
    }

    onDeleteVendor(rowData: any) {
        this.vendorGridData.gridValue = [...this.vendorGridData.gridValue.filter(ele => ele.id != rowData.id)];
        this.reloadGridComponent();
    }
    onDeleteDelivery(rowData: any) {
        this.deliveryGridData.gridValue = [...this.deliveryGridData.gridValue.filter(ele => ele.id != rowData.id)];
        this.reloadGridComponent();
    }

    reloadGridComponent() {
        this.isShowGrid = false;
        setTimeout(() => {
            this.isShowGrid = true;
        }, 300)
    }

    onEditVendor(rowData) {

        if (this.vendorForm) {
            this.isEditForm = true;
            this.vendorForm.patchValue(rowData);
        }

        if (rowData.id.split('_').includes('MANUALENTRYID')) {
            Object.keys(this.vendorForm.controls).forEach((ctrl: any) => {
                this.vendorForm.enable();

            })
        } else {
            Object.keys(this.vendorForm.controls).forEach((ctrl: any) => {
                if (!(ctrl == 'companyName' || ctrl == 'otherEmails')) {
                    this.vendorForm.controls[ctrl].disable();
                }
            })
        }
    }

    onEditDelivery(rowData) {
        if (this.deliveryForm) {
            this.isEditForm = true;
            this.deliveryForm.patchValue(rowData);
        }
    }


    uploadBOQFile($event) {

        this.BOQDocument = $event.target.files[0];
        if ((this.BOQDocument.name.split('.').pop()).toLowerCase() !== 'xlsx') {
            this.toaster.warning('Please check file format, only allowed xlsx extension files', 'Warning');
            return;
        }
        this.converSer.getBase64(this.BOQDocument).then((data: string) => {
            const temp = {
                fileName: this.BOQDocument.name,
                file: data.split(',')[1]
            };
            this.boqFile = Object.assign({}, temp);
        });
    }
    removeFile() {
        this.boqFile = null;
    }

    onUploadFile(){
        // this.loaderService.isLoading.next(true);
        // setTimeout(()=>{
        //     this.loaderService.isLoading.next(false);
        //     this.toaster.error("Something went Wrong!, Pls try after sometime", "Failed")
        // }, 7000)
        // return;
        this.loaderService.isLoading.next(true);
        this.convertBoQtoPrItems();
    }

    convertBoQtoPrItems() {

        if (this.boqFile ) {
          this.createRFQService.convertToBOQ({boqfile: this.boqFile['file'], boqFileName: 'sample'}).subscribe((res) => {
            if (Array.isArray(res)) {

              res.forEach(element => {
                element['isBoqItem'] = true;
                const gridValue = {'description': element.description ,specification: element.brand,   unitofMeasures: element.unitofMeasures, quantity: element.quantity, id: 'MANUALENTRYID_' + Math.random(), remarks: element.remarks}
                this.itemGridData.gridValue.push(gridValue);
                this.reloadGridComponent();
              });
              this.removeFile();
            }
          });
         }
      }

    navigateTo(isBack: boolean = false) {
        if (this.currentStep == 1) {
            this.currentStep = 2;
            this.getAllVendorByCategory();
        } else if (this.currentStep == 2) {
            this.currentStep = isBack ? 1 : 3;
        } else {
            this.currentStep = isBack ? 2 : 1;
        }
        this.isEditForm = false;
        this.itemForm.reset();
        this.vendorForm.reset();
    }

    onSaveAndExit(){
        this.createRFQ();
    }

    onGridAction(event: any) {
        this[event.eventData['eventName']](event.rowData);
    }

    onVendorSearch(id: any) {
        const config: MatDialogConfig = {
            width: ' 762px'
        };
        const dialog = this.modalDialog.open(id, config);

        dialog.afterClosed().subscribe(result => {

        });
    }

    createRFQ() {

        const projectFormData = this.projectForm.getRawValue();
        const deliveryFormData = this.deliveryForm.getRawValue();
        const itemsList = this.itemGridData.gridValue.map((item: any) => {
            return {
                brand: item.specification,
                unitofMeasures: item.unitofMeasures,
                quantity: item.quantity,
                description: item.description,
                "category": null,
                "createdBy": null,
                "createdTS": (new Date().toISOString()).split('Z')[0],
                "itemcode": null,
                "serialNo": 1001,
                "remarks": item.remarks
            }
        });

        const vendorList = this.buildVendorsForAPI();


        let obj = {
            "createdBy": this.loggedUserDetails.fullName,
            "projectDesc": projectFormData.projectDesc,

            "deliveryDate": deliveryFormData.date,
            "noPrFlag": true,
            "org": {
                "id": this.loggedUserDetails.org.id
            },
            "rfqItem": itemsList,
            "vendors": vendorList,
            "clientdeliverylocationrfq": [{
                state: deliveryFormData.state,
                city: deliveryFormData.city,
                address: deliveryFormData.address,
                pincode: deliveryFormData.pincode
            }],
            "remarks": this.remarks,
            "rfqDocument": this.attachements,

            "user": this.loggedUserDetails.id
        };
        if(this.roleName == 'ClientInitiator'){
            if(this.divisionsList.find(ele => ele == projectFormData.division)){
                obj['division']= projectFormData.division;
            }else{
                this.toaster.warning("Please Select Division from given list, Not allowed new Division", "Warning");
                return;
            }

            this.createRFQService.createRFQByClient(obj).subscribe((res: any) => {
                console.log('res', res);
                if (res.status == 'Success') {
                    this.isCreateRFQView = false;
                    this.toaster.success(res.message, 'Success');
                    this.getRfqData();
                } else {
                    this.toaster.error(res.message, 'Failed')
                }
                // this.isCreateRFQView = false;
            })
        }else{
            obj["category"]= projectFormData.category;
            this.createRFQService.sendRFQ(obj).subscribe((res: any) => {
                console.log('res', res);
                if (res.status == 'Success') {
                    this.isCreateRFQView = false;
                    this.toaster.success(res.message, 'Success');
                    this.getRfqData();
                } else {
                    this.toaster.error(res.message, 'Failed')
                }
                // this.isCreateRFQView = false;
            })
        }
    };

    buildVendorsForAPI() {
        const vendorValue =  this.vendorGridData.gridValue.filter(ele => !ele.isSendRFQToVendorScreen);
        const vendors: any = vendorValue.map((item: any) => {
            let vendor;
            if (item.id.split('_').includes('MANUALENTRYID')) {
                vendor = {
                    "city": item.city,
                    "companyName": item.companyName,
                    "organizationPhonenumber": item.mobileNo,
                    "email": item.email,
                    "otherEmails": item.otherEmails,
                    "vendorcategory": null,
                    "subCategory": null

                }
            } else {
                vendor = {
                    "id": item.id,
                    "otherEmails": item.otherEmails,
                    "email": item.email
                }
            }
            return vendor;
        });

        return vendors;
    }

    getCloseRFQs(selectedRowData, event) {
        this.expandedRows = {};
    }

    getRFQs(selectedRowData, event) {
        this.expandedRows = {};
        const thisRef = this;
        thisRef.expandedRows[selectedRowData.id] = 1;
        this.selectedRFQData = null;

        this.selectedData = [selectedRowData];
        setTimeout(()=>{
            this.selectedRFQData = Object.assign({}, selectedRowData);
        }, 100)
        // this.rfqId = event.srcElement.lastChild.data;
        // console.log('event data', event.srcElement.lastChild.data);
        // this.childGridEle.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }

    OnGetQuotationCounter(rowData: any) {
        this.isShowCounterDialog = true;
        this.selectedRFQData = rowData;
        this.createRFQService.getQuotationCounter({ id: rowData.id }).subscribe((res: any) => {
            this.quotationCounter = res.count;
        });
    }

    downloadSampleBOQ() {

        let link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.href = 'assets/images/RFQ_BOQ_SAMPLE_FILE.xlsx';
        // link.download = path;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    getAttachedDocsList(event:any){
        console.log('event..',event)
        this.attachements = event.attachedDocuments;
    }

    onReAuthenticateLoggedUser(){
        const dialogConfig = new MatDialogConfig();

        // dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {...this.viewRFQByIdData, hiddenCategory: true};
        dialogConfig.minWidth = 200;
        dialogConfig.minHeight = 300;
        dialogConfig.maxWidth = 'none';
        dialogConfig.width = '30%';
        this.dialog.open(AuthenticateLoggedUserComponent, dialogConfig).afterClosed().subscribe(result => { console.log(result); });
    }

    isClientInitiatory(){
        return this.loggedUserDetails.role.roleName && this.loggedUserDetails.role.roleName == 'ClientInitiator'? true: false;
    }

}
