import { Component, OnInit } from '@angular/core';
//import { CatProcuRequestsService } from '../services/cat-procu-requests.service';
import { AppConfig } from 'src/app/app.config';
import { VendorService } from '../../../vendor-registration/services/vendor-service.service';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss']
})
export class VendorDashboardComponent implements OnInit {

  rfqTableData: any;
  selectedData: any;
  rfqName = "RFQ Sample";
  dueDate = "03-11-20";
  clientName = "Client 1"

  rfqHeaders: any = [
      { field: 'clientName', header: 'Client Name'  , isLink: true},
      { field: 'prNo', header: 'PR No'  , isLink: false},
      { field: 'description', header: 'Description' , isLink: false},
      { field: 'dueDate', header: 'Due Date' , isLink: false},
      { field: 'bidType', header: 'Bid Type' , isLink: false},
      
  ];

  paginatoryDetails: any;


  selectedRFQData: any;
  rfqsList: Object;
  pageRecordSize: any;
  pageOptions: any;

  constructor(private vendorService: VendorService) {}
  

  ngOnInit() {
      this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
      this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
      this.getRfqData();
  }

  getRfqData() {
    this.vendorService
    .getRfqData()
    .subscribe(data => {
        this.rfqTableData = data  || [];
    });
  }

  // getRFQs list
  getRFQs(selectedRowData) {
      this.selectedData = [selectedRowData];
      this.selectedRFQData = Object.assign({}, selectedRowData);
  }

  getLineItems(event) {
      console.log('clicked tab', event);

  }

  onPage(event) {
      //this.paginatorDetails = event;
    }

  downloadBOQ(){
    alert('downloading...')
  }

  raiseQuery()
  {
    alert('Querry raised...')
  }
}
