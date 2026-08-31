import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { AppConfig } from 'src/app/app.config';
import { RfqService } from '../../../services/rfq.service';

@Component({
  selector: 'app-quot-info',
  templateUrl: './quot-info.component.html',
  styleUrls: ['./quot-info.component.scss']
})
export class QuotInfoComponent implements OnInit {

    @Input('rfqData') rfqData: any;
    @Input('rfqId') rfqId:any;
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

    quotInfoHeaders : any = [
        { field: 'unitprice', header: 'unit price', isLink: false },
        { field: 'quantity', header: 'quantity', isLink: false },
        { field: 'unitofMeasures', header: 'UOM', isLink: false },
        { field: 'totalamount', header: 'total amount'}
    ]

    //quotInfoList from local

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

  constructor(private tostrService:ToastrService,
    private encryDecryService:EncryDecryService,
    private rfqservice: RfqService) { }

  ngOnInit() {
    this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    let temp =  JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')) );

    this.loggedUserPermissions = temp.details.listofPermission;

    this.modalGridpageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.modalGridpageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    //this.getQuotInfo();
}
//quotInfoList from rest call
getQuotInfo() {

    this.rfqservice.getLineitemsById({ 'id': this.rfqData.rfq.id}).subscribe((response)=> {
        if (Array.isArray(response)){
            this.quotInfoList = response;
        } else {
           // this.tostrService.error('Failed! No data Fetched')
            this.quotInfoList =  [];
        }
    })
}
    // ngOnChanges() {
    //     if(this.rfqId){
    //         this.getQuotInfo();
    //     }
    // }
    ngOnChanges(changes : SimpleChanges): void {
        console.log(changes);
        if(changes){
            if(this.rfqId){
                this.getQuotInfo();
            }
        }
    }

    getRFQs(rowData, event) {
        // this.selectedRFQData = rowData;
        // this.selectedData = [rowData];
        // this.rfqId =  event.srcElement.lastChild.data;
    }

    getThirdTab(event) {}

}
