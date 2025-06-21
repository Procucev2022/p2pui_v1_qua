import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrProcuRequestsComponent } from './cat-mgr-procu-requests.component';

describe('CatMgrProcuRequestsComponent', () => {
  let component: CatMgrProcuRequestsComponent;
  let fixture: ComponentFixture<CatMgrProcuRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrProcuRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrProcuRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
