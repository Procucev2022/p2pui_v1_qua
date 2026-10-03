import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CreateRfqService } from '../services/create-rfq.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { SystemViewConfig } from 'src/app/app.config';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
    selector: 'app-cat-mgr-gmt-register-clients',
    templateUrl: './cat-mgr-gmt-register-clients.component.html',
    styleUrls: ['./cat-mgr-gmt-register-clients.component.scss']
})
export class CatMgrGmtRegisterClientsComponent implements OnInit {
    isLoaded: boolean = false;
    sourceList = [
        { label: 'Web App', value: 'Web App' },
        { label: 'WhatsApp', value: 'WhatsApp' }
    ];
    cached_clientList = [];
    clientTableHeaders: any = [
        { field: 'fullName', header: 'User Name', isLink: false, isExceedContent: true, width: '165px' },
        { field: 'companyName', header: 'Company Name', isLink: false, isExceedContent: true, width: '165px' },
        { field: 'phone', header: 'Phone Number', isLink: false, isExceedContent: true, width: '165px' },
        { field: 'username', header: 'User Email', isLink: false, isExceedContent: true, width: '165px' },
        { field: 'createdTS', header: 'Reg. Date', isLink: false, fieldType: 'date', isExceedContent: true, width: '215px' },
        { field: 'status', header: 'Status', isLink: false, isExceedContent: true, width: '135px' },
        { field: 'sourceType', header: 'Source Type', isLink: false, isExceedContent: false, width: '165px' },
    ];

    userTableHeaders = [
        { field: 'fullName', header: 'Name', fieldType: 'text', isLink: false, isExceedContent: true, width: '165px' },
        { field: 'username', header: 'Email Id', fieldType: 'text', isLink: true, isExceedContent: true, width: '225px' },
        { field: 'phone', header: 'Phone Number', fieldType: 'text', isLink: false, isExceedContent: true, width: '165px' },
        { field: 'createdTS', header: 'created Time', fieldType: 'date', isLink: false, isExceedContent: false, width: '165px' },
        { field: 'status', header: 'Status', fieldType: 'text', isLink: false, isExceedContent: false, width: '135px' },
    ];
    usersList = [];
    clientsList = [];
    selectedClientData: any;
    pageRecordSize: number;
    pageOptions: number[];
    defaultPermissions: any;
    loggedUserPermissions: any;
    loggedUserDetails: any;
    loggedUserName: any;
    selectedData: any;
    expandedRows = {};
    isShowChildGrid: boolean;
    roleName: any;
    currentView: any;
    isGMTView: boolean;
    @ViewChild('editClientTemplateRef') editClientTemplateRef: any;
    @ViewChild('editUserTemplateRef') editUserTemplateRef: any;
    clientForm: FormGroup;
    userForm: FormGroup;
    sectors = [
        "Steel", "Cement", "Sugar", "Retail", "Pharma", "Chemical",
        "Other Manufacturing", "Other Services", "Others"
    ];
    selectedUserData: any;
    constructor(private createRfqService: CreateRfqService, private encryDecryService: EncryDecryService,
        private catProcService: CatProcuRequestsService, private toaster: ToastrService, private dialog: MatDialog) { }

    ngOnInit() {
        this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        const temp = JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')));
        this.loggedUserPermissions = temp.details.listofPermission;
        this.loggedUserDetails = temp.details;
        this.loggedUserName = this.loggedUserDetails.username;
        this.roleName = this.loggedUserDetails.role.roleName;
        this.getRegClients();
        this.currentView = !localStorage.getItem('system-view') ? JSON.parse(localStorage.getItem('system-view')) : localStorage.getItem('system-view');

        this.isGMTView = [SystemViewConfig.GMT_BASIC, SystemViewConfig.GMT_BASIC_PLUS].includes(this.currentView) ? true : false;
        this.clientForm = new FormGroup({
            address1: new FormControl('', Validators.required),
            organizationPhonenumber: new FormControl('', Validators.required),
            companyName: new FormControl('', Validators.required),
            clientSector: new FormControl('', Validators.required),
            pan: new FormControl('', Validators.required)
        });
        this.userForm = new FormGroup({
            username: new FormControl(this.loggedUserName, Validators.required),
            phone: new FormControl('', Validators.required),
            fullName: new FormControl('', Validators.required)
        });
    }

