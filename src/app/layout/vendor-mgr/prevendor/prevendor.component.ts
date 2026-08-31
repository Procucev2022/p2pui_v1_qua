import { Component, OnInit } from '@angular/core';
import { VendorReqService } from '../../vendor-request/services/vendor-req.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { AddOrEditVendorModalComponent } from '../../../shared/modules/common-share/components/add-or-edit-vendor-modal/add-or-edit-vendor-modal.component';
import { ViewPreVendorDetailsComponent } from '../view-pre-vendor-details/view-pre-vendor-details.component';
import { VendorEvolutionComponent } from '../vendor-evolution/vendor-evolution.component';
import { ViewVendorEvaluationComponent } from '../view-vendor-evaluation/view-vendor-evaluation.component';
import { CatProcuRequestsService } from '../../category-mgr/services';
import { ExcelService } from 'src/app/shared/modules/common-share/services/excel.service';
@Component({
  selector: 'app-prevendor',
  templateUrl: './prevendor.component.html',
  styleUrls: ['./prevendor.component.scss']
})
export class PrevendorComponent implements OnInit {
  vendorReqData: any[] = [];
  pageRecordSize: any;
  pageOptions: any;
  paginatoryDetails: any;
  defaultPermissions: any;
  vendorDocToBase64: any[];
  vendorDoc: any;
  convertSer: any;
  closeDialog: any;
  selectedData: any[] = [];
  registerData: any[] = [];
  excelData: any[] = [];
  loggedUserDetails: any;
  userModel: any = {};
  partialVendor = false;
  constructor(private vendorReqSer: VendorReqService, private procuReqService: CatProcuRequestsService,
    private modalDialog: MatDialog,
    private toaster: ToastrService,
    private encryDecryService: EncryDecryService,
    private excelService: ExcelService) { }
  vendorReqHeaders: any = [
    // { field: 'id', header: 'Id', isLink: false },
    { field: 'companyName', header: 'Vendor Name', isLink: false, width: '260px' },
    { field: 'vendorcategory', header: 'Category', isLink: false, width: '180px' },
    { field: 'subCategory', header: 'Sub Category', isLink: false, width: '180px' },

    // { field: 'status', header: 'Evaluation', isLink: false, width: '160px' },
    // { field: 'hsncode', header: 'HSNCode', isLink: false, width: '160px' },
    { field: 'email', header: 'Email', isLink: false, width: '280px' },
    { field: 'organizationPhonenumber', header: 'Mobile No', isLink: false, width: '160px' },
    { field: 'city', header: 'Location', isLink: false, width: '160px' },
    { field: 'vendorStatus', header: 'Status', isLink: false, width: '160px' },
    // { field: 'createdBy', header: 'Created By', isLink: false, width: '160px' },
    { field: 'createdTS', header: 'Creation Date', isLink: false, width: '170px' },
    { field: 'companyId', header: 'Vendor Id', isLink: false, width: '180px' }

  ];
  ngOnInit() {


    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    const temp = JSON.parse(
      this.encryDecryService.get(localStorage.getItem('logData'))
    );
    this.loggedUserDetails = temp.details;
    this.removeHeadersForVendorExecutive();
    this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    this.fetchVendors();

  }

  removeHeadersForVendorExecutive() {
    const newVendorReqHeaders: any = [];
    if (this.loggedUserDetails.role.roleName === 'VendorExecutive' || this.loggedUserDetails.role.roleName === 'VendorExecutive2') {
      for (let i = 0; i < this.vendorReqHeaders.length; i++) {
        if (this.vendorReqHeaders[i].header !== 'Evaluation' && this.vendorReqHeaders[i].header !== 'Vendor Id' && this.vendorReqHeaders[i].header !== 'Email'
         && this.vendorReqHeaders[i].header !== 'Mobile No' && this.vendorReqHeaders[i].header !== 'HSNCode') {
            newVendorReqHeaders.push(this.vendorReqHeaders[i]);
        }
      }
      this.vendorReqHeaders = newVendorReqHeaders;
    }
  }

  getVendorStatus(data) {
    return data.status === 'Invitation Sent' ? 'blue-text' : data.status === 'Submitted' ? 'green-text' : data.status === 'Registration pending' ? 'yellow-text' : 'grey-text';
  }


  fetchVendors() {
    if (this.loggedUserDetails.role.roleName === 'VendorManager' || this.loggedUserDetails.role.roleName === 'VendorManager2' ) {
      this.getAllPreVendorsByVM();
    } else {
      this.getAllPreVendors();
    }

  }
  getAllPreVendors() {
    this.vendorReqSer.getAllPreVendors().subscribe((res: any) => {
      if (Array.isArray(res)) {
        res.forEach(element => {
          element['vendorStatus'] = element['vendorStatus']['uiDisplay'];
          element['status'] = element['status']['uiDisplay'];
          element['partialVendor'] = element.vendorStatus == 'VendorAdded' || false;
        });
        this.vendorReqData = res;
      }
    });
  }


