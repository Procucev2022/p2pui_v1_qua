import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPriceApprovalsComponent } from './item-price-approvals.component';

describe('ItemPriceApprovalsComponent', () => {
  let component: ItemPriceApprovalsComponent;
  let fixture: ComponentFixture<ItemPriceApprovalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemPriceApprovalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPriceApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
