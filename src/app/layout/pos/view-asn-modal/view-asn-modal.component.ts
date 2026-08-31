import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PoService } from 'src/app/shared/modules/common-share/services/po.service';
import { EncryDecryService } from 'src/app/shared/services';
import { ViewPosComponent } from '../view-pos/view-pos.component';

@Component({
  selector: 'app-view-asn-modal',
  templateUrl: './view-asn-modal.component.html',
  styleUrls: ['./view-asn-modal.component.scss']
})
export class ViewAsnModalComponent implements OnInit {

  asnData: any;
  asnId: any;
  asnItemsData: any[];
  asnGridData;
  asnStatus: any;
  roleName: any;
  loggedUserDetails: any;
  constructor(public dialogRef: MatDialogRef<ViewPosComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private encryDecryService: EncryDecryService,
    private toaster: ToastrService,
    private modalDialog: MatDialog,
    private  poService: PoService) { }

  ngOnInit() {
    this.asnData = {...this.data};
    this.asnStatus = this.data.clientStatus.uiDisplay;
    const temp = JSON.parse(
      this.encryDecryService.get(localStorage.getItem('logData'))
    );
    this.loggedUserDetails = temp.details;
    this.roleName = this.loggedUserDetails.role.roleName;
    const tableHeaders = [
      { field: 'description', header: 'Description', isLink: false, width: '220px', fieldType: 'text' },
      { field: 'brand', header: 'Specification', isLink: false, width: '220px', fieldType: 'text' },
      { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '175px', fieldType: 'text'},
      { field: 'poQuantity', header: 'PO Quantity', isLink: false, width: '175px', fieldType: 'text' },
      { field: 'quantity', header: 'Quantity', isLink: false, width: '175px', fieldType: 'text' },
      { field: 'excludetaxamount', header: 'Basic Amount', isLink: false, width: '175px', fieldType: 'text'},
      { field: 'gstValue', header: 'GST', isLink: false, width: '175px', fieldType: 'text'},
      { field: 'totalamount', header: 'Total Amount', isLink: false, width: '155px', fieldType: 'text' } ];
   this.asnGridData = {
        actionEvents: [],
        gridTopButtonActions  : [],
        gridColumnData: [...this.data.asnItems],
        gridHeaders: [...tableHeaders],
        gridTitle: '',
        displayParentLabel: 'ASN Items ',
        displayParentId: '',
        rowEventClickEventName: '',
        editableCells : [],
        gridSelectionCheckbox: {
          showSelction: false,
          allowMultipleSelection: false
        }
      };
  }

  onClickCommonGrid(event) {

  }

  accpetASN() {
    this.poService.acceptASNById({id: this.asnData.id}).subscribe((res) => {
      if (res['status'] === 'Success') {
        this.toaster.success(res['message'], 'Success');
        this.dialogRef.close({event: 'close'});
      } else {
        this.toaster.error(res['message'], 'Failure');
      }
    });
  }

}
