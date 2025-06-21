import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { VendorSearchService } from '../services/vendor-search.service';
import { AppConfig } from 'src/app/app.config';
import { VendorNamesService } from '../services/vendor-names.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { VendorViewModelService } from '../services/vendor-view-model.service';
import { VendorViewModelComponent } from '../../../shared/modules/common-share/components/vendor-view-model/vendor-view-model.component';

@Component({
  selector: 'app-vmgr-vendor-search',
  templateUrl: './vmgr-vendor-search.component.html',
  styleUrls: ['./vmgr-vendor-search.component.scss']
})
export class VmgrVendorSearchComponent implements OnInit {

  index = 0;
  dropDownConfig = {
    search: true,
    placeholder: 'Select',
    searchPlaceholder: 'Search',
    height: 'auto'
  }

//   hsnCodeList: any[]=[];
//   sacCodeList:any[]=[];
  selectedTypeData;

  details={
    selectedType:null
  };

  selectedType = ['Product-Class','Product-HSN','Service-Class','Service-SAC'];
  companyName  = '';
  city = '';
  vendorRegData: any;

  selectChangeHandler(event:any, i, type) {
    this.selectedTypeData = event.target.value;
    if(type == "Service-Class") {
      this.getSections(i)
    }
    if(type == "Service-SAC") {
    }

    if(type == "Product-Class") {
      this.getSegments(i)
    }

    if(type == "Product-HSN") {
    }
  }

  // For Service type
  public approvalListForServices: any[] = [{
    section: '',
    heading: '',
    groupdescription: '',
    sac: '',
    sacCode:'',
    sacCodes:[],
    sections: [],
    headings: [],
    groupdescriptions: [],
    sacs: []
  }];

  classificationListForServices: any =[{
    section: '',
    heading: '',
    groupdescription: '',
    sac: '',
    sacCode:''
  }]
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
        hsncode:'',
        hsnCodes:[],
        segmentNames: [],
        familyNames: [],
        classNames: [],
        commodityNames: [],


      section: '',
      heading: '',
      groupdescription: '',
      sac: '',
      sacCode:'',
      sacCodes:[],
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
        hsncode:'',
        typeName: null,

        section: '',
        heading: '',
        groupdescription: '',
        sac: '',
        sacCode:''

      }]
      segmentNames: any[];
      familyNames: any;
      approval: any = {};
      classNames: any;
      commodityNames: any[];
      hsncode: any[];
  tempSegmentNames: any[];


  constructor(private searchVendor:VendorSearchService,
    private vendorApprovalSer: VendorNamesService,
    private toaster: ToastrService,private matDialog: MatDialog,private vendorViewService: VendorViewModelService) { }

  ngOnInit() {
    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    this.getSegments(this.index);
    this.getSections(this.index);
  }

  searchsList: any = [];
  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  selectedData: any;

  adding(i) {
    this.approvalListForServices.push({
      section: '',
      heading: '',
      groupdescription: '',
      sac: '',
      sacCode:'',
      sacCodes:[],
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
      sacCode:''
    })
    this.getSections(i + 1)
}

