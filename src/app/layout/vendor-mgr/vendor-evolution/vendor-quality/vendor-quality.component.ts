import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-vendor-quality',
  templateUrl: './vendor-quality.component.html',
  styleUrls: ['./vendor-quality.component.scss']
})
export class VendorQualityComponent implements OnInit {

  model:any = {}
  @Output() vendorQuality = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() back = new EventEmitter();
  @Input('selectedVendorData') selectedVendorData;
  @ViewChild('vendorQuality') qualityFormValidatity: FormGroup;

  @Input('selectedIndex') selectedIndex;
  constructor() { }

  ngOnInit() {
    this.model.vendor = this.selectedVendorData['id'];
    this.model.vendorName = this.selectedVendorData['vendorName'];
    this.model.certification = this.selectedVendorData['certification'] ;
    this.model.qualityCertification = this.selectedVendorData['qualityCertification'] ? 'yes': 'no';
    this.model.materialSource = this.selectedVendorData['materialSource'];
    this.model.testCertifcates = this.selectedVendorData['testCertifcates'] ? 'yes': 'no';
    this.model.qualityTesting = this.selectedVendorData['qualityTesting'] ? 'yes': 'no';
    this.model.ensureQuality = this.selectedVendorData['ensureQuality'];
    this.model.packingQuality = this.selectedVendorData['packingQuality'];
    this.model.clientRejections = this.selectedVendorData['clientRejections'];
    this.model.subContracting = this.selectedVendorData['subContracting'] ? 'yes': 'no';
  }

  onVendorQuallitySubmit(){
    this.vendorQuality.emit({data :this.model, qualityFormValidatity:this.qualityFormValidatity.valid})
  }

  onNext(){
    this.next.emit()
  }
  onBack(){
    this.back.emit()
  }
  onReset(){
    this.model = {}
  }

}