  getAllPreVendorsByVM() {
    this.vendorReqSer.getVendorsByVM().subscribe((res: any) => {
      if (Array.isArray(res)) {
        res.forEach(element => {
          element['vendorStatus'] = element['vendorStatus']['uiDisplay'];
          element['status'] = element['status']['uiDisplay'];
          element['partialVendor'] = element.vendorStatus == 'VendorAdded' ||false;
        });
        this.vendorReqData = res;

      }
    });
  }


  inActivate() {
    if (this.hasSelectedData()) {
      this.vendorReqSer.inActivate(this.selectedData).subscribe((res: any) => {
        this.showToaster(res);
      });
    }
  }
  registerVendor() {
    this.registerData = [];
    if (this.hasSelectedData()) {
      const isAllRecordsInvitedAlready = this.selectedData.every((ele) => ele.vendorStatus !== 'VendorAdded');
      if (isAllRecordsInvitedAlready) {
        this.toaster.warning('Sorry! You already sent request for the selected vendors', 'Warning');
        return;
      } else {
        this.selectedData.forEach(element => {
          if (element.vendorStatus === 'VendorAdded') {
          const obj = {
            'email': element.email,
            'orgName': element.companyName,
            'phone': element.organizationPhonenumber,
            tempapproval: element.partialVendor ? element.partialVendor : undefined
          };
            this.registerData.push(obj);
          }
        });
        this.vendorReqSer.registerVendor(this.registerData).subscribe((res: any) => {
          this.showToasterRegister(res);
        });
      }
    }
  }
  hasSelectedData() {
    if (this.selectedData.length) {
      return true;
    } else {
      this.toaster.error('Please select atleast one record!', 'Failure');
      return false;
    }
  }
  showToaster(res) {
    if (res.status === 'Success') {
      this.toaster.success(res.errorMessage, 'Success');
      // this.getAllPreVendors();
      this.fetchVendors();
      this.selectedData = [];
    } else {
      this.toaster.error(res.errorMessage, 'Failure');
    }
  }
  showToasterRegister(res) {
    if (res.statusCode === 'Success') {
      this.toaster.success(res.errorMessage, 'Success');
      // this.getAllPreVendors();
      this.fetchVendors();
      this.selectedData = [];
    } else {
      this.toaster.error(res.errorMessage, 'Failure');
    }
  }
  addOrEditVendor(data) {
    const modalData = data ? data : null;
    let height;
    if (data != null) {
      height = '100px';
    } else {
      height = '450px';
    }
    console.log('heght is ' + height);
    this.modalDialog.open(AddOrEditVendorModalComponent, {
      width: '70%',
      minHeight: height,
      data: data,
    }).afterClosed().subscribe((result) => {
      console.log('result.event', result.event);
      if (result && result.event === 'close') {
        // this.getAllPreVendors();
        this.fetchVendors();
      }
    });
  }

  vendorEvolution(data) {
    console.log('selected data', data)

    const modalData: any = this.selectedData ? this.selectedData[0] : null;
    const reqPayload = {'vendor': modalData['id']};
    if(modalData && modalData['status'] && modalData['status']  == 'New'){
      const obj:any ={
        'id': modalData['id'],
        'vendor': modalData['id'],
        'vendorName': modalData['companyName'],
        'location': modalData['city'],
        'client': [],
        'feedback': [],
        'companyId': modalData['companyId']
      }
      this.openVendorEvaluationModal(obj);
    }else{
      this.vendorReqSer.getVendorEvaluationById(reqPayload).subscribe((res: any) => {
        if (res.status) {
          const vendorData = {...res, 'companyId': modalData['companyId']};
          this.openVendorEvaluationModal(vendorData);
        }
      });
    }



    // this.modalDialog.open(VendorEvolutionComponent, {
    //   width: '80%',
    //   minHeight: '450px',
    //   data: data,
    // }).afterClosed().subscribe((result) => {
    //   console.log('result.event', result.event);
    //   if (result && result.event === 'close') {
    //     // this.getAllPreVendors();
    //     this.fetchVendors();
    //   }
    // });
  }

  openVendorEvaluationModal(res:any){
    this.modalDialog.open(VendorEvolutionComponent, {
      width: '80%',
      minHeight: '320px',
      data: res
    }).afterClosed().subscribe((result) => {
      console.log('result.event', result.event);
      if (result && result.event === 'close') {
        // this.getAllPreVendors();
        this.fetchVendors();
      }
    });
  }

