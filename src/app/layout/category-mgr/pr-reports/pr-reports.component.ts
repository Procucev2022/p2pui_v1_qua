import { Component, OnInit } from '@angular/core';
import {CatProcuRequestsService} from '../services';
import { ExcelService } from 'src/app/shared/modules/common-share/services/excel.service';
import { EncryDecryService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pr-reports',
  templateUrl: './pr-reports.component.html',
  styleUrls: ['./pr-reports.component.scss']
})
export class PrReportsComponent implements OnInit {

  fromDate: any;
  toDate: any;
  reportData: any;
  loggedUserData: any;
  userNames: any = [];
  userName: any;
  departments: any = [];
  department: any;
  allClients: any = [];
  clientName: any;
  filteredClientList: any = [];
  constructor(private procuReqService: CatProcuRequestsService, private excelService: ExcelService,  private encryDecryService: EncryDecryService,
    private toastService: ToastrService) { }

  ngOnInit() {
    // this.userName = 'undefined';
    // this.department = 'undefined';
    const temp = JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')));
    this.loggedUserData = temp.details;
    if (this.loggedUserData.role.description === 'clientInitiator') {
      this.getUserNames();
      this.getDepartments();
    } else if (this.loggedUserData.role.description === 'CategoryManager') {
      this.getAllClients();
    }

  }

  getAllClients() {
    this.procuReqService.getClients().subscribe((response) => {
      this.allClients = response || [];
    });
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

      this.userName = undefined;
      this.department = undefined;
    }
  }

  getUserNames() {
    const reqObj = {
      id: localStorage.getItem('orgId')
    };
    this.procuReqService.getUserNamesByOrg(reqObj).subscribe((data) => {
      if (Array.isArray(data)) {
        this.userNames = data;
      } else {
        this.userNames = [];
      }
    });
  }



  downloadPRreport() {

    if (this.loggedUserData.role.description === 'CategoryManager') {

      const fromDateformat = this.formatDate(this.fromDate);
      const toDateObjformat = this.formatDate(this.toDate);
      const reqObj = {
        startDate: fromDateformat,
        masterStatus: ['PC_PR_NEW', 'PC_PR_ACCEPTED', 'PC_PR_REJECTED', 'PC_PR_CLOSED', 'PPO_GENERATED'],
        endDate: toDateObjformat,
        org: {id: this.clientName},
        createdBy: this.userName,
        deptName: this.department
      };

      this.procuReqService.getPrByCMAndCreatedTS(reqObj).subscribe((data) => {
        if (Array.isArray(data)) {
          this.reportData = data;
          this.prepareData(this.reportData);
        } else {
          this.reportData = [];
          this.toastService.warning('No data is avilable with given inputs', 'WARNING');
          return;
        }
      });

    } else if (this.loggedUserData.role.description === 'clientInitiator') {
      const fromDateformat = this.formatDate(this.fromDate);
      const toDateObjformat = this.formatDate(this.toDate);
      const reqObj = {
        startDate: fromDateformat,
        org: {id: localStorage.getItem('orgId')},
        endDate: toDateObjformat,
        createdBy: this.userName,
        deptName: this.department
      };
      this.procuReqService.getPrByOrgAndCreatedTS(reqObj).subscribe((data) => {
        if (Array.isArray(data)) {
          this.reportData = data;
          this.prepareData(this.reportData);
        } else {
          this.reportData = [];
          this.toastService.warning('No data is avilable with given inputs', 'WARNING');
          return;
        }
      });
    }
  }


  prepareData(data: any) {
    // if (data.length === 0) {
    //   this.toastService.warning('No data is avilable with given inputs', 'WARNING');
    //   return;
    // }
    const excelDataFormat = [];
    for (let i = 0; i < data.length; i++) {

      // cost centre value preparation
      let costCentreValue = '';

      for (let j = 0; j < data[i].clientcostcentre.length; j++) {
        costCentreValue += data[i].clientcostcentre[j].name + ', ';
      }
      const obj = {
        'PR Id' : data[i].prId,
        'PR corresponds': data[i].prCorrespond,
        'Description' : data[i].prDescription,
        'Status' : data[i].clientStatus.uiDisplay,
        'DepartmentName': data[i].deptName,
        'Future Requirement Plan ': data[i].futureRequirement,
        'Cost Centre': costCentreValue,
        'Priority' : data[i].priority,
        'Estimated PR value': data[i].estimatedPrvalue,
        'Date of Creation' : this.formatDate(data[i].createdTS),
        'Approval Date' : this.formatDate(data[i].clientApprovalDate),
        'Accepted Date' : this.formatDate(data[i].procucevAcceptDate),
        'Expected Date Of Closure' : this.formatDate(data[i].dueDate),
      };


      for (let j = 0; j < data[i].clientdeliverylocation.length; j++) {
        const keyname = 'address' + (j + 1);
        obj[keyname] = data[i].clientdeliverylocation[j].address + ', ' + data[i].clientdeliverylocation[j].city + ', ' + data[i].clientdeliverylocation[j].state;
      }
      for (let j = 0; j < data[i].pritems.length; j++) {
        const obj1 = JSON.parse(JSON.stringify(obj));
        obj1.serialNo = data[i].pritems[j].serialNo;
        obj1.description = data[i].pritems[j].description;
        obj1.specification = data[i].pritems[j].brand;
        obj1.quantity = data[i].pritems[j].quantity;
        obj1.Category = data[i].pritems[j].Category;
        obj1.itemcode = data[i].pritems[j].itemcode;
        obj1.vendorName = data[i].pritems[j].vendorName;
        obj1.vendorPrice = data[i].pritems[j].vendorPrice;
        obj1.unitofMeasures = data[i].pritems[j].unitofMeasures;
        obj1.estimatedItemValue = data[i].pritems[j].estimatedItemValue;
        obj1.linkedItemPrice = data[i].pritems[j].linkedItemPrice;
        excelDataFormat.push(obj1);
      }
    }

    this.excelService.exportAsExcelFile(excelDataFormat, 'PR_Report');
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
