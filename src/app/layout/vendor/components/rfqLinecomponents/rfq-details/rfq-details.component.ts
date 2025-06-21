import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from 'src/app/app.config';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
import { RfqService } from '../../../services/rfq.service';

@Component({
  selector: 'app-rfq-details',
  templateUrl: './rfq-details.component.html',
  styleUrls: ['./rfq-details.component.scss']
})
export class RfqDetailsComponent implements OnInit {

    @Input('rfqData') rfqData: any;
    @Input('rfqId') rfqId: any;
    rfqdetailsList: any = [];
    selectedData: any;
    selectedRFQData: any;
    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    modalGridpageOptions: any;
    modalGridpageRecordSize: any;
    loggedUserPermissions: any;
    defaultPermissions;

    rfqDetailHeaders: any = [
       // { field: 'id', header: 'id', isLink: false },

       { field: 'description', header: 'Description', isLink: false },
        { field: 'brand', header: 'Specifications', isLink: false },
        { field: 'category', header: 'Category', isLink: false },
        { field: 'itemCode', header: 'Item Code', isLink: false },
        { field: 'quantity', header: 'Quantity', isLink: false },
        { field: 'unitofMeasures', header: 'UOM', isLink: false },
        // { field: 'createdTS', header: 'created date '}
    ];

    // rfqdetailsList is from local , if rest cal available then comment below code
    // rfqdetailsList :any =[
    //     {
    //         "item_description":"Printers",
    //         "item_brand":"Dell",
    //         "quantity":"30",
    //         "unit_ofMeasurments":"200"
    //     },
    //     {
    //         "item_description":"Led Desktps",
    //         "item_brand":"LG",
    //         "quantity":"20",
    //         "unit_ofMeasurments":"400"
    //     }
    // ]

  constructor(private tostrService: ToastrService,
    private encryDecryService: EncryDecryService,
    private rfqservice: RfqService) { }

  ngOnInit() {
    this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    const temp =  JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')) );

    this.loggedUserPermissions = temp.details.listofPermission;

    this.modalGridpageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.modalGridpageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
}

    // rfqdetailsList from rest call
    getRfqsList() {

        this.rfqservice.getLineitemsById({ 'id': this.rfqData.rfquuid}).subscribe((response) => {
            if (Array.isArray(response)) {
                this.rfqdetailsList = response || [];
            } else {
                // this.tostrService.error('Failed! No Data fetched', 'Failed')
                this.rfqdetailsList =  [];
            }
        });
}
    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
        if (changes) {
            if (this.rfqId) {
                this.getRfqsList();
            }
        }
    }

    // ngOnchanges(){
    //     if(this.rfqId){
    //         this.getRfqsList();
    //     }
    // }
    getRFQs(rowData, event) {
        this.selectedRFQData = rowData;
        this.selectedData = [rowData];
        this.rfqId =  event.srcElement.lastChild.data;
    }

getThirdTab(event) {}

}
