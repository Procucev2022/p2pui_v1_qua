import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AnalyticsComponent } from './analytics.component';
import { autoMock } from 'src/testing/test-helpers';
import { Router } from '@angular/router';

describe('AnalyticsComponent', () => {
  let component: AnalyticsComponent;
  let fixture: ComponentFixture<AnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalyticsComponent],
      providers: [{ provide: Router, useValue: autoMock('Router') }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose navTabs with expected routes', () => {
    expect(component.navTabs.length).toBe(5);
    const routes = component.navTabs.map((t) => t.route);
    expect(routes).toContain('/categorymgr/analytics/overview');
    expect(routes).toContain('/categorymgr/analytics/funnel');
    expect(routes).toContain('/categorymgr/analytics/categories');
    expect(routes).toContain('/categorymgr/analytics/calendar');
    expect(routes).toContain('/categorymgr/analytics/console');
  });

  it('should call ngOnInit without error', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });
});
