import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorViewModelComponent } from './vendor-view-model.component';

describe('VendorViewModelComponent', () => {
  let component: VendorViewModelComponent;
  let fixture: ComponentFixture<VendorViewModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorViewModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorViewModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
