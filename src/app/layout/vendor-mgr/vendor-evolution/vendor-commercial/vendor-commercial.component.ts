import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-vendor-commercial',
  templateUrl: './vendor-commercial.component.html',
  styleUrls: ['./vendor-commercial.component.scss']
})
export class VendorCommercialComponent implements OnInit {

  model:any = {}
  @Output() vendorCommercial = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() back = new EventEmitter();
  @Input('selectedVendorData') selectedVendorData;
  @ViewChild('vendorCommercial') vendorCommercialForm: FormGroup;


  constructor() { }

  ngOnInit() {
    this.model.enquires = this.selectedVendorData['enquires'];
    this.model.conversionRate = this.selectedVendorData['conversionRate'];
    this.model.clientService = this.selectedVendorData['clientService'];
    this.model.billDiscounting = this.selectedVendorData['billDiscounting'];
    this.model.financialStability = this.selectedVendorData['financialStability'];
    this.model.paymentCycle = this.selectedVendorData['paymentCycle'];
  }

  onVendorCommercialSubmit(){
    this.vendorCommercial.emit({data :this.model, commercialFormValidatity: this.vendorCommercialForm.valid})
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