  viewPrevendorDetails(rowData: any) {
    this.modalDialog.open(ViewPreVendorDetailsComponent, {
      width: '80%',
      minHeight: '320px',
      data: rowData
    });
  }
  editVendorEvaluation(rowData: any) {

    this.vendorReqSer.getVendorEvaluationById({'vendor': rowData.id}).subscribe((res: any) => {
      if (res.status !== 'Failure') {
        this.modalDialog.open(ViewVendorEvaluationComponent, {
          width: '80%',
          minHeight: '320px',
          data: res
        });
      }
    });
  }

  onAddUser(user) {
    this.userModel = {};
     const  config: MatDialogConfig = {
        width: ' 900px'
      };
    const dialog =  this.modalDialog.open(user, config);
     dialog.afterClosed().subscribe(result => {
          //  this.getAllClients();
      });
  }

  onAddUserSubmit(userForm: NgForm) {
    const reqObj = {
      'firstName': this.userModel.firstName,
      'lastName': this.userModel.lastName,
      'username': this.userModel.email,
      'phone': this.userModel.phone,
      'org': {
       'id': this.selectedData[0].id
      },
     'role': {'id': '5004'}

    };
    this.procuReqService.clientuserCreation(reqObj).subscribe(data => this.successCallBack(data));
  }
  successCallBack(data: any) {
    console.log(data);
    if (data.statusCode !== 'Success') {
      this.toaster.error( data.errorMessage, 'Failure');
    } else {
    this.toaster.success( 'User Added Successfully', 'Success');
    this.modalDialog.closeAll();
    }
    // this.createdUserList.push(this.userModel)
  }
  onSelectRecordCheck(e, data) {
    console.log(e, data);
    data['partialVendor'] = e;
  }


  Download() {
    if (this.selectedData.length === 0) {
      this.toaster.error( 'Please select atleast one record', 'Failure');
    } else if (this.selectedData.length > 10) {
      this.toaster.error( 'Number of records exceeded. Record count should be <= 10 ', 'Failure');
    } else {
      const previousCount = localStorage.getItem('downloadHitCount') === null ? 1 : parseInt(localStorage.getItem('downloadHitCount')) + 1;
      localStorage.setItem('downloadHitCount', previousCount + '');
        this.excelData = []; console.log(JSON.stringify(this.selectedData));
        this.selectedData.forEach((data, i) => {
          const obj = {
            'Vendor Name' : data.companyName,
            'Vendor Id' : data.companyId,
            'Category' : data.vendorcategory,
            'Status' : data.vendorStatus,
            'Evaluation' : data.status,
            'HSN code': data.hsncode,
            'Email': data.email,
            'Mobile No': data.organizationPhonenumber,
            'Location': data.city
          };
          this.excelData.push(obj);
        });
        this.excelService.exportAsExcelFile(this.excelData, 'Vendor_List');
        // sending notification to procucev
        this.vendorReqSer.vendorDownloadExcNotification().subscribe((res: any) => {
          if (res) {
            console.log('Notified to procucev sucessfully');
          } else {
            console.log('Failed to notify Procucev');
          }
        });
        const count = parseInt(localStorage.getItem('downloadHitCount'));
      if (count >= 3) {
        const downloadButton = document.getElementById('downloadButton')  as HTMLButtonElement;
        downloadButton.disabled = true;
        downloadButton.title = 'Exceeded download limit. Please try after 10 seconds!!';
        setTimeout(function() {
          downloadButton.disabled = false;
          downloadButton.title = '';
        }, 10000);
        localStorage.setItem('downloadHitCount', '0');
      }
    }
  }

  approveVendor() {
    if (this.selectedData.length === 0) {
      this.toaster.error( 'Please select atleast one vendor');
    }
    let check = false;
    for (const item of this.selectedData) {
      if (item.vendorStatus === 'VendorAdded') {
        this.toaster.error( 'The selected vendors contains already approved vendors!!');
        check = true;
        return;
      }
    }
    if (check) {
      return;
    }
    const request = [];
    for (const item of this.selectedData) {
      const reqObj = {'id': item.id};
      request.push(reqObj);
    }
    this.vendorReqSer.approvePreVendor(request).subscribe((res) => {
      if (res['status'] === 'Success') {
        this.toaster.success(res['message'], 'Success');
        this.fetchVendors();
        this.selectedData = [];
      } else {
        this.toaster.error(res['errorMessage'], 'Failed');
      }
    });
  }

  enableVendor() {
    if (this.hasSelectedData()) {
      const req =  {
        'email': this.selectedData[0].email,
        'orgName': this.selectedData[0].companyName,
        'phone': this.selectedData[0].organizationPhonenumber
      };
      this.vendorReqSer.enableVendor(req).subscribe((res: any) => {
        this.showToaster(res);
      });
    }
  }
}
