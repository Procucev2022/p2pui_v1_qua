import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { VendorMgrService } from '../../services/vendor-mgr.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-vendor-rejected',
  templateUrl: './vendor-rejected.component.html',
  styleUrls: ['./vendor-rejected.component.scss']
})
export class VendorRejectedComponent implements OnInit {

    vendorRejectedList: any = [];
    selectedData: any;

    vendorRejectedHeaders: any = [
        //{ field: 'id', header: 'ID'  , isLink: false},
        { field: 'companyName', header: 'Name'  , isLink: false, width:'215px'},
        { field: 'companyId', header: 'Vendor ID', width:'135px' },
        { field: 'vendorEmail', header: 'Email'  , isLink: false, width:'165px'},
        { field: 'vendorPhone', header: 'Mobile No' , isLink: false, width:'135px'},
        // { field: 'lastModifiedTS', header: 'createdtimestamp' , isLink: false,fieldType: 'date'},
        // { field: 'companyName', header: 'CompanyName'  , isLink: false},
        // { field: 'city', header: 'city' , isLink: false},
    ];

    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;

    constructor(private vendMgrSer: VendorMgrService, private toaster: ToastrService) {}

    ngOnInit() {
        this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
        this.getVendorRejectedData();
    }

    getVendorRejectedData(){
      this.vendorRejectedList = [];
        let obj ={
            "masterStatus":"VENDOR_REJECTED"
        }
      this.vendMgrSer.getVendorByStatus(obj).subscribe((res:any)=>{
        if(Array.isArray(res)){
            console.log(res)
            res.forEach(element => {
              element['status'] = element['status']['uiDisplay'];
            });
          this.vendorRejectedList = res;
        }else{
          //this.toaster.error(res.message, 'Failure')
        }
      })
    }


    onPage(event) {
        this.paginatoryDetails = event;
      }


}
