import { Component, OnInit } from '@angular/core';

interface SubscriptionPlanDetail {
  id: 'version_1' | 'version_2' | 'version_3';
  name: string;
  subtext: string;
  price: string;
  billing: string;
  description: string;
  badge: string;
  features: string[];
}

@Component({
  selector: 'app-buyer-subscriptions',
  templateUrl: './buyer-subscriptions.component.html',
  styleUrls: ['./buyer-subscriptions.component.scss']
})
export class BuyerSubscriptionsComponent implements OnInit {

  activeSubscription: string = 'free_trial';
  remainingFreeRFQs: number = 5;
  toastMessage: string = '';

  plans: SubscriptionPlanDetail[] = [
    {
      id: 'version_1',
      name: 'Version 1 Sourcing',
      subtext: 'Roster-Based Chasing',
      price: '$199',
      billing: 'per user / month',
      description: 'Streamline procurement across your pre-approved roster with automated working-hour follow-up pipelines.',
      badge: 'Basic Roster',
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
      name: 'Version 2 Sourcing',
      subtext: 'Hybrid Sourced Network',
      price: '$499',
      billing: 'per user / month',
      description: 'Expand your pool to Procucev Base Network suppliers. Evaluate vendors immediately post-quote.',
      badge: 'Recommended',
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
      name: 'Version 3 Sourcing',
      subtext: 'Autonomous Sourcing Desk',
      price: '$999',
      billing: 'per user / month',
      description: 'Fully autonomous category manager desk. Full 360-degree audits and matrices active immediately.',
      badge: 'Enterprise AI',
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

  handleSubscribe(planId: string): void {
    this.activeSubscription = planId;
    this.showToast(`Subscription Activated! Successfully subscribed to ${planId.toUpperCase()} Sourcing Plan.`);
  }

  handleResetTrial(): void {
    this.activeSubscription = 'free_trial';
    this.remainingFreeRFQs = 5;
    this.showToast('Trial Restored: 5 remaining Version 1 RFQs granted.');
  }

  showToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => this.toastMessage = '', 3500);
  }
}
