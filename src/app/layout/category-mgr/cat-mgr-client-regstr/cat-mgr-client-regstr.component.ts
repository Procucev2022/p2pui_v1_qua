import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EncryDecryService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { CatProcuRequestsService } from '../services';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-cat-mgr-client-regstr',
    templateUrl: './cat-mgr-client-regstr.component.html',
    styleUrls: ['./cat-mgr-client-regstr.component.scss']
})
export class CatMgrClientRegstrComponent implements OnInit {
    clientList: any = [];
    selectedData: any[] = [];
    @ViewChild('addCostCenterElement') addCostCenterBtn: ElementRef;
    @ViewChild('addClientRegElement') addClientRegBtn: ElementRef;
    @ViewChild('addClientSubCatElement') addClientSubCatElement: ElementRef;
    @ViewChild('addDepartment') addDepartmentBtn: ElementRef;
    clientTableHeaders: any = [
        { field: 'companyId', header: 'Company Id', isLink: true, isExceedContent: false, width: '255px' },
        { field: 'companyName', header: 'Company Name', isLink: false, isExceedContent: true, width: '165px' },
        { field: 'clientVertical', header: 'Vertical', isLink: false, isExceedContent: true, width: '165px' },
        { field: 'clientCategory', header: 'Category', isLink: false, isExceedContent: true, width: '165px' },
        { field: 'city', header: 'City', isLink: false, isExceedContent: false, width: '165px' },
    ];
    isClientDataView = false;
    paginatoryDetails: any;
    costCentersList: any = [];
    clientRegionList: any = [{'region': ''}];
    clientSubCategoryList: any = [{'subCategory': ''}];
    clientDepartmentList: any = [];
    selectedPrData: any;
    rfqsList: Object;
    pageRecordSize: any;
    pageOptions: any;
    prId: any;
    defaultPermissions: any;
    loggedUserPermissions: any;
    clientVerticals: any;
    clientModel: any = new ClientModel();
    userModel: any = new UserModel();
    states: any = [];
    rolesList: any[] = [];
    DepartmentsLists: any = [];
    orgBranches: any[] = [{

        'branchName': '',
        'gstin': '',
        'address1': '',
        'city': '',
        'state': '',
        'zipCode': '',
    }];
    loggedUserData: any;
    createdUserList: any = [];
    clientDetails: any;


    constructor(private procuReqService: CatProcuRequestsService,
        private encryDecryService: EncryDecryService, private toaster: ToastrService,
        private modalDialog: MatDialog) { }

    ngOnInit() {
        this.states = AppApiConfig.STATES;
        this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        const temp = JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')));
        this.loggedUserData = temp;
        this.loggedUserPermissions = temp.details.listofPermission;
        this.getAllClients();
        this.getClientVerticals();
        this.procuReqService.clientRoles().subscribe(data => this.getrolesList(data));
    }

    getrolesList(data) {
        this.rolesList = data;
        // data.forEach(element => {
        //   this.rolesList.push(element.roleName)
        // });
    }

    getAllClients() {
        this.procuReqService.getClients().subscribe((response) => {
            console.log('clients', response);
            this.clientList = response || [];
        });
    }

    getClientVerticals() {
        this.procuReqService.getClientVerticals().subscribe((res) => {
            this.clientVerticals = res || [];
        });
    }

    removeCostCenter(i) {
        this.costCentersList.splice(i, 1);
    }
    addOneMoreCostCenter() {
        this.costCentersList.push({
            name: ''
        });

        this.addCostCenterBtn.nativeElement.focus();
    }

    removeClientRegion(i) {
        this.clientRegionList.splice(i, 1);
    }
    addOneMoreClientRegion() {
        this.clientRegionList.push({
            'region': ''
        });
        this.addClientRegBtn.nativeElement.focus();
    }

    removeClientSubCategory(i) {
        this.clientSubCategoryList.splice(i, 1);
    }
    addOneMoreClientSubCategory() {
        this.clientSubCategoryList.push({
            'region': ''
        });
        this.addClientSubCatElement.nativeElement.focus();
    }
    removeDepartment(i) {
        this.clientDepartmentList.splice(i, 1);
    }
    addOneMoreDepartment() {
        this.clientDepartmentList.push({
            name: ''
        });

        this.addDepartmentBtn.nativeElement.focus();
    }

