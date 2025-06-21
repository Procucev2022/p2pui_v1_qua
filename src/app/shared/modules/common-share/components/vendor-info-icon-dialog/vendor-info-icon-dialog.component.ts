import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { VendorSearchService } from 'src/app/layout/vendor-mgr/services/vendor-search.service';

@Component({
  selector: 'app-vendor-info-icon-dialog',
  templateUrl: './vendor-info-icon-dialog.component.html',
  styleUrls: ['./vendor-info-icon-dialog.component.scss']
})
export class VendorInfoIconDialogComponent implements OnInit {
  visibleDialog:boolean =false;
  @Input('vendorData')vendorData: any ;
  @ViewChild('op') op: OverlayPanel;
  @ViewChild('targetEl') targetEl: ElementRef;
  vendorInfo:any = {
    "category":null,
    "subCategory": null,
    "vendorClass": null,
    "bussinessAge": null
  }
 
  constructor(private vendorService: VendorSearchService) { }

  ngOnInit() {
  }

  getVendorData(){
    // event.stopPropagation();
    // this.op.show(event)
    this.visibleDialog = true;
    if(!this.vendorData.vendorId){
      return;
    }
    this.vendorService.getVendorInfo({"id":this.vendorData.vendorId}).subscribe((res:any)=>{
      this.vendorInfo = res? res: this.vendorInfo;
    })
  }

  onFocusOut(event){
    this.op.hide()
  }

}
