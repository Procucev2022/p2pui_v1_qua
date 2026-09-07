import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-view-rfq-by-id-modal',
  templateUrl: './view-rfq-by-id-modal.component.html',
  styleUrls: ['./view-rfq-by-id-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewRFQByIdModalComponent implements OnInit {

    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    selectedData: any;
  viewRFQbyIDdetails: any;
    isShowItemsSectionOnly: boolean =false;

  constructor( private dialogRef: MatDialogRef<ViewRFQByIdModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,

  ) {
      this.viewRFQbyIDdetails = data;
      console.log(this.viewRFQbyIDdetails);
   }

   isEmailRfq(): boolean {
       const source = (this.viewRFQbyIDdetails?.sourceType || '').toUpperCase().trim();
       return source === 'EMAIL' || source === 'E' || source === 'MAIL';
   }

   rfqDetailsHeaders: any = [

    { field: 'description', header: 'Description', isLink: false ,  width: '220px', isExceedContent: true},
    { field: 'brand', header: 'Specification', isLink: false ,  width: '190px', isExceedContent: false},

    { field: 'quantity', header: 'Quantity', isLink: false ,  width: '190px', isExceedContent: false},
    { field: 'unitofMeasures', header: 'UOM', isLink: false ,  width: '190px', isExceedContent: false},
    // { field: 'unitprice', header: 'Unit Price', isLink: false },
  ];

  ngOnInit() {
    this.isShowItemsSectionOnly = this.viewRFQbyIDdetails.showItemsOnly;
    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    if(!this.viewRFQbyIDdetails.hiddenCategory){
        this.rfqDetailsHeaders.splice(2,0,  { field: 'category', header: 'Category', isLink: false ,  width: '190px', isExceedContent: false},);

    }else{
        this.rfqDetailsHeaders.push( { field: 'remarks', header: 'Remarks', isLink: false,  width: '190px', isExceedContent: false })
    }
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
}

zoomout() {
  this.dialogRef.updateSize('70%');
}

zoomin() {
    this.dialogRef.updateSize('90%');
}

getImageURL(file:any){
    let url= '';
    if(file['fileName'].split('.').splice(-1) == 'xlsx' || file['fileName'].split('.').splice(-1) == 'xls' || file['fileName'].split('.').splice(-1) == 'csv'){
        url = '/assets/images/export-excel.png'
    }else if(file['fileName'].split('.').splice(-1) == 'pdf'){
        url = '/assets/images/new/download-pdf.svg'
    }else if(file['fileName'].split('.').splice(-1) == 'png'||file['fileName'].split('.').splice(-1) == 'PNG' || file['fileName'].split('.').splice(-1) == 'JPG'||  file['fileName'].split('.').splice(-1) == 'jpeg' || file['fileName'].split('.').splice(-1) == 'jpg'){
        url = '/assets/images/new/download-img.png'
    }else{
        url = '/assets/images/new/download-file.png'
    }
    return url;
}

}
