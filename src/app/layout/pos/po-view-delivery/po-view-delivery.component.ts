import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { PoService } from 'src/app/shared/modules/common-share/services/po.service';
import { EncryDecryService } from 'src/app/shared/services';
import swal from 'sweetalert2';
import { AcceptPosComponent } from '../accept-pos/accept-pos.component';

@Component({
  selector: 'app-po-view-delivery',
  templateUrl: './po-view-delivery.component.html',
  styleUrls: ['./po-view-delivery.component.scss']
})
export class PoViewDeliveryComponent implements OnInit {
  deliveryData: any;
  deliveryItemsData: any;
  deliveryId: any  = '';
  isEditDeliveryDate: boolean;
  deliveryDate: Date;
  minDate: Date;
  allowEditForVendor: boolean;
  roleName: string;
  loggedUserDetails: any;
  constructor(public dialogRef: MatDialogRef<AcceptPosComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private encryDecryService: EncryDecryService,
    private toaster: ToastrService,
    private modalDialog: MatDialog,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private poService: PoService,
    public datepipe: DatePipe) { }

  ngOnInit() {
    const temp = JSON.parse(
      this.encryDecryService.get(localStorage.getItem('logData'))
    );
    this.loggedUserDetails = temp.details;
    this.roleName = this.loggedUserDetails.role.roleName;
    this.deliveryData = this.data.data;
    this.deliveryId = this.deliveryData.id;
    this.isEditDeliveryDate = false;
    this.allowEditForVendor = (this.deliveryData.clientStatus.status === 'REVISE_DATE_REQUESTED' ||  this.deliveryData.clientStatus.status === 'DELIVERY_NEW') &&  (this.data.loggedUserRole === 'Vendor' ? true : false);
    this.deliveryDate = new Date(this.deliveryData.deliveryDate);
    this.minDate = new Date();
    const gridHeaders = [
      {
          field: 'description',
          header: 'Description',
          isLink: false,
          width: '300px',
          isExceedContent: true

      },
      {
          field: 'brand',
          header: 'Specification',
          isLink: false,
          width: '140px',
          isExceedContent: true
      },
      {
          field: 'quantity',
          header: 'Delivery Quantity',
          isLink: false,
          width: '170px',
          isExceedContent: false
      },
      {
          field: 'unitofMeasures',
          header: 'UOM',
          isLink: false,
          width: '100px',
          isExceedContent: false
      },
      {
          field: 'excludetaxamount',
          header: 'Basic Amount',
          isLink: false,
          width: '150px',
          isExceedContent: false
      },
      {
          field: 'gstValue',
          header: 'GST Value',
          isLink: false,
          width: '125px',
          isExceedContent: false
      },
      {
          field: 'totalamount',
          header: 'Total Amount',
          isLink: false,
          width: '155px',
           isExceedContent: false
      },
  ];
  const actionEvents = [];

  this.deliveryItemsData = {
      actionEvents: [...actionEvents],
      gridTopButtonActions  : [],
      gridColumnData: [...this.data.data.deliveryItems],
      gridHeaders: [...gridHeaders],
      gridTitle: '',
      displayParentLabel: 'Delivery ID - ',
      displayParentId: this.deliveryData.deliveryId,
      rowEventClickEventName: '',
      editableCells : [],
      gridSelectionCheckbox: {
        showSelction: false,
        allowMultipleSelection: false
      }
  };
  }

  onClickCommonGrid(event) {
    console.log('even', event);
  }

  promptDeliveryDateConfirm(deliveryDateLabel: string): any {
    return swal({
      title: `<h4>Are you sure?</h4>`,
      html: `<h5>You will be ready to delivery on  <b>${deliveryDateLabel}</b><h5>`,
      type: 'warning',
      confirmButtonText: 'Yes',
      confirmButtonColor: '#006dd5',
      cancelButtonColor: '#d63636',
      showCancelButton: true,
      reverseButtons: true,
    });
  }

  onDeliveryDateDialogResult(result: any) {
    if (result?.value) {
      const obj = {
        id: this.deliveryData.id,
        deliveryDate: this.deliveryDate,
      };
      this.poService.setRequestDate(obj).subscribe((response) => {
        if (response['status'] === 'Success') {
          this.toaster.success('New Delivery Date submitted successfully', 'Success');
          this.dialogRef.close({ event: 'close' });
        }
      });
    }
  }

  changeDeliveryDate(isEdit, isApplyNewDate) {

    if (!isEdit && isApplyNewDate) {
      if (new Date(this.deliveryDate) <= new Date(this.deliveryData.deliveryDate)) {
        this.toaster.warning('Delivery date should not same or less than previous date', 'Warning');
        return;
      }
      const deliveryDate = this. datepipe. transform(this.deliveryDate, 'dd-MM-yyyy');
      this.promptDeliveryDateConfirm(deliveryDate).then((result) =>
        this.onDeliveryDateDialogResult(result)
      );
    }
    if ((!isEdit && !isApplyNewDate) || (isEdit && ! isApplyNewDate)) {
      this.deliveryDate = new Date(this.deliveryData.deliveryDate);
      this.isEditDeliveryDate = isEdit;
    }
  }

  accpetDelivery() {
    const obj = {'id': this.deliveryData.id};
    this.poService.acceptDelivery(obj).subscribe((response) => {
      if (response['status'] === 'Success') {
      this.toaster.success('Delivery aceepted successfully', 'Success');
      this.dialogRef.close({event: 'close'});
      }
    });
  }

}