    onSourceTypeChange(value) {
        if (value) {
            this.clientsList = this.cached_clientList.filter(ele => ele.sourceType == value);
        } else {
            this.clientsList = this.cached_clientList;
        }
    }

    onAcceptUserByClient(rowData: any, isAceept: boolean) {
        if (isAceept) {
            this.createRfqService.acceptGMTRegisteredClient({ 'id': rowData.id }).subscribe((res: any) => {
                if (res && res.status == 'Success') {
                    this.toaster.success(res.message, 'Success');
                    rowData.status = 'Accepted';
                    if (rowData.clientStatus) {
                        rowData.clientStatus.uiDisplay = 'Accepted';
                        rowData.clientStatus.status = 'USER_ACCEPTED';
                    } else {
                        rowData.clientStatus = { uiDisplay: 'Accepted', status: 'USER_ACCEPTED' };
                    }
                } else {
                    this.toaster.error(res.message, 'Error');
                }
            });
        } else {
            this.createRfqService.ignoreGMTRegisteredClient({ 'id': rowData.id }).subscribe((res: any) => {
                if (res && res.status == 'Success') {
                    this.toaster.success(res.message, 'Success');
                    rowData.status = 'Ignored';
                    if (rowData.clientStatus) {
                        rowData.clientStatus.uiDisplay = 'Ignored';
                        rowData.clientStatus.status = 'USER_IGNORED';
                    } else {
                        rowData.clientStatus = { uiDisplay: 'Ignored', status: 'USER_IGNORED' };
                    }
                } else {
                    this.toaster.error(res.message, 'Error');
                }
            });
        }
    }

    getCloseClients(selectedRowData, event) {
        this.expandedRows = {};
        this.isShowChildGrid = false;
    }

    getClients(selectedRowData, event) {
        this.isShowChildGrid = false;
        this.expandedRows = {};
        const thisRef = this;
        this.usersList = [];
        thisRef.expandedRows[selectedRowData.id] = 1;

        this.selectedData = [selectedRowData];
        this.selectedClientData = Object.assign({}, selectedRowData);
        this.getUsersByClient();
    }

    getUsersByClient() {
        this.catProcService.getClientUserByClient({ id: this.selectedClientData.id }).subscribe((res: any) => {
            this.usersList = Array.isArray(res) ? res.map(ele => {
                let statusDisplay = '-';
                if (ele && ele.clientStatus) {
                    if (ele.clientStatus.uiDisplay) {
                        statusDisplay = ele.clientStatus.uiDisplay;
                    } else if (ele.clientStatus.status === 'USER_ACCEPTED') {
                        statusDisplay = 'Accepted';
                    } else if (ele.clientStatus.status === 'USER_IGNORED') {
                        statusDisplay = 'Ignored';
                    } else {
                        statusDisplay = ele.clientStatus.status;
                    }
                }
                return { ...ele, status: statusDisplay };
            }) : [];
            this.isShowChildGrid = true;
        });
    }

    getRegClients() {
        this.createRfqService.getGMTRegisteredClientsWithUser().subscribe((res: any) => {
            if (res) {
                this.clientsList = Array.isArray(res) ? res.map(ele => {
                    const phoneNumber = ele.phone || ele.organizationPhonenumber || ele.phoneNumber || '';
                    let statusDisplay = '-';
                    if (ele.clientStatus) {
                        if (ele.clientStatus.uiDisplay) {
                            statusDisplay = ele.clientStatus.uiDisplay;
                        } else if (ele.clientStatus.status === 'USER_ACCEPTED') {
                            statusDisplay = 'Accepted';
                        } else if (ele.clientStatus.status === 'USER_IGNORED') {
                            statusDisplay = 'Ignored';
                        } else {
                            statusDisplay = ele.clientStatus.status;
                        }
                    }
                    return {
                        ...ele,
                        phone: phoneNumber,
                        organizationPhonenumber: phoneNumber,
                        status: statusDisplay,
                        sourceType: ele.sourceType ? (ele.sourceType == 'T' ? 'Web App' : (ele.sourceType == 'W' ? 'WhatsApp' : ele.sourceType)) : 'Web App'
                    };
                }) : [];
                this.cached_clientList = this.clientsList;
                this.isLoaded = true;
            }
        });
    }

