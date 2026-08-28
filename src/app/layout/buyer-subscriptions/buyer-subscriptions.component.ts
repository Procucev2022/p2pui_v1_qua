import { Component, OnInit } from '@angular/core';

export interface SubscriptionPlanDetail {
  id: 'version_1' | 'version_2' | 'version_3';
  tag: string;
  name: string;
  price: string;
  billing: string;
  description: string;
  buttonLabel: string;
  buttonIcon: string;
  buttonClass: string;
  features: string[];
}

@Component({
  selector: 'app-buyer-subscriptions',
  templateUrl: './buyer-subscriptions.component.html',
  styleUrls: ['./buyer-subscriptions.component.scss']
})
export class BuyerSubscriptionsComponent implements OnInit {

  activeSubscription: string = 'version_1';
  remainingFreeRFQs: number = 5;
  toastMessage: string = '';

  plans: SubscriptionPlanDetail[] = [
    {
      id: 'version_1',
      tag: 'ROSTER-BASED CHASING',
      name: 'Version 1 Sourcing',
      price: '$199',
      billing: 'per user / month',
      description: 'Streamline procurement across your pre-approved roster with automated working-hour follow-up pipelines.',
      buttonLabel: 'Active Free Trial',
      buttonIcon: 'fa fa-shield',
      buttonClass: 'btn-plan-outline',
      features: [
        'Direct Sourcing from uploaded Excel/Manual buyer rosters',
        'SMS outreach sent exactly 5 mins after email dispatch',
        'Automatic Call chasing placed after 6 working hours',
        'WhatsApp chaser interactive prompts after 12 working hours',
        'Skips Sundays and operates strictly 8 AM - 7 PM IST Mon-Sat',
        'OCR Quote extraction parsed directly from incoming vendor emails',
        'Automatic halt of chasing sequence upon quote ingestion'
      ]
    },
    {
      id: 'version_2',
      tag: 'HYBRID SOURCED NETWORK',
      name: 'Version 2 Sourcing',
      price: '$499',
      billing: 'per user / month',
      description: 'Expand your pool to Procucev Base Network suppliers. Evaluate vendors immediately post-quote.',
      buttonLabel: 'Subscribe to Version 2',
      buttonIcon: 'fa fa-bolt',
      buttonClass: 'btn-plan-cyan',
      features: [
        'All features in Version 1 included',
        'RFQ broadcast matches Procucev Pool network partners',
        'Intelligent RFQ Category matching & Location proximity filter',
        'Automatic classification of Buyer Upload vs. Network pool',
        'Vendor evaluation triggers unlocked strictly after quote receipt',
        'Interactive evaluation surveys to verify quality metrics post-bid',
        'Real-time proximity-based targeted pool preview in Wizard'
      ]
    },
    {
      id: 'version_3',
      tag: 'AUTONOMOUS SOURCING DESK',
      name: 'Version 3 Sourcing',
      price: '$999',
      billing: 'per user / month',
      description: 'Fully autonomous category manager desk. Full 360-degree audits and matrices active immediately.',
      buttonLabel: 'Subscribe to Version 3',
      buttonIcon: 'fa fa-bolt',
      buttonClass: 'btn-plan-darkblue',
      features: [
        'All features in Version 1 & 2 included',
        'Immediate 360-degree Vendor Audits active for all pool partners',
        'Detailed remarks & documents OCR checked against each criteria',
        'Interactive Comparative Quote Evaluation Matrices',
        'Automatic PO generation & contract digital signature creation',
        'Immutable Compliance Audit Log (SHA-256 integrity checkers)',
        'Autonomous category agent operational monitoring Kanban desk'
      ]
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  handleSubscribe(plan: SubscriptionPlanDetail): void {
    this.activeSubscription = plan.id;
    this.showToast(`Subscription Activated: Successfully subscribed to ${plan.name} (${plan.price} ${plan.billing}).`);
  }

  handleResetTrial(): void {
    this.activeSubscription = 'version_1';
    this.remainingFreeRFQs = 5;
    this.showToast('Trial Restored: 5 Free Version 1 RFQs quota granted.');
  }

  showToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => this.toastMessage = '', 4000);
  }
}
