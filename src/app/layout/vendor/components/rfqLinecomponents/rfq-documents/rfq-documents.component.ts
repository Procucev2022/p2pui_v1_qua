import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';
import { RfqService } from '../../../services/rfq.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Component({
  selector: 'app-rfq-documents',
  templateUrl: './rfq-documents.component.html',
  styleUrls: ['./rfq-documents.component.scss']
})
export class RfqDocumentsComponent implements OnInit {

    @Input('rfqData') rfqData: any;
    @Input('rfqId') rfqId: any;
    @Input('isVendorRFQ') isVendorRFQ: boolean;
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
        // { field: 'id', header: 'id', isLink: false , width:'260px', fieldType: 'text'},
        { field: 'fileName', header: 'File Name', isLink: false , width: '290px', fieldType: 'text'},
        { field: 'createdTS', header: 'Creation Date', isLink: false , width: '205px', fieldType: 'date'}
    ];


  constructor(private tostrService: ToastrService,
    private encryDecryService: EncryDecryService,
    private rfqservice: RfqService) { }

  ngOnInit() {
    this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    const temp =  JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')) );

    this.loggedUserPermissions = temp.details.listofPermission;

    this.modalGridpageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.modalGridpageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
}

    // rfqdetailsList from rest call
    getDocumentsByRfqId() {
        let obj = {};
        if (this.isVendorRFQ) {
            obj  = { 'id': this.rfqData.rfquuid};
        } else {
           obj =  { 'id': this.rfqData.id};
        }
        this.rfqservice.getDocumentsByRfqId(obj).subscribe((response) => {
            if (response) {
                this.rfqdetailsList = response['rfqDocument'] ? response['rfqDocument'] : [];
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
                this.getDocumentsByRfqId();
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
