import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { AnalyticsCategoriesComponent } from './analytics-categories.component';
import { AnalyticsService } from '../../services/analytics.service';
import { autoMock } from 'src/testing/test-helpers';

describe('AnalyticsCategoriesComponent', () => {
  let component: AnalyticsCategoriesComponent;
  let fixture: ComponentFixture<AnalyticsCategoriesComponent>;
  let analyticsService: any;

  const categoriesResponse = {
    categories: [
      { name: 'Steel', subDescription: 'Metals', activeRfqs: 10, buyers: 5, sellers: 3, avgValue: '100' },
      { name: 'Cement', subDescription: 'Construction', activeRfqs: 5, buyers: 2, sellers: 1, avgValue: '50' }
    ],
    stats: { totalCategories: 2, activeBuyers: 7, registeredSellers: 4, openRfqs: 15 }
  };

  function setup() {
    analyticsService = autoMock('AnalyticsService');
    TestBed.configureTestingModule({
      declarations: [AnalyticsCategoriesComponent],
      providers: [{ provide: AnalyticsService, useValue: analyticsService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideTemplate(AnalyticsCategoriesComponent, '');
    fixture = TestBed.createComponent(AnalyticsCategoriesComponent);
    component = fixture.componentInstance;
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create and load categories on init', () => {
    setup();
    analyticsService.getCategoriesData.and.returnValue(of(categoriesResponse));
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.categories.length).toBe(2);
    expect(component.selectedCategory).toEqual(categoriesResponse.categories[0]);
    expect(component.isLoading).toBe(false);
  });

  it('should handle empty response gracefully', () => {
    setup();
    analyticsService.getCategoriesData.and.returnValue(of(null));
    fixture.detectChanges();
    expect(component.isLoading).toBe(false);
    expect(component.categories).toEqual([]);
  });

  it('should retain defaults when the response has no categories or stats', () => {
    setup();
    analyticsService.getCategoriesData.and.returnValue(of({ categories: [], stats: null }));
    fixture.detectChanges();
    expect(component.categories).toEqual([]);
    expect(component.stats.totalCategories).toBe(0);
  });

  it('should handle error from getCategoriesData', () => {
    setup();
    analyticsService.getCategoriesData.and.returnValue(throwError(() => new Error('fail')));
    fixture.detectChanges();
    expect(component.isLoading).toBe(false);
  });

  it('should filter categories by search query', () => {
    setup();
    analyticsService.getCategoriesData.and.returnValue(of(categoriesResponse));
    fixture.detectChanges();
    component.searchQuery = 'steel';
    expect(component.filteredCategories.length).toBe(1);
    component.searchQuery = 'construction';
    expect(component.filteredCategories.length).toBe(1);
    component.searchQuery = '';
    expect(component.filteredCategories.length).toBe(2);
  });

  it('should filter out categories without a matching subDescription', () => {
    setup();
    const noSubDescResponse = {
      ...categoriesResponse,
      categories: [{ name: 'Steel', activeRfqs: 10, buyers: 5, sellers: 3 }]
    };
    analyticsService.getCategoriesData.and.returnValue(of(noSubDescResponse));
    fixture.detectChanges();
    component.searchQuery = 'nomatch';
    expect(component.filteredCategories.length).toBe(0);
  });

  it('should paginate displayed categories', () => {
    setup();
    analyticsService.getCategoriesData.and.returnValue(of(categoriesResponse));
    fixture.detectChanges();
    component.itemsPerPage = 1;
    component.currentPage = 1;
    expect(component.displayedCategories.length).toBe(1);
    expect(component.totalPages).toBe(2);
    component.currentPage = 2;
    expect(component.displayedCategories.length).toBe(1);
  });

  it('should open drawer and move backdrop element to body', (done) => {
    setup();
    analyticsService.getCategoriesData.and.returnValue(of(categoriesResponse));
    fixture.detectChanges();
    const el = document.createElement('div');
    el.id = 'category-modal-backdrop';
    document.body.appendChild(document.createElement('div')).appendChild(el);
    component.openDrawer(categoriesResponse.categories[0]);
    expect(component.isDrawerOpen).toBe(true);
    setTimeout(() => {
      expect(el.parentElement).toBe(document.body);
      component.closeDrawer();
      expect(component.isDrawerOpen).toBe(false);
      done();
    }, 10);
  });

  it('should cleanup on destroy without existing backdrop', () => {
    setup();
    analyticsService.getCategoriesData.and.returnValue(of(categoriesResponse));
    fixture.detectChanges();
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('should export data as CSV', () => {
    setup();
    analyticsService.getCategoriesData.and.returnValue(of(categoriesResponse));
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

  it('should export data as CSV when avgValue is missing', () => {
    setup();
    analyticsService.getCategoriesData.and.returnValue(
      of({ ...categoriesResponse, categories: [{ name: 'NoAvg', activeRfqs: 1, buyers: 1, sellers: 1 }] })
    );
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
});
