


import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppConfig } from 'src/app/app.config';
import { ToastrService } from 'ngx-toastr';
import { VendorSearchService } from 'src/app/layout/vendor-mgr/services/vendor-search.service';
import { VendorNamesService } from 'src/app/layout/vendor-mgr/services/vendor-names.service';
import { MatDialogRef } from '@angular/material/dialog';
import {MatDialog} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services/cat-procu-requests.service';
import { EncryDecryService } from 'src/app/shared/services';

@Component({
  selector: 'app-vendor-search',
  templateUrl: './vendor-search.component.html',
  styleUrls: ['./vendor-search.component.scss']
})
export class VendorSearchComponent implements OnInit {
  public min = new Date();
    index = 0;
    dropDownConfig = {
        search: true,
        placeholder: 'Select',
        searchPlaceholder: 'Search',
        height: 'auto'
      };


      selectedType = ['Product-Class', 'Product-HSN', 'Service-Class', 'Service-SAC'];
      companyName  = '';
      city = '';
      vendorcategory = '';
      subCategory = '';
  rfqData: any;
  rfqClosingDate: any;
    loggedUserPermissions: any;
    loggedUserDetails: any;

      selectChangeHandler(event: any, i, type) {
        if (type === 'Service-Class') {
          this.getSections(i);
        }
        if (type === 'Service-SAC') {
        }

        if (type === 'Product-Class') {
          this.getSegments(i);
        }

        if (type === 'Product-HSN') {
        }
      }

      // For Service type
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

      classificationListForServices: any = [{
        section: '',
        heading: '',
        groupdescription: '',
        sac: '',
        sacCode: ''
      }];
      sections: any[];
      headings: any[];
      groupdescription: any[];
      sacs: any[];



        // FOR Product type
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

