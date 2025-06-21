import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcuVendorSearchComponent } from './procu-vendor-search.component';

describe('ProcuVendorSearchComponent', () => {
  let component: ProcuVendorSearchComponent;
  let fixture: ComponentFixture<ProcuVendorSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcuVendorSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcuVendorSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
