import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js'
import { ToastrService } from 'ngx-toastr';
import { ClientService } from '../services/client-service.service';
import { DatePipe } from '@angular/common';
import { EncryDecryService } from 'src/app/shared/services';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Component({
  selector: 'app-client-analytics-info',
  templateUrl: './client-analytics-info.component.html',
  styleUrls: ['./client-analytics-info.component.scss']
})
export class ClientAnalyticsInfoComponent implements OnInit {
  prChart: any;
  tDate:any;
  fDate:any;
  prtDate:any;
  prfDate:any;
  totalAuctionCount: number;
  prList: any[] = [];
  prHeaders: any[] = [];
  chartBackgroundList:any[] = ['#9827ac','#0e2ac6','#d71a60','#fc9700']
    defaultPermissions: any;
    loggedUserDetails: any;
  constructor(private toaster : ToastrService, private chartService : ClientService,
    private datePipe: DatePipe, private encryDecryService: EncryDecryService ) { }

  ngOnInit() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() -7)
    const dateBefore7Days = (new Date()).setDate(new Date().getDate()-30) ;
    const prfDate = this.datePipe.transform(dateBefore7Days, 'yyyy-MM-dd')
    const prtDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    this.prfDate = new Date(dateBefore7Days)
    this.prtDate= new Date();
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    const temp =  JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')) );
    this.loggedUserDetails = temp.details;

    this.getChartDetails(prfDate, prtDate)
  }

  getChartDetails(prfDate? :any,prtDate?:any) {
    this.prList = []
    this.prHeaders = []
    if (this.prChart) {
      this.prChart.destroy();
    }
      let obj = {
          org: { id: localStorage.getItem('orgId') },
          startDate: prfDate ? prfDate : this.datePipe.transform(new Date(this.prfDate), 'yyyy-MM-dd'),
          endDate: prtDate ? prtDate : this.datePipe.transform(new Date(this.prtDate), 'yyyy-MM-dd'),

      }
      if(this.loggedUserDetails.role.roleName == 'ClientInitiator' || this.loggedUserDetails.role.roleName === 'clientInitiator1.1'){
        obj['fromInitiator']=true,
        obj['initiator'] = {
            id: this.loggedUserDetails.id
        }
      }

      if(this.loggedUserDetails.role.roleName === 'PRApprover' || this.loggedUserDetails.role.roleName === 'PRApprover2'){
        obj['fromInitiator']=false,
        obj['department'] =  this.loggedUserDetails.department ? this.loggedUserDetails.department.id: '';

      }
    this.chartService.prChart(obj).subscribe((data:any) => {
      if(data){
        this.prList = data.data
        this.prHeaders = data.header
        this.prChart = new Chart('prcanvas', {
          type: 'pie',
          data: {
            labels: this.prHeaders,
            datasets: [
              {
                data: this.prList,
                backgroundColor: this.chartBackgroundList             },
            ]
          },
        });
      }
    })
  }

  onSubmit(type){
    if(this.prfDate && this.prtDate){
      this.getChartDetails()
    }else{
      this.toaster.error('Please enter all the required fields', 'Error');
    }
  }

}

