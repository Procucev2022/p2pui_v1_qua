import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VendorApprovalModelList } from 'src/app/layout/vendor-mgr/components/vendor-approval-modal/vendor-approval-modal.component';
import { Optional } from 'ag-grid-community';
import { VendorNamesService } from 'src/app/layout/vendor-mgr/services/vendor-names.service';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { VendorReqService } from '../../services/vendor-req.service';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';
import { EncryDecryService } from 'src/app/shared/services';

@Component({
    selector: 'app-vendor-req-modal',
    templateUrl: './vendor-req-modal.component.html',
    styleUrls: ['./vendor-req-modal.component.scss']
})
export class VendorReqModalComponent implements OnInit {

    index = 0;
    action: string;
    local_data: any;
    vendorType: any;

    priorityTypes: any[] = ["High", "Moderate", "Low"];
    selectedPriority: any;
    description: any;
    selectedProductor_Service

    details = {
        selectProductorService: null
    };

    selectProductorService = ['Product', 'Service']
    tempSegmentNames: any[];
    vendorTypes: any;
    sacCode: any;
    selectedHsnCode: any;
    selectedSacCode: any;
    loggedUserDetails: any;

    selectChangeHandler(event: any, i, type) {
        this.selectedProductor_Service = event.target.value;
        this.classificationList[i].typeName = event.target.value;
        this.selectedHsnCode = undefined;
        this.selectedSacCode = undefined;
        if (type == "Service") {
            this.getSections(i)
        }

        if (type == "Product") {
            this.getSegments(i)
        }

    }


