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

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.isLoading = true;
    this.analyticsService.searchCompanies(this.searchQuery).subscribe({
      next: (res: any) => {
        if (res && res.companies) {
          this.companies = res.companies;
          if (this.companies.length > 0 && !this.selectedCompany) {
            this.selectCompany(this.companies[0]);
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
