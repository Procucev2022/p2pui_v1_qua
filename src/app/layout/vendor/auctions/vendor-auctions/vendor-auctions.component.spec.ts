import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAuctionsComponent } from './vendor-auctions.component';

describe('VendorAuctionsComponent', () => {
  let component: VendorAuctionsComponent;
  let fixture: ComponentFixture<VendorAuctionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorAuctionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorAuctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
