import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { AppConfig } from 'src/app/app.config';
import { VendorQuotService } from '../../../services/vendor-quot.service';

@Component({
  selector: 'app-quot-by-id',
  templateUrl: './quot-by-id.component.html',
  styleUrls: ['./quot-by-id.component.scss']
})
export class QuotByIdComponent implements OnInit {

    @Input('quotData') quotData: any;
    @Input('quotId') quotId: any;
    quotInfoList: any = [];
    selectedData: any;
    selectedRFQData: any;
    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    modalGridpageOptions: any;
    modalGridpageRecordSize: any;
    loggedUserPermissions: any;
    defaultPermissions;

    quotLineHeaders: any = [
        // { field: 'id', header: 'id', isLink: false },
        { field: 'description', header: 'Desc', isLink: false, width: '150px' },
        { field: 'brand', header: 'Specifications', isLink: false, width: '150px' },
        // { field: 'category', header: 'Category', isLink: false, width:'140px' },
        { field: 'itemcode', header: 'Item Code', isLink: false, width: '140px' },
        { field: 'quantity', header: 'QTY', isLink: false, width: '140px' },
        { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '140px' },
        { field: 'unitprice', header: 'Unit Price', isLink: false, width: '140px' },
       // { field: 'cgstPercentage', header: 'CGST %', isLink: false },
       // { field: 'cgstValue', header: 'CGST Value', isLink: false },
        { field: 'gstPercentage', header: 'GST %', isLink: false, width: '140px' },
        { field: 'gstValue', header: 'GST Value', isLink: false, width: '140px' },
        // { field: 'discountType', header: 'Discount Type', isLink: false },
        // { field: 'discountValue', header: 'Discount Value', isLink: false },
        { field: 'totalamount', header: 'Total Amount', isLink: false, width: '140px' },
    ];

    // quotInfoList from local

    // quotInfoList :any =[
    //     {
    //         "unit_of_price":"2000",
    //         "discount_type":"percentages(%)",
    //         "discount_value":"20",
    //         "total_value":"1800"
    //     },
    //     {
    //         "unit_of_price":"5000",
    //         "discount_type":"Amount(Rs)",
    //         "discount_value":"500",
    //         "total_value":"4500"
    //     }
    // ]

  constructor(private tostrService: ToastrService,
    private encryDecryService: EncryDecryService,
    private vendorquotService: VendorQuotService) { }

  ngOnInit() {
    this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    const temp =  JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')) );

    this.loggedUserPermissions = temp.details.listofPermission;

    this.modalGridpageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.modalGridpageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    // this.getQuotInfo();
}
// quotInfoList from rest call
getQuotInfo() {
    // console.log('this.quotData.quotId', this.quotData.id);


    this.vendorquotService.getQuotDataByid({ 'id': this.quotData.id}).subscribe((response) => {
        if (Array.isArray(response)) {
            this.quotInfoList = response;
        } else {
            this.tostrService.error('Failed');
            this.quotInfoList =  [];
        }
    });
}
    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            if (this.quotId) {
                this.getQuotInfo();
            }
        }
    }

    getQuotLineData(rowData, event) {

    }

    getThirdTab(event) {}


}
