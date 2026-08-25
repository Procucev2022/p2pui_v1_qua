import { Component, OnInit } from '@angular/core';
import { ExcelService } from 'src/app/shared/modules/common-share/services/excel.service';
import { PoService } from 'src/app/shared/modules/common-share/services/po.service';
import { EncryDecryService } from 'src/app/shared/services';
import {CatProcuRequestsService} from 'src/app/layout/category-mgr/services/cat-procu-requests.service';


@Component({
  selector: 'app-ppo-reports',
  templateUrl: './ppo-reports.component.html',
  styleUrls: ['./ppo-reports.component.scss']
})
export class PpoReportsComponent implements OnInit {

  fromDate: any;
  toDate: any;
  reportData: any;
  loggedUserData: any;
  userNames: any = [];
  userName: any;
  clientName: any;
  departments: any = [];
  department: any;
  allClients: any = [];
  filteredClientList: any[] = [];

  constructor( private excelService: ExcelService, private poService: PoService,  private encryDecryService: EncryDecryService, private procuReqService: CatProcuRequestsService ) { }

  ngOnInit() {
    const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));

    this.loggedUserData = temp.details;
    if (this.loggedUserData.role.description === 'clientInitiator') {
      // this.getUserNames();
      this.getDepartments();
    } else if (this.loggedUserData.role.description === 'CategoryManager') {
      this.getAllClients();
    }
  }

  getUserNamesandDeptForCM(event) {
    this.clientName = event.id;
    if (this.clientName != null) {
      const reqObj = {
        id: this.clientName
      };
      this.procuReqService.getDepartmentsByOrg(reqObj).subscribe((data) => {
        if (Array.isArray(data)) {
          this.departments = data;
        } else {
          this.departments = [];
        }
      });


      this.procuReqService.getUserNamesByOrg(reqObj).subscribe((data) => {
        if (Array.isArray(data)) {
          this.userNames = data;
        } else {
          this.userNames = [];
        }
      });
    }
  }
  getDepartments() {
    const reqObj = {
      id: localStorage.getItem('orgId')
    };
    this.procuReqService.getDepartmentsByOrg(reqObj).subscribe((data) => {
      if (Array.isArray(data)) {
        this.departments = data;
      } else {
        this.departments = [];
      }
    });

  }

  getAllClients() {
    this.procuReqService.getClients().subscribe((response) => {
      this.allClients = response || [];
    });
  }

  // getUserNames() {
  //   const reqObj = {
  //     id: localStorage.getItem('orgId')
  //   };
  //   this.procuReqService.getUserNamesByOrg(reqObj).subscribe((data) => {
  //     if (Array.isArray(data)) {
  //       this.userNames = data || [];
  //     } else {
  //       this.userNames = [];
  //     }
  //   });
  // }


  downloadPRreport() {
    const fromDateformat = this.formatDate(this.fromDate);
    const toDateObjformat = this.formatDate(this.toDate);
    // getPrByOrgAndCreatedTS
    if (this.loggedUserData.role.description === 'CategoryManager') {
      const reqObj = {
        startDate: fromDateformat,
        createdBy: this.userName,
        deptName: this.department,
        masterStatus: [
          'PPO_SUBMIT',
          'PPO_NEW',
          'PPO_CLIENT_ACCEPT',
          'PPO_CLIENT_REJECT',
          'PPO_REJECT'],
        endDate: toDateObjformat,
        client: this.clientName
      };
      this.poService.getppobyStatusAndCreatedTS(reqObj).subscribe((data) => {
        if (Array.isArray(data)) {
          this.reportData = data;
          this.prepareData(this.reportData);

        } else {
          this.reportData = [];
        }

      });
    } else if (this.loggedUserData.role.description === 'clientInitiator') {
      const reqObj = {
        'client': this.loggedUserData.org.id,
        startDate: fromDateformat,
        deptName: this.department,
        masterStatus: [
          'PPO_SUBMIT',
          'PPO_CLIENT_ACCEPT',
          'PPO_CLIENT_REJECT',
        ],
        endDate: toDateObjformat
      };
      this.poService.getppoClientbyStatusAndCreatedTS(reqObj).subscribe((data) => {
        if (Array.isArray(data)) {
          this.reportData = data;
          this.prepareData(this.reportData);

        } else {
          this.reportData = [];
        }

      });
    }

  }


  prepareData(data: any) {
    const excelDataFormat = [];
    for (let i = 0; i < data.length; i++) {
      const obj = {
        'PPO Id' : data[i].ppoId,
        'PPO Value': data[i].ppoValue,
        'Payment Terms' : data[i].paymentTerms,
        'Delivary Terms' : data[i].delivaryTerms,
        'Other Terms': data[i].otherTerms
      };

      for (let j = 0; j < data[i].ppoitems.length; j++) {
        const obj1 = JSON.parse(JSON.stringify(obj));
        obj1.vendroName = data[i].ppoitems[j].org.companyName;
        obj1.description = data[i].ppoitems[j].description;
        obj1.specification = data[i].ppoitems[j].brand;
        obj1.unitofMeasures = data[i].ppoitems[j].unitofMeasures;
        obj1.quantity = data[i].ppoitems[j].quantity;

        obj1.unitprice = data[i].ppoitems[j].unitprice;
        obj1.basicamount = data[i].ppoitems[j].unitprice * data[i].ppoitems[j].quantity;
        obj1.gstvalue = data[i].ppoitems[j].gstValue;
        obj1.gstpercentage =  data[i].ppoitems[j].gstPercentage;
        obj1.totalamount = data[i].ppoitems[j].totalamount;
        excelDataFormat.push(obj1);
      }
    }
    this.excelService.exportAsExcelFile(excelDataFormat, 'PPO_Report');
  }


  formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }

    return [year, month, day].join('-');
  }

  filterClient(event) {
    // in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.allClients.length; i++) {
        const client = this.allClients[i];
        if ( client.companyName.toLowerCase().includes(query.toLowerCase())) {
            filtered.push(client);
        }
    }
    this.filteredClientList = filtered;
  }

}
