import { Component, OnInit, ViewChild } from '@angular/core';
import { EncryDecryService } from 'src/app/shared/services';
import { BfsItemsService } from '../bfs-items.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { SystemViewConfig } from 'src/app/app.config';
import { forkJoin } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
    selector: 'app-bfs-items-list',
    templateUrl: './bfs-items-list.component.html',
    styleUrls: ['./bfs-items-list.component.scss', '../bfs-custom.scss']
})
export class BfsItemsListComponent implements OnInit {
  fileData:any;
    @ViewChild('selectOrgTemplate') selectOrgTemplate: any;
    @ViewChild('viewItemDetailsTemplate') viewItemDetailsTemplate: any;
    @ViewChild('addOrEditCommentsTemplate') addOrEditCommentsTemplate: any;
    itemCartTableHeaders: any = [
        { field: 'userName', header: 'User Name', isLink: false, width: '120px', fieldType: 'text', isExceedContent: true },
        { field: 'description', header: 'Description', isLink: false, width: '200px', fieldType: 'text', isExceedContent: true },
        { field: 'specification', header: 'Specification', isLink: false, width: '120px', fieldType: 'text', isExceedContent: true },
        { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        { field: 'itemNumber', header: 'Item Number', isLink: false, width: '190px', fieldType: 'text', isExceedContent: false },
        { field: 'availableQuantity', header: 'Available Qty.', isLink: false, width: '130px', fieldType: 'text', isExceedContent: false },
        { field: 'ageOfAsset', header: 'Age Of Asset', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        // { field: 'sellPrice', header: 'Buy Price(Per Unit)', isLink: false, width: '180px', fieldType: 'text', isExceedContent: false },
        // { field: 'discount', header: 'Discount(%)', isLink: false, width: '100px', fieldType: 'text', isExceedContent: false },
        { field: 'askPrice', header: 'Sale Price(Per Unit)', isLink: false, width: '180px', fieldType: 'text', isExceedContent: false },
        { field: 'category', header: 'Category', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
    ];

    bfsGroupList: any = [
        { value: 'networking', display: 'Networking' },
        { value: 'hardware', display: 'Hardware' },
        { value: 'software', display: 'Software' },
        { value: 'furniture', display: 'Furniture' },
        { value: 'others', display: 'Others' },
    ];

    commentsList :any =[
        "Need more details",
        "Request Images",
        "Need quality details",
        "Want material urgently",
        "Others"
    ]

    itemHeaders: any = [
        { field: 'description', header: 'Description', isLink: false, width: '200px', fieldType: 'text', isExceedContent: true },
        { field: 'specification', header: 'Specification', isLink: false, width: '230px', fieldType: 'text', isExceedContent: true },
        { field: 'availableQuantity', header: 'Available Qty.', isLink: false, width: '190px', fieldType: 'text', isExceedContent: false },
        // { field: 'sellPrice', header: 'Buy Price(Per Unit)', isLink: false, width: '200px', fieldType: 'text', isExceedContent: false },
        // { field: 'discount', header: 'Discount(%)', isLink: false, width: '170px', fieldType: 'text', isExceedContent: false },
        { field: 'askPrice', header: 'Sale Price(Per Unit)', isLink: false, width: '220px', fieldType: 'text', isExceedContent: false }
    ];

    bidItemObj: any = {
        discount: '',
        price: '',
        quantity: '',
        remarks: ''
    }
    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    itemList: any = [];
    roleName: any = '';
    selectedData: any = [];
    selectedRowData: any;
    loggedUserOwnPermissions: any = [];
    loggedUserDetails: any;
    isApprovalList: boolean = false;
    isCreateItemForm: boolean = false;
    itemForm: any;
    BOQDocument: any;
    isShowGrid: boolean = true;
    orgList: any = [];
    filtered_organizationList: any = [];
    filtered_userList: any = [];
    userList: any = [];
    searchedOrgString = '';
    boqFile: { fileName: any; file: string; };
    categoryList: any = [];
    filtered_categoryList: any = [];
    divisionsList: any = [];
    filtered_divisionsList = [];
    itemGridData: { gridHeaders: Array<any>, gridValue: Array<any>, actionsList: Array<any>, isMultiSelectAllows: boolean, gridEmptyMsg: string } = {
        gridHeaders: this.itemCartTableHeaders,
        gridValue: [],
        actionsList: [
            { 'eventName': 'onEditItem', 'eventImg': 'edit-data', 'eventDesc': 'Edit Item', eventType: 'img', eventText: '', className: ' ' }
            , { 'eventName': 'onDeleteItem', 'eventImg': 'delete', 'eventDesc': 'Delete Item', eventType: 'img', eventText: 'Accept', className: ' ' }
        ],
        isMultiSelectAllows: false, gridEmptyMsg: 'No Items Avaliable in Cart'
    };
    userHeaders: any = [
        { field: 'companyName', header: 'Buyer Name', isLink: false, width: '120px', fieldType: 'text', isExceedContent: true },
        { field: 'askPrice', header: 'Buyer Price(Per Unit)', isLink: false, width: '180px', fieldType: 'text', isExceedContent: false },
        { field: 'quantity', header: 'Quantity', isLink: false, width: '130px', fieldType: 'text', isExceedContent: false },
        { field: 'buyPrice', header: 'Sale Price(Per Unit)', isLink: false, width: '180px', fieldType: 'text', isExceedContent: false },
        // { field: 'discount', header: 'Discount(%)', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        { field: 'city', header: 'City', isLink: false, width: '120px', fieldType: 'text', isExceedContent: true },
        { field: 'status', header: 'Status', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false }
    ];
    requestUserGridData: { gridHeaders: Array<any>, gridValue: Array<any>, actionsList: Array<any>, isMultiSelectAllows: boolean, gridEmptyMsg: string } = {
        gridHeaders: this.userHeaders,
        gridValue: [],
        actionsList: [
            // { 'eventName': 'onEditItem', 'eventImg': 'edit-data', 'eventDesc': 'Edit Item' , eventType: 'img', eventText: '', className:' '}
            // , { 'eventName': 'onDeleteItem', 'eventImg': 'delete', 'eventDesc': 'Delete Item',  eventType: 'img', eventText: 'Accept', className:' '}
        ],
        isMultiSelectAllows: false, gridEmptyMsg: 'No Items Avaliable in Cart'
    }
    isEditForm: boolean;
    selectedOrgData: any = null;
    boqSelectedUser: any = null;
    defaultPermissions: any;
    isBFSView: boolean;
    currentView: any = '';
    expandedRows: any = {};
    isBidRequest: boolean;
    bidType: string = 'Price'
    requestedUsers: any = [];
    commentFileData: any;
    commentFilesDataList: any = [];
    commentFileType: any;
    @ViewChild('fileInput') fileInput: any;
    @ViewChild('fileInput3') fileInput3: any;
    isEditBFSItem: boolean = false;
    editBFSItemData: any = null;
    commentContent: any = { "text": '' };
    commentContentList: any = [];
    selectedIndex: number;
    @ViewChild('tabGrp') tabGrp:MatTabGroup;
    commentFileDataImg: string;
    commentFileTypeImg: any;
    commentFilesDataListImg: any = [];
    selecteEditItemRowData: any;
    searchedEmail: any;
    searchedPhone: any;

    constructor(private encryDecryService: EncryDecryService, private converSer: ConvertToBase64Service,
        private bfsItemService: BfsItemsService, private toaster: ToastrService, private loaderService: LoaderService, private bfsItemsService: BfsItemsService,
        private dialog: MatDialog,
        private authService:AuthenticationService) {

        const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
        this.loggedUserDetails = temp.details;
        this.roleName = this.loggedUserDetails.role.roleName;
        this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    }

    onCloseItemForm() {
        this.itemForm.reset();
        this.reloadGridComponent();
        this.itemGridData.gridValue = [];
        this.isCreateItemForm = false;
        this.selectedOrgData = null;
        this.userList = [];
        this.filtered_organizationList = [];
        this.orgList =[];
    }

    async onSubmitAddItem() {
        if (this.itemGridData.gridValue.length <= 0) {
            this.toaster.warning('Please fill the required fields');
            return;
        }
        const reqObj = await this.itemGridData.gridValue.map((ele: any) => {
            delete ele['id'];
            let finalItemObj = { ...ele, totalQuantity: ele.availableQuantity, userId: ele.user.id, org: { id: ele.org.id }, ageOfAsset: ele.ageOfAsset> 0 ? ele.ageOfAsset+ ' Months' : 'New Stock', sellPrice: ele.askPrice};
            delete finalItemObj['user'];
            return finalItemObj;
        })
        //, totalQuantity: this.itemForm.value['availableQuantity'], org: {id: this.selectedOrgData.id, userId: this.itemForm.value['user'].id}

        this.bfsItemsService.createItems(reqObj).subscribe((res: any) => {
            if (res && res.status == 'Success') {
                this.toaster.success(res.message, 'Success');
                this.isCreateItemForm = false;
                this.onCloseItemForm();
                this.getItemsList();
            } else {
                this.toaster.error(res.errorMessage, 'Error');

            }
        })
        // [{
        //     "description": "Hardisk",
        //     "specification": "HP",
        //     "totalQuantity": 100.0,
        //     "availableQuantity": 50.0,
        //     "category": "Sample Category",
        //     "itemNumber": "ITEM12345",
        //     "location": "Hyd",
        //     "ageOfAsset": 5.0,
        //     "sellPrice": 1000.0,
        //     "discount": 10.0,
        //     "askPrice": 900.0,
        //     "bfsGroup": "Networking",
        //     "userId": "76d8d712-053e-411f-b1e7-26e6ba0b68cb",
        //     "org": {
        //       "id": "570f5874-0676-42c7-a4c4-1b1712642bc8"
        //     }
        //     }]
    }
    ngOnInit() {
        this.getItemsList();
        this.bfsItemService.getGMTCategories().subscribe((res: any) => {
            this.categoryList = res || [];
        });
        this.bfsItemService.getGMTDivisions().subscribe((res: any) => {
            this.divisionsList = res || [];
        });
        this.currentView = !localStorage.getItem('system-view') ? JSON.parse(localStorage.getItem('system-view')) : localStorage.getItem('system-view');
        this.isBFSView = [SystemViewConfig.BFS_PRO].includes(this.currentView) ? true : false;
        this.itemForm = new FormGroup({
            id: new FormControl('MANUALENTRYID_' + Math.random()),
            description: new FormControl('', Validators.required),
            totalQuantity: new FormControl(''),
            unitofMeasures: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
            specification: new FormControl('', Validators.required),
            itemNumber: new FormControl(''),
            availableQuantity: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)]),
            ageOfAsset: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)]),
            sellPrice: new FormControl('' ),
            discount: new FormControl('' ),
            askPrice: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)]),
            category: new FormControl('', Validators.required),
            bfsGroup: new FormControl('', Validators.required),
            location: new FormControl('', Validators.required),
            user: new FormControl('', Validators.required),
            remarks: new FormControl(''),
            buyPriceDisclosure: new FormControl('true')
        });
        this.itemForm.patchValue({
            buyPriceDisclosure: true,
            discount: 0
        });
        this.itemForm.updateValueAndValidity();
    }

    onChangePriceDisclosure(value:boolean){
        if(value == true){
            this.itemForm.controls['askPrice'].disable();
            if( this.isEditBFSItem){
                this.itemForm.controls['discount'].setValue(this.editBFSItemData.discount);
                this.itemForm.controls['sellPrice'].setValue(this.editBFSItemData.sellPrice);
            }else{
                this.itemForm.controls['discount'].setValue('');
                this.itemForm.controls['sellPrice'].setValue('');
                this.itemForm.controls['discount'].setValue(0);
            }
 

        }else{
            this.itemForm.controls['askPrice'].setValidators([Validators.required]);
            this.itemForm.controls['sellPrice'].clearValidators();
            this.itemForm.controls['askPrice'].enable();
            if( this.isEditBFSItem){
                this.itemForm.controls['discount'].setValue(this.editBFSItemData.discount);
                this.itemForm.controls['sellPrice'].setValue(0);
                this.itemForm.controls['askPrice'].setValue(this.editBFSItemData.askPrice);
            }else{
                this.itemForm.controls['sellPrice'].setValue(0);
                this.itemForm.controls['discount'].setValue(0);
                this.itemForm.controls['askPrice'].setValue(0);
            }

        }
        this.itemForm.updateValueAndValidity();
    }

    createItem() {
        this.isCreateItemForm = true;
        this.isEditForm = false;
        this.commentFilesDataList = [];
        this.selectedOrgData = null;
        this.itemForm.reset();
        this.itemGridData.gridValue = [];
        this.selectedOrgData = null;
        this.userList = [];
        this.filtered_organizationList = [];
        this.orgList =[];

    }
    filterAutoCompleteDataByOrg(event, inputArrayName, outputArrayName, isStringType) {
        console.log('re', event)
    }

    onSelectOrgForm() {
        const dialogConfig = new MatDialogConfig();

        // dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = null;
        dialogConfig.minWidth = 400;
        dialogConfig.minHeight = 500;
        dialogConfig.maxWidth = 'none';
        dialogConfig.width = '50%';
        const dialogRef = this.dialog.open(this.selectOrgTemplate, dialogConfig).afterClosed().subscribe(result => {
            console.log(result);
            if (result && result.success) {
                // this.initialCalls(); //NTC
            }
        });

    }
    searchForOrgs() {
        this.filtered_organizationList = [];
        // write condition for email and phone number 10 digit validation check
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^\d{10}$/;

        if (!emailPattern.test(this.searchedEmail)) {
            this.toaster.warning('Please enter a valid Email / User ID');
            return;
        }

        if (!phonePattern.test(this.searchedPhone)) {
            this.toaster.warning('Please enter a valid Mobile Number');
            return;
        }

        if (this.searchedEmail && this.searchedPhone) {
            this.bfsItemService.getOrgSearchByEmailPhone({ 'username': this.searchedEmail, 'phone': this.searchedPhone }).subscribe((res: any) => {
                if (res &&  
                    res.id) {
                    this.filtered_organizationList = [res];
                }else{
                    this.filtered_organizationList = [];
                    this.toaster.warning('No Organizations found for the provided Email / User ID and Mobile Number');
                }
            })
        } else {
            this.toaster.warning('Please Enter Email / User ID and Mobile Number to search Organization');
            return;
        }
    }

    onChooseOrg(org) {

        this.bfsItemService.getUsersByOrg({ 'id': org.id }).subscribe((res: any) => {
            if (Array.isArray(res)) {
                if (res.length > 0) {
                    this.userList = res;
                    this.dialog.closeAll();
                    this.searchedOrgString = '';
                    this.selectedOrgData = org;
                    this.itemForm.patchValue({ 'org': org, user: null });
                } else {
                    this.toaster.warning('No Users found for selected Organization');
                    return;
                }

            } else {

            }
        })
    }
    filterAutoCompleteData(event, inputArrayName, outputArrayName, isStringType) {

        let filtered: any[] = [];
        this[outputArrayName] = [];
        const query = isStringType ? event.query.toLowerCase() : event.query;

        this[outputArrayName] = this[inputArrayName].filter(ele => ele != null && (ele.toLowerCase().includes(query)));
        if(this[outputArrayName].length<=0 && inputArrayName == 'categoryList'){
            this.itemForm.patchValue({category: ''})
        }
        if(this[outputArrayName].length<=0 && inputArrayName == 'divisionsList'){
            this.itemForm.patchValue({bfsGroup: ''})
        }
    }

    onPriceDiscountChange() {
        const sellPrice = this.itemForm.value['sellPrice'] ? this.itemForm.value['sellPrice'] : 0;
        const discount = this.itemForm.value['discount'] ? (this.itemForm.value['discount'] > 100 ? 100 : this.itemForm.value['discount']) : 0;
       const askPrc = Number(sellPrice - ((sellPrice * discount) / 100));
        const askPriceVal = askPrc <=100 ? askPrc.toFixed(2): askPrc.toFixed();
        this.itemForm.patchValue({ askPrice: askPriceVal });
    }

    onAddItemsToCart() {
        if (this.itemForm.invalid) {
            this.toaster.warning('Pls fill the required fields');
            return;
        }
        const formValue = this.itemForm.getRawValue();
        if (this.isEditForm) { //for existed item
            const index = this.itemGridData.gridValue.findIndex(ele => {
                return (ele.id == this.itemForm.value['id'])
            })
            this.itemGridData.gridValue[index] = {
                ...formValue, org: this.selectedOrgData,
                userName: this.itemForm.value.user.username,
                bfsDocuments: this.commentFilesDataList,
                sellPrice: formValue.buyPriceDisclosure == true ? (Number(formValue.sellPrice) <=100 ? Number(formValue.sellPrice).toFixed(2): Number(formValue.sellPrice).toFixed()):
                0,
                askPrice: Number(formValue.askPrice) <=100 ? Number(formValue.askPrice).toFixed(2): Number(formValue.askPrice).toFixed(),
                discount :Number(formValue.discount) <=100 ? Number(formValue.discount).toFixed(2):Number(formValue.discount).toFixed(),
                bfsImages: this.commentFilesDataListImg
            };
            this.toaster.success('Item Details updated in Cart!', 'Success');
            this.itemForm.reset();
            this.reloadGridComponent();
        } else { // for New Item
            const fullDate = this.getBFSItemNumber();
            this.itemForm.controls.id.setValue('MANUALENTRYID_' + Math.random());
            this.itemGridData.gridValue.push({
                ...formValue, org: this.selectedOrgData, userName: this.itemForm.value.user.username, itemNumber: fullDate,
                bfsDocuments: this.commentFilesDataList,
                sellPrice:formValue.buyPriceDisclosure == true ? (Number(formValue.sellPrice) <=100 ? Number(formValue.sellPrice).toFixed(2): Number(formValue.sellPrice).toFixed()):
                0,
                askPrice: Number(formValue.askPrice) <= 100 ?  Number(formValue.askPrice).toFixed(2):  Number(formValue.askPrice).toFixed(2),
                discount : Number(formValue.discount).toFixed(2),
                bfsImages: this.commentFilesDataListImg
            });
            this.toaster.success('Item added to Cart!', 'Success');

            this.commentFilesDataList = [];
            this.commentFileData = null;
            this.commentFileType = '';
            this.commentFilesDataListImg = [];
            this.commentFileDataImg = null;
            this.commentFileTypeImg = '';
            this.reloadGridComponent();
            const userValue = this.itemForm.value.user;
            this.itemForm.reset();
            this.itemForm.patchValue({ 'user': userValue })
        }
        this.commentFilesDataList = [];
    }

    getBFSItemNumber() {
        const x = new Date();
        const m = ((x.getMonth() + 1) < 10 ? '0' + (x.getMonth() + 1) : (x.getMonth() + 1)).toString();
        const d = (x.getDate() < 10 ? '0' + x.getDate() : x.getDate()).toString();
        const h = (x.getHours() < 10 ? '0' + x.getHours() : x.getHours()).toString();
        const mn = (x.getMinutes() < 10 ? '0' + x.getMinutes() : x.getMinutes()).toString();
        const s = (x.getSeconds() < 10 ? '0' + x.getSeconds() : x.getSeconds()).toString();
        const ms = (x.getMilliseconds() < 10 ? '0' + x.getMilliseconds() : x.getMilliseconds()).toString();
        const fullDate = 'BFS' + d + m + x.getFullYear() + h + mn + s+ ms;
        return fullDate;
    }
    onDeleteItem(rowData: any) {
        this.itemGridData.gridValue = this.itemGridData.gridValue.filter(ele => ele.id != rowData.id);
        this.reloadGridComponent();
    }
    onEditItem(rowData) {

        console.log("edit", rowData);
        if (this.itemForm) {
            this.isEditForm = true;
            this.itemForm.patchValue(rowData);
            this.selectedOrgData = rowData.org;
            this.commentFilesDataList = rowData.bfsDocuments;
            this.commentFilesDataListImg = rowData.bfsImages;
            this.commentFileDataImg = null;
            this.commentFileTypeImg = '';
            this.commentFileData = null;
            this.commentFileType = '';
            if(rowData && rowData.id && rowData.id.includes('MANUALENTRYID_')){
                this.tabGrp.selectedIndex =0;
            }

        }
    }
    reloadGridComponent() {
        this.isShowGrid = false;
        setTimeout(() => {
            this.isShowGrid = true;
        }, 100)
    }



    downloadSampleBOQ() {

        let link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.href = 'assets/images/BfsItems_SampleBoq.xlsx';
        // link.download = path;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    uploadBOQFile($event) {
        this.BOQDocument = $event.target.files[0];
        if ((this.BOQDocument.name.split('.').pop()).toLowerCase() !== 'xlsx' && (this.BOQDocument.name.split('.').pop()).toLowerCase() !== 'xls') {
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


    onUploadFile() {
        if (!(this.boqSelectedUser && this.selectedOrgData)) {
            this.toaster.warning("Please Select Organization & User details", "Warning");
            return;
        }
        this.loaderService.isLoading.next(true);
        this.convertBoQtoPrItems();
    }

    convertBoQtoPrItems() {

        if (this.boqFile) {
            this.bfsItemService.getBFSItemsByBOQFile({ boqfile: this.boqFile['file'] }).subscribe((res) => {
                if (Array.isArray(res)) {


                    res.forEach(element => {
                        element['isBoqItem'] = true;
                        const gridValue = { ...element,  id: 'MANUALENTRYID_' + Math.random(),availableQuantity: element.totalQuantity, itemNumber: this.getBFSItemNumber(), org: this.selectedOrgData, userName: this.boqSelectedUser.username, user: this.boqSelectedUser,
                        askPrice: this.calculateBuyPrice(element) , sellPrice: Number(element.sellPrice) <=100 ? Number(element.sellPrice).toFixed(2) : Number(element.sellPrice).toFixed() }
                        this.itemGridData.gridValue.push(gridValue);
                        this.reloadGridComponent();
                    });
                    this.removeFile();
                }
            }, error => {
                this.toaster.error("Something went wrong..!", "Error")
            });
        }
    }

    onGridAction(event: any) {
        this[event.eventData['eventName']](event.rowData);
    }

    calculateBuyPrice(rowData:any){
       const x =Number(rowData.sellPrice -(( rowData.sellPrice * rowData.discount)/100))
       return x <= 100 ? x.toFixed(2) : x.toFixed()
    }


    navigateToGMT(sysValue){
        this.authService.onSelectedSubscriptions(sysValue, this.loggedUserDetails, true);
    }

    getItemsList() {
        this.itemList = [];
        this.bfsItemService.getAllBFSItems({ id: this.loggedUserDetails.id }).subscribe((res: any) => {
            this.itemList = Array.isArray(res) ? [...res] : [];
        })

    }

    getCloseRFQs(rowData, $event) {
        console.log('closed')
        this.expandedRows = {};
    }
    getRFQs(rowData, $event) {
        console.log('closed1')
        this.selectedRowData = rowData;
        this.expandedRows = {};
        const thisRef = this;
        thisRef.expandedRows[rowData.id] = 1;
         this.expandedRows = this.expandedRows?.id === rowData.id ? null : rowData;
        this.getBuyerByBFS(rowData);
    }

        get expandedRowKeys() {
        return this.expandedRows ? { [this.expandedRows.id]: true } : {};
    }
    getBuyerByBFS(rowData: any) {
        this.requestedUsers = [];
        this.bfsItemService.getRequestedUsersByBFSForCM({ id: rowData.id }).subscribe((res: any) => {
            if (res && Array.isArray(res)) {
                this.requestedUsers = res.map((ele: any) => {
                    return { ...ele, status: ele.status.uiDisplay }
                })
                
             
            }else{
                this.requestUserGridData.gridValue = []
            }
             this.requestUserGridData.gridValue = [...this.requestedUsers]
        })
       
           this.reloadGridComponent();
    }

    //onUpdateBFSItem

    onUpdateBFSItem() {

    }

    onCloseEditForm() {
        this.isEditBFSItem = false;
        this.selectedRowData = null
        this.itemForm.reset();
        this.editBFSItemData = null;
    }
    onEditBFSItemDetails(rowData: any) {
        this.isEditBFSItem = true;
        this.selectedRowData = rowData;
        console.log("edit item", rowData)
        this.selectedRowData['bfsDocuments'] = [];
        this.bfsItemService.getBFSItemDetailsById({ id: rowData.id }).subscribe((res) => {
            if (res && res.id) {
                this.editBFSItemData = res;
                this.selectedOrgData = { ...res.org };
                this.itemForm.patchValue({ user: { id: res.userId } });
                this.itemForm.patchValue(this.editBFSItemData);
                // remove Months form age of asset
                const ageOfAssetValue = this.editBFSItemData.ageOfAsset ? this.editBFSItemData.ageOfAsset.toString().replace(' Months', '') : '';
                this.itemForm.patchValue({ ageOfAsset: ageOfAssetValue });
                this.itemForm.controls['user'].clearValidators();
                this.itemForm.controls['user'].updateValueAndValidity();
                   this.onChangePriceDisclosure(rowData.buyPriceDisclosure)
            }
        }, error => {

        })
    }

    updateBFSItemData() {
        if (this.itemForm.invalid) {
            this.toaster.warning('Pls fill the required fields');
            return;
        }
        const modifiedData = this.itemForm.getRawValue();
        this.editBFSItemData.bfsDocuments = this.editBFSItemData.bfsDocuments.map(ele => {
            if (ele && ele.id)
                delete ele['id']

            return ele;
        })
        delete this.editBFSItemData['user']
          this.editBFSItemData.bfsImages.forEach(ele =>{
            delete ele['id']
        })

        // add space Months to age of asset
        const ageOfAssetValue = modifiedData.ageOfAsset ? modifiedData.ageOfAsset.toString() + ' Months' : '';
        const requestedData = { ... this.editBFSItemData, ...modifiedData, askPrice: Number(modifiedData.askPrice).toFixed(2), sellPrice: modifiedData.buyPriceDisclosure == true? Number(modifiedData.sellPrice).toFixed(2): 0 , discount: Number(modifiedData.discount).toFixed(2), ageOfAsset: ageOfAssetValue }
        console.log('update', requestedData);

        this.bfsItemService.editBFSItemDetails(requestedData).subscribe((res) => {
            if (res && res.status == 'Success') {
                this.toaster.success(res.message, 'Success');
                this.getItemsList();
                this.onCloseEditForm();
                this.onCloseItemForm();
            } else {
                this.toaster.error(res.errorMessage, 'Error');

            }
        }, error => {

        })
    }


    onViewItemDetails(rowData: any, isBidRequest?: boolean) {
        this.isEditBFSItem = false;
        this.isBidRequest = isBidRequest ? true : false;
        const dialogConfig = new MatDialogConfig();

       this.selectedRowData ={'bfsDocuments' :[]}
         this.bfsItemService.getItemDetails({ id: rowData.id }).subscribe((res: any) => {
            if (res && res.id) {
                this.selectedRowData = { ...this.selectedRowData, ...res }
            }else{
                this.selectedRowData = { ...this.selectedRowData, ...rowData }
            }
        }) 
        this.bfsItemService.getDocsByBFSId({ id: rowData.id }).subscribe((res: any) => {
            if (Array.isArray(res)) {
                this.selectedRowData['bfsDocuments'] = [...res]
            }
        })
        // dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = null;
        dialogConfig.minWidth = 400;
        dialogConfig.minHeight = 500;
        dialogConfig.maxWidth = 'none';
        dialogConfig.width = this.isBidRequest ? '45%' : '35%';
        const dialogRef = this.dialog.open(this.viewItemDetailsTemplate, dialogConfig).afterClosed().subscribe(result => {

        });
    }


    onBidReqest(rowData: any) {
        this.onViewItemDetails(rowData, true);
        this.bidType = 'price'
        this.bidItemObj = {
            discount: '',
            price: '',
            quantity: ''
        }
    }

    onSubmitBid() {
        if (!(this.bidItemObj.price && this.bidItemObj.quantity && (this.bidItemObj.discount >0 || (this.bidItemObj.discount<=0 && !this.selectedRowData.buyPriceDisclosure)))   ) {
            this.toaster.warning('Please Enter All Mandatory Fields', 'Warning');
            return;
        }
        if(this.bidItemObj.quantity > this.selectedRowData.availableQuantity) {
            this.toaster.warning('Bid Quantity should  be less than Available Quantity', 'Warning');
            return;
        }

        const obj = {
            "buyPrice": this.selectedRowData.askPrice,
            "discount": Number(this.bidItemObj.discount).toFixed(2),
            "quantity": this.bidItemObj.quantity,
            "askPrice":  this.bidItemObj.price,
            "remarks": this.selectedRowData.remarks,
            "org": {
                "id": this.loggedUserDetails.org.id
            },
            "items": {
                "id": this.selectedRowData.id
            },
            "user": { "id": this.loggedUserDetails.id }
        }
        this.bfsItemService.requestBFSItem(obj).subscribe((res: any) => {
            if (res && res.status == 'Success') {
                this.toaster.success(res.message, 'Success');
                this.getItemsList();
                this.dialog.closeAll();
            } else {
                this.toaster.error(res.errorMessage, 'Error');

            }

        })
    }

    onChangeBidValue(isPriceChanged: boolean) {
        if (isPriceChanged) {
            this.bidItemObj.discount = this.bidItemObj.price < this.selectedRowData.sellPrice ? (((this.selectedRowData.sellPrice - this.bidItemObj.price) * 100) / this.selectedRowData.sellPrice).toFixed(2) : 0;
        } else {
            const bidPrice = (this.selectedRowData.sellPrice - ((this.selectedRowData.sellPrice * this.bidItemObj.discount) / 100));
            this.bidItemObj.price = this.bidItemObj.discount < 100 ?(bidPrice<=100 ? bidPrice.toFixed(2): bidPrice.toFixed()) : 0;
        }
    }



    fileUploadEvent(files, isEditForm: boolean) {
        const fileData = event;
        // console.log('event1', event);
        const file = files[0];
        this.converSer.getBase64(file).then((data: string) => {
            const temp = {
                fileName: file.name,
                file: data.split(',')[1],
            };

            if (isEditForm == true) {
                // For Single files upload
                this.commentFileData = data.split(',')[1];
                this.commentFileType = file.name;

                // For Muliple files upload
                this.editBFSItemData.bfsDocuments.push(temp);
                this.commentFileData = null;
                this.fileInput.value = null;
            } else {
                // For Single files upload
                this.commentFileData = data.split(',')[1];
                this.commentFileType = file.name;

                // For Muliple files upload
                this.commentFilesDataList.push(temp);
                this.commentFileData = null;
                this.fileInput.value = null;
            }

        });
    }

    fileUploadEventForImages(files, isEditForm: boolean) {
        const fileData = event;
        console.log('event1', files);
        const file = files[0];
        const imgFilesTypes = ['png', 'PNG', 'jpeg', 'JPEG', 'JPG', 'jpg']
        const fileType = file.name.split('.').length>0 ?  file.name.split('.')[file.name.split('.').length-1]: ''
        if(!imgFilesTypes.includes(fileType)){
            this.toaster.warning('Image Type should be JPEG/PNG/JPG', 'Warning');
            return;
        }
        this.converSer.getBase64(file).then((data: string) => {
            const temp = {
                fileName: file.name,
                file: data.split(',')[1],
            };

            if (isEditForm == true) {
                // For Single files upload
                this.commentFileDataImg = data.split(',')[1];
                this.commentFileTypeImg = file.name;

                // For Muliple files upload
                this.editBFSItemData.bfsImages.push(temp);
                this.commentFileDataImg = null;
                this.fileInput3.value = null;
            } else {
                // For Single files upload
                this.commentFileDataImg = data.split(',')[1];
                this.commentFileTypeImg = file.name;

                // For Muliple files upload
                this.commentFilesDataListImg.push(temp);
                this.commentFileDataImg = null;
                this.fileInput3.value = null;
            }

        });
    }


    removeFilesImg(i: any) {
        this.commentFilesDataListImg.splice(i, 1)
    }
    removeFilesListImg(i: any) {
        this.editBFSItemData.bfsDocumentsImg.splice(i, 1)
    }

    removeFilesImgForEdit(i: any) {
        this.editBFSItemData.bfsImages.splice(i, 1)
    }
    removeFilesListImgForEdit(i: any) {
        this.editBFSItemData.bfsDocumentsImg.splice(i, 1)
    }

    removeFiles(i: any) {
        this.commentFilesDataList.splice(i, 1)
    }
    removeFilesList(i: any) {
        this.editBFSItemData.bfsDocuments.splice(i, 1)
    }

    // for Create Comment by Buyer
    openCreateCommentsByBuyer(rowData) {
        this.selectedRowData = rowData;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = null;
        dialogConfig.minWidth = 400;
        dialogConfig.minHeight = this.roleName != "CategoryManager" ? 500 : 400;
        dialogConfig.maxWidth = 'none';
        dialogConfig.width = '45%';
        this.getCommentsByBuyer();

        this.commentContent.text = '';
        const dialogRef = this.dialog.open(this.addOrEditCommentsTemplate, dialogConfig).afterClosed().subscribe(result => {
           if(rowData.commentsFlag == true){
            this.bfsItemService.deactiveCommentFlag({id: rowData.id}).subscribe((res:any)=>{
                this.getItemsList();
            })
        }
        });

    }
    createCommentsByBuyer() {
        if (this.commentContent && this.commentContent.text) {
            this.bfsItemService.createCommentsByBuyer({
                "comments": this.commentContent.text,
                "commentedBy": this.loggedUserDetails.username,
                "companyName": this.loggedUserDetails.org.companyName,
                "user": { "id": this.loggedUserDetails.id },
                "items": { "id": this.selectedRowData.id }
            }).subscribe((res: any) => {
                if (res && res.status == 'Success') {
                    this.toaster.success(res.message, 'Success');
                    this.getItemsList();
                    this.dialog.closeAll();
                    this.commentContent.text = {};
                } else {
                    this.toaster.error(res.errorMessage, 'Error');

                }
            })
        }
        else {
            this.toaster.warning("Please Enter Your Comments", 'Success');
        }
    }

    getCommentsByBuyer() {
        if (this.roleName != "CategoryManager") {
            this.bfsItemService.getCommentsByBuyer(
                {
                    "user": { "id": this.loggedUserDetails.id },
                    "items": { "id": this.selectedRowData.id }
                }
            ).subscribe((res: any) => {
                this.commentContentList = Array.isArray(res) ? [...res] : []
            });
        } else {
            this.bfsItemService.getCommentsByCM(
                {
                    "items": { "id": this.selectedRowData.id }
                }
            ).subscribe((res: any) => {
                this.commentContentList = Array.isArray(res) ? [...res] : []
            });
        }


    }

    onCloseComments() {
        this.dialog.closeAll();
        this.commentContent.text = '';
    }

    tabChanged(event:any){
        console.log('event', event);
        this.selectedIndex = event.index;
    }

}
