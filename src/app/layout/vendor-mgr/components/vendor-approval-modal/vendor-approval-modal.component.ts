import { Component, Inject, Optional, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VendorNamesService } from '../../services/vendor-names.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { AppConfig } from 'src/app/app.config';
export interface VendorApprovalModelList {
  segmentName: string;
  familyName: string;
  className: number;
  commodityName: string;
}


@Component({
  selector: 'app-vendor-approval-modal',
  templateUrl: './vendor-approval-modal.component.html',
  styleUrls: ['./vendor-approval-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VendorApprovalModalComponent implements OnInit {
  selectedData: any;
  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  pageRecordSize1: any;
  pageOptions1: any;
  index = 0;
  action: string;
  local_data: any;
  hscCode: any[];
  vendorType: any;
  others: any;
  eagerNess: any;
  eagerNessTypes: any[] = ['High', 'Moderate', 'Low'];

  selectedProductor_Service;

  details = {
    selectProductorService: null
  };

  selectProductorService = ['Product', 'Service'];
  tempSegmentNames: any[];
    vendorTypes: any;
    hsnCodeed = false;
    sacCodeed = false;
  hsncodeList: any[] = [];
  saccodeList: any[] = [];
  productsData: any;
  servicesData: any;

  selectChangeHandler(event: any, i, type) {
    this.selectedProductor_Service = event.target.value;
      this.classificationList[i].typeName = event.target.value;
      if (type === 'Service') {
        this.getSections(i);
      }

      if (type === 'Product') {
        this.getSegments(i);
      }

  }

//   hsnCodeList: any[]=[];
//   sacCodeList:any[]=[];

  dropDownConfig = {
    search: true,
    placeholder: 'Select',
    searchPlaceholder: 'Search',
    height: 'auto'
  };

  vendorProductHeaders: any = [
    { field: 'productName', header: 'Product Name'  , isLink: true, width: '130px', fieldType: 'text'},
    { field: 'hsnCode', header: 'HSN Code', isLink: false, width: '140px' , fieldType: 'text'},
  ];

  vendorServiceHeaders: any = [
    { field: 'serviceName', header: 'service Name'  , isLink: true, width: '130px', fieldType: 'text'},
    { field: 'sacCode', header: 'SAC Code', isLink: false, width: '140px' , fieldType: 'text'},
];

  public approvalListForServices: any[] = [{
    section: '',
    heading: '',
    groupdescription: '',
    sac: '',
    sacCode: '',
    sacCodes: [],
    sections: [],
    headings: [],
    groupdescriptions: [],
    sacs: []
  }];


  public approvalList: any[] = [{
    segmentName: '',
    familyName: '',
    className: '',
    commodityName: '',
    hsnCode: '',
    hsnCodes: [],
    segmentNames: [],
    familyNames: [],
    classNames: [],
    commodityNames: [],
    typeName: '',

    section: '',
    heading: '',
    groupdescription: '',
    sac: '',
    sacCode: '',
    sacCodes: [],
    sections: [],
    headings: [],
    groupdescriptions: [],
    sacs: []
  }];

  classificationListForServices: any = [{
    section: '',
    heading: '',
    groupdescription: '',
    sac: '',
    sacCode: ''
  }];
  sections: any[];
  headings: any[];
  groupdescriptions: any[];
  sacs: any[];
  sacCodes: any[];

  typesList: any = [{
    name: '',
  }];
  classificationList: any = [{
    typeName: null,
    segmentName: '',
    familyName: '',
    className: '',
    commodityName: '',
    hsnCode: '',

    section: '',
    heading: '',
    groupdescription: '',
    sac: '',
    sacCode: ''
  }];
  segmentNames: any[];
  familyNames: any;
  approval: any = {};
  classNames: any;
  commodityNames: any[];
  hsnCode: any[];

  constructor(
    public dialogRef: MatDialogRef<VendorApprovalModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: VendorApprovalModelList,
    private vendorApprovalSer: VendorNamesService,
    private toaster: ToastrService) {
    console.log(data, 'popup data');
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit() {
    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    this.pageRecordSize1 = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions1 = AppConfig.GRID_PAGE_INFO.pageOptions;
    this.getSegments(this.index);
    this.getSections(this.index);
    this.getVendorTypes();
    this.getProducts();
    this.getServices();
  }
  getProducts() {
    const reqObj = {
      'id' : this.local_data.id
    };
    this.vendorApprovalSer.getProductsByVendor(reqObj).subscribe(data => {
      if (Array.isArray(data)) {
      this.productsData = data;
      }
    });
  }
  getServices() {
    const reqObj = {
      'id' : this.local_data.id
    };
    this.vendorApprovalSer.getServicesByVendor(reqObj).subscribe(data => {
      if (Array.isArray(data)) {
      this.servicesData = data;
      }
    });
  }

  adding(i) {
      this.approvalListForServices.push({
        section: '',
        heading: '',
        groupdescription: '',
        sac: '',
        sacCode: '',
        sacCodes: [],
        sections: [],
        headings: [],
        groupdescriptions: [],
        sacs: []
      });
      this.classificationListForServices.push({
        section: '',
        heading: '',
        groupdescription: '',
        sac: '',
        sacCode: '',

      });
      this.getSections(i + 1);
  }

  removing(i: number) {
    this.approvalListForServices.splice(i, 1);
    this.classificationListForServices.splice(i, 1);
  }


  add(i, type) {
    this.approvalList.push({
      segmentName: '',
      familyName: '',
      className: '',
      commodityName: '',
      hsnCode: '',
      hsnCodes: [],
      segmentNames: [],
      familyNames: [],
      classNames: [],
      commodityNames: [],
      typeName: '',

      section: '',
      heading: '',
      groupdescription: '',
      sac: '',
      sacCode: '',
      sacCodes: [],
      sections: [],
      headings: [],
      groupdescriptions: [],
      sacs: []
    });
    this.classificationList.push({
      segmentName: '',
      familyName: '',
      className: '',
      commodityName: '',
      typeName: null,

      section: '',
      heading: '',
      groupdescription: '',
      sac: '',
      sacCode: ''
    });

    // if(type == "Service"){
    //   this.getSections(i + 1)
    // }

    // if(type == "Product"){
    //   this.getSegments(i + 1)
    // }

  }
  remove(i: number) {
    this.approvalList.splice(i, 1);
    this.classificationList.splice(i, 1);
  }


  // closeDialog() {
  //   this.dialogRef.close({ event: 'Cancel' });
  // }

  // Getting Dropdown data for Services
  getSections(i) {
    this.vendorApprovalSer.getVendorClassificationDataForServices({}).subscribe((res: any) => {
      console.log(res);
      this.approvalList[i].sections = res || [];
    });
  }

  getVendorTypes() {
    this.vendorApprovalSer.getVendorOrClientByType({'type' : 'Vendor'}).subscribe((res: any) => {
        this.vendorTypes = res || [];
      });
  }

  getHeadings(bySection, i) {
    const temp = {
      section: bySection
    };
    this.vendorApprovalSer.getVendorClassificationDataForServices(temp).subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.approvalList[i].headings = [];
        this.approvalList[i].groupdescriptions = [];
        this.approvalList[i].sacs = [];
        this.approvalList[i].headings = res;
        this.classificationList[i].heading = null;
        this.classificationList[i].groupdescription = null;
        this.classificationList[i].sac = null;
      } else {

      }
    });
  }

  getGroupDescriptions(byHeading, bySection, i) {
    const temp = {
      section: bySection,
      heading: byHeading
    };
    this.vendorApprovalSer.getVendorClassificationDataForServices(temp).subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.approvalList[i].groupdescriptions = [];
        this.approvalList[i].sacs = [];
        this.approvalList[i].groupdescriptions = res;

        this.classificationList[i].groupdescription = null;
        this.classificationList[i].sac = null;
      } else {

      }
    });
  }

  getSacs(byGroupdescription, bySection, byHeading, i) {
    const temp = {
      section: bySection,
      heading: byHeading,
      groupdescription: byGroupdescription
    };
    this.vendorApprovalSer.getVendorClassificationDataForServices(temp).subscribe((res: any) => {
      if (res) {
        this.approvalList[i].sacs = [];
        this.approvalList[i].sacs = res;
        this.classificationList[i].sac = null;
      } else {

      }

    });
  }


  // Getting Dropdown data for Products
  getSegments(i) {
    this.vendorApprovalSer.getVendorClassificationData({}).subscribe((res: any) => {
      console.log(res);
      this.approvalList[i].segmentNames = res || [];
      this.tempSegmentNames = res || [];
    });
  }

  getFamilyNames(bySegmentName, i) {
    const temp = {
      segmentName: bySegmentName
    };
    this.vendorApprovalSer.getVendorClassificationData(temp).subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.approvalList[i].familyNames = [];
        this.approvalList[i].classNames = [];
        this.approvalList[i].commodityNames = [];
        this.classificationList[i].familyName = null;
        this.classificationList[i].className = null;
        this.classificationList[i].commodityName = null;
        this.approvalList[i].familyNames = res;
      } else {

      }
    });
  }

  getClassNames(byFamilyName, bySegmentName, i) {
    const temp = {
      segmentName: bySegmentName,
      familyName: byFamilyName
    };
    this.vendorApprovalSer.getVendorClassificationData(temp).subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.approvalList[i].classNames = [];
        this.approvalList[i].commodityNames = [];
        this.approvalList[i].classNames = res;
        this.classificationList[i].className = null;
        this.classificationList[i].commodityName = null;
      } else {

      }
    });
  }

  getCommodityNames(byClassName, bySegmentName, byFamilyName, i) {
    const temp = {
      segmentName: bySegmentName,
      familyName: byFamilyName,
      className: byClassName
    };
    this.vendorApprovalSer.getVendorClassificationData(temp).subscribe((res: any) => {
      if (res) {
        this.approvalList[i].commodityNames = [];
        this.approvalList[i].commodityNames = res;
        this.classificationList[i].commodityName = null;
      } else {

      }

    });
  }

  // For HSNCode
  getHsnCode(byCommodityName, bySegmentName, byFamilyName, byClassName, i) {
    const temp = {
      segmentName: bySegmentName,
      familyName: byFamilyName,
      className: byClassName,
      commodityName: byCommodityName
    };
    this.vendorApprovalSer.getVendorClassificationData(temp).subscribe((res: any) => {
      if (res) {
          console.log(res);
          // this.classificationList[i]['hscCode']= res[i];
          this.classificationList[i]['hsnCode'] = '';
          this.classificationList[i]['hsnCode'] = res[0];
          console.log(this.classificationList);
      } else {

      }

    });
  }

  getSacCode(sac, section, heading, byGroupDescriptions, i) {
    console.log('i', i);
    const temp = {
        section: section,
        heading: heading,
        groupdescription: byGroupDescriptions,
        sac: sac
    };
    this.vendorApprovalSer.getVendorClassificationDataForServices(temp).subscribe((res: any) => {
        if (res) {
            console.log(res[0]);
          this.classificationList[i]['sacCode'] = '';
          this.classificationList[i]['sacCode'] = res[0];
          // console.log(this.classificationListForServices)
        } else {

        }

      });
  }

  onSegmentChange(segmentName, index) {
    if (segmentName === undefined || segmentName === '') {
      this.hsnCodeed = false;
    } else {
    this.hsnCodeed = true;
    }
    this.getFamilyNames(segmentName, index);
  }

  onFamilyChange(familyName, segmentName, index) {
    this.getClassNames(familyName, segmentName, index);
  }

  onClassChange(className, segmentName, familyName, index) {
    this.getCommodityNames(className, segmentName, familyName, index);
  }

  // for HsnCode
  onCommodityChange(commodityName, segmentName, familyName, className, index ) {
    this.getHsnCode(commodityName, segmentName, familyName, className, index);
  }

  // For Service  //For Service //For Service
  onSectionChange(section, index) {
    if (section === undefined || section === '') {
      this.sacCodeed = false;
    } else {
    this.sacCodeed = true;
    }
    this.getHeadings(section, index);
  }

  onHeadingChange(heading, section, index) {
    this.getGroupDescriptions(heading, section, index);
  }

  onGroupDescriptionChange(groupdescription, section, heading, index) {
    this.getSacs(groupdescription, section, heading, index);
  }

  onSacChange(sac, section, heading, groupdescription, index) {
      this.getSacCode(sac, section, heading, groupdescription, index);
  }














  onSacCoded() {

    this.saccodeList = [];
    this.classificationList.forEach(c => {
      if (c.typeName === 'Service') {
        const reqObj = {
          'sacCode' : c.sacCode
        };
        this.vendorApprovalSer.getVendorClassificationDataForServices(reqObj).subscribe((res: any) => {
          console.log(res);
          this.saccodeList = res || [];
          if (this.saccodeList['errorCode']) {
            c['section'] = [];
                     c['heading'] = [];
                     c['groupdescription'] = [];
                     c['sac'] = [];
          } else {
            c['section'] = this.saccodeList[0];
                     c['heading'] = this.saccodeList[1] ;
                     c['groupdescription'] = this.saccodeList[2];
                     c['sac'] = this.saccodeList[3];
          }
        });
      }
    });
  }


  onHsnCoded() {

     this.hsncodeList = [];
    this.classificationList.forEach(c => {
      if (c.typeName === 'Product') {
        const reqObj = {
          'fullCode' : c.hsnCode
        };
        this.vendorApprovalSer.getVendorClassificationData(reqObj).subscribe((res: any) => {
          console.log(res);
          this.hsncodeList = res || [];
          if (this.hsncodeList['errorCode']) {
            c['segmentName'] = [];
                     c['familyName'] = [];
                     c['className'] = [];
                     c['commodityName'] = [];
          } else {
            c['segmentName'] = this.hsncodeList[0];
                     c['familyName'] = this.hsncodeList[1] ;
                     c['className'] = this.hsncodeList[2];
                     c['commodityName'] = this.hsncodeList[3];
          }
        });
      }
    });
  }


  onSubmit(form: NgForm, selected) {
    if ((this.classificationList.length > 0 && this.classificationList[0].typeName) ) {
        swal({
          title: '<h5>Please Confirm!!<h5>',
          html: '<h3>Are you sure you want to approve?</h3>',
          type: 'warning',
          confirmButtonText: 'Yes',
          confirmButtonColor: '#006dd5',
          cancelButtonColor: '#d63636',
          showCancelButton: true,
          reverseButtons: true
        }).then((result) => {
          if (result.value) {
            if (true) {
              const servicesList = [];
              const productList  = [];
              this.classificationList.forEach(c => {
                  c['organization'] = {
                  'id': this.local_data.id,
                  'pan': this.local_data.pan
                  };
                  if (c.typeName === 'Product') {
                    if (c.segmentName === undefined || c.segmentName === '' ) {
                      c['hsncode'] = c.hsnCode;
                    delete c['groupdescription'];
                    delete c['heading'];
                    delete c['sac'];
                    delete c['sacCode'];
                    delete c['section'];
                      if (this.hsncodeList['errorCode']) {
                        this.toaster.error('No details found', 'Failure');
                     } else {
                        c['segmentName'] = this.hsncodeList[0];
                     c['familyName'] = this.hsncodeList[1];
                     c['className'] = this.hsncodeList[2];
                     c['commodityName'] = this.hsncodeList[3];
                    productList.push(c);
                     }
                    } else {
                      c['hsncode'] = c.hsnCode;
                    delete c['groupdescription'];
                    delete c['heading'];
                    delete c['sac'];
                    delete c['sacCode'];
                    delete c['section'];
                    // c['hsnCode']= '';
                    productList.push(c);
                    }
                  }

                  if (c.typeName  === 'Service') {
                    if (c.section === undefined || c.section === '' ) {
                      delete c['className'];
                      delete c['commodityName'];
                      delete c['familyName'];
                      delete c['segmentName'];
                      delete c['hsnCode'];
                      if (this.saccodeList['errorCode']) {
                        this.toaster.error('No details found', 'Failure');
                      } else {
                        c['groupdescription'] = this.saccodeList[0];
                      c['heading'] = this.saccodeList[1];
                      c['sac'] = this.saccodeList[2];
                      c['section'] = this.saccodeList[3];
                      servicesList.push(c);
                      }
                    } else {
                    delete c['className'];
                    delete c['commodityName'];
                    delete c['familyName'];
                    delete c['segmentName'];
                    servicesList.push(c);
                      }
                  }
              });
              console.log('classficationList', this.classificationList);

              const inputJson = {
                  id: this.local_data.id,
                  pan: this.local_data.pan,
                  vendorType: this.vendorType === 'Others' ? this.others : this.vendorType,
                  eagerNess: this.eagerNess,
                  vendorCategory: productList,
                  vendorserviceApprove: servicesList
              };
              console.log(inputJson);
              this.vendorApprovalSer.approveVendorRegistration([inputJson]).subscribe((res: any) => {
                  if (res.status === 'Success' || res.status === 'success') {
                  this.toaster.success(res.message, 'Success');
                  this.dialogRef.close({ event: 'submit' });
                  } else {
                  this.toaster.error(res.errorMessage, 'Failure');
                  }
              });
          }
          // if(selected == 'Service'){

          //     this.classificationListForServices.forEach(c => {
          //         c['organization'] = {
          //         'id': this.local_data.id,
          //         'pan': this.local_data.pan
          //         }
          //     });
          //     var vendorService = {
          //         id: this.local_data.id,
          //         pan:this.local_data.pan,
          //         vendorserviceApprove: this.classificationListForServices
          //     }
          //     //console.log(inputJson)
          //     this.vendorApprovalSer.approveVendorRegistration([vendorService]).subscribe((res: any) => {
          //         if (res.status == 'Success' || res.status == 'success') {
          //         this.toaster.success(res.message, 'Success')
          //         this.dialogRef.close({ event: 'submit' });
          //         } else {
          //         this.toaster.error(res.message, 'Failure')
          //         }
          //     })

          // }

        } else if (result.dismiss === swal.DismissReason.cancel) {

      }
    });


    } else {
      this.toaster.error('Please select the required field', 'Warning');
    }
  }


resetPanel() {
  this.hsnCodeed = false;
  this.sacCodeed = false;
  this.approvalList = [{
    segmentName: '',
    familyName: '',
    className: '',
    commodityName: '',
    segmentNames: [],
    familyNames: [],
    classNames: [],
    commodityNames: [],

    typeName: null,
    section: '',
    heading: '',
    groupdescription: '',
    sac: '',
    sacCode: '',
    sacCodes: [],
    sections: [],
    headings: [],
    groupdescriptions: [],
    sacs: []
  }];

  this.classificationList = [{
    segmentName: '',
    familyName: '',
    className: '',
    commodityName: '',

    section: '',
    heading: '',
    groupdescription: '',
    sac: '',
    sacCode: ''
  }];

  this.segmentNames = this.tempSegmentNames;
  this.familyNames = [];
  this.getSegments(0);
}

}



