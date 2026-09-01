import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js'
import { ToastrService } from 'ngx-toastr';
import { ClientService } from '../services/client-service.service';
import { DatePipe } from '@angular/common';
import { EncryDecryService } from 'src/app/shared/services';

@Component({
  selector: 'app-auctions-chart',
  templateUrl: './auctions-chart.component.html',
  styleUrls: ['./auctions-chart.component.scss']
})
export class AuctionsChartComponent implements OnInit {

  auction: any;
  auctionFromDate:any;
  auctionToDate:any
  totalAuctionCount: number;
  auctionHeaders: any[] = [];
  auctionList: any[] = [];
  chartBackgroundList:any[] = ['#fc9700']
    loggedUserDetails: any;
  constructor(private toaster : ToastrService, private chartService : ClientService,   private datePipe: DatePipe, private encryDecryService: EncryDecryService) { }

  ngOnInit() {
    const dateBefore7Days = (new Date()).setDate(new Date().getDate()-30) ;
    const prfDate = this.datePipe.transform(dateBefore7Days, 'yyyy-MM-dd')
    const prtDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    this.auctionFromDate = new Date(dateBefore7Days)
    this.auctionToDate= new Date();
    const temp =  JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')) );
    this.loggedUserDetails = temp.details;
    this.getChartDetails(prfDate, prtDate)
  }

  getChartDetails(prfDate? :any,prtDate?:any) {
    this.auctionList = []
    this.auctionHeaders = []
    if (this.auction) {
      this.auction.destroy();
    }
    let obj = {
      org:{id: localStorage.getItem('orgId')},
      startDate: prfDate ? prfDate: this.datePipe.transform(new Date(this.auctionFromDate) , 'yyyy-MM-dd'),
      endDate: prtDate? prtDate: this.datePipe.transform(new Date(this.auctionToDate), 'yyyy-MM-dd'),
    }
      if (this.loggedUserDetails.role.roleName == 'ClientInitiator' || this.loggedUserDetails.role.roleName === 'clientInitiator1.1') {
          obj['fromInitiator'] = true,
              obj['initiator'] =   this.loggedUserDetails.id;
      }

      if (this.loggedUserDetails.role.roleName === 'PRApprover' || this.loggedUserDetails.role.roleName === 'PRApprover2') {
          obj['fromInitiator'] = false,
              obj['department'] =  this.loggedUserDetails.department ? this.loggedUserDetails.department.id : '';

      }
    this.chartService.auctionChart(obj).subscribe((data:any) => {
      if(data){
        this.auctionList = data.data
        this.auctionHeaders = data.header
        this.auction = new Chart("auctioncanvas", {
          type: "bar",
          data: {
            labels: this.auctionHeaders,
            datasets: [
              {
                label: "Auction",
                data: this.auctionList,
                backgroundColor: this.chartBackgroundList,
                borderColor: this.chartBackgroundList,
                borderWidth: 1
              }
            ]
          },
          // "Total No.of Auctions Count",
          // options: {
          //   tooltips:{
          //     enabled:false
          //   },
            // scales: {
            //   xAxes: [{
            //     gridLines:{
            //       display:false
            //     },
            //   scaleLabel: {
            //     display:false,
            //     labelString: ''
            //   },
            //   }],
            //   yAxes: [{
            //     gridLines:{
            //       display:true
            //     },
            //   scaleLabel: {
            //     display:false,
            //     labelString: ''
            //   },
            //  }]
            // }
          // }
        });
      }
    })
  }

  onSubmit(type){
    if(this.auctionFromDate && this.auctionToDate){
      this.getChartDetails()
    }else{
      this.toaster.error('Please enter all the required fields', 'Error');
    }
  }

}
