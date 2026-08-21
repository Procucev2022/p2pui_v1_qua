import { state } from '@angular/animations';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router, UrlSerializer } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonGridData } from 'src/app/shared/modules/common-share/models/commonGridData';
import { PoService } from 'src/app/shared/modules/common-share/services/po.service';
import { EncryDecryService } from 'src/app/shared/services';
import swal from 'sweetalert2';
import { ClientService } from '../../client/services/client-service.service';
import { ViewPosComponent } from '../../pos/view-pos/view-pos.component';
import { ProcuProcureRequestsComponent } from '../../procuceve-admin/procu-procure-requests/procu-procure-requests.component';
import { InvoicesService } from '../invoices.service';

@Component({
  selector: 'app-view-invoice-modal',
  templateUrl: './view-invoice-modal.component.html',
  styleUrls: ['./view-invoice-modal.component.scss']
})
export class ViewInvoiceModalComponent implements OnInit {

  invoiceData: any;
  invoiceId: any;
  invoiceItemsData: any[];
  invoiceGridData;
  invoiceStatus: any;
  roleName: any;
  loggedUserDetails: any;
  additionalItemsGridData: CommonGridData;
  prData: any;
  constructor(public dialogRef: MatDialogRef<ViewPosComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private encryDecryService: EncryDecryService,
    private toaster: ToastrService,
    private router: Router, private modalDialog: MatDialog,
    private invoiceService: InvoicesService,
    private serializer: UrlSerializer,
    private clientService: ClientService) { }

  ngOnInit() {
    this.invoiceData = {...this.data.response};
    this.invoiceStatus = this.data.invoiceStatus;
    const temp = JSON.parse(
      this.encryDecryService.get('perm', localStorage.getItem('logData'))
    );
    this.loggedUserDetails = temp.details;
    this.roleName = this.loggedUserDetails.role.roleName;
    const tableHeaders = [
      { field: 'description', header: 'Description', isLink: false, width: '220px', fieldType: 'text' },
      { field: 'brand', header: 'Specification', isLink: false, width: '220px', fieldType: 'text' },
      { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '175px', fieldType: 'text'},
      { field: 'poQuantity', header: 'PO Quantity', isLink: false, width: '175px', fieldType: 'text' },
      { field: 'quantity', header: 'Received Quantity', isLink: false, width: '175px', fieldType: 'text' },
      { field: 'excludetaxamount', header: 'Basic Amount', isLink: false, width: '175px', fieldType: 'text'},
      { field: 'gstValue', header: 'GST', isLink: false, width: '175px', fieldType: 'text'},
      { field: 'totalamount', header: 'Total Amount', isLink: false, width: '155px', fieldType: 'text' } ];
   this.invoiceGridData = {
        actionEvents: [],
        gridTopButtonActions  : [],
        gridColumnData: [...this.data.response.invoiceItems],
        gridHeaders: [...tableHeaders],
        gridTitle: '',
        displayParentLabel: 'Invoice Items ',
        displayParentId: '',
        rowEventClickEventName: '',
        editableCells : [],
        gridSelectionCheckbox: {
          showSelction: false,
          allowMultipleSelection: false
        }
      };
      this.getAdditionalItemsData();
  }

  getAdditionalItemsData() {
    this.additionalItemsGridData = null;
    const tableHeaders = [
      { field: 'description', header: 'Description', isLink: false, width: '220px', fieldType: 'text' },
      { field: 'brand', header: 'Specification', isLink: false, width: '220px', fieldType: 'text' },
      { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '175px', fieldType: 'text'},
      { field: 'itemcode', header: 'Item Code', isLink: false, width: '175px', fieldType: 'text' },
      { field: 'quantity', header: 'Quantity', isLink: false, width: '175px', fieldType: 'text' },
      { field: 'vendorPrice', header: 'Price', isLink: false, width: '175px', fieldType: 'text'},

    ];
    const topButtons = [];

    this.invoiceService.getAdditionalItemsByInvoiceId({id: this.data.response.id}).subscribe((res) => {
      this.prData = {...res};
      console.log(this.prData);
      if (res['id']) {
      if (res['clientStatus'] && res['clientStatus']['status'] === 'VENDOR_INITIATED') {
        topButtons.push( {btnName: 'Convert To PR', btnColor: 'primary', btnEventName: 'converToPR'});
      }
      const response = Array.isArray(res['pritems']) ? res['pritems'] : [];
      this.additionalItemsGridData = {
        actionEvents: [],
        gridTopButtonActions  : this.roleName === 'ClientInitiator' ? [...topButtons] : [],
        gridColumnData: [...response],
        gridHeaders: [...tableHeaders],
        gridTitle: 'Additional Items',
        displayParentLabel: ' ',
        displayParentId: '',
        rowEventClickEventName: '',
        editableCells : [],
        gridSelectionCheckbox: {
          showSelction: false,
          allowMultipleSelection: false
        }
      };
    } else {
      this.additionalItemsGridData = {
        actionEvents: [],
        gridTopButtonActions  : this.roleName === 'ClientInitiator' ? [...topButtons] : [],
        gridColumnData: [],
        gridHeaders: [...tableHeaders],
        gridTitle: 'Additional Items',
        displayParentLabel: ' ',
        displayParentId: '',
        rowEventClickEventName: '',
        editableCells : [],
        gridSelectionCheckbox: {
          showSelction: false,
          allowMultipleSelection: false
        }
      };
    }
    });
  }
  onClickCommonGrid(event) {
    this[event.eventName](event);
  }

  promptAcceptInvoice(): any {
    return swal({
      title: '<h6>Please Confirm!!<h6>',
      html: '<h4>Are you sure you want to Accept Invoice?</h4>',
      confirmButtonText: 'Yes',
      confirmButtonColor: '#006dd5',
      cancelButtonColor: '#d63636',
      showCancelButton: true,
      reverseButtons: true
    });
  }

  onAcceptInvoiceDialogResult(result: any) {
    if (result?.value) {
      this.invoiceService.acceptInvoiceById({ id: this.invoiceData.id }).subscribe((res) => {
        if (res['status'] === 'Success') {
          this.toaster.success(res['message'], 'Success');
          this.dialogRef.close({ event: 'close' });
        } else {
          this.toaster.error(res['message'], 'Failure');
        }
      });
    }
  }

  accpetInvoice() {
    this.promptAcceptInvoice().then((result) => this.onAcceptInvoiceDialogResult(result));
  }

  converToPR(event) {
    const data = {
      id: this.prData['id'],
      invoice: this.prData['invoice'],
      po: this.prData['po'],
      prId: this.prData['id'],
      prItems: this.prData['pritems']
    };
    this.modalDialog.closeAll();
    this.router.navigate(['/client/procurerequest']);
    this.clientService.$_prData.next(data);
    this.clientService.$_prData.subscribe((res) => console.log(res));
  }


  zoomout() {
    this.dialogRef.updateSize('70%');
  }

  zoomin() {
      this.dialogRef.updateSize('90%');
  }
}
