import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { EncryDecryService } from 'src/app/shared/services';
import { ApprovePrService } from '../../services/approve-pr.service';

@Component({
  selector: 'app-accept-pr-view',
  templateUrl: './accept-pr-view.component.html',
  styleUrls: ['./accept-pr-view.component.scss']
})
export class AcceptPrViewComponent implements OnInit {
  acceptPrByIdList: any;
  prClosureDate: any;
  minDate: Date = new Date();

  constructor(private toaster: ToastrService,
    private approvePrService: ApprovePrService,
    private dialogRef: MatDialogRef<AcceptPrViewComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private encryDecryService: EncryDecryService,
    private procuReqService: CatProcuRequestsService,
    private modalDialog: MatDialog,
    // private activeModal : NgbActiveModal,
    private modalService: NgbModal
) {
    this.acceptPrByIdList = data;
    console.log(this.acceptPrByIdList); }

  ngOnInit() {
  }
  acceptPrData(acceptPRForm) {
    console.log('acceptModal', acceptPRForm);
  if (!acceptPRForm.form.valid) {
    this.toaster.error('Please select closure date', 'Warning');
    return;
  }
  const finalArray = [];
finalArray.push({id: this.acceptPrByIdList.id, dueDate: this.prClosureDate});
  console.log('finalArra', finalArray);
  this.procuReqService.prAccept(finalArray)
  .subscribe((res: any) => {
      if (res.status === 'Success' || res.statusCode === 'Success') {
          this.toaster.success(res.message, 'Success');
        //   this.getPrLists();
          this.modalDialog.closeAll();
      } else {
          this.toaster.error(res.message, 'Failure');
      }
  });
  }
}
