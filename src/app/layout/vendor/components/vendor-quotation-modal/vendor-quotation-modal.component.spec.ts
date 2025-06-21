import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorQuotationModalComponent } from './vendor-quotation-modal.component';

describe('VendorQuotationModalComponent', () => {
  let component: VendorQuotationModalComponent;
  let fixture: ComponentFixture<VendorQuotationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorQuotationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorQuotationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
