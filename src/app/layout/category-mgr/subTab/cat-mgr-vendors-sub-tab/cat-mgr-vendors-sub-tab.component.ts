import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CatProcuRequestsService } from '../../services/cat-procu-requests.service';
import { AppConfig } from 'src/app/app.config';
import { CorrespondenceComponent } from 'src/app/shared/modules/common-share/components/correspondence/correspondence.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cat-mgr-vendors-sub-tab',
  templateUrl: './cat-mgr-vendors-sub-tab.component.html',
  styleUrls: ['./cat-mgr-vendors-sub-tab.component.scss']
})
export class CatMgrVendorsSubTabComponent implements OnInit , OnChanges {


  @Input('rfqData') rfqData: any;
    @Input('isNoActionsRequired') isNoActionsRequired:boolean = false;
  @Input('rfqId') rfqId: any;
  vendorList: any =  [];
  selectedData: any;
  selectedRFQData: any;
  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  vendorResponseDate: any;
  selectedVendorDetails: any;
  public min = new Date();
  constructor(private procuReqService: CatProcuRequestsService, private modalDialog: MatDialog,private tostrService: ToastrService,) { }
  vendorTableHeaders: any = [
    { field: 'companyName', header: 'Vendor Name'  , isLink: false , width:'200px', fieldType: 'text'},
    { field: 'email', header: 'Vendor Email'  , isLink: false , width:'280px', fieldType: 'text'},
    { field: 'phone', header: 'Vendor Phone'  , isLink: false , width:'220px', fieldType: 'text'},
    { field: 'vendorResponseDate', header: 'Quotation Closing Date'  , isLink: false, width:'230px', fieldType: 'date'},
    { field: 'vendorStatus', header: 'Status'  , isLink: false, width:'200px', fieldType: 'text'},
    // { field: 'createdTS', header: 'created Time'  , isLink: false, width:'205px', fieldType: 'date'},
    // { field: 'createdBy', header: 'Created By'  , isLink: false, width:'150px', fieldType: 'text'},
];

  ngOnInit() {
    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    this.getVendorsList();
  }

  getVendorsList() {
    const req = {
      'id': this.rfqData.id
    };

    this.procuReqService.getVendorsByRfq(req).subscribe( (data: any[] ) => {
         if(Array.isArray(data)) {
          this.vendorList = [];
          data.forEach(d => {
            this.vendorList.push(
              {
                id: d.id,
                // rfqNotifiedTo : d.rfqNotifiedTo,
                vendorStatus : d.vendorStatus,
                vendorResponseDate : d.vendorResponseDate,
                // createdTS: d.createdTS,
                // createdBy:d.createdBy,
                email:d.email,
                phone:d.phone,
                companyName: d.companyName,
                vendorId: d.vendorId

              }
            );
          });
         } else {
           this.vendorList = [];
         }
    });
   }

   ngOnChanges() {
     if (this.rfqId) {
      this.getVendorsList();
     }
  }

  getVendors(rowData) {
    this.selectedRFQData = rowData;
    this.selectedData = [rowData];
  }

  onPage(event) {
    this.paginatoryDetails = event;
  }
  viewCorresspondance(editVendorDate,rowData){
    console.log(this.vendorResponseDate);

    const  config: MatDialogConfig = {
      width: ' 762px'
    }
  const dialog =  this.modalDialog.open(editVendorDate, config)
  this.selectedVendorDetails = rowData
  if(rowData.vendorResponseDate != null){
    this.vendorResponseDate = new Date(rowData.vendorResponseDate)
    }else{
      this.vendorResponseDate =  ''
    }
   dialog.afterClosed().subscribe(result => {
    this.getVendorsList();
  });
  }
  SubmitVendorData(vendorDateForm){
    if (!vendorDateForm.form.valid) {
      this.tostrService.error('Please select vendor Response date', 'Warning');
      return;
    }
    // console.log(this.selectedData.id);

    let reqObj =
      {
      "id":this.selectedVendorDetails.id,
      "vendorResponseDate": this.vendorResponseDate
    }
    this.procuReqService.getVendorClosingDate(reqObj).subscribe((res: any) => {
          if (res.status === "Success") {
              this.tostrService.success(res.message, 'Success');
              this.getVendorsList();
              this.modalDialog.closeAll();
          } else {
              this.tostrService.error(res.message, 'Failure');
          }
      })
  }

  // viewCorresspondance(editVendorDate,rowData){
    // if (!editVendorDate.form.valid) {
    //   this.tostrService.error('Please select closure date', 'Warning');
    //   return;
    // }

    // this.procuReqService.prAccept()
    // .subscribe((res: any) => {
    //     if (res.status === 'Success' || res.statusCode === 'Success') {
    //         this.toaster.success(res.message, 'Success');
    //         this.getPrLists();
    //         this.modalDialog.closeAll();
    //     } else {
    //         this.toaster.error(res.message, 'Failure');
    //     }
    // });
  // }

//   viewCorresspondance(rowData) {
//     this.modalDialog.open(CorrespondenceComponent, { data: rowData });
// }

}
