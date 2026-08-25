import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface ScreenTab {
  id: string;
  name: string;
  icon: string;
  active: boolean;
  route: string;
}

@Component({
  selector: 'app-buyer-dashboard',
  templateUrl: './buyer-dashboard.component.html',
  styleUrls: ['./buyer-dashboard.component.scss']
})
export class BuyerDashboardComponent implements OnInit, OnDestroy {

  private routerSub?: Subscription;

  screenTabs: ScreenTab[] = [
    {
      id: 'screen-1-1',
      name: 'Screen 1.1: Buyer Command Center',
      icon: 'fa fa-th-large',
      active: true,
      route: '/buyer-dashboard/command-center'
    },
    {
      id: 'screen-1-2',
      name: 'Screen 1.2: AI Ingestion & Mode Wizard',
      icon: 'fa fa-file-code-o',
      active: false,
      route: '/buyer-dashboard/ai-ingestion-wizard'
    },
    {
      id: 'screen-1-3',
      name: 'Screen 1.3: Quote Evaluation Matrix',
      icon: 'fa fa-star-o',
      active: false,
      route: '/buyer-dashboard/quote-evaluation-matrix'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.syncActiveTabWithUrl(this.router.url);
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.syncActiveTabWithUrl(event.urlAfterRedirects || event.url);
    });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  syncActiveTabWithUrl(url: string): void {
    if (url && url.includes('ai-ingestion-wizard')) {
      this.screenTabs.forEach(s => s.active = (s.id === 'screen-1-2'));
    } else if (url && url.includes('quote-evaluation-matrix')) {
      this.screenTabs.forEach(s => s.active = (s.id === 'screen-1-3'));
    } else {
      this.screenTabs.forEach(s => s.active = (s.id === 'screen-1-1'));
    }
  }

  onSelectScreen(screen: ScreenTab): void {
    this.screenTabs.forEach(s => s.active = (s.id === screen.id));
    if (screen.route && this.router.url !== screen.route) {
      this.router.navigateByUrl(screen.route);
    }
  }
}
