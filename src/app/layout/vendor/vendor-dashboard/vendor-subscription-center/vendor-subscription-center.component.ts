import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';
import { VendorDashboardService } from '../services/vendor-dashboard.service';
import {
  VendorProfileSummary,
  VendorSubscriptionPlanDetail
} from '../models/vendor-dashboard.model';

@Component({
  selector: 'app-vendor-subscription-center',
  templateUrl: './vendor-subscription-center.component.html',
  styleUrls: ['./vendor-subscription-center.component.scss']
})
export class VendorSubscriptionCenterComponent implements OnInit {

  @Input() profile: VendorProfileSummary | null = null;

  plans: VendorSubscriptionPlanDetail[] = [];
  loading = true;
  processingPlanId: string | null = null;
  loggedUserDetails: any = null;

  constructor(
    private vendorDashboardService: VendorDashboardService,
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
    this.vendorDashboardService.getSubscriptionPlans().subscribe({
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

  /** Matched on plan id, which is stable regardless of display wording. */
  isActive(plan: VendorSubscriptionPlanDetail): boolean {
    if (!this.profile || !this.profile.subscriptionPlanId) { return false; }
    return this.profile.subscriptionPlanId === plan.id;
  }

  get activePlan(): VendorSubscriptionPlanDetail | null {
    const found = this.plans.filter(p => this.isActive(p));
    return found.length > 0 ? found[0] : null;
  }

  get maxQuota(): number {
    const plan = this.activePlan;
    return plan ? plan.quota : 0;
  }

  get downloadsUsed(): number {
    return this.profile ? this.profile.rfqDownloadsUsed : 0;
  }

  get quotaPercent(): number {
    if (this.maxQuota <= 0) { return 0; }
    return Math.min(100, Math.round((this.downloadsUsed / this.maxQuota) * 100));
  }

  get remainingDownloads(): number {
    return Math.max(0, this.maxQuota - this.downloadsUsed);
  }

  get quotaExhausted(): boolean {
    return this.maxQuota > 0 && this.downloadsUsed >= this.maxQuota;
  }

  get quotaBarClass(): string {
    return this.quotaExhausted ? 'bar-danger' : 'bar-indigo';
  }

  /**
   * Validates the plan server-side, then hands off to the Zoho payment link.
   * The plan activates via the Zoho webhook once payment clears.
   */
  subscribe(plan: VendorSubscriptionPlanDetail): void {
    if (this.isActive(plan) || this.processingPlanId) { return; }

    if (!this.loggedUserDetails || !this.loggedUserDetails.username || !this.loggedUserDetails.phone) {
      this.toastr.error('Your account is missing an email or phone number required for payment', 'Error');
      return;
    }

    this.processingPlanId = plan.id;

    this.vendorDashboardService.updateSubscription(plan.id).subscribe({
      next: () => {
        // Payment is settled through Zoho; activation happens on the webhook.
        this.vendorDashboardService.generatePaymentLink({
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
            this.toastr.error(this.extractError(err, 'Could not start the payment for this plan'), 'Payment failed');
          }
        });
      },
      error: (err: any) => {
        this.processingPlanId = null;
        this.toastr.error(this.extractError(err, 'This plan is not available for purchase'), 'Error');
      }
    });
  }

  /** AppException responses carry the reason in message or errorMessage. */
  private extractError(err: any, fallback: string): string {
    const body = err ? err.error : null;
    if (body) {
      if (body.message) { return body.message; }
      if (body.errorMessage) { return body.errorMessage; }
    }
    return fallback;
  }

  trackByPlanId(index: number, plan: VendorSubscriptionPlanDetail): string {
    return plan.id;
  }
}
