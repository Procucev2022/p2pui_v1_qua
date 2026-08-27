import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics-console',
  templateUrl: './analytics-console.component.html',
  styleUrls: ['./analytics-console.component.scss']
})
export class AnalyticsConsoleComponent implements OnInit {
  companies: any[] = [];
  selectedCompany: any = null;
  searchQuery: string = '';
  chatInput: string = '';
  chatMessages: any[] = [];
  isLoading: boolean = true;
  isSendingChat: boolean = false;

  activeTab: 'rfqs' | 'accounts' | 'quotes' | 'subscription' | 'whatsapp' = 'rfqs';
  dayWiseChats: any[] = [];

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.search();
  }

  setTab(tab: 'rfqs' | 'accounts' | 'quotes' | 'subscription' | 'whatsapp'): void {
    this.activeTab = tab;
  }

  search(): void {
    this.isLoading = true;
    this.analyticsService.searchCompanies(this.searchQuery).subscribe({
      next: (res: any) => {
        if (res && res.companies) {
          this.companies = res.companies;
          if (this.companies.length > 0) {
            this.selectCompany(this.companies[0]);
          } else {
            this.selectedCompany = null;
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Search error:', err);
        this.isLoading = false;
      }
    });
  }

  selectCompany(c: any): void {
    this.selectedCompany = c;
    this.chatMessages = c.chatMessages || [];
    this.dayWiseChats = c.dayWiseChats || [
      {
        dayLabel: 'Today',
        messages: [
          { id: 'm1', sender: 'user', senderName: c.pocName || 'Client', text: 'Hello, we need updates on our pending RFQ quotation.', time: '10:15 AM' },
          { id: 'm2', sender: 'agent', senderName: 'Procucev Bot', text: `Hello ${c.pocName || 'Partner'}! Your RFQ records and quotes are updated in your console.`, time: '10:16 AM' }
        ]
      },
      {
        dayLabel: 'Yesterday',
        messages: [
          { id: 'm3', sender: 'user', senderName: c.pocName || 'Client', text: 'Please check our available credit balance.', time: '04:20 PM' },
          { id: 'm4', sender: 'agent', senderName: 'Procucev Bot', text: `You currently have ${c.totalCredits || 0} RFQ credits available. Tier: ${c.tier || 'Growth'}`, time: '04:22 PM' }
        ]
      }
    ];
  }

  sendChat(): void {
    if (!this.chatInput.trim() || !this.selectedCompany || this.isSendingChat) return;

    const userText = this.chatInput.trim();
    this.chatInput = '';

    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      senderName: 'You',
      text: userText,
      time: 'Just now'
    };
    this.chatMessages.push(userMsg);

    this.isSendingChat = true;
    this.analyticsService.processChat({ prompt: userText, companyId: this.selectedCompany.id }).subscribe({
      next: (botMsg: any) => {
        if (botMsg) {
          this.chatMessages.push(botMsg);
        }
        this.isSendingChat = false;
      },
      error: () => {
        this.chatMessages.push({
          id: 'msg-err',
          sender: 'agent',
          senderName: 'Procucev Bot',
          text: 'Thank you for your message. An agent will respond shortly.',
          time: 'Just now'
        });
        this.isSendingChat = false;
      }
    });
  }
}
