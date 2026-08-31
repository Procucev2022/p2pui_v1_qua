import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { AnalyticsCalendarComponent } from './analytics-calendar.component';
import { AnalyticsService } from '../../services/analytics.service';
import { autoMock } from 'src/testing/test-helpers';

describe('AnalyticsCalendarComponent', () => {
  let component: AnalyticsCalendarComponent;
  let fixture: ComponentFixture<AnalyticsCalendarComponent>;
  let analyticsService: any;

  const calendarResponse = {
    days: Array.from({ length: 31 }, (_, i) => ({
      day: i + 1,
      rfqs: i === 5 ? 3 : 0,
      sellerSubmissions: i,
      regB: 1,
      regS: 1
    })),
    weeks: [
      { dateRange: 'Aug 01 - Aug 07', rfqs: 3, sellerSubmissions: 10, regB: 2, regS: 3, totalReg: 5 }
    ],
    month: 'August 2026',
    startDayOffset: 6,
    availableMonths: [{ year: 2026, month: 8, label: 'August 2026' }]
  };

  function setup() {
    analyticsService = autoMock('AnalyticsService');
    TestBed.configureTestingModule({
      declarations: [AnalyticsCalendarComponent],
      providers: [{ provide: AnalyticsService, useValue: analyticsService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideTemplate(AnalyticsCalendarComponent, '');
    fixture = TestBed.createComponent(AnalyticsCalendarComponent);
    component = fixture.componentInstance;
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create and load calendar on init', () => {
    setup();
    analyticsService.getCalendarData.and.returnValue(of(calendarResponse));
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.days.length).toBe(31);
    expect(component.monthName).toBe('August 2026');
    expect(component.selectedDay?.day).toBe(6);
    expect(component.selectedWeek).toEqual(calendarResponse.weeks[0]);
    expect(component.isLoading).toBe(false);
  });

  it('should handle empty response gracefully', () => {
    setup();
    analyticsService.getCalendarData.and.returnValue(of(null));
    fixture.detectChanges();
    expect(component.isLoading).toBe(false);
  });

  it('should handle error from getCalendarData', () => {
    setup();
    analyticsService.getCalendarData.and.returnValue(throwError(() => new Error('fail')));
    fixture.detectChanges();
    expect(component.isLoading).toBe(false);
  });

  it('should default selectedDay when no rfqs present', () => {
    setup();
    const noRfqResponse = {
      ...calendarResponse,
      days: calendarResponse.days.map((d) => ({ ...d, rfqs: 0 }))
    };
    analyticsService.getCalendarData.and.returnValue(of(noRfqResponse));
    fixture.detectChanges();
    expect(component.selectedDay?.day).toBe(1);
  });

  it('should navigate to previous month, wrapping year at January', () => {
    setup();
    analyticsService.getCalendarData.and.returnValue(of(calendarResponse));
    fixture.detectChanges();
    component.currentYear = 2026;
    component.currentMonth = 1;
    component.handlePrevMonth();
    expect(component.currentMonth).toBe(12);
    expect(component.currentYear).toBe(2025);

    component.currentMonth = 5;
    component.handlePrevMonth();
    expect(component.currentMonth).toBe(4);
  });

  it('should navigate to next month, wrapping year at December', () => {
    setup();
    analyticsService.getCalendarData.and.returnValue(of(calendarResponse));
    fixture.detectChanges();
    component.currentYear = 2026;
    component.currentMonth = 12;
    component.handleNextMonth();
    expect(component.currentMonth).toBe(1);
    expect(component.currentYear).toBe(2027);

    component.currentMonth = 5;
    component.handleNextMonth();
    expect(component.currentMonth).toBe(6);
  });

  it('should handle month select from dropdown value', () => {
    setup();
    analyticsService.getCalendarData.and.returnValue(of(calendarResponse));
    fixture.detectChanges();
    component.handleMonthSelect('2026-7');
    expect(component.currentYear).toBe(2026);
    expect(component.currentMonth).toBe(7);
  });

  it('should ignore invalid month select value', () => {
    setup();
    analyticsService.getCalendarData.and.returnValue(of(calendarResponse));
    fixture.detectChanges();
    const prevMonth = component.currentMonth;
    component.handleMonthSelect('invalid');
    expect(component.currentMonth).toBe(prevMonth);
  });

  it('should select a day on cell click and open drawer', () => {
    setup();
    analyticsService.getCalendarData.and.returnValue(of(calendarResponse));
    fixture.detectChanges();
    component.handleCellClick(10);
    expect(component.selectedDay?.day).toBe(10);
    expect(component.isDrawerOpen).toBe(true);
    expect(component.isWeekDrawerOpen).toBe(false);
  });

  it('should ignore cell click for missing day', () => {
    setup();
    analyticsService.getCalendarData.and.returnValue(of(calendarResponse));
    fixture.detectChanges();
    component.isDrawerOpen = false;
    component.handleCellClick(999);
    expect(component.isDrawerOpen).toBe(false);
  });

  it('should select a week on week click and open week drawer', () => {
    setup();
    analyticsService.getCalendarData.and.returnValue(of(calendarResponse));
    fixture.detectChanges();
    component.handleWeekClick(calendarResponse.weeks[0]);
    expect(component.selectedWeek).toEqual(calendarResponse.weeks[0]);
    expect(component.isWeekDrawerOpen).toBe(true);
    expect(component.isDrawerOpen).toBe(false);
  });

  it('should compute weekRows using backend week data when available', () => {
    setup();
    analyticsService.getCalendarData.and.returnValue(of(calendarResponse));
    fixture.detectChanges();
    const rows = component.weekRows;
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].totalRfqs).toBe(3);
    expect(rows[0].dateRange).toBe('Aug 01 - Aug 07');
  });

  it('should compute weekRows falling back to computed totals when no backend week data', () => {
    setup();
    analyticsService.getCalendarData.and.returnValue(of({ ...calendarResponse, weeks: [] }));
    fixture.detectChanges();
    const rows = component.weekRows;
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].dateRange).toBeTruthy();
    expect(rows[0].totalRfqs).toBeDefined();
  });

  it('should fall back to "Day" prefix when monthName is empty', () => {
    setup();
    analyticsService.getCalendarData.and.returnValue(
      of({ ...calendarResponse, days: [{ day: 1, rfqs: 0, sellerSubmissions: 0, regB: 0, regS: 0 }], weeks: [], startDayOffset: 0 })
    );
    fixture.detectChanges();
    component.monthName = '';
    const rows = component.weekRows;
    expect(rows.length).toBe(1);
    expect(rows[0].dateRange).toContain('Day');
  });


});