    createClient(id) {
        this.costCentersList = [
            { name: '' }
        ];
        this.clientRegionList = [
            { 'region' : '' }
        ];
        this.clientSubCategoryList = [{
            'subCategory': ''
        }];
        this.clientDepartmentList = [
            { department: '' }
        ];
        this.isClientDataView = false;
        this.clientModel = new ClientModel();
        this.orgBranches = [{

            'branchName': '',
            'gstin': '',
            'address1': '',
            'city': '',
            'state': '',
            'zipCode': '',
        }];
        const config: MatDialogConfig = {
            width: ' 762px'
        };
        const dialog = this.modalDialog.open(id, config);

        dialog.afterClosed().subscribe(result => {
            this.getAllClients();
        });
    }
    getAllClientUsers() {
        const reqObj = {
            'id': this.selectedData[0].id
        };
        this.procuReqService.getClientUserByClient(reqObj).subscribe((data) => { this.createdUserList = data; });
    }

    addUser(user) {

        const reqObj1 = {
            'id': this.selectedData[0].id
        };
        this.procuReqService.getclientdepartmentByclient(reqObj1).subscribe((data) => { this.DepartmentsLists = data; });

        this.userModel = new UserModel();
        const config: MatDialogConfig = {
            width: ' 1000px'
        };
        const dialog = this.modalDialog.open(user, config);
        this.getAllClientUsers();
        dialog.afterClosed().subscribe(result => {
            //  this.getAllClients();
        });
    }
    onSubmit(form: NgForm) {
        if (form.form.valid) {
            if (this.clientModel.id) {
                const f: any = Object.assign({}, form.form.value);

                const obj = {
                    id: this.clientModel.id,
                    companyName: f.companyName,
                    clientVertical: f.clientVertical,
                    clientCategory: f.clientCategory,
                    city: f.city,
                    state: f.state,
                    pan: f.pan,
                    gstin: f.gstin,
                    tan: f.tan,
                    address1: f.address1,
                    others: f.others,
                    // orgBranches: this.orgBranches,
                    costCenter: this.costCentersList,
                    clientRegion: this.clientRegionList,
                    clientSubCategory: this.clientSubCategoryList,
                    clientDepartment: this.clientDepartmentList,
                    zipCode: f.zipCode,
                    'orgType': {
                        'id': '3001'
                    }
                };
                console.log('save details', this.clientModel);
                this.procuReqService.updateClient(obj).subscribe((res) => {
                    if (res['statusCode'] === 'Success' || res['status'] === 'Success') {
                        this.toaster.success('Client details updated successfully', 'Success');
                        this.getAllClients();
                        this.modalDialog.closeAll();
                    } else {
                        this.toaster.error('Client details updation failed', 'Failure');
                    }
                });
            } else {

                console.log(this.loggedUserData);
                const f: any = Object.assign({}, form.form.value);
                const obj = {
                    companyName: f.companyName,
                    clientVertical: f.clientVertical,
                    clientCategory: f.clientCategory,
                    city: f.city,
                    state: f.state,
                    pan: f.pan,
                    gstin: f.gstin,
                    tan: f.tan,
                    address1: f.address1,
                    others: f.others,
                    // orgBranches: this.orgBranches,
                    zipCode: f.zipCode,
                    costCenter: this.costCentersList,
                    clientRegion: this.clientRegionList,
                    clientSubCategory: this.clientSubCategoryList,
                    clientDepartment: this.clientDepartmentList,
                    'orgType': {
                        'id': '3001'
                    }
                };
                console.log('save details', this.clientModel);
                this.procuReqService.createClientRegistration(obj).subscribe((res) => {
                    if (res['statusCode'] === 'Success' || res['status'] === 'Success') {
                        this.toaster.success('Client Registration done successfully', 'Success');
                        this.getAllClients();
                        this.modalDialog.closeAll();
                    } else if (res['errorCode'] === 500) {
                        this.toaster.error('The client Details are already associated with Procucev. Please re-validate.');
                    } else {
                        this.toaster.error('Client Registration failed', 'Error');
                    }
                });
            }

        } else {
            this.toaster.error('Please fill the required fields', 'Error');
        }

    }

