import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSearchForLinkingComponent } from './vendor-search-for-linking.component';

describe('VendorSearchForLinkingComponent', () => {
  let component: VendorSearchForLinkingComponent;
  let fixture: ComponentFixture<VendorSearchForLinkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorSearchForLinkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorSearchForLinkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