removing(i: number) {
  this.approvalListForServices.splice(i, 1);
  this.classificationListForServices.splice(i, 1);
}

  add(i) {
    this.approvalList.push({
      segmentName: '',
      familyName: '',
      className: '',
      commodityName: '',
      hsncode:'',
      hsnCodes:[],
      segmentNames: [],
      familyNames: [],
      classNames: [],
      commodityNames: [],
      typeName: '',

      section: '',
      heading: '',
      groupdescription: '',
      sac: '',
      sacCode:'',
      sacCodes:[],
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
      hsncode:'',

      typeName: null,
      section: '',
      heading: '',
      groupdescription: '',
      sac: '',
      sacCode:''
    })
    this.getSegments(i + 1)
  }
  remove(i: number) {
    this.approvalList.splice(i, 1);
    this.classificationList.splice(i, 1);
  }

  searchHeaders: any = [
    { field: 'companyName', header: 'Company Name', isLink: false, width:'170px' },
    { field: 'companyId', header: 'Vendor Id', isLink: false, width:'150px' },
    { field: 'vendorEmail', header: 'Vendor Email', isLink: false, width:'200px' },
    { field: 'vendorPhone', header: 'Vendor PhoneNumber', isLink: false, width:'200px' },
    { field: 'city', header: 'City', isLink: false, width:'150px' },
    { field: 'vendorRank', header: 'Vendor Class', isLink: false, width:'150px' },
    // { field: 'hsncode', header: 'HSN Code', isLink: false },
    // { field: 'state', header: 'State', isLink: false },
    // { field: 'segment', header: 'Segment', isLink: false }
  ];

  getRFQs() { }

  getSections(i) {
    this.vendorApprovalSer.getVendorClassificationDataForServices({}).subscribe((res: any) => {
      console.log(res);
      this.approvalList[i].sections = res || [];
    })
  }

  getHeadings(bySection, i) {
    let temp = {
      section: bySection
    }
    this.vendorApprovalSer.getVendorClassificationDataForServices(temp).subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.approvalList[i].headings = [];
        this.approvalList[i].groupdescriptions = [];
        this.approvalList[i].sacs = [];
        this.approvalList[i].headings = res;
      } else {

      }
    })
  }

  getGroups(byHeading, bySection, i) {
    let temp = {
      section: bySection,
      heading: byHeading
    }
    this.vendorApprovalSer.getVendorClassificationDataForServices(temp).subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.approvalList[i].groupdescriptions = [];
        this.approvalList[i].sacs = [];
        this.approvalList[i].groupdescriptions = res;
      } else {

      }
    })
  }

  getSacs(byGroupdescription, bySection, byHeading, i) {
    let temp = {
      section: bySection,
      heading: byHeading,
      groupdescription: byGroupdescription
    }
    this.vendorApprovalSer.getVendorClassificationDataForServices(temp).subscribe((res: any) => {
      if (res) {
        this.approvalList[i].sacs = [];
        this.approvalList[i].sacs = res;
      } else {

      }

    })
  }

  getSegments(i) {
    this.vendorApprovalSer.getVendorClassificationData({}).subscribe((res: any) => {
      console.log(res);
      this.tempSegmentNames = res  || [];
      this.approvalList[i].segmentNames = res || [];
    })
  }

  getFamilyNames(bySegmentName, i) {
    let temp = {
      segmentName: bySegmentName
    }
    this.vendorApprovalSer.getVendorClassificationData(temp).subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.approvalList[i].familyNames = [];
        this.approvalList[i].classNames = [];
        this.approvalList[i].commodityNames = [];
        this.approvalList[i].familyNames = res;
      } else {

      }
    })
  }

  getClassNames(byFamilyName, bySegmentName, i) {
    let temp = {
      segmentName: bySegmentName,
      familyName: byFamilyName
    }
    this.vendorApprovalSer.getVendorClassificationData(temp).subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.approvalList[i].classNames = [];
        this.approvalList[i].commodityNames = [];
        this.approvalList[i].classNames = res;
      } else {

      }
    })
  }

  getCommodityNames(byClassName, bySegmentName, byFamilyName, i) {
    let temp = {
      segmentName: bySegmentName,
      familyName: byFamilyName,
      className: byClassName
    }
    this.vendorApprovalSer.getVendorClassificationData(temp).subscribe((res: any) => {
      if (res) {
        this.approvalList[i].commodityNames = [];
        this.approvalList[i].commodityNames = res;
      } else {

      }

    })
  }


  // For HSNCode
  getHsnCode(byCommodityName,bySegmentName, byFamilyName,byClassName, i) {
    let temp = {
      segmentName: bySegmentName,
      familyName: byFamilyName,
      className: byClassName,
      commodityName: byCommodityName
    }
    this.vendorApprovalSer.getVendorClassificationData(temp).subscribe((res: any) => {
      if (res) {
          console.log(res)
          this.classificationList[i]['hsncode'] = '';
          this.classificationList[i]['hsncode']= res[0];
         console.log(this.classificationList)
      } else {

      }

    })
  }

  getSacCode(sac,section,heading,groupdescription,i) {
    let temp = {
        section: section,
        heading:heading,
        groupdescription:groupdescription,
        sac:sac
    }
    this.vendorApprovalSer.getVendorClassificationDataForServices(temp).subscribe((res: any) => {
        if (res) {
            console.log(res);
            this.classificationList[i]['sacCode'] = '';
            this.classificationList[i]['sacCode']= res[0];
           console.log(this.classificationListForServices)
        } else {

        }

      })
  }

  onSegmentChange(segmentName, index) {
    this.getFamilyNames(segmentName, index)
  }

  onFamilyChange(familyName, segmentName, index) {
    this.getClassNames(familyName, segmentName, index);
  }

  onClassChange(className, segmentName, familyName, index) {
    this.getCommodityNames(className, segmentName, familyName, index);
  }

   // for HsnCode
   onCommodityChange(commodityName, segmentName,familyName,className,index ) {
    this.getHsnCode(commodityName, segmentName,familyName,className,index)
  }

  // For Service  //For Service //For Service
  onSectionChange(section, index) {
    this.getHeadings(section, index)
  }

  onHeadingChange(heading, section, index) {
    this.getGroups(heading, section, index);
  }

  onGroupChange(groupdescription, section, heading, index) {
    this.getSacs(groupdescription, section, heading, index);
  }

  onSacChange(sac,section,heading,groupdescription,index) {
      this.getSacCode(sac,section,heading,groupdescription,index);
  }

  onSubmit(form: NgForm,selected) {
      if(this.companyName || this.city || (this.classificationList.length>0 && this.classificationList[0].typeName) ) {
        let servicesList = [];
              let productList  = [];
              this.classificationList.forEach(c => {
                  if(c.typeName == 'Product-Class') {
                    delete c['groupdescription'];
                    delete c['heading'];
                    delete c['sac'];
                    delete c['sacCode'];
                    delete c['section'];
                    // c.typeName = 'Product'
                    productList.push(c)
                  }
                  if(c.typeName == 'Product-HSN') {
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
                    productList.push(c)
                  }
                  if(c.typeName  == 'Service-Class') {
                    delete c['className'];
                    delete c['commodityName'];
                    delete c['familyName'];
                    delete c['segmentName'];
                    // c.typeName = 'Service'
                    servicesList.push(c)
                  }
                  if(c.typeName  == 'Service-SAC') {
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
                    servicesList.push(c)
                  }
              });
                let temp = {
                    'city': this.city,
                    'companyName': this.companyName,
                    vendorCategory: productList,
                    vendorserviceApprove: servicesList
                }
                console.log(temp);
                this.searchsList = []
                this.searchVendor.getSearchData(temp)
                        .subscribe(res => {
                            console.log(res)
                            if (Array.isArray(res)) {
                              res.forEach(element => {
                                element['status'] = element.status ? element['status']['uiDisplay'] : '';
                              });
                              this.searchsList = res || [];
                            }
                        });

        } else {
          this.toaster.error('Please Enter Either Company or City or Category type details', 'Warning')
        }
  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.resetPanel();
    this.searchsList= [];
    this.selectedTypeData = '';
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
    sacCode:'',
    sacCodes:[],
    sections: [],
    headings: [],
    groupdescriptions: [],
    sacs: []
  }];

  this.classificationList = [{
    segmentName: '',
    familyName: '',
    className: '',
    commodityName: ''
  }]
  this.segmentNames = this.tempSegmentNames;
  this.familyNames = [];
  this.getSegments(0)
}
viewVendor(data) {
  const temp = {
    id: data.id
  };
  this.vendorViewService.getVendorById(temp).subscribe((res:any)=> {

    if(res) {
      this.vendorRegData = res || {};
      this.viewVendorModal();
    } else {
      this.toaster.error('Failed to Fetch data', 'Failure');
    }
  });

}

viewVendorModal() {
  const dialogConfig = new MatDialogConfig();

  dialogConfig.autoFocus = false;
  dialogConfig.data = this.vendorRegData;
  dialogConfig.width = '80%';
  dialogConfig.maxWidth = 'none';

  const dialogRef = this.matDialog.open(VendorViewModelComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(result => {
    console.log(result);
  });
}




}
