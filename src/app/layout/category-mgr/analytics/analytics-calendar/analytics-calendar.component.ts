import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics-calendar',
  templateUrl: './analytics-calendar.component.html',
  styleUrls: ['./analytics-calendar.component.scss']
})
export class AnalyticsCalendarComponent implements OnInit {
  days: any[] = [];
  selectedDay: any = null;
  isDrawerOpen: boolean = false;
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
          this.monthName = res.month || `${this.currentMonth}/${this.currentYear}`;
          this.startDayOffset = res.startDayOffset ?? 0;
          if (res.availableMonths && res.availableMonths.length > 0) {
            this.availableMonths = res.availableMonths;
          }
          if (this.days.length > 0) {
            const active = this.days.find((d: any) => d.rfqs > 0) || this.days[0];
            this.selectedDay = active;
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
    }
  }

  get totalGridCells(): number[] {
    const total = Math.ceil((this.startDayOffset + this.days.length) / 7) * 7;
    return Array.from({ length: total }, (_, i) => i);
  }
}
