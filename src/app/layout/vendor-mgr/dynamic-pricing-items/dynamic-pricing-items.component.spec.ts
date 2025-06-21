import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPricingItemsComponent } from './dynamic-pricing-items.component';

describe('DynamicPricingItemsComponent', () => {
  let component: DynamicPricingItemsComponent;
  let fixture: ComponentFixture<DynamicPricingItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicPricingItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicPricingItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
