import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';
import { BuyerDashboardService } from '../services/buyer-dashboard.service';
import { SubscriptionPlan } from '../models/buyer-dashboard.model';

@Component({
  selector: 'app-buyer-subscriptions',
  templateUrl: './buyer-subscriptions.component.html',
  styleUrls: ['./buyer-subscriptions.component.scss']
})
export class BuyerSubscriptionsComponent implements OnInit {

  plans: SubscriptionPlan[] = [];
  loading = true;
  processingPlanId: string | null = null;
  loggedUserDetails: any = null;

  constructor(
    private buyerDashboardService: BuyerDashboardService,
    private encryDecryService: EncryDecryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.resolveLoggedUser();
    this.loadPlans();
  }

  private resolveLoggedUser(): void {
    try {
      const raw = localStorage.getItem('logData');
      if (raw) {
        const temp = JSON.parse(this.encryDecryService.get('perm', raw));
        this.loggedUserDetails = temp ? temp.details : null;
      }
    } catch (e) {
      this.loggedUserDetails = null;
    }
  }

  private loadPlans(): void {
    this.loading = true;
    this.buyerDashboardService.getSubscriptions().subscribe({
      next: list => {
        this.plans = list || [];
        this.loading = false;
      },
      error: () => {
        this.plans = [];
        this.loading = false;
        this.toastr.error('Could not load subscription plans', 'Error');
      }
    });
  }

  get currentPlan(): SubscriptionPlan | null {
    const found = this.plans.filter(p => p.isCurrent);
    return found.length > 0 ? found[0] : null;
  }

  isCurrent(plan: SubscriptionPlan): boolean {
    return !!plan.isCurrent;
  }

  /**
   * A Zoho payment link can only be created for a plan that has a billing
   * record, which the API signals by returning a non-empty id.
   */
  isPayable(plan: SubscriptionPlan): boolean {
    return !!plan.id;
  }



  /** Purchases go through the existing Zoho payment link endpoint. */
  handleSubscribe(plan: SubscriptionPlan): void {
    if (this.isCurrent(plan) || this.processingPlanId) { return; }

    // A payable plan record is required to generate a Zoho payment link.
    if (!this.isPayable(plan)) {
      this.toastr.info(
        `${plan.name} is not set up for online payment yet. Please contact your account manager.`,
        'Contact sales'
      );
      return;
    }

    if (!this.loggedUserDetails || !this.loggedUserDetails.username || !this.loggedUserDetails.phone) {
      this.toastr.error('Your account is missing an email or phone number required for payment', 'Error');
      return;
    }

    this.processingPlanId = plan.id;

    this.buyerDashboardService.generatePaymentLink({
      planId: plan.id,
      userEmail: this.loggedUserDetails.username,
      userPhone: this.loggedUserDetails.phone
    }).subscribe({
      next: (res: any) => {
        this.processingPlanId = null;
        if (res && res.paymentUrl) {
          window.open(res.paymentUrl, '_self');
        } else {
          this.toastr.error('Payment link could not be generated', 'Error');
        }
      },
      error: (err: any) => {
        this.processingPlanId = null;
        this.toastr.error(this.extractError(err), 'Payment failed');
      }
    });
  }

  /** AppException responses carry the reason in message or errorMessage. */
  private extractError(err: any): string {
    const body = err ? err.error : null;
    if (body) {
      if (body.message) { return body.message; }
      if (body.errorMessage) { return body.errorMessage; }
    }
    return 'Could not start the payment for this plan';
  }
}
