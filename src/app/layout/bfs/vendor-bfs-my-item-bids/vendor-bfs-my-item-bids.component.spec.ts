import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorBfsMyItemBidsComponent } from './vendor-bfs-my-item-bids.component';

describe('VendorBfsMyItemBidsComponent', () => {
  let component: VendorBfsMyItemBidsComponent;
  let fixture: ComponentFixture<VendorBfsMyItemBidsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorBfsMyItemBidsComponent]
    });
    fixture = TestBed.createComponent(VendorBfsMyItemBidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
