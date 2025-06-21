import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-vendor-evaluation',
  templateUrl: './view-vendor-evaluation.component.html',
  styleUrls: ['./view-vendor-evaluation.component.scss']
})
export class ViewVendorEvaluationComponent implements OnInit {

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data) { }
  vendorEvaluationData:any;

  ngOnInit() {
    this.vendorEvaluationData =this.data
  }

}
