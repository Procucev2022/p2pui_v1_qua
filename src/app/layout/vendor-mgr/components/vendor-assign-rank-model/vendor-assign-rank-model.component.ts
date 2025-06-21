import { Component, OnInit, Inject } from '@angular/core';
import { Optional } from 'ag-grid-community';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-vendor-assign-rank-model',
  templateUrl: './vendor-assign-rank-model.component.html',
  styleUrls: ['./vendor-assign-rank-model.component.scss']
})
export class VendorAssignRankModelComponent implements OnInit {
  ranksModal : any
  finalObj: any[] = [];
  constructor(public dialogRef: MatDialogRef<VendorAssignRankModelComponent>,@Optional() @Inject(MAT_DIALOG_DATA) public data, 
  private clientReq : CatProcuRequestsService,private toaster: ToastrService) { }
  ranksList = ['Diamond','Platinum','Gold','Silver']
  ngOnInit() {
    console.log(this.data);
  }
  sumbitRank(){
    let reqResp:any
    this.data.forEach(element => {
      reqResp = {
      'id' :element.id,
      'vendorRank' : this.ranksModal
    }
    this.finalObj.push(reqResp)
    });
    this.clientReq.submitvendorRank(this.finalObj).subscribe(data => this.successCallBack(data))
  }
  successCallBack(data: any) {
    console.log(data);
    if(data.statusCode == 200){
    this.toaster.success(data.message, 'Success');
    } else{
      this.toaster.error(data.message, 'Error');
    }
  }

}