    dropDownConfig = {
        search: true,
        placeholder: 'Select',
        searchPlaceholder: 'Search',
        height: 'auto'
    }

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
    }]
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
    }]
    segmentNames: any[];
    familyNames: any;
    approval: any = {};
    classNames: any;
    commodityNames: any[];
    hsnCode: any[];
    certificatesArray: any[] = [];
    certificatesToBase64: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<VendorReqModalComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: VendorApprovalModelList,
        private vendorApprovalSer: VendorNamesService,
        private vendorReqSer: VendorReqService,
        private toaster: ToastrService,
        private convertSer: ConvertToBase64Service,
        private encryDecryService : EncryDecryService) {
        console.log(data, 'popup data');
        this.local_data = { ...data };
        this.action = this.local_data.action;
    }

    ngOnInit() {
        const temp =  JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')) );
        this.loggedUserDetails = temp.details;
        this.getSegments(this.index);
        this.getSections(this.index);
        this.getVendorTypes()
    }

    // adding(i) {
    //     this.approvalListForServices.push({
    //         section: '',
    //         heading: '',
    //         groupdescription: '',
    //         sac: '',
    //         sacCode: '',
    //         sacCodes: [],
    //         sections: [],
    //         headings: [],
    //         groupdescriptions: [],
    //         sacs: []
    //     });
    //     this.classificationListForServices.push({
    //         section: '',
    //         heading: '',
    //         groupdescription: '',
    //         sac: '',
    //         sacCode: '',

    //     })
    //     this.getSections(i + 1)
    // }

    // removing(i: number) {
    //     this.approvalListForServices.splice(i, 1);
    //     this.classificationListForServices.splice(i, 1);
    // }


    // add(i, type) {
    //     this.approvalList.push({
    //         segmentName: '',
    //         familyName: '',
    //         className: '',
    //         commodityName: '',
    //         hsnCode: '',
    //         hsnCodes: [],
    //         segmentNames: [],
    //         familyNames: [],
    //         classNames: [],
    //         commodityNames: [],
    //         typeName: '',

    //         section: '',
    //         heading: '',
    //         groupdescription: '',
    //         sac: '',
    //         sacCode: '',
    //         sacCodes: [],
    //         sections: [],
    //         headings: [],
    //         groupdescriptions: [],
    //         sacs: []
    //     });
    //     this.classificationList.push({
    //         segmentName: '',
    //         familyName: '',
    //         className: '',
    //         commodityName: '',
    //         typeName: null,

    //         section: '',
    //         heading: '',
    //         groupdescription: '',
    //         sac: '',
    //         sacCode: ''
    //     })

    //     // if(type == "Service"){
    //     //   this.getSections(i + 1)
    //     // }

    //     // if(type == "Product"){
    //     //   this.getSegments(i + 1)
    //     // }

    // }
    // remove(i: number) {
    //     this.approvalList.splice(i, 1);
    //     this.classificationList.splice(i, 1);
    // }


    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }

    //Getting Dropdown data for Services
    getSections(i) {
        this.vendorApprovalSer.getVendorClassificationDataForServices({}).subscribe((res: any) => {
            console.log(res);
            this.approvalList[i].sections = res || [];
        })
    }

    getVendorTypes() {
        this.vendorApprovalSer.getVendorOrClientByType({ 'type': 'Vendor' }).subscribe((res: any) => {
            this.vendorTypes = res || []
        })
    }

    getHeadings(bySection, i) {
        var temp = {
            section: bySection
        }
        this.vendorApprovalSer.getVendorClassificationDataForServices(temp).subscribe((res: any) => {
            if (res) {
                console.log(res);
                this.approvalList[i].headings = [];
                this.approvalList[i].groupdescriptions = [];
                this.approvalList[i].sacs = [];
                this.approvalList[i].headings = res;
                this.classificationList[i].heading = null
                this.classificationList[i].groupdescription = null
                this.classificationList[i].sac = null
            } else {

            }
        })
    }

    getGroupDescriptions(byHeading, bySection, i) {
        var temp = {
            section: bySection,
            heading: byHeading
        }
        this.vendorApprovalSer.getVendorClassificationDataForServices(temp).subscribe((res: any) => {
            if (res) {
                console.log(res);
                this.approvalList[i].groupdescriptions = [];
                this.approvalList[i].sacs = [];
                this.approvalList[i].groupdescriptions = res;

                this.classificationList[i].groupdescription = null
                this.classificationList[i].sac = null
            } else {

            }
        })
    }

    getSacs(byGroupdescription, bySection, byHeading, i) {
        var temp = {
            section: bySection,
            heading: byHeading,
            groupdescription: byGroupdescription
        }
        this.vendorApprovalSer.getVendorClassificationDataForServices(temp).subscribe((res: any) => {
            if (res) {
                this.approvalList[i].sacs = [];
                this.approvalList[i].sacs = res;
                this.classificationList[i].sac = null
            } else {

            }

        })
    }


    //Getting Dropdown data for Products
    getSegments(i) {
        this.vendorApprovalSer.getVendorClassificationData({}).subscribe((res: any) => {
            console.log(res);
            this.approvalList[i].segmentNames = res || [];
            this.tempSegmentNames = res || [];
        })
    }

    getFamilyNames(bySegmentName, i) {
        var temp = {
            segmentName: bySegmentName
        }
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
        })
    }

    getClassNames(byFamilyName, bySegmentName, i) {
        var temp = {
            segmentName: bySegmentName,
            familyName: byFamilyName
        }
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
        })
    }

    getCommodityNames(byClassName, bySegmentName, byFamilyName, i) {
        var temp = {
            segmentName: bySegmentName,
            familyName: byFamilyName,
            className: byClassName
        }
        this.vendorApprovalSer.getVendorClassificationData(temp).subscribe((res: any) => {
            if (res) {
                this.approvalList[i].commodityNames = [];
                this.approvalList[i].commodityNames = res;
                this.classificationList[i].commodityName = null;
            } else {

            }

        })
    }

    //For HSNCode
    getHsnCode(byCommodityName, bySegmentName, byFamilyName, byClassName, i) {
        var temp = {
            segmentName: bySegmentName,
            familyName: byFamilyName,
            className: byClassName,
            commodityName: byCommodityName
        }
        this.vendorApprovalSer.getVendorClassificationData(temp).subscribe((res: any) => {
            if (res) {
                console.log(res)

                this.classificationList[i]['hsnCode'] = '';
                this.classificationList[i]['hsnCode'] = res[0];
                this.selectedHsnCode = res[0];
                this.hsnCode = res[1]
                console.log(this.classificationList)
            } else {

            }

        })
    }

    getSacCode(sac, section, heading, byGroupDescriptions, i) {
        console.log('i', i)
        var temp = {
            section: section,
            heading: heading,
            groupdescription: byGroupDescriptions,
            sac: sac
        }
        this.vendorApprovalSer.getVendorClassificationDataForServices(temp).subscribe((res: any) => {
            if (res) {
                console.log(res[0]);
                this.classificationList[i]['sacCode'] = '';
                this.classificationList[i]['sacCode'] = res[0];
                this.selectedSacCode = res[0];
                this.sacCode = res[1]
                // console.log(this.classificationListForServices)
            } else {

            }

        })
    }

    onSegmentChange(segmentName, index, familyRef, classRef, commodityRef) {
        familyRef.value = undefined;
        familyRef._value = undefined;
        familyRef.disabled = true;
        this.approvalList[0].familyNames = [];

        classRef.value = undefined;
        classRef._value = undefined;
        classRef.disabled = true;
        this.approvalList[0].classNames = [];


        commodityRef.value = undefined;
        commodityRef._value = undefined;
        commodityRef.disabled = true;
        this.approvalList[0].commodityNames = [];

        this.getFamilyNames(segmentName, index);
    }

    onFamilyChange(familyName, segmentName,index, classRef,commodityRef) {
        classRef.value = undefined;
        classRef._value = undefined;
        classRef.disabled = true;
        this.approvalList[0].classNames = [];

        commodityRef.value = undefined;
        commodityRef._value = undefined;
        commodityRef.disabled = true;
        this.approvalList[0].commodityNames = [];
        this.getClassNames(familyName, segmentName, index);
    }

    onClassChange(className, segmentName, familyName, index,commodityRef) {
        commodityRef.value = undefined;
        commodityRef._value = undefined;
        commodityRef.disabled = true;
        this.approvalList[0].commodityNames = [];
        this.getCommodityNames(className, segmentName, familyName, index);
    }

    //for HsnCode
    onCommodityChange(commodityName, segmentName, familyName, className, index) {
        this.getHsnCode(commodityName, segmentName, familyName, className, index)
    }

    //For Service  //For Service //For Service
    onSectionChange(section, index, headingRef,groupRef,sacRef) {
        headingRef.value = undefined;
        headingRef._value = undefined;
        headingRef.disabled = true;
        this.approvalList[0].headings = [];

        groupRef.value = undefined;
        groupRef._value = undefined;
        groupRef.disabled = true;
        this.approvalList[0].groupdescriptions = [];


        sacRef.value = undefined;
        sacRef._value = undefined;
        sacRef.disabled = true;
        this.approvalList[0].sacs = [];

        this.getHeadings(section, index)
    }

    onHeadingChange(heading, section, index,groupRef,sacRef) {
        groupRef.value = undefined;
        groupRef._value = undefined;
        groupRef.disabled = true;
        this.approvalList[0].groupdescriptions = [];


        sacRef.value = undefined;
        sacRef._value = undefined;
        sacRef.disabled = true;
        this.approvalList[0].sacs = [];
        this.getGroupDescriptions(heading, section, index);
    }

    onGroupDescriptionChange(groupdescription, section, heading, index,sacRef) {
        sacRef.value = undefined;
        sacRef._value = undefined;
        sacRef.disabled = true;
        this.approvalList[0].sacs = [];
        this.getSacs(groupdescription, section, heading, index);
    }

    onSacChange(sac, section, heading, groupdescription, index) {
        this.getSacCode(sac, section, heading, groupdescription, index);
    }



    onSubmit(form: NgForm, selected) {
        console.log(form);

        if (form.valid) {
            let servicesList = [];
            let productList = [];
            this.classificationList.forEach(c => {
                c['organization'] = {
                    'id': this.local_data.id,
                    'pan': this.local_data.pan
                }
                if (c.typeName == 'Product') {
                    delete c['groupdescription'];
                    delete c['heading'];
                    delete c['sac'];
                    delete c['sacCode'];
                    delete c['section'];
                    c['hsnCode'] = '';
                    productList.push(c)
                }

                if (c.typeName == 'Service') {
                    delete c['className'];
                    delete c['commodityName'];
                    delete c['familyName'];
                    delete c['segmentName'];
                    servicesList.push(c)
                }
            });
            console.log('classficationList', this.classificationList);

            var inputJson = {
                type: this.classificationList[0].typeName,
                vendorCategory: this.hsnCode ? { id: this.hsnCode } : null,
                vendorServiceApprove: this.sacCode ? { id: this.sacCode } : null,
                description: this.description,
                priority: this.selectedPriority,
                code: this.selectedHsnCode ? this.selectedHsnCode : (this.selectedSacCode ? this.selectedSacCode : null),
                vendorreqDocuments : this.certificatesToBase64
            }
            console.log(inputJson)
            this.vendorReqSer.createNewRequestVendor(inputJson).subscribe((res: any) => {
                if (res.statusCode == 'Success' || res.statusCode == 'success') {
                    this.toaster.success(res.message, 'Success')
                    this.dialogRef.close({ event: 'submit' });
                } else {
                    this.toaster.error(res.errorMessage, 'Failure')
                }
            })

        } else {
            this.toaster.error('Please fill the required(*) fields', 'Warning')
        }
    }


    resetPanel(form:NgForm) {
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
        }]

        this.segmentNames = this.tempSegmentNames;
        this.familyNames = [];
        this.getSegments(0)

        form.reset();
    }

    uploadCertificates(files) {
        console.log('files', files)
        Array.from(files).forEach(file => {
          this.certificatesArray.push(file)
        });
        this.multi()
      }
      multi(){
        if(this.certificatesArray.length>0) {
            this.certificatesArray.forEach(element => {
              console.log('element.cer', element)
              if(element.isOldCertificate) {
      
              } else {
                this.certificatesToBase64 = []

                this.convertSer.getBase64(element).then((data:string)=> {
                  const temp = {
                    fileName: element.name,
                    file: data.split(',')[1]
                  }
                  this.certificatesToBase64.push(temp)
                });
              }
            });
          }
      }
      deleteAttachment(index, type) {
        this[type].splice(index, 1)
        if(type == 'certificatesArray') {
          this.certificatesToBase64.splice(index,1)
        //   this.vendorRegObj.certificates.splice(index, 1);
        }
            console.log('certificatesArray', this.certificatesArray)
      }

}
