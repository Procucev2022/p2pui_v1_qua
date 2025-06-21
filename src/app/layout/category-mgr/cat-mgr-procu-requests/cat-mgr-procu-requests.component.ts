import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CatProcuRequestsService } from '../services/cat-procu-requests.service';
import { AppConfig } from 'src/app/app.config';
import { EncryDecryService } from 'src/app/shared/services';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { ToastrService } from 'ngx-toastr';
import { CorrespondenceComponent } from 'src/app/shared/modules/common-share/components/correspondence/correspondence.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ClientService } from '../../client/services/client-service.service';
import { PrViewModalComponent } from '../../client/components/pr-view-modal/pr-view-modal.component';
import swal from 'sweetalert2';
import { ExcelService } from 'src/app/shared/modules/common-share/services/excel.service';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
    selector: 'app-cat-mgr-procu-requests',
    templateUrl: './cat-mgr-procu-requests.component.html',
    styleUrls: ['./cat-mgr-procu-requests.component.scss'],
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
export class CatMgrProcuRequestsComponent implements OnInit {
    procuRequestList: any = [];
    selectedData: any = [];
    minDate: Date = new Date();
    prClosureData: Date;
    @ViewChild('h1')
    h1: ElementRef;
    public min = new Date();
    excelData: any[] = [];

    procuTableHeaders: any = [
        { field: 'prId', header: 'PR Id'  , isLink: true, width: '160px', fieldType: 'text', isExceedContent: false},
        { field: 'prDescription', header: 'Description', isLink: false, width: '160px' , fieldType: 'text', isExceedContent: true},
        { field: 'procucevStatus', header: 'Status'  , isLink: false, width: '140px', fieldType: 'text', isExceedContent: false},
        // { field: 'priority', header: 'Priority' , isLink: false, width:'105px', fieldType: 'text', isExceedContent: true},
        { field: 'clientApprovalDate', header: 'Approved Date' , isLink: false, width: '160px', fieldType: 'date', isExceedContent: false},
        { field: 'dueDate', header: 'Due Date' , isLink: false, width: '160px', fieldType: 'date', isExceedContent: false},
        { field: 'ppoGenerated', header: 'PPOs'  , isLink: false, width: '120px', fieldType: 'text', isExceedContent: false},
        // { field: 'notQuotedCount', header: 'NotQuoted'  , isLink: false, width:'140px', fieldType: 'text', isExceedContent: false},
        { field: 'createdBy', header: 'Created By' , isLink: false, width: '145px', fieldType: 'text', isExceedContent: false}
    ];

    paginatoryDetails: any;


    selectedPrData: any;
    rfqsList: Object;
    pageRecordSize: any;
    pageOptions: any;
    prId: any;
    defaultPermissions: any;
    loggedUserPermissions: any;
    viewPrByIdData: any;
    prClosureDate: any;
    expandedRows: {} = {};


    constructor(private procuReqService: CatProcuRequestsService, private encryDecryService: EncryDecryService, private toaster: ToastrService,
        private modalDialog: MatDialog, private clientService: ClientService, private excelService: ExcelService, ) {}

    ngOnInit() {
        this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        const temp =  JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')) );

        this.loggedUserPermissions = temp.details.listofPermission;


        this.getPrLists();
    }

    getPrLists() {
        const reqObj = {
            'masterStatus': ['PC_PR_NEW', 'PC_PR_ACCEPTED', 'PC_PR_REJECTED', 'PC_PR_CLOSED', 'PPO_GENERATED']
      };
        this.procuReqService
            .getPrLists(reqObj)
            .subscribe(data => {
                this.procuRequestList = Array.isArray(data) ? data : [];
            });
        console.log('this.pre', this.procuRequestList);
    }

    // getRFQs list
    getRFQs(selectedRowData, event) {
      this.expandedRows = {};
      const thisRef = this;
      thisRef.expandedRows[selectedRowData.id] = 1;

        this.selectedData = [selectedRowData];
        this.selectedPrData = Object.assign({}, selectedRowData);
        this.prId =  event.srcElement.lastChild.data;
        console.log('event data', event.srcElement.lastChild.data);
        if(this.h1){
            this.h1.nativeElement.scrollIntoView({behavior: 'smooth'});
        }

    }

    getCloseRFQs(selectedRowData, event) {
      this.expandedRows = {};
  }

    getLineItems(event) {
        // alert('helel');
        console.log('clicked tab lienitmes', event);
    }

    onPage(event) {
        this.paginatoryDetails = event;
      }

      acceptPR(acceptModal) {
        if (this.selectedData.length === 0) {
          this.toaster.error('Please select atleast one PR', 'Warning');
          return;
        }
        let check = false;
        this.selectedData.forEach(ele => {
          if (ele.procucevStatus.uiDisplay !== 'New') {
            this.toaster.error('Please select only new PR\'s', 'Warning');
            check = true;
            return;
          }
        });
        if (check) {
          return;
        }
        this.prClosureDate = null;
        const modal =  this.modalDialog.open(acceptModal);
      }

      acceptPrData(acceptPRForm) {
        console.log('acceptModal', acceptPRForm);
      if (!acceptPRForm.form.valid) {
        this.toaster.error('Please select closure date', 'Warning');
        return;
      }
      const finalArray = [];
      this.selectedData.forEach(element => {
        finalArray.push({id: element.id, dueDate: this.prClosureDate});
      });
      console.log('finalArra', finalArray);

      this.procuReqService.prAccept(finalArray)
      .subscribe((res: any) => {
          if (res.status === 'Success' || res.statusCode === 'Success') {
              this.toaster.success(res.message, 'Success');
              this.getPrLists();
              this.modalDialog.closeAll();
          } else {
              this.toaster.error(res.message, 'Failure');
          }
      });
      }


    viewPrbyId(rowData) {
        const temp = {
            id: rowData.id
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

        // dialogConfig.disableClose = true;
        this.modalDialog.open(PrViewModalComponent, {autoFocus :true, data : this.viewPrByIdData,minWidth : 400, width: '80%', minHeight: 500  }).afterClosed()
        .subscribe(result => {
        //   this.getPrLists();
        });

    }


    viewCorresspondance(rowData) {
        rowData['commentRootPath'] = 'PR-COMMENTS-MODAL';
       const dialog =  this.modalDialog.open(CorrespondenceComponent,{autoFocus :true, data :  rowData ,width: '60%', maxWidth: '40%',
       minHeight: 297 , maxHeight: '70vh' });

       dialog.afterClosed().subscribe(result => {
            //  this.getPrLists();
        });
    }
    exportAsXLSX(): void {
      this.excelData = [];
      this.procuRequestList.forEach((data, i) => {
        const obj = {
          'PR Id' : data.prId,
          'Description' : data.prDescription,
          'Status' : data.procucevStatus.uiDisplay,
          'Priority' : data.priority,
          'Approved Date' : data.clientApprovalDate,
          'Due Date' : data.dueDate,
          'PPOs Generated' : data.ppoGenerated,
          'NotQuoted' : data.notQuotedCount,
          'Created By' : data.createdBy,
        };
        this.excelData.push(obj);
      });
      this.excelService.exportAsExcelFile(this.excelData, 'PR_Data');
    }

    onPPOcreated(event) {
      if (event.created) {
        this.getPrLists();
      }

    }

}
