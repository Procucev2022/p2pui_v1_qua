import { Component, Inject, OnInit, Optional, ViewChild, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';
import { VendorReqService } from '../../vendor-request/services/vendor-req.service';

@Component({
  selector: 'app-vendor-evolution',
  templateUrl: './vendor-evolution.component.html',
  styleUrls: ['./vendor-evolution.component.scss']
})
export class VendorEvolutionComponent implements OnInit {
  vendorDetails: any;
  selecetedVendor: any;
  @ViewChild('tabGroup') tabGroup;
  selectedIndex = 0;
  @Input('selectedVendorData') selectedVendorData;
  vendorInfoFormValidatity: boolean = false;
  capabilityFormValidatity: boolean = false;
  qualityFormValidatity: boolean = false;
  commercialFormValidatity: boolean = false;
  clientReferenceFormValidatity: boolean = false;
  constructor(public dialogRef: MatDialogRef<VendorEvolutionComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private encryDecryService: EncryDecryService,
    private toaster: ToastrService,
    private modalDialog: MatDialog,
    private vendorReqService: VendorReqService) { }

  ngOnInit() {
    console.log(this.data);
    this.selecetedVendor = {...this.data, id: this.data['vendor']};
  }

  submit(resp, isExit?: boolean) {
    this.vendorReqService.saveVendorInfo(resp).subscribe((res: any) => {
      this.successCallBack(res);
      if (isExit) {
        const respSuccess: any = res.vendor ? { status: 'Success', message: 'Vendor details updated successfully!'} : { status: 'Failuer', message: 'Unable to save details'};

       this.submitSuccessCallBack(respSuccess);
        return;
      }
      if (this.selectedIndex !== 4) {
      this.selectedIndex = this.tabGroup.selectedIndex + 1;
      }
    });
  }

  vendorInfoSubmit(data) {
    this.vendorInfoFormValidatity = data.vendorInfoFormValidatity;
    this.submit(data.data, data.isExit);
  }
  onVendorCapabilitySubmit(data) {
    if (this.vendorInfoFormValidatity) {
      this.capabilityFormValidatity = data.capabilityFormValidatity;
      this.vendorDetails['manPower'] = data.data.manPower;
      this.vendorDetails['managerial'] = data.data.managerial;
      this.vendorDetails['nonManagerial'] = data.data.nonManagerial;
      this.vendorDetails['machineTypes'] = data.data.machineTypes;
      this.vendorDetails['serviceCapacity'] = data.data.serviceCapacity;
      this.vendorDetails['bussinessAge'] = data.data.bussinessAge;
      this.vendorDetails['capacityUtilization'] = data.data.capacityUtilization;
      this.submit(this.vendorDetails);
    } else {
      this.toaster.warning('Please enter vendor info details', 'Warning');
      this.selectedIndex = 0;
    }
  }
  onVendorQualitySubmit(data) {
    if (this.capabilityFormValidatity) {
      this.qualityFormValidatity = data.qualityFormValidatity;
      this.vendorDetails['qualityCertification'] = data.data.qualityCertification === 'yes' ? true : false;
      this.vendorDetails['certification'] = data.data.certification ? data.data.certification : undefined;
      this.vendorDetails['materialSource'] = data.data.materialSource;
      this.vendorDetails['testCertifcates'] = data.data.testCertifcates === 'yes' ? true : false;
      this.vendorDetails['qualityTesting'] = data.data.qualityTesting === 'yes' ? true : false;
      this.vendorDetails['ensureQuality'] = data.data.ensureQuality ? data.data.ensureQuality : undefined;
      this.vendorDetails['packingQuality'] = data.data.packingQuality;
      this.vendorDetails['clientRejections'] = data.data.clientRejections;
      this.vendorDetails['subContracting'] = data.data.subContracting === 'yes' ? true : false;
      this.submit(this.vendorDetails);
    } else {
      this.toaster.warning('Please check & fill the mandatory data  for previous pages', 'Warning');
      this.selectedIndex = 0;
    }
  }
  onVendorCommercialSubmit(data) {
    if (this.qualityFormValidatity) {
      this.commercialFormValidatity = data.commercialFormValidatity
      this.vendorDetails['enquires'] = data.data.enquires;
      this.vendorDetails['conversionRate'] = data.data.conversionRate;
      this.vendorDetails['clientService'] = data.data.clientService;
      this.vendorDetails['billDiscounting'] = data.data.billDiscounting;
      this.vendorDetails['financialStability'] = data.data.financialStability;
      this.vendorDetails['paymentCycle'] = data.data.paymentCycle;
      this.submit(this.vendorDetails);
    } else {
      this.toaster.warning('Please check & fill the mandatory data  for previous pages', 'Warning');
      this.selectedIndex = 0;
    }
  }
  onVendorClientSubmit(data) {
    if (this.commercialFormValidatity) {
      if (this.vendorDetails.enquires && this.vendorDetails.materialSource && this.vendorDetails.manPower) {
        this.vendorDetails['existingClients'] = data.data.existingClients;
        this.vendorDetails['reffernceFeedback'] = data.data.reffernceFeedback;
        this.vendorDetails['feedback'] = data.data.feedback;
        this.submit(this.vendorDetails);
        this.vendorReqService.submitVendorInfo(this.vendorDetails).subscribe((res) => {
          this.submitSuccessCallBack(res);
          if (this.selectedIndex !== 4) {
          this.selectedIndex = this.tabGroup.selectedIndex + 1;
          }
        });
      } else {
        if (this.vendorDetails.enquires) {
          this.selectedIndex = 3;
        } else if (this.vendorDetails.qualityCertification) {
          this.selectedIndex = 2;
        } else {
          this.selectedIndex = 1;
        }
        this.toaster.warning('All the previous pages are mandatory', 'Warning');
      }
    } else {
      this.toaster.warning('Please enter previous page details', 'Warning');
      this.selectedIndex = 0;
    }
  }
  successCallBack(res: any) {
    console.log(res);
    this.vendorDetails = res;
  }
  submitSuccessCallBack(res: any) {
    if (res.status === 'Success') {
      this.toaster.success(res.message, 'Success');
    } else {
      this.toaster.error(res.message, 'Error');
    }
    this.dialogRef.close({event: 'close'});
  }
  onNext(event:any) {
    this.selectedIndex = this.tabGroup.selectedIndex + 1;
  }
  onBack(event:any) {
    this.selectedIndex = this.tabGroup.selectedIndex - 1;
  }
}
