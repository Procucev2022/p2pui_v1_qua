import { Component, OnInit, Input } from '@angular/core';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { ClientService } from '../../services/client-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-pr-id-details',
  templateUrl: './view-pr-id-details.component.html',
  styleUrls: ['./view-pr-id-details.component.scss']
})
export class ViewPRIdDetailsComponent implements OnInit {

    @Input('prData') prData: any;
    @Input('prId') prId:any;
    rfqsList: any = [];
    prList: any = [];
    selectedData: any;
    selectedRFQData: any;
    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    prSummaryList:any ={
    }
    prIDTableHeaders: any = [
        // { field: 'id', header: ' ID', isLink: false, width:'258px' },
        { field: 'serialNo', header: 'S.No', isLink: false, width:'70px' },
        { field: 'description', header: 'Item Description', isLink: false, width:'210px' },
        { field: 'brand', header: 'Material Specification', isLink: false, width:'170px' },

        { field: 'unitofMeasures', header: 'Unit Of Measure', width:'170px'},
        { field: 'quantity', header: 'Quantity', width:'130px'}
    ];


    getPrdetails() {
        this.ClientService.getPRitemsByid({ 'id': this.prData.id}).subscribe((response)=> {
            if (Array.isArray(response)){
                this.rfqsList = response;
            } else {
                this.toastrService.error('Failed No data fetched')
                this.rfqsList =  [];
            }
        })
    }
  constructor(private ClientService: ClientService,
    private toastrService:ToastrService ) { }

  ngOnInit() {
    this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
    this.getPrdetails();
  }

  ngOnChanges() {
    if(this.prId){
        this.getPrdetails();
    }
 }

//  prList =[
//      {
//          "id":"55gjdfnjgn3595656548hbc4t",
//          "itemDescription":'printer',
//          "materialSpecification":"Hardware",
//          "unitOFMeasure":"2",
//          "quantity":"200"
//      },
//      {
//          "id":"345dfgdfgdg444444f34f5555f",
//         "itemDescription":'mouse',
//         "materialSpecification":"Hardware",
//         "unitOFMeasure":"20",
//         "quantity":"300"
//     }
//  ]


}
