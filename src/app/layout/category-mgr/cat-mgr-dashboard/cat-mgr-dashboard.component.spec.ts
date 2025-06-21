import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrDashboardComponent } from './cat-mgr-dashboard.component';

describe('CatMgrDashboardComponent', () => {
  let component: CatMgrDashboardComponent;
  let fixture: ComponentFixture<CatMgrDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
