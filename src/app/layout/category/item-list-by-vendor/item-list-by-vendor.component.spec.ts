import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemListByVendorComponent } from './item-list-by-vendor.component';

describe('ItemListByVendorComponent', () => {
  let component: ItemListByVendorComponent;
  let fixture: ComponentFixture<ItemListByVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemListByVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemListByVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
