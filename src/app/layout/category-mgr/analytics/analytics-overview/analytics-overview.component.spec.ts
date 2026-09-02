import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { AnalyticsOverviewComponent } from './analytics-overview.component';
import { AnalyticsService } from '../../services/analytics.service';
import { autoMock } from 'src/testing/test-helpers';

describe('AnalyticsOverviewComponent', () => {
  let component: AnalyticsOverviewComponent;
  let fixture: ComponentFixture<AnalyticsOverviewComponent>;
  let analyticsService: any;

  const dashboardResponse = {
    metrics: {
      totalBuyers: { value: 100, change: '+5%' },
      totalSellers: { value: 50, change: '+2%' },
      activeBuyers: { value: 60, percentOfTotal: '60%' },
      inactiveBuyers: { value: 40, percentOfTotal: '40%' },
      totalRfqs: { value: 200, change: '+10%' },
      rfqsWithQuotes: { value: 150, tag: '75% Quoted' },
      sellerSubmissions: { value: 300, change: '+3%' },
      rfqsWithoutQuotes: { value: 50, tag: 'Needs Attention' },
      sellerSubs: { value: '₹1000', change: '+1%' },
      pendingCredits: { value: 5, tag: 'Awaiting' },
      repeatBuyers: { value: '20%', tag: 'Loyalty' },
      topCategory: { name: 'Steel', volumePercent: '30%' }
    },
    sources: [
      { channel: 'WhatsApp', buyersPercent: 50, sellersPercent: 50, buyersCount: 10, sellersCount: 5, totalCount: 15 },
      { channel: 'Web', buyersPercent: 30, sellersPercent: 30 }
    ],
    lifecycleStages: [{ stage: 'Draft', volume: 10, trend: '+1', colorDot: 'bg-primary', isPositive: true }]
  };

  function setup(serviceOverrides?: any) {
    analyticsService = serviceOverrides || autoMock('AnalyticsService');
    TestBed.configureTestingModule({
      declarations: [AnalyticsOverviewComponent],
      providers: [{ provide: AnalyticsService, useValue: analyticsService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideTemplate(AnalyticsOverviewComponent, '');
    fixture = TestBed.createComponent(AnalyticsOverviewComponent);
    component = fixture.componentInstance;
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create and load dashboard data on init', () => {
    setup();
    analyticsService.getDashboardData.and.returnValue(of(dashboardResponse));
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.isLoading).toBe(false);
    expect(component.metrics.totalBuyers.value).toBe(100);
    expect(component.sources[0].buyersCount).toBe(10);
    // Second source has no buyersCount so it should be derived from percent
    expect(component.sources[1].buyersCount).toBe(30);
    expect(component.lifecycleStages.length).toBe(1);
  });

  it('should handle empty response gracefully', () => {
    setup();
    analyticsService.getDashboardData.and.returnValue(of(null));
    fixture.detectChanges();
    expect(component.isLoading).toBe(false);
  });

  it('should handle error from getDashboardData', () => {
    setup();
    analyticsService.getDashboardData.and.returnValue(throwError(() => new Error('fail')));
    fixture.detectChanges();
    expect(component.isLoading).toBe(false);
  });

  it('should open and close metric details for a known key', fakeAsync(() => {
    setup();
    analyticsService.getDashboardData.and.returnValue(of(dashboardResponse));
    fixture.detectChanges();
    component.openMetricDetails('totalBuyers');
    tick(0);
    expect(component.isModalOpen).toBe(true);
    expect(component.selectedMetricDetail.title).toBe('Total Buyers');
    component.closeMetricDetails();
    expect(component.isModalOpen).toBe(false);
    expect(component.selectedMetricDetail).toBeNull();
  }));

  it('should not open modal for unknown metric key', () => {
    setup();
    analyticsService.getDashboardData.and.returnValue(of(dashboardResponse));
    fixture.detectChanges();
    component.openMetricDetails('unknownKey');
    expect(component.isModalOpen).toBe(false);
  });

  it('should cover all metric detail keys', fakeAsync(() => {
    setup();
    analyticsService.getDashboardData.and.returnValue(of(dashboardResponse));
    fixture.detectChanges();
    const keys = [
      'totalBuyers', 'totalSellers', 'activeBuyers', 'inactiveBuyers', 'totalRfqs',
      'rfqsWithQuotes', 'sellerSubmissions', 'rfqsWithoutQuotes', 'sellerSubs',
      'pendingCredits', 'repeatBuyers', 'topCategory', 'registrationSource', 'lifecycleStatus'
    ];
    for (const key of keys) {
      component.openMetricDetails(key);
      tick(0);
      expect(component.selectedMetricDetail).toBeTruthy();
      component.closeMetricDetails();
    }
  }));

  it('should export data as CSV when metrics present', () => {
    setup();
    analyticsService.getDashboardData.and.returnValue(of(dashboardResponse));
    fixture.detectChanges();
    const clickSpy = jasmine.createSpy('click');
    const originalCreateElement = document.createElement.bind(document);
    spyOn(document, 'createElement').and.callFake((tag: string) => {
      const el = originalCreateElement(tag) as any;
      if (tag === 'a') {
        el.click = clickSpy;
      }
      return el;
    });
    component.exportData();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should not export data when metrics is null', () => {
    setup();
    analyticsService.getDashboardData.and.returnValue(of(null));
    fixture.detectChanges();
    const appendSpy = spyOn(document.body, 'appendChild');
    component.exportData();
    expect(appendSpy).not.toHaveBeenCalled();
  });

  it('should fall back to default values when metrics fields are missing', fakeAsync(() => {
    setup();
    analyticsService.getDashboardData.and.returnValue(of({ metrics: {}, sources: [], lifecycleStages: [] }));
    fixture.detectChanges();
    component.openMetricDetails('totalBuyers');
    tick(0);
    expect(component.selectedMetricDetail.value).toBe('0');
    component.openMetricDetails('topCategory');
    tick(0);
    expect(component.selectedMetricDetail.value).toBe('N/A');
    component.openMetricDetails('registrationSource');
    tick(0);
    expect(component.selectedMetricDetail.value).toBe('Channel Analytics');
  }));

  it('should export default 0 values when metric fields are missing', () => {
    setup();
    analyticsService.getDashboardData.and.returnValue(of({ metrics: {}, sources: [], lifecycleStages: [] }));
    fixture.detectChanges();
    const appendSpy = spyOn(document.body, 'appendChild').and.callThrough();
    component.exportData();
    expect(appendSpy).toHaveBeenCalled();
  });

  it('should move an existing backdrop element into body when opening and remove it when closing', fakeAsync(() => {
    setup();
    analyticsService.getDashboardData.and.returnValue(of(dashboardResponse));
    fixture.detectChanges();

    const wrapper = document.createElement('div');
    document.body.appendChild(wrapper);
    const backdrop = document.createElement('div');
    backdrop.id = 'overview-modal-backdrop';
    wrapper.appendChild(backdrop);

    component.openMetricDetails('totalBuyers');
    tick(0);
    expect(backdrop.parentElement).toBe(document.body);

    component.closeMetricDetails();
    expect(backdrop.parentElement).toBeNull();

    document.body.removeChild(wrapper);
  }));
});
