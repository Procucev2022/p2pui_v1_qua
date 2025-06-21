import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTabViewModelComponent } from './vendor-tab-view-model.component';

describe('VendorTabViewModelComponent', () => {
  let component: VendorTabViewModelComponent;
  let fixture: ComponentFixture<VendorTabViewModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorTabViewModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorTabViewModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
