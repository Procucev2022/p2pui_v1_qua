import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorClientRefComponent } from './vendor-client-ref.component';

describe('VendorClientRefComponent', () => {
  let component: VendorClientRefComponent;
  let fixture: ComponentFixture<VendorClientRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorClientRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorClientRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
