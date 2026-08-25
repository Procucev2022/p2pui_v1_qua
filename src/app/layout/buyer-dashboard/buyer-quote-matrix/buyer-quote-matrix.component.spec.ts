import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuyerQuoteMatrixComponent } from './buyer-quote-matrix.component';
import { CommonModule } from '@angular/common';

describe('BuyerQuoteMatrixComponent', () => {
  let component: BuyerQuoteMatrixComponent;
  let fixture: ComponentFixture<BuyerQuoteMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyerQuoteMatrixComponent],
      imports: [CommonModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerQuoteMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create BuyerQuoteMatrixComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should render header with SCREEN 1.3 badge and RFQ metadata', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.page-title')?.textContent).toContain('Quote Evaluation Matrix');
    expect(compiled.querySelector('.screen-badge')?.textContent).toContain('SCREEN 1.3');
    expect(compiled.querySelector('#rfq-metadata-bar')?.textContent).toContain('RFQ-2026-00421');
    expect(compiled.querySelector('#rfq-metadata-bar')?.textContent).toContain('$450,000');
  });

  it('should render top AI recommended supplier card for Apex Supplies Ltd.', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero-vendor-name')?.textContent).toContain('Apex Supplies Ltd.');
    expect(compiled.querySelector('.metric-value-large')?.textContent).toContain('$412,000');
    expect(compiled.querySelector('.metric-value-green')?.textContent).toContain('8.44% ($38,000 Saved)');
  });

  it('should render side-by-side matrix with 5 vendor columns', () => {
    expect(component.vendors.length).toBe(5);
    const compiled = fixture.nativeElement as HTMLElement;
    const vendorHeaders = compiled.querySelectorAll('.evaluation-matrix-table thead th.th-vendor');
    expect(vendorHeaders.length).toBe(5);
  });

  it('should handle vendor selection and action triggers', () => {
    component.selectVendor(component.vendors[1]);
    expect(component.vendors[1].isSelected).toBe(true);
    expect(component.toastMessage).toContain('Bharat Heavy Machines');

    // Call again to test clearing timer
    component.selectVendor(component.vendors[2]);
    expect(component.vendors[2].isSelected).toBe(true);

    component.acceptAiPick();
    expect(component.toastMessage).toContain('Accepted AI Pick');

    component.onCounterOffer();
    expect(component.toastMessage).toContain('Counter-Offer');

    component.exportPdf();
    expect(component.toastMessage).toContain('Comparison PDF');

    component.downloadExcel();
    expect(component.toastMessage).toContain('Excel');

    component.awardSelectedVendor();
    expect(component.toastMessage).toContain('Awarding');
  });
});
