import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuyerDashboardComponent } from './buyer-dashboard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('BuyerDashboardComponent', () => {
  let component: BuyerDashboardComponent;
  let fixture: ComponentFixture<BuyerDashboardComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyerDashboardComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerDashboardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create BuyerDashboardComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should render screens tabs with Screen 1.1 active by default', () => {
    expect(component.screenTabs.length).toBe(3);
    expect(component.screenTabs[0].active).toBe(true);
    const compiled = fixture.nativeElement as HTMLElement;
    const activeScreen = compiled.querySelector('.screen-pill-btn.active');
    expect(activeScreen?.textContent).toContain('Screen 1.1: Buyer Command Center');
  });

  it('should navigate on selecting screen tab', () => {
    spyOn(router, 'navigateByUrl');
    component.onSelectScreen(component.screenTabs[0]);
    expect(component.screenTabs[0].active).toBe(true);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/buyer-dashboard/command-center');

    component.onSelectScreen(component.screenTabs[1]);
    expect(component.screenTabs[1].active).toBe(true);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/buyer-dashboard/ai-ingestion-wizard');

    component.onSelectScreen(component.screenTabs[2]);
    expect(component.screenTabs[2].active).toBe(true);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/buyer-dashboard/quote-evaluation-matrix');
  });

  it('should sync active tab with URL correctly', () => {
    component.syncActiveTabWithUrl('/buyer-dashboard/ai-ingestion-wizard');
    expect(component.screenTabs[1].active).toBe(true);

    component.syncActiveTabWithUrl('/buyer-dashboard/quote-evaluation-matrix');
    expect(component.screenTabs[2].active).toBe(true);

    component.syncActiveTabWithUrl('/buyer-dashboard/command-center');
    expect(component.screenTabs[0].active).toBe(true);
  });
});
