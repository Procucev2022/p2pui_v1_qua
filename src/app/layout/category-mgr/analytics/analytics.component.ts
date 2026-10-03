import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  navTabs = [
    { label: 'Overview', route: '/categorymgr/analytics/overview', icon: 'fa-tachometer' },
    { label: 'Conversion Funnel', route: '/categorymgr/analytics/funnel', icon: 'fa-filter' },
    { label: 'Category Analysis', route: '/categorymgr/analytics/categories', icon: 'fa-cubes' },
    { label: 'Conversion Calendar', route: '/categorymgr/analytics/calendar', icon: 'fa-calendar' },
    { label: 'Company Console', route: '/categorymgr/analytics/console', icon: 'fa-building-o' }
  ];

  constructor(public router: Router) {}

  ngOnInit(): void {}
}
