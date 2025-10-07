import { Component } from '@angular/core';
import { VendorRegistrationService } from 'src/app/vendor-registration/services/vendor-registration.service';
import { RfqService } from '../../vendor/services/rfq.service';
import { ToastrService } from 'ngx-toastr';
import { CreateRfqService } from '../services/create-rfq.service';
import { EncryDecryService } from 'src/app/shared/services';

@Component({
  selector: 'app-vendor-profile-subscriptions',
  templateUrl: './vendor-profile-subscriptions.component.html',
  styleUrls: ['./vendor-profile-subscriptions.component.scss']
})
export class VendorProfileSubscriptionsComponent {


  selectedSubscription: any;
  subscriptionPlansList = [];
  loggedUserDetails: any;
  vendorRegObj: any;
  currentPlan: any;

  constructor(private vendorRegSer: VendorRegistrationService, private encryDecryService: EncryDecryService,
    private rfqservice: RfqService,
    private toastrService: ToastrService,
    private createRfqService: CreateRfqService,
  ) {
    const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
    this.loggedUserDetails = temp.details;
    this.createRfqService.getSubscriptionsList().subscribe((res: any) => {
      this.subscriptionPlansList = res.data && res.data.plans ? res.data.plans : []
    });

    if (this.loggedUserDetails) {
      this.getVendorById(this.loggedUserDetails.org.id)
    }

  }

  getClassName(subData: any) {
    return subData.analyticsLevel.toLowerCase() == 'basic' ?
      'yellowClass' : subData.analyticsLevel.toLowerCase() == 'regular' ? 'blueClass' : 'purpleClass';

  }


  isMatchedPlan(id: string) {
    return this.selectedSubscription && this.selectedSubscription.id === id ? true : false;
  }
  getVendorById(id) {
    this.vendorRegObj = null;
    this.vendorRegSer.getGMTSellerById({ id: id }).subscribe((response) => {
      this.vendorRegObj = response;
      console.log('response', response)
      this.selectedSubscription = this.vendorRegObj.subscriptionPlan;

      this.currentPlan = this.vendorRegObj.subscriptionPlan.analyticsLevel;
    }, (error) => {

    });
  }

  updateVendorForm() {

    // if (this.vendorForm.valid) {
    if (!this.selectedSubscription) {
      this.toastrService.error('Please select subscription plan', 'Error');
      return;
    }
    const obj = this.vendorRegObj;
    obj.subscriptionPlan = this.selectedSubscription ? { id: this.selectedSubscription.id } : null;
    this.createRfqService.updateSellerData(obj).subscribe((res: any) => {
      this.toastrService.success('Vendor Updated Successfully', 'Success');
      this.getVendorById(this.loggedUserDetails.org.id)
    }, (error) => {
      this.toastrService.error('Error while updating vendor', 'Error');
    })

  }

  updateSubscription(selectedPlan: any) {
    if (this.selectedSubscription && selectedPlan.id == this.selectedSubscription.id) {
      this.selectedSubscription = '';
      return;
    }
    this.selectedSubscription = selectedPlan;
  }
}