import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapexCatMgrQuoteComparComponent } from './capex-cat-mgr-quote-compar.component';

describe('CapexCatMgrQuoteComparComponent', () => {
  let component: CapexCatMgrQuoteComparComponent;
  let fixture: ComponentFixture<CapexCatMgrQuoteComparComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapexCatMgrQuoteComparComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapexCatMgrQuoteComparComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
