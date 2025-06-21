import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProCpxVendorSummaryClientsComponent } from './pro-cpx-vendor-summary-clients.component';

describe('ProCpxVendorSummaryClientsComponent', () => {
  let component: ProCpxVendorSummaryClientsComponent;
  let fixture: ComponentFixture<ProCpxVendorSummaryClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProCpxVendorSummaryClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProCpxVendorSummaryClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
