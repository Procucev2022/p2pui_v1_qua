import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoDeliveryItemsComponent } from './po-delivery-items.component';

describe('PoDeliveryItemsComponent', () => {
  let component: PoDeliveryItemsComponent;
  let fixture: ComponentFixture<PoDeliveryItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoDeliveryItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDeliveryItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
