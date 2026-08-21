import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { CommonGridData } from 'src/app/shared/modules/common-share/models/commonGridData';
import { PoService } from 'src/app/shared/modules/common-share/services/po.service';
import { EncryDecryService } from 'src/app/shared/services';
import { CreateEditAdvancePaymentRequestsComponent } from '../create-edit-advance-payment-requests/create-edit-advance-payment-requests.component';
import { InvoicesService } from '../invoices.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AppConfig } from 'src/app/app.config';


@Component({
  selector: 'app-advance-payment-requests',
  templateUrl: './advance-payment-requests.component.html',
  styleUrls: ['./advance-payment-requests.component.scss'],
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
export class AdvancePaymentRequestsComponent implements OnInit, OnChanges {

  poGridData: any;
  advancePaymentsList = [];
  gridHeaders: any[];
  loggedUserDetails: any;
  defaultPermissions: any;
  loggedUserPermissions: any;
  roleName: any;
  advancePaymentGridData: CommonGridData;
  poId: any;
  pageRecordSize: any;
  pageOptions: any;
  paginatoryDetails: any;
  selectedData: any[] = [];
  expandedRows: {} = {};
  subGridColSpan: number = 6;

  constructor(private invoiceService: InvoicesService,
    private encryDecryService: EncryDecryService,
    private modalDialog: MatDialog,
    private toaster: ToastrService,
    private poService: PoService) { }

    ngOnInit() {
      this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
      this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;

      this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
      const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
      this.loggedUserDetails = temp.details;
      this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
      this.getAllPos();
    }

    onPage(event) {
      this.paginatoryDetails = event;
    }

    getAllPos() {
      this.poGridData = null;
      this.gridHeaders = [
        { field: 'poId', header: 'PO Id', isLink: false, width: '220px', fieldType: 'text' , isExceedContent: false},
        { field: 'companyName', header: 'Company Name', isLink: false, width: '175px', fieldType: 'text' , isExceedContent: true},
        { field: 'podesc', header: 'Po Desc.', isLink: false, width: '175px', fieldType: 'text', isExceedContent: true},
        { field: 'poValue', header: 'PO Value', isLink: false, width: '115px', fieldType: 'text', isExceedContent: false},
        { field: 'advanceAmount', header: 'Advance Amount', isLink: false, width: '145px', fieldType: 'text' , isExceedContent: false},

       ];

      this.roleName = this.loggedUserDetails.role.roleName === 'Registration' ? 'Vendor' : this.loggedUserDetails.role.roleName;
       if(this.roleName === 'Vendor'){
        this.gridHeaders.push( { field: 'action', header: 'Action', isLink: true, width: '145px', fieldType: 'text' });
        this.subGridColSpan = 7;
       }
      this.advancePaymentsList = [];
      const methodName = (this.roleName === 'Vendor' ? 'getPosByVendorAndAdvance' : (this.roleName === 'ClientInitiator' ? 'getPosByClientAndAdvance' : (this.roleName === 'CategoryManager' ? 'getPosByAdvance' : (this.roleName === 'PRApprover' ? 'getPosByClientAndAdvance' : null))));

      if (methodName) {
        this.invoiceService[methodName]({id:  this.loggedUserDetails.org.id }).subscribe((res) => {
          if (Array.isArray(res)) {
            this.advancePaymentsList = res;
            this.setPoGridData();
            this.poGridData['gridColumnData'] =  [...res];
          }
        });
      }

    }

  setPoGridData() {
    const actionEvents = [];
    if (this.roleName === 'Vendor') {
      actionEvents.push({
        name: '+ Adv. Payment',
        className: 'create-adv-icon',
        eventName: 'onCreateAdvancePayment',
        iconType: 'regular',
      });
    }
    this.poGridData = {
      actionEvents: [...actionEvents],
      gridTopButtonActions  : [],
      gridColumnData: [],
      gridHeaders: [...this.gridHeaders],
      gridTitle: 'Advance Payments',
      displayParentLabel: '',
      displayParentId: '',
      rowEventClickEventName: 'getAdvancePaymentList',
      editableCells : [],
      gridSelectionCheckbox: {
        showSelction: false,
        allowMultipleSelection: false
      }
    };
  }
  onClickCommonGrid(event) {
    console.log('event name ---> ' + event.eventName);
    this[event.eventName](event);
  }

  getCloseAdvancePaymentList() {
    this.expandedRows = {};
  }

  getAdvancePaymentList(event) {
    this.expandedRows = {};
    const thisRef = this;
    thisRef.expandedRows[event.id] = 1;
    console.log('event', event);
    this.poId = event.poId;
    this.invoiceService.getPoAdvanceByPo({id: event.id}).subscribe((res) => {
      this.advancePaymentGridData = null;
      this.setAdvancePaymentGridData(res);
    });
  }
  setAdvancePaymentGridData(res) {
    const response = Array.isArray(res) ? res : [];
    response.forEach(ele => {
      ele['status'] = ele['status']['uiDisplay'] ;
      ele['isIncludingGST'] = ele['includingGst'] ? 'Yes' : 'No';
      ele['showSpecialIcon'] = ele['status'] !== 'Accepted';
    }

    );

    const actionEvents = [
    {
      name: 'View Payment',
      className: 'fa fa-eye view',
      eventName: 'onViewAdvancePayment',
      iconType: 'regular',
    }];
    if (this.roleName === 'Vendor') {
      actionEvents.push({
        name: 'Edit Payment',
        className: 'fa fa-pencil',
        eventName: 'editAdvancePayment',
        iconType: 'special',
      }, );
    }

    const gridHeaders = [
    { field: 'advanceAmount', header: 'Advance Amount', isLink: false, width: '220px', fieldType: 'text' },
    { field: 'advanceMode', header: 'Advance Mode', isLink: false, width: '175px', fieldType: 'text' },
    { field: 'advanceValue', header: 'Advance Value', isLink: false, width: '175px', fieldType: 'text'},
    { field: 'isIncludingGST', header: 'Is Including GST', isLink: false, width: '175px', fieldType: 'text'},
    { field: 'status', header: 'Status', isLink: false, width: '155px', fieldType: 'text' } ];

    this.advancePaymentGridData = {
      actionEvents: [...actionEvents],
      gridTopButtonActions  : [ ],
      gridColumnData: response,
      gridHeaders: gridHeaders,
      gridTitle: 'Advance Payments',
      displayParentLabel: '',
      displayParentId: '',
      rowEventClickEventName: 'getAdvancePaymentList',
      editableCells : [],
      gridSelectionCheckbox: {
        showSelction: false,
        allowMultipleSelection: false
      }
    };
  }


  onViewAdvancePayment(event) {
    this.invoiceService.getPOAdvanceById({id: event.rowData.id}).subscribe((res) => {
      if (res['id']) {
        res['isNewPayment'] = false;
        res['isView'] = true;
        res['clientId'] = event.rowData.clientId;
        res['po'] = event.rowData.id;
        this.modalDialog.open(CreateEditAdvancePaymentRequestsComponent, {
          width: '60%',
          minHeight: '450px',
          data: res,
        }).afterClosed().subscribe((result) => {
          console.log('result.event', result.event);
          if (result && result.event === 'close') {
            this.advancePaymentGridData = null;
            this.getAdvancePaymentList({rowData : {id: event.rowData.id}});
          }
        });
      }
    });
  }

  onCreateAdvancePayment(rowData) {
   this.poService.getItemsByPO({id: rowData.id}).subscribe((res) => {
     let basicTotal = 0;
     Array.isArray(res) ? res.forEach((ele) => {
        basicTotal = basicTotal + ele.excludetaxamount; }) : basicTotal = 0  ;
     rowData['basicAmount'] = basicTotal;
     rowData['isNewPayment'] = true;
     rowData['isView'] = false;
    this.modalDialog.open(CreateEditAdvancePaymentRequestsComponent, {
      width: '60%',
      minHeight: '450px',
      data: rowData,
    }).afterClosed().subscribe((result) => {
      console.log('result.event', result.event);
      if (result && result.event === 'close') {
        this.advancePaymentGridData = null;
        this.getAdvancePaymentList({rowData : {id: rowData.id}});
      }
    });
   }, err => {
     this.toaster.error(err, 'Failed to load data');
   });

  }

  editAdvancePayment(event) {
    this.invoiceService.getPOAdvanceById({id: event.rowData.id}).subscribe((res) => {
      if (res['id']) {
        res['isNewPayment'] = false;
        res['clientId'] = event.rowData.clientId;
        res['po'] = event.rowData.id;
        res['isView'] = false;
        this.modalDialog.open(CreateEditAdvancePaymentRequestsComponent, {
          width: '60%',
          minHeight: '450px',
          data: res,
        }).afterClosed().subscribe((result) => {
          console.log('result.event', result.event);
          if (result && result.event === 'close') {
            this.advancePaymentGridData = null;
            this.getAdvancePaymentList({rowData : {id: event.rowData.id}});
          }
        });
      }
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.poGridData.currentValue) {
      console.log('c', this.poGridData);
    }
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.

  }

}
