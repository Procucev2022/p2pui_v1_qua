import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { ClientService } from '../services/client-service.service';
import { CreatePrModalComponent } from '../components/create-pr-modal/create-pr-modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ViewPrModalComponent } from '../components/view-pr-modal/view-pr-modal.component';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
import { ApprovePrService } from '../services/approve-pr.service';
import { CorrespondenceComponent } from 'src/app/shared/modules/common-share/components/correspondence/correspondence.component';
import { PrViewModalComponent } from '../components/pr-view-modal/pr-view-modal.component';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoicesService } from '../../invoices/invoices.service';
import { ExcelService } from 'src/app/shared/modules/common-share/services/excel.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'app-client-procure-request',
    templateUrl: './client-procure-request.component.html',
    styleUrls: ['./client-procure-request.component.scss'],
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
export class ClientProcureRequestComponent implements OnInit, OnDestroy {

    prSummaryList: any = [];
    selectedData: any = [];
    selectedPrIdData: any = [];
    isVenodorApprover: boolean;
    prStatusData: any = [];
    prSummaryHeaders: any = [
        { field: 'prId', header: 'PR Id', isLink: false, width: '180px' , fieldType: 'text', head: 'PR Id' , isExceedContent: false },
        { field: 'prDescription', header: 'Description', isLink: false, width: '220px' , fieldType: 'text', head: 'Description', isExceedContent: true },
        { field: 'clientStatus', header: 'Status', isLink: false , width: '175px' , fieldType: 'text', head: 'Status', isExceedContent: false },
        { field: 'capexFlag', header: 'PR Type', isLink: false , width: '125px' , fieldType: 'text', head: 'PR Type', isExceedContent: false },
        { field: 'userStatus', header: 'Approver', isLink: false , width: '180px' , fieldType: 'text', head: 'User Status', isExceedContent: false },
        { field: 'createdTS', header: 'Creation Date', isLink: false, width: '170px' , fieldType: 'date', head: 'Creation Date', isExceedContent: false },
        { field: 'clientApprovalDate', header: 'Approval Date', isLink: false, width: '200px' , fieldType: 'date', head: 'Approval Date', isExceedContent: false },
        { field: 'procucevAcceptDate', header: 'Accepted Date', isLink: false , width: '200px' , fieldType: 'date', head: 'Accepted Date', isExceedContent: false },
        { field: 'dueDate', header: 'EDC', isLink: false , width: '160px' , fieldType: 'date', head: 'Expected Date Of Closure', isExceedContent: false }
    ];
    prIDTableHeaders: any = [
        { field: 'serialNo', header: 'S.No', isLink: false, width: '70px'  , isExceedContent: false},
        { field: 'description', header: 'Item Description', isLink: false, width: '210px'  , isExceedContent: true},
        { field: 'brand', header: 'Material Specification', isLink: false, width: '170px'  , isExceedContent: true},
        { field: 'unitofMeasures', header: 'Unit Of Measure', width: '170px' , isExceedContent: false},
        { field: 'quantity', header: 'Quantity', width: '130px' , isExceedContent: false}
    ];
    paginatoryDetails: any;
    selectedPrData: any;
    rfqsList: Object;
    pageRecordSize: any;
    pageOptions: any;
    loggedUserPermissions: any;
    loggedUserDetails: any;
    defaultPermissions: any;
    prId: any;
    viewPrByIdData: any = [];
    @ViewChild('h1')
    h1: ElementRef;
    queryParams: any;
    selectedPrDataObj: { prId: any; };
    showSecondScreen: boolean;
    showThriScreen: boolean;
    excelData: any[] = [];
    secondPageRecordSize: any;
    secondPageOptions: any;
    allRfqsList: any[] = [];
    selectedStatus: any;
    statusList = [
        {name: 'In Progress', code: 'CLIENT_PR_INPROGRESS'},
        {name: 'Submitted', code: 'CLIENT_PR_REQFORAPPROVAL'},
        {name: 'PPO Generated', code: 'PPO_GENERATED'},
        {name: 'Accepted', code: 'CLIENT_PR_PC_ACCEPTED'},
        {name: 'Approved', code: 'CLIENT_PR_APPROVED'},
        {name: 'Closed', code: 'CLIENT_PR_CLOSED'},
        {name: 'Rejected', code: 'CLIENT_PR_REJECT'},
        {name: 'All', code: 'All'}
    ];
    expandedRows: {} = {};
    constructor(private clientService: ClientService,
        private dialog: MatDialog,
        private toaster: ToastrService,
        private encryDecryService: EncryDecryService,
        private approvePrService: ApprovePrService, private ClientService: ClientService,
        private invoiceService: InvoicesService, private excelService: ExcelService) { }

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
        if (this.loggedUserDetails.role.roleName !== 'ClientInitiator') {
            this.prSummaryHeaders.push({ field: 'priority', header: 'Priority', isLink: false, width: '120px' , fieldType: 'text', head: 'Priority'},
            );
        }
        this.getPrSummaryData();
    }

    getStatus(id) {
        this.clientService.getPrTrackingStatus({ 'id': id }).subscribe((response) => {
            // if (response.status === 200) {
                const data = JSON.parse(JSON.stringify(response));
                this.prStatusData =  data.trackingStatus;
                return this.prStatusData.sort(function(a, b) {
                 const x = a['id']; const y = b['id'];
                 return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                });
            // } else {
            //     // this.tostrService.warning('Failed', response.errorMessage);
            //     // this.rfqsList = [];
            // }
        });


    }

    onSelectStatus(e) {
        this.prSummaryList = [];
        if (e.code !== 'All') {
            const obj = {
                'org': {'id': localStorage.getItem('orgId')},
                'masterStatus': [e.code]
            };
            this.clientService.getPRByClientStatus(obj).subscribe((data) => {
                this.prSummaryList = data;
            });
        } else {
            this.getPrSummaryData();
        }
    }

    getPrSummaryData() {
        this.clientService.$_prData.subscribe((res) => {
            if (res) {
                this.openCreateModal(res);
            }
        });
        let url;
        let req = {};
        if (this.loggedUserPermissions.includes('PC_C_PR_PAGE_APPROVE')) {
            url = AppApiConfig.GET_PR_FOR_APPROVER;
            req = this.loggedUserDetails;
        } else {
            url = AppApiConfig.GET_PR_FOR_INITIATOR;
            req = {
                org: {
                    id: localStorage.getItem('orgId')
                }

            };

            if(this.loggedUserDetails.role.roleName == "ClientInitiator"){
                req['initiator'] = {"id": this.loggedUserDetails.id}
            }
        }
        this.clientService
            .getPrSummaryData(req, url)
            .subscribe(data => {
                if (Array.isArray(data)) {
                    this.prSummaryList = data.map((ele: any) => {
                        if (ele.userStatus) {
                            if (ele['userStatus']['uiDisplay'] === 'ApprovalApproved') {
                                ele['status'] = 'Approved';
                            } else if (ele['userStatus']['uiDisplay'] === 'ApprovalPending') {
                                ele['status'] = 'Pending';
                            } else {
                                ele['status'] = ele['userStatus']['uiDisplay'];
                            }
                        }
                        return ele;

                    });
                }
                this.prSummaryList = Array.isArray(data) ? data : [];
        });
    }



    getLineItems(event) {
        console.log('clicked tab lienitmes', event);

    }

    onPage(event) {
        this.paginatoryDetails = event;
    }

    openCreateModal(rowData ) {
        this.showSecondScreen = true;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        this.selectedPrDataObj = null;
        if (rowData) {
            this.selectedPrDataObj = {prId: rowData.id};
        }
    }

    closeCreatePR() {
        this.showSecondScreen = false;
        this.getPrSummaryData();
    }
    approvePR() {
        if (this.selectedData.length) {
            swal({
                title: '<h5>Please Confirm!!</h5>',
                html: '<h3>Are you sure you want to accept?</h4>',
                confirmButtonText: 'Yes',
                confirmButtonColor: '#006dd5',
                cancelButtonColor: '#d63636',
                showCancelButton: true,
                reverseButtons: true
               }).then((result) => {
                if (result.value) {
                    const ids: any = [];
            this.selectedData.forEach(selected => {
                const obj = {
                    id: selected.id
                };
                ids.push(obj);
            });
            console.log(ids);
            const approverId = {
                'id' : localStorage.getItem('loggedId')
            };
            this.selectedData[0]['approverId'] = approverId;
            this.approvePrService.approvePRServices(ids)
                .subscribe((res: any) => {
                    if (res.status === 'Success' || res.status === 'success') {
                        this.toaster.success(res.message, 'Success');
                        this.getPrSummaryData();
                    } else if (res.status === 'Failure' || res.status === 'failure') {
                        this.toaster.error(res.message, 'Failure');
                    }
                });
                } else {
                    this.selectedData = [];
                }
            });


        } else {
            this.toaster.error('Please select a record', 'Failure');
        }
    }

    getCloseRowDetails() {
        this.expandedRows = {};
    }


    getRowDetails(rowData, event) {
        this.expandedRows = {};
        this.allRfqsList = [];
        const obj = {
            'id' : rowData.id
        };
        this.ClientService.getPRitemsByid(obj).subscribe((data: any) => {
            if (Array.isArray(data)) {
                this.allRfqsList = data;
                this.successChilds(data, rowData);
            } else {
                this.toaster.error(data.errorMessage, 'Error');
            }
        });

        // fetching status
        this.getStatus( rowData.id);
        // this.selectedData = [selectedRowData];
        // this.selectedPrData = Object.assign({}, selectedRowData);
        // this.prId = event.srcElement.lastChild.data;
        // this.h1.nativeElement.scrollIntoView({behavior: 'smooth'});
        // console.log('event data', event.srcElement.lastChild.data);
        // console.log(this.selectedPrData);
        // this.getPrdetails(selectedRowData);
    }
    successChilds(data, rowData) {
        const thisRef = this;
        this.prSummaryList.forEach(element => {
            if (rowData.id === element.id) {
                thisRef.expandedRows[element.id] = 1;
                element['childs'] = data;
            }
        });
    }

    viewPrbyId(rowData) {
        const temp = {
            id: rowData.id,
            approverId: {
                'id': localStorage.getItem('loggedId')
              }
          };
          this.clientService.getPrById(temp).subscribe((res: any) => {
            if (res) {
              this.viewPrByIdData = res || {};
              this.viewPrByIdModal();
            } else {
              this.toaster.error('Failed to Fetch data', 'Failure');
            }
          });

    }

    viewPrByIdModal() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = this.viewPrByIdData;
        dialogConfig.minWidth = 400;
        dialogConfig.minHeight = 500;
        dialogConfig.maxWidth = 'none';
        dialogConfig.width = '80%';
        const dialogRef = this.dialog.open(PrViewModalComponent, dialogConfig).afterClosed()
        .subscribe(result => {
            if (result.event === 'Success' || 'success') {
                this.getPrSummaryData();
            }
        });

    }

    viewCorresspondance(rowData, isInternal) {
    if (isInternal) {
        rowData['commentRootPath'] = 'PR-INTERNAL-COMMENTS-MODAL';
    } else {
        rowData['commentRootPath'] = 'PR-COMMENTS-MODAL';
    }

   const dialog =  this.dialog.open(CorrespondenceComponent, { data: rowData,width: '60%', maxWidth: '40%',
   minHeight: 297 , maxHeight: '70vh'  });

    dialog.afterClosed().subscribe(result => {
            this.getPrSummaryData();
    });
  }

  exportAsXLSX(): void {
    this.excelData = [];
    this.prSummaryList.forEach((data, i) => {
      const obj = {
        'PR Id' : data.prId,
        'Description' : data.prDescription,
        'Status' : data.clientStatus.uiDisplay,
        // "User Status" : data.userStatus,
        'Priority' : data.priority,
        'Date of Creation' : data.createdTS,
        'Approval Date' : data.clientApprovalDate,
        'Accepted Date' : data.procucevAcceptDate,
        'Expected Date Of Closure' : data.dueDate,
      };
      this.excelData.push(obj);
    });
    this.excelService.exportAsExcelFile(this.excelData, 'PR_Data');
  }

  ngOnDestroy() {
    this.clientService.$_prData.next(null);
  }
}