          classificationList: any = [{
            segmentName: '',
            familyName: '',
            className: '',
            commodityName: '',
            hsnCode: '',
            typeName: null,

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
      tempSegmentNames: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private searchVendor: VendorSearchService,

    private vendorApprovalSer: VendorNamesService,
    private procuReqService: CatProcuRequestsService,
    private tostrService: ToastrService, private matDialog: MatDialog, private dialogRef: MatDialogRef<VendorSearchComponent>,
    private encryDecryService:EncryDecryService ) { }

  ngOnInit() {
    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
    this.loggedUserPermissions = temp.details.listofPermission;
    this.loggedUserDetails = temp.details;
    this.selectedData = [];
    this.getSegments(this.index);
    this.getSections(this.index);
    this.rfqData = this.data;
    console.log('data', this.data);
  }

  searchsList: any = [];
  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  selectedData: any;

  add(i) {
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
      hsnCode: '',

      typeName: null,
      section: '',
      heading: '',
      groupdescription: '',
      sac: '',
      sacCode: ''
    });
    this.getSegments(i + 1);
  }
  remove(i: number) {
    this.approvalList.splice(i, 1);
    this.classificationList.splice(i, 1);
  }

  searchHeaders: any = [
    { field: 'companyName', header: 'Vendor Name', isLink: false },
    { field: 'companyId', header: 'Vendor Id', isLink: false },
    { field: 'vendorEmail', header: 'Vendor Email', isLink: false },
    { field: 'vendorPhone', header: 'Vendor MobileNumber', isLink: false },
    { field: 'vendorRank', header: 'Vendor Class', isLink: false },
    { field: 'city', header: 'City', isLink: false }
    // { field: 'segment', header: 'Segment', isLink: false }
  ];

  getRFQs() { }

  getSections(i) {
    this.vendorApprovalSer.getVendorClassificationDataForServices({}).subscribe((res: any) => {
      console.log(res);
      this.approvalList[i].sections = res || [];
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
      } else {

      }
    });
  }

  getGroups(byHeading, bySection, i) {
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
      } else {

      }

    });
  }

  getSegments(i) {
    this.vendorApprovalSer.getVendorClassificationData({}).subscribe((res: any) => {
      console.log(res);
      this.tempSegmentNames = res  || [];
      this.approvalList[i].segmentNames = res || [];
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
          this.classificationList[i]['hsnCode'] = '';
          this.classificationList[i]['hsnCode'] = res[0];
         console.log(this.classificationList);
      } else {

      }

    });
  }

  getSacCode(sac, section, heading, groupdescription, i) {
    const temp = {
        section: section,
        heading: heading,
        groupdescription: groupdescription,
        sac: sac
    };
    this.vendorApprovalSer.getVendorClassificationDataForServices(temp).subscribe((res: any) => {
        if (res) {
            console.log(res);
            this.classificationList[i]['sacCode'] = '';
            this.classificationList[i]['sacCode'] = res[0];
        } else {

        }

      });
  }

  onSegmentChange(segmentName, index) {
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
    this.getHeadings(section, index);
  }

  onHeadingChange(heading, section, index) {
    this.getGroups(heading, section, index);
  }

  onGroupChange(groupdescription, section, heading, index) {
    this.getSacs(groupdescription, section, heading, index);
  }

  onSacChange(sac, section, heading, groupdescription, index) {
      this.getSacCode(sac, section, heading, groupdescription, index);
  }



  onSubmit(form: NgForm) {
    if (this.companyName || this.city || this.vendorcategory || this.subCategory || (this.classificationList.length > 0 && this.classificationList[0].typeName) ) {
      const servicesList = [];
            const productList  = [];
            this.classificationList.forEach(c => {
                if (c.typeName === 'Product-Class') {
                  delete c['groupdescription'];
                  delete c['heading'];
                  delete c['sac'];
                  delete c['sacCode'];
                  delete c['section'];
                 // c.typeName = 'Product'
                  productList.push(c);
                }
                if (c.typeName === 'Product-HSN') {
                  delete c['groupdescription'];
                  delete c['heading'];
                  delete c['sac'];
                  delete c['sacCode'];
                  delete c['section'];
                  delete c['className'];
                  delete c['commodityName'];
                  delete c['familyName'];
                  delete c['segmentName'];
                  // c.typeName = 'Product'
                  productList.push(c);
                }
                if (c.typeName  === 'Service-Class') {
                  delete c['className'];
                  delete c['commodityName'];
                  delete c['familyName'];
                  delete c['segmentName'];
                 // c.typeName = 'Service'
                  servicesList.push(c);
                }
                if (c.typeName  === 'Service-SAC') {
                  delete c['groupdescription'];
                  delete c['heading'];
                  delete c['sac'];
                  delete c['hsncode'];
                  delete c['section'];
                  delete c['className'];
                  delete c['commodityName'];
                  delete c['familyName'];
                  delete c['segmentName'];
                  // c.typeName = 'Service'
                  servicesList.push(c);
                }
            });
              const temp = {
                  'city': this.city,
                  'companyName': this.companyName,
                  'vendorcategory': this.vendorcategory,
                  'subCategory': this.subCategory,
                  vendorCategory: productList,
                  vendorserviceApprove: servicesList
              };
              console.log(temp);
              this.searchsList = [];
              this.searchVendor.getSearchData(temp)
                      .subscribe(res => {
                          console.log(res);
                          if (Array.isArray(res)) {
                            res.forEach(element => {
                              element['status'] = element['status']['uiDisplay'];
                            });
                            this.searchsList = res || [];
                          }
                      });

      } else {
        this.tostrService.error('Please Enter Either Company or City or Category type or Vendor Category or Sub Category details', 'Warning');
      }
}

resetForm(form: NgForm) {
  this.selectedData = [];
    form.resetForm();
    this.searchsList = [];
    this.resetPanel();
}

resetPanel() {
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



sendRfqToVendors() {
  const vendorsList = [];
  if (this.rfqClosingDate) {
  if (this.selectedData.length > 0) {
    this.selectedData.forEach(vendor => {
      const obj =  {
          'organization': {
            'id': vendor['id']
          },
          'rfq': {
            'id': this.rfqData.id
          },
          'vendorResponseDate': this.rfqClosingDate || '',
          'cmUser': this.loggedUserDetails.id
        };
        vendorsList.push(obj);
    });
  }

  this.procuReqService.sentRfqToVendors(vendorsList).subscribe((response) => {
      if (response.status === 'Success') {
          this.tostrService.success(response.message, 'Success');
          this.matDialog.closeAll();
      } else {
          this.tostrService.warning(response.message, 'Failed');
      }
  });
} else {
  this.tostrService.error('Please enter RFQ closing date');
}
}

close() {
  this.matDialog.closeAll();
}


zoomout() {
  this.dialogRef.updateSize('70%');
}

zoomin() {
    this.dialogRef.updateSize('100%');
}


}