    addOneMoreBranch(i) {
        this.orgBranches.push({
            'branchName': '',
            'gstin': '',
            'address1': '',
            'city': '',
            'state': '',
            'zipCode': '',
        });
    }

    removeBranch(i) {
        this.orgBranches.splice(i, 1);
    }

    onEditClient(modal, rowData, isView) {
        this.costCentersList = [];
        this.clientDepartmentList = [];
        this.clientRegionList = [];
        this.clientSubCategoryList = []
        this.isClientDataView = isView;

        this.procuReqService.getClientDetails({id: rowData.id}).subscribe((res) => {
            if (res && res.id) {
                this.clientDetails = res;
                this.buildViewOrEditModalData(res, modal)
             }
        });



    }

    buildViewOrEditModalData(rowData, modal){
        this.clientModel = new ClientModel();
        this.orgBranches = [{

            'branchName': '',
            'gstin': '',
            'address1': '',
            'city': '',
            'state': '',
            'zipCode': '',
        }];
        // rowData.costCenter = [
        //   {name: 'ab'},
        //   {name: 'cd'},
        //   {name: 'de'},
        // ]
        if (rowData.costCenter && rowData.costCenter.length > 0) {
            rowData.costCenter.forEach(element => {
                this.costCentersList.push({ 'name': element.name });
            });
        } else {
            this.costCentersList.push({ 'name': '' });
        }
        if (rowData.clientRegion && rowData.clientRegion.length > 0) {
            rowData.clientRegion.forEach(element => {
                this.clientRegionList.push(element);
            });
        } else {
            this.clientRegionList.push({ 'region': '' });
        }
        if (rowData.clientSubCategory && rowData.clientSubCategory.length > 0) {
            rowData.clientSubCategory.forEach(element => {
                this.clientSubCategoryList.push(element);
            });
        } else {
            this.clientSubCategoryList.push({ 'subCategory': '' });
        }
        if (rowData.clientDepartment && rowData.clientDepartment.length > 0) {
            rowData.clientDepartment.forEach(element => {
                this.clientDepartmentList.push({ 'department': element.department });
            });
        } else {
            this.clientDepartmentList.push({ 'department': '' });
        }
        const config: MatDialogConfig = {
            width: ' 762px'
        };
        this.clientModel = Object.assign({}, rowData);
        console.log('edit details', this.clientModel);
        const dialog = this.modalDialog.open(modal, config);

        dialog.afterClosed().subscribe(result => {
            this.getAllClients();
        });
    }

    createdUserHeaders = [
        { field: 'firstName', header: 'First Name', isLink: true },
        { field: 'lastName', header: 'Last Name', isLink: true },
        { field: 'username', header: 'Email', isLink: true },
        { field: 'phone', header: 'Phone', isLink: true },
        { field: 'role', header: 'Role', isLink: true },

    ];

    onAddUserSubmit(userForm: NgForm) {
        const reqObj = {
            'firstName': this.userModel.firstName,
            'lastName': this.userModel.lastName,
            'username': this.userModel.email,
            'phone': this.userModel.phone,
            'org': {
                'id': this.selectedData[0].id
            },
            'role': {
                'id': this.userModel.role
            },
            'department': {
                'id': this.userModel.department
            }

        };
        this.procuReqService.clientuserCreation(reqObj).subscribe(data => this.successCallBack(data));
    }
    successCallBack(data: any) {
        console.log(data);
        if (data.statusCode !== 'Success') {
            this.toaster.error(data.errorMessage, 'Failure');
        } else {
            this.getAllClientUsers();
            this.toaster.success('User Added Successfully', 'Success');
        }
        // this.createdUserList.push(this.userModel)
    }

}

export class ClientModel {
    companyName: string;
    id: any;
    clientVertical: string;
    clientCategory: string;
    city: string;
    state: string;
    pan: string;
    gstin: string;
    tan: string;
    address1: string;
    others: any;
    orgBranches: any[] = [];
    zipCode: any;
}

export class UserModel {
    firstName: string;
    lastName: string;
    phone: number;
    email: string;
    role: any;
    department: any;
}
