import { Component, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { CorrespondenceComponent } from 'src/app/shared/modules/common-share/components/correspondence/correspondence.component';
import { PoService } from 'src/app/shared/modules/common-share/services/po.service';
import { EncryDecryService } from 'src/app/shared/services';
import { InvoicesService } from '../invoices.service';
import { ViewInvoiceModalComponent } from '../view-invoice-modal/view-invoice-modal.component';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.scss']
})
export class InvoicesListComponent implements OnInit, OnChanges {

  invoicesData: any  = {};
  invoicesList: any[];
  defaultPermissions: any;
  loggedUserDetails: any;
  loggedUserPermissions: any = [];
  roleName: any;
  gridHeaders = [];
  invoiceItemsData: {};
  invoiceId = '';
  constructor(private invoiceService: InvoicesService,
    private encryDecryService: EncryDecryService,
    private modalDialog: MatDialog,
    private toaster: ToastrService) { }

  ngOnInit() {
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
    this.loggedUserDetails = temp.details;
    this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
    this.getAllInvoices();
  }

  getAllInvoices() {
    this.invoicesData = null;
    this.gridHeaders = [
      { field: 'invoiceId', header: 'Invoice Id', isLink: false, width: '220px', fieldType: 'text' },
      { field: 'Poid', header: 'PO ID', isLink: false, width: '220px', fieldType: 'text' },
      { field: 'invoiceDesc', header: 'Description', isLink: false, width: '175px', fieldType: 'text' },
      { field: 'invoiceAmount', header: 'Invoice Amount', isLink: false, width: '175px', fieldType: 'text'},
      { field: 'status', header: 'Status', isLink: false, width: '175px', fieldType: 'text'},
      { field: 'createdTS', header: 'Creation Date', isLink: false, width: '155px', fieldType: 'date' } ];



    this.invoicesList = [];
    this.roleName = this.loggedUserDetails.role.roleName === 'Registration' ? 'Vendor' : this.loggedUserDetails.role.roleName;
    // console.log('role name ' + this.roleName);
    switch (this.roleName) {
      case 'Vendor':
        this.invoiceService.getAllInvoicesByVendor({ id: this.loggedUserDetails.org.id })
          .subscribe((res) => this.applyInvoiceResponse(res));
        break;
      case 'ClientInitiator':
        this.invoiceService.getAllInvoicesByClientId({ id: this.loggedUserDetails.org.id })
          .subscribe((res) => this.applyInvoiceResponse(res));
        break;
        case 'PRApprover':
          this.invoiceService.getAllInvoicesByClientId({ id: this.loggedUserDetails.org.id })
            .subscribe((res) => this.applyInvoiceResponse(res));
          break;
      case 'CategoryManager':
        this.invoiceService.getAllInvoices({ id: this.loggedUserDetails.org.id })
          .subscribe((res) => this.applyInvoiceResponse(res));
        break;
      default:
    }
  }
  applyInvoiceResponse(res: any) {
    if (Array.isArray(res)) {
      this.invoicesList = res;
    } else if (res && res['errorCode'] === 204) {
      this.invoicesList = [];
    } else {
      return;
    }
    this.invoicesList.forEach((ele) => ele['status'] = ele['status'] ? ele['status']['uiDisplay'] : ele['status']);
    this.setGridData();
    this.invoicesData['gridColumnData'] = this.invoicesList;
  }

  setGridData() {
    const actionEvents = [{
      name: 'View Invoice',
      className: 'fa fa-eye view',
      eventName: 'viewInvoice',
      iconType: 'regular',
    }];
    this.invoicesData = {
      actionEvents: [...actionEvents],
      gridTopButtonActions  : [],
      gridColumnData: [],
      gridHeaders: [...this.gridHeaders],
      gridTitle: '',
      displayParentLabel: 'Invoices',
      displayParentId: '',
      rowEventClickEventName: '',
      editableCells : [],
      gridSelectionCheckbox: {
        showSelction: false,
        allowMultipleSelection: false
      },
      scrollHeight: '214px'
    };
  }

  onClickCommonGrid(event) {
    this[event.eventName](event);
  }

  ngOnChanges() {
    if (this.invoicesData || this.invoicesList) {
      this.invoicesData['gridColumnData'] = this.invoicesList || [];
    }
  }

  commentsOnInvoices(event) {
    this.viewCorresspondance(event.rowData, 'INVOICES-COMMENTS-MODAL');
  }

  getInvoiceItemsAndDocs(event) {
    console.log('rowda', event);
    this.invoiceId = event.rowData.id;
    this.invoiceItemsData = event.rowData;
  }

  viewCorresspondance(rowData, path) {
    rowData['commentRootPath'] = path;
    const dialog = this.modalDialog.open(CorrespondenceComponent, {
      data: rowData,width: '60%', maxWidth: '40%',
      minHeight: 297 , maxHeight: '70vh'
    });

    dialog.afterClosed().subscribe((result) => {
      if (path === 'INVOICES-COMMENTS-MODAL') {
        this.getAllInvoices();
      }
    });
  }

  viewInvoice(event) {
    this.invoiceService.getInvoiceById({ id: event.rowData.id }).subscribe((res) => {
      if (res['id']) {
        const dialog = this.modalDialog.open(ViewInvoiceModalComponent, {
          width: '80%',
          minHeight: '400px',
          data: {response: res, invoiceStatus: event.rowData.status},
        });
        dialog.afterClosed().subscribe((result) => {
          if ( result && result['event']  && result['event'] === 'close') {
              this.getAllInvoices();
          }
        });
      } else {
        this.toaster.warning('Please try again later', 'Warning');
      }
    });
  }


}
