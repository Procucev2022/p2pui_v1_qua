import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics-categories',
  templateUrl: './analytics-categories.component.html',
  styleUrls: ['./analytics-categories.component.scss']
})
export class AnalyticsCategoriesComponent implements OnInit, OnDestroy {
  categories: any[] = [];
  stats: any = { totalCategories: 0, activeBuyers: 0, registeredSellers: 0, openRfqs: 0 };
  searchQuery: string = '';
  selectedCategory: any = null;
  isDrawerOpen: boolean = false;
  isLoading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  private modalBackdropEl: HTMLElement | null = null;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.cleanupBodyModal();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.analyticsService.getCategoriesData().subscribe({
      next: (res: any) => {
        if (res) {
          this.categories = res.categories || [];
          this.stats = res.stats || this.stats;
          if (this.categories.length > 0) {
            this.selectedCategory = this.categories[0];
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Categories error:', err);
        this.isLoading = false;
      }
    });
  }

  get filteredCategories(): any[] {
    if (!this.searchQuery) return this.categories;
    const q = this.searchQuery.toLowerCase();
    return this.categories.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.subDescription && c.subDescription.toLowerCase().includes(q))
    );
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCategories.length / this.itemsPerPage);
  }

  get displayedCategories(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCategories.slice(start, start + this.itemsPerPage);
  }

  openDrawer(cat: any): void {
    this.selectedCategory = cat;
    this.isDrawerOpen = true;
    setTimeout(() => {
      const el = document.getElementById('category-modal-backdrop');
      if (el && el.parentElement !== document.body) {
        this.modalBackdropEl = el;
        document.body.appendChild(el);
      }
    }, 0);
  }

  closeDrawer(): void {
    this.cleanupBodyModal();
    this.isDrawerOpen = false;
  }

  private cleanupBodyModal(): void {
    const el = document.getElementById('category-modal-backdrop') || this.modalBackdropEl;
    if (el && el.parentElement === document.body) {
      document.body.removeChild(el);
    }
    this.modalBackdropEl = null;
  }

  exportData(): void {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Category,Active RFQs,Buyers,Sellers,Avg Demand\n' +
      this.categories.map((c) => `"${c.name}",${c.activeRfqs},${c.buyers},${c.sellers},"${c.avgValue || ''}"`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'category_analysis.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
