import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { VendorMgrService } from '../../services/vendor-mgr.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-vendor-info',
  templateUrl: './vendor-info.component.html',
  styleUrls: ['./vendor-info.component.scss']

})
export class VendorInfoComponent implements OnInit {

  model: any = {};
  servicesList = ['Manufacturer', 'Distributor/partner', 'Service Provider', 'Trader'];
  @ViewChild('addInternalElement') addInternalBtn: ElementRef;
  @ViewChild('vendorInfo') vendorInfoForm: FormGroup;
  @Output() vendoeDetails = new EventEmitter();
  @Output() next = new EventEmitter();
  @Input('selectedVendorData') selectedVendorData;
  clientsList: any = [];
  constructor(private vendor: VendorMgrService) { }

  ngOnInit() {
    this.model.vendor = this.selectedVendorData['id'];
    this.model.vendorName = this.selectedVendorData['vendorName'];
    this.model.address = this.selectedVendorData['address'] ? this.selectedVendorData['address'] : '';
    this.model.location = this.selectedVendorData['location'];
    this.model.email = this.selectedVendorData['email'];
    this.model.phone = this.selectedVendorData['phone'];
    this.model.pan = this.selectedVendorData['pan'];
    this.model.gst = this.selectedVendorData['gst'];
    this.model.annualTurnOver = this.selectedVendorData['annualTurnOver'];
    this.model.goodsType = this.selectedVendorData['goodsType'];
    this.selectedVendorData.client.forEach((client:any) => {
       this.clientsList.push({'clientName': client['clientName']})
    });
    // if(this.clientsList.length<=0){
      this.clientsList.push({
        clientName: undefined,
      });
    // }

  }

  addOneMoreinternals() {
    this.clientsList.push({
      clientName: undefined,
    });

    if (this.addInternalBtn) {
    this.addInternalBtn.nativeElement.focus();
    }
  }
  removeinternals(i) {
    this.clientsList.splice(i, 1);
  }

  onVendorInfoSubmit() {
    console.log('vendorInfoForm', this.vendorInfoForm);
    this.model['client'] = this.clientsList;
    this.vendoeDetails.emit({data : this.model, isExit: false, vendorInfoFormValidatity: this.vendorInfoForm.valid});
  }
  onVendorInfoSaveAndExit() {
    this.model['client'] = this.clientsList;
    this.vendoeDetails.emit({data : this.model, isExit: true, vendorInfoFormValidatity: this.vendorInfoForm.valid});
  }
  onNext() {
    this.next.emit();
  }
  onReset() {
    this.model = {};
    this.clientsList = [];
    this.clientsList.push({
      clientName: undefined,
    });
  }

}
