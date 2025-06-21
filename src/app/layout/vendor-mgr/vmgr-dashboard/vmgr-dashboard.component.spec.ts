import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmgrDashboardComponent } from './vmgr-dashboard.component';

describe('VmgrDashboardComponent', () => {
  let component: VmgrDashboardComponent;
  let fixture: ComponentFixture<VmgrDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmgrDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmgrDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
