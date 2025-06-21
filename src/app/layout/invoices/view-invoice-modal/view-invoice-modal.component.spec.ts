import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInvoiceModalComponent } from './view-invoice-modal.component';

describe('ViewInvoiceModalComponent', () => {
  let component: ViewInvoiceModalComponent;
  let fixture: ComponentFixture<ViewInvoiceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInvoiceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInvoiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
