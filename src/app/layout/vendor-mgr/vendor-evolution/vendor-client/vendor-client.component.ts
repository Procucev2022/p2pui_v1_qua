import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-vendor-client',
  templateUrl: './vendor-client.component.html',
  styleUrls: ['./vendor-client.component.scss']
})
export class VendorClientComponent implements OnInit {

  model:any = {}
  @Output() vendorClient = new EventEmitter();
  @Output() back = new EventEmitter();
  servicesList = ['Manufacturer','Distributor/partner','Service Provider', 'Trader']
  @ViewChild('addPricingElement') addPricingBtn: ElementRef;
  @Input('selectedVendorData') selectedVendorData;
  
  @ViewChild('vendorClient') vendorClientForm: FormGroup;

  pricingList: any= [];

  // @ViewChild('addQualityElement') addQualityBtn: ElementRef;
  // qualityList: any= [];

  // @ViewChild('addDeliveryTimeElement') addDeliveryTimeBtn: ElementRef;
  // deliveryTimeList: any= [];

  // @ViewChild('addProfessionalismElement') addProfessionalismBtn: ElementRef;
  // professionalismList: any= [];

  // @ViewChild('addIssuesElement') addIssuesBtn: ElementRef;
  // issuesList: any= [];
  constructor() { }

  ngOnInit() {
    this.model.existingClients = this.selectedVendorData['existingClients'];
    this.model.reffernceFeedback = this.selectedVendorData['reffernceFeedback']; 
 

    this.selectedVendorData['feedback'].forEach((ele:any) => {
     this.pricingList.push( 
        { 
          clientName: ele.clientName,
        pricingFeedback:ele.pricingFeedback,
        qualityFeedback:ele.qualityFeedback,
        deliveryFeedback:ele.deliveryFeedback,
        professionalismFeedback:ele.professionalismFeedback,
        serviceFeedback:ele.serviceFeedback
      }
    );
    });
    this.pricingList.push({
      clientName: undefined,
      pricingFeedback:undefined,
      qualityFeedback:undefined,
      deliveryFeedback:undefined,
      professionalismFeedback:undefined,
      serviceFeedback:undefined
    })


    // this.qualityList.push({
    //   clientName: undefined,
    //   feedBack: undefined
    // })

    // this.deliveryTimeList.push({
    //   clientName: undefined,
    //   feedBack: undefined
    // })

    // this.professionalismList.push({
    //   clientName: undefined,
    //   feedBack: undefined
    // })

    // this.issuesList.push({
    //   clientName: undefined,
    //   feedBack: undefined
    // })
  }

  addPricing(){
    this.pricingList.push({
      clientName: undefined,
      pricingFeedback:undefined,
      qualityFeedback:undefined,
      deliveryFeedback:undefined,
      professionalismFeedback:undefined,
      serviceFeedback:undefined
    })

    if(this.addPricingBtn)
    this.addPricingBtn.nativeElement.focus();
  }
  removePricing(i){
    this.pricingList.splice(i,1);
  }

  // addQuality(){
  //   this.qualityList.push({
  //     clientName: undefined,
  //     feedBack: undefined
  //   })

  //   if(this.addQualityBtn)
  //   this.addQualityBtn.nativeElement.focus();
  // }
  // removeQuality(i){
  //   this.qualityList.splice(i,1);
  // }

  // addDeliveryTime(){
  //   this.deliveryTimeList.push({
  //     clientName: undefined,
  //     feedBack: undefined
  //   })

  //   if(this.addDeliveryTimeBtn)
  //   this.addDeliveryTimeBtn.nativeElement.focus();
  // }
  // removeDeliveryTime(i){
  //   this.deliveryTimeList.splice(i,1);
  // }

  // addProfessionalism(){
  //   this.professionalismList.push({
  //     clientName: undefined,
  //     feedBack: undefined
  //   })

  //   if(this.addProfessionalismBtn)
  //   this.addProfessionalismBtn.nativeElement.focus();
  // }
  // removeProfessionalism(i){
  //   this.professionalismList.splice(i,1);
  // }

  // addIssues(){
  //   this.issuesList.push({
  //     clientName: undefined,
  //     feedBack: undefined
  //   })

  //   if(this.addIssuesBtn)
  //   this.addIssuesBtn.nativeElement.focus();
  // }
  // removeIssues(i){
  //   this.issuesList.splice(i,1);
  // }

  onVendorClientSubmit(){
    this.model['feedback'] = this.pricingList
    this.vendorClient.emit({data :this.model, clientReferenceFormValidatity: this.vendorClientForm.valid})
  }
  onBack(){
    this.back.emit()
  }
  onReset(){
    this.model = {}
    this.pricingList = []
    if(this.selectedVendorData.feedback)
    this.pricingList.push({
      clientName: undefined,
      pricingFeedback:undefined,
      qualityFeedback:undefined,
      deliveryFeedback:undefined,
      professionalismFeedback:undefined,
      serviceFeedback:undefined
    })
  }

}