    onGridAction(event: any) {
        console.log(event);
    }

    onEditClient(rowData: any, isClient) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.minHeight = '70vh';
        dialogConfig.maxWidth = 'none';
        dialogConfig.width = '30%';

        if (isClient) {
            this.selectedClientData = rowData;
            this.clientForm.patchValue({
                companyName: rowData.companyName,
                address1: rowData.address1,
                organizationPhonenumber: rowData.organizationPhonenumber,
                clientSector: rowData.clientSector ? rowData.clientSector : '',
                pan: rowData.pan
            });
            const dialogRef = this.dialog.open(this.editClientTemplateRef, dialogConfig).afterClosed().subscribe(result => { console.log(result); });
        } else {
            this.selectedUserData = rowData;
            this.userForm.patchValue({
                username: rowData.username,
                fullName: rowData.fullName,
                phone: rowData.phone,
            });
            const dialogRef = this.dialog.open(this.editUserTemplateRef, dialogConfig).afterClosed().subscribe(result => { console.log(result); });
        }
    }

    resetForm() {
        this.userForm.reset();
        this.clientForm.reset();
    }

    updateClientDetails() {
        if (this.clientForm.valid) {
            const obj: any = {
                id: this.selectedClientData.id,
                ...this.clientForm.value,
            };

            this.createRfqService.updateClientDetails(obj).subscribe((res: any) => {
                if (res.status == 'Success') {
                    this.toaster.success(res.message, 'Success');
                    this.dialog.closeAll();
                    this.getRegClients();
                } else {
                    this.toaster.error(res.message, 'Failed');
                }
            });
        } else {
            this.toaster.warning("Please fill the all the details", "Warning");
        }
    }

    updateUserDetails() {
        const isEmailChanged = this.selectedUserData.username && this.selectedUserData.username == this.userForm.value.username ? true : false;
        if (this.userForm.valid) {
            const obj: any = {
                id: this.selectedUserData.id,
                ...this.userForm.value,
                pan: this.selectedClientData.pan,
                emailMatched: isEmailChanged
            };

            this.createRfqService.updateUserDetails(obj).subscribe((res: any) => {
                if (res.status == 'Success') {
                    this.toaster.success(res.message, 'Success');
                    this.dialog.closeAll();
                    if (!isEmailChanged) {
                        this.getRegClients();
                    }
                    this.getUsersByClient();
                } else {
                    this.toaster.error(res.message, 'Failed');
                }
            });
        } else {
            this.toaster.warning("Please fill the all the details", "Warning");
        }
    }

    deleteUser(rowData: any) {
        const obj = { id: rowData.id };
        swal({
            title: '<h6>Please Confirm!!<h6>',
            html: `<h4>Are you sure you want to Delete User<br /> <b>${rowData.fullName}</b> ?</h4>`,
            confirmButtonText: 'Yes',
            confirmButtonColor: '#006dd5',
            cancelButtonColor: '#d63636',
            showCancelButton: true,
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                this.createRfqService.deleteUser(obj).subscribe((res: any) => {
                    if (res.statusCode == 'Success') {
                        this.toaster.success('User Deleted Successfully!', 'Success');
                        this.dialog.closeAll();
                        this.getUsersByClient();
                    } else {
                        this.toaster.error('User Deletion failed', 'Failed');
                    }
                });
            }
        });
    }
}
