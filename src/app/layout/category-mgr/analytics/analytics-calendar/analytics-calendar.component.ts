import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics-calendar',
  templateUrl: './analytics-calendar.component.html',
  styleUrls: ['./analytics-calendar.component.scss']
})
export class AnalyticsCalendarComponent implements OnInit {
  days: any[] = [];
  weeks: any[] = [];
  selectedDay: any = null;
  selectedWeek: any = null;
  isDrawerOpen: boolean = false;
  isWeekDrawerOpen: boolean = false;
  currentYear: number = 2026;
  currentMonth: number = 8;
  monthName: string = 'August 2026';
  startDayOffset: number = 6;
  availableMonths: any[] = [
    { year: 2026, month: 8, label: 'August 2026' },
    { year: 2026, month: 7, label: 'July 2026' },
    { year: 2026, month: 6, label: 'June 2026' },
    { year: 2026, month: 5, label: 'May 2026' },
    { year: 2026, month: 4, label: 'April 2026' },
    { year: 2026, month: 3, label: 'March 2026' },
    { year: 2026, month: 2, label: 'February 2026' },
    { year: 2026, month: 1, label: 'January 2026' },
    { year: 2025, month: 12, label: 'December 2025' }
  ];
  isLoading: boolean = true;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadCalendar();
  }

  loadCalendar(): void {
    this.isLoading = true;
    this.analyticsService.getCalendarData(this.currentYear, this.currentMonth).subscribe({
      next: (res: any) => {
        if (res) {
          this.days = res.days || [];
          this.weeks = res.weeks || [];
          this.monthName = res.month || `${this.currentMonth}/${this.currentYear}`;
          this.startDayOffset = res.startDayOffset ?? 0;
          if (res.availableMonths && res.availableMonths.length > 0) {
            this.availableMonths = res.availableMonths;
          }
          if (this.days.length > 0) {
            const active = this.days.find((d: any) => d.rfqs > 0) || this.days[0];
            this.selectedDay = active;
          }
          if (this.weeks.length > 0) {
            this.selectedWeek = this.weeks[0];
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Calendar load error:', err);
        this.isLoading = false;
      }
    });
  }

  handlePrevMonth(): void {
    if (this.currentMonth === 1) {
      this.currentYear--;
      this.currentMonth = 12;
    } else {
      this.currentMonth--;
    }
    this.loadCalendar();
  }

  handleNextMonth(): void {
    if (this.currentMonth === 12) {
      this.currentYear++;
      this.currentMonth = 1;
    } else {
      this.currentMonth++;
    }
    this.loadCalendar();
  }

  handleMonthSelect(val: string): void {
    const parts = val.split('-').map(Number);
    if (parts.length === 2 && parts[0] && parts[1]) {
      this.currentYear = parts[0];
      this.currentMonth = parts[1];
      this.loadCalendar();
    }
  }

  handleCellClick(dayNum: number): void {
    const entry = this.days.find((d) => d.day === dayNum);
    if (entry) {
      this.selectedDay = entry;
      this.isDrawerOpen = true;
      this.isWeekDrawerOpen = false;
    }
  }

  handleWeekClick(week: any): void {
    this.selectedWeek = week;
    this.isWeekDrawerOpen = true;
    this.isDrawerOpen = false;
  }

  get weekRows(): any[] {
    const rows: any[] = [];
    const totalCells = Math.ceil((this.startDayOffset + this.days.length) / 7) * 7;
    const numWeeks = totalCells / 7;

    for (let w = 0; w < numWeeks; w++) {
      const weekCells: any[] = [];
      let weekRfqs = 0;
      let weekSubmissions = 0;
      let weekRegB = 0;
      let weekRegS = 0;
      let startDayNum = 0;
      let endDayNum = 0;

      for (let c = 0; c < 7; c++) {
        const cellIdx = w * 7 + c;
        const dayNum = cellIdx - this.startDayOffset + 1;
        if (cellIdx >= this.startDayOffset && dayNum <= this.days.length) {
          const dayData = this.days[dayNum - 1];
          weekCells.push(dayData);
          if (!startDayNum) startDayNum = dayNum;
          endDayNum = dayNum;
          if (dayData) {
            weekRfqs += dayData.rfqs || 0;
            weekSubmissions += dayData.sellerSubmissions || 0;
            weekRegB += dayData.regB || 0;
            weekRegS += dayData.regS || 0;
          }
        } else {
          weekCells.push(null);
        }
      }

      const monthPrefix = this.monthName ? this.monthName.split(' ')[0].substring(0, 3) : 'Day';
      const weekRange = (startDayNum && endDayNum)
        ? `${monthPrefix} ${String(startDayNum).padStart(2, '0')} - ${monthPrefix} ${String(endDayNum).padStart(2, '0')}`
        : `Week ${w + 1}`;

      const backendWeek = (this.weeks && this.weeks[w]) || {};

      rows.push({
        weekNumber: w + 1,
        dateRange: backendWeek.dateRange || weekRange,
        cells: weekCells,
        totalRfqs: backendWeek.rfqs !== undefined ? backendWeek.rfqs : weekRfqs,
        totalSubmissions: backendWeek.sellerSubmissions !== undefined ? backendWeek.sellerSubmissions : weekSubmissions,
        totalRegB: backendWeek.regB !== undefined ? backendWeek.regB : weekRegB,
        totalRegS: backendWeek.regS !== undefined ? backendWeek.regS : weekRegS,
        totalReg: backendWeek.totalReg !== undefined ? backendWeek.totalReg : (weekRegB + weekRegS)
      });
    }
    return rows;
  }
}
