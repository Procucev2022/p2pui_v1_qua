import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PoService } from 'src/app/shared/modules/common-share/services/po.service';
import { EncryDecryService } from 'src/app/shared/services';
import { AcceptPosComponent } from '../accept-pos/accept-pos.component';

@Component({
  selector: 'app-cancel-po',
  templateUrl: './cancel-po.component.html',
  styleUrls: ['./cancel-po.component.scss']
})
export class CancelPoComponent implements OnInit {
  reason: any = null;
  isInvalid: boolean;
  constructor(public dialogRef: MatDialogRef<AcceptPosComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private encryDecryService: EncryDecryService,
    private toaster: ToastrService,
    private modalDialog: MatDialog,
    private poService: PoService) { }

  ngOnInit() {
  }

  cancelPo(){
    this.isInvalid = false;
    if(this.reason){
      this.poService.cancelPoById({id: this.data.id}).subscribe((response) =>   {
        if(response['status']== 'Success'){
              this.toaster.success(response['message'], 'Success');
              this.dialogRef.close({event: 'close'});
           }
          });
    }else{
      this.isInvalid = true;
      this.toaster.warning('Please enter reason for cancellation', 'Warning');
    }
  }
}
