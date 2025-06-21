import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-vendor-capability',
  templateUrl: './vendor-capability.component.html',
  styleUrls: ['./vendor-capability.component.scss']
})
export class VendorCapabilityComponent implements OnInit {

  model: any = {};
  @Output() vendorCapability = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() back = new EventEmitter();
  @Input('selectedVendorData') selectedVendorData;
  @ViewChild('vendorCapability') vendorCapabilityForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.model.bussinessAge = this.selectedVendorData['bussinessAge'];
    this.model.manPower = this.selectedVendorData['manPower'];
    this.model.managerial = this.selectedVendorData['managerial'];
    this.model.machineTypes = this.selectedVendorData['machineTypes'];
    this.model.serviceCapacity = this.selectedVendorData['serviceCapacity'];
    this.model.nonManagerial = this.selectedVendorData['nonManagerial'];
    this.model.capacityUtilization = this.selectedVendorData['capacityUtilization'];
  }

  onVendorCapabilitySubmit() {
    this.vendorCapability.emit({data : this.model, capabilityFormValidatity: this.vendorCapabilityForm.valid});
  }
  onNext() {
    this.next.emit();
  }
  onBack() {
    this.back.emit();
  }
  onReset() {
    this.model = {};
  }

}
