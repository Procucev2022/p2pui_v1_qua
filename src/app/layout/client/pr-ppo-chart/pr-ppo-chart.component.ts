import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js'
import { ToastrService } from 'ngx-toastr';
import { ClientService } from '../services/client-service.service';
import { EncryDecryService } from 'src/app/shared/services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pr-ppo-chart',
  templateUrl: './pr-ppo-chart.component.html',
  styleUrls: ['./pr-ppo-chart.component.scss']
})
export class PrPpoChartComponent implements OnInit {

  pramount:any;
  ppoToDate:any;
  ppoFromDate:any;
  prPpoList: any[] = [];
  prPpoHeaders: any[] = [];
  chartBackgroundList:any[] = ['#9827ac','#0e2ac6','#d71a60'];
  auctionFromDate:any;
  auctionToDate:any
    loggedUserDetails: any;
  constructor(private toaster : ToastrService,  private datePipe: DatePipe,private chartService : ClientService, private encryDecryService: EncryDecryService) { }

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
    this.prPpoList = []
    this.prPpoHeaders = []
    let obj = {
        org:{id: localStorage.getItem('orgId')},
        startDate: prfDate ? prfDate: this.datePipe.transform(new Date(this.auctionFromDate) , 'yyyy-MM-dd'),
        endDate: prtDate? prtDate: this.datePipe.transform(new Date(this.auctionToDate), 'yyyy-MM-dd'),
      }
        if (this.loggedUserDetails.role.roleName == 'ClientInitiator' || this.loggedUserDetails.role.roleName === 'clientInitiator1.1') {
            obj['fromInitiator'] = true,
                obj['initiator'] = {id:   this.loggedUserDetails.id};
        }

        if (this.loggedUserDetails.role.roleName === 'PRApprover' || this.loggedUserDetails.role.roleName === 'PRApprover2') {
            obj['fromInitiator'] = false,
                obj['department'] =  this.loggedUserDetails.department ? this.loggedUserDetails.department.id : '';

        }
    this.chartService.prPpoChart(obj).subscribe((data:any) => {
      if(data){
        this.prPpoList = data.data
        this.prPpoHeaders = data.header
        this.pramount = new Chart("pramountcanvas", {
          type: "bar",
          data: {
            labels: this.prPpoHeaders,
            datasets: [
              {
                label: "PR-PPO",
                data: this.prPpoList,
                backgroundColor: this.chartBackgroundList,
                borderColor: this.chartBackgroundList,
                borderWidth: 1
              }
            ]
          },
          // pramount -barchart ppo ampont for that pr and differential amount(pramount-ppoamount) =savings
          // options: {
          //   tooltips:{
          //     enabled:false
          //   }
          // }
        });
      }
    })
  }

  onSubmit(type){
    if(this.ppoFromDate && this.ppoToDate){
      this.getChartDetails()
    }else{
      this.toaster.error('Please enter all the required fields', 'Error');
    }
  }

}
