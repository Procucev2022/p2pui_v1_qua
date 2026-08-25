import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuyerCommandCenterComponent } from './buyer-command-center.component';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe('BuyerCommandCenterComponent', () => {
  let component: BuyerCommandCenterComponent;
  let fixture: ComponentFixture<BuyerCommandCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyerCommandCenterComponent],
      imports: [CommonModule, RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerCommandCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create BuyerCommandCenterComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should render executive header title and screen 1.1 badge', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('.page-title');
    const badge = compiled.querySelector('.screen-badge');
    expect(title?.textContent).toContain('Executive Buyer Command Center');
    expect(badge?.textContent).toContain('SCREEN 1.1');
  });

  it('should have 4 KPI cards with expected data', () => {
    expect(component.kpiStats.length).toBe(4);
    const compiled = fixture.nativeElement as HTMLElement;
    const kpiCards = compiled.querySelectorAll('.kpi-card');
    expect(kpiCards.length).toBe(4);
    expect(compiled.querySelector('#kpi-active-rfqs .kpi-value')?.textContent?.trim()).toBe('5');
    expect(compiled.querySelector('#kpi-pending-quotes .kpi-value')?.textContent?.trim()).toBe('40');
    expect(compiled.querySelector('#kpi-ai-followups .kpi-value')?.textContent?.trim()).toBe('12');
    expect(compiled.querySelector('#kpi-total-spend .kpi-value')?.textContent?.trim()).toBe('$1.24M');
  });

  it('should render 5 procurement pipeline rows in the table', () => {
    expect(component.pipelineEvents.length).toBe(5);
    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('.pipeline-table tbody tr');
    expect(rows.length).toBe(5);
  });

  it('should render AI bot live feed with activities and footer', () => {
    expect(component.aiFeedEvents.length).toBe(9);
    expect(component.feedTabs.length).toBe(5);
    const compiled = fixture.nativeElement as HTMLElement;
    const feedTabs = compiled.querySelectorAll('.feed-tab-btn');
    expect(feedTabs.length).toBe(5);

    const feedItems = compiled.querySelectorAll('.feed-item');
    expect(feedItems.length).toBe(9);
    expect(compiled.querySelector('.feed-autochasing-label')?.textContent).toContain('Auto-Chasing 24/7');

    // Test filtering by calls
    component.selectFeedTab('calls');
    expect(component.filteredFeedEvents.length).toBe(2);

    // Test filtering by wa
    component.selectFeedTab('wa');
    expect(component.filteredFeedEvents.length).toBe(2);

    // Test filtering by sms
    component.selectFeedTab('sms');
    expect(component.filteredFeedEvents.length).toBe(2);

    // Test filtering by system
    component.selectFeedTab('system');
    expect(component.filteredFeedEvents.length).toBe(3);

    // Test reset to all
    component.selectFeedTab('all');
    expect(component.filteredFeedEvents.length).toBe(9);
  });

  it('should handle action button clicks and show feedback messages', (done) => {
    component.onCreateRfq();
    expect(component.feedbackMessage).toContain('Create New RFQ');

    // Call again to exercise clearTimeout branch
    component.onCreateRfq();
    expect(component.feedbackMessage).toContain('Create New RFQ');

    component.onUploadBoq();
    expect(component.feedbackMessage).toContain('BOQ Document Ingestion');

    component.onExportAnalytics();
    expect(component.feedbackMessage).toContain('Analytics Export');

    const event = component.pipelineEvents[0];
    component.onViewMatrix(event);
    expect(component.feedbackMessage).toContain('RFQ-2026-00421');

    const recEvent = component.pipelineEvents[2];
    component.onAiRecommended(recEvent);
    expect(component.feedbackMessage).toContain('RFQ-2026-00418');

    component.onActionClick(component.pipelineEvents[0]);
    expect(component.feedbackMessage).toContain('RFQ-2026-00421');

    component.onActionClick(component.pipelineEvents[2]);
    expect(component.feedbackMessage).toContain('RFQ-2026-00418');

    component.onActionClick(component.pipelineEvents[3]);
    expect(component.feedbackMessage).toContain('OCR Parsing');

    done();
  });
});
