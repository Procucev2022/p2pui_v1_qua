import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from '../services/client-service.service';
import { DatePipe } from '@angular/common';
import { EncryDecryService } from 'src/app/shared/services';
@Component({
  selector: 'app-pr-lead-time-chart',
  templateUrl: './pr-lead-time-chart.component.html',
  styleUrls: ['./pr-lead-time-chart.component.scss']
})
export class PrLeadTimeChartComponent implements OnInit {
  chart: any;
  prTimeToDate: any;
  prTimeFromDate: any;
  isDataPresent = 0;
  disableColorWrapper = 0;
  prLeadTimeHeaders: any[] = [];
  prLeadTimeList: any[] = [];
  chartBackgroundList: any[] = ['#fc9700', '#cab0ee', '#9827ac'];
    loggedUserDetails: any;
  constructor(private toaster: ToastrService, private chartService: ClientService,
    private datePipe: DatePipe, private encryDecryService: EncryDecryService) { }

  ngOnInit() {
    const dateBefore7Days = (new Date()).setDate(new Date().getDate()-30) ;
    const prTimeFromDate = this.datePipe.transform(dateBefore7Days, 'yyyy-MM-dd')
    const prTimeToDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    this.prTimeFromDate=  new Date(dateBefore7Days)
    this.prTimeToDate= new Date();
    const temp =  JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')) );
    this.loggedUserDetails = temp.details;
    this.getChartDetails(prTimeFromDate,prTimeToDate);


  }

  getChartDetails(prTimeFromDate?:any,prTimeToDate?:any) {
    this.prLeadTimeHeaders = [];
    this.prLeadTimeList = [];
    if (this.chart) {
      this.chart.destroy();
    }
    const obj = {
      org: {id: localStorage.getItem('orgId')},
      startDate: prTimeFromDate? prTimeFromDate:  this.datePipe.transform(new Date(this.prTimeFromDate) , 'yyyy-MM-dd'),
      endDate: prTimeToDate? prTimeToDate:  this.datePipe.transform(new Date(this.prTimeToDate) , 'yyyy-MM-dd'),
    };
    if(this.loggedUserDetails.role.roleName == 'ClientInitiator' || this.loggedUserDetails.role.roleName === 'clientInitiator1.1'){
        obj['fromInitiator']=true,
        obj['initiator'] = {
            id: this.loggedUserDetails.id
        }
      }

      if(this.loggedUserDetails.role.roleName === 'PRApprover' || this.loggedUserDetails.role.roleName === 'PRApprover2'){
        obj['fromInitiator']=false,
        obj['department'] =     this.loggedUserDetails.department ? this.loggedUserDetails.department.id: '';

      }
    this.chartService.prLeadTimeChart(obj).subscribe((data: any) => {
      if (data.data) {
        this.isDataPresent = 0;
        this.disableColorWrapper = 1;
        this.prLeadTimeList = data.data;
        this.prLeadTimeHeaders = data.header;
        this.chart = new Chart('canvas', {
          type: 'pie',
          data: {
            labels: this.prLeadTimeHeaders,
            datasets: [
              {
                data: this.prLeadTimeList,
                backgroundColor: this.chartBackgroundList,
                // fill: false
              },
            ]
          },
          // options: {
          //   // legend: {
          //   //   display: false
          //   // },
          //   tooltips:{
          //     enabled:false
          //   }
          // }
        });
      } else {
        this.isDataPresent = 1;
        this.disableColorWrapper = 0;
      }
    });
  }

  onSubmit(type) {
    if (this.prTimeFromDate && this.prTimeToDate) {
      this.getChartDetails();
    } else {
      this.toaster.error('Please enter all the required fields', 'Error');
    }
  }
}
