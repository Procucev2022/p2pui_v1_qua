import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrGmtRegisterClientsComponent } from './cat-mgr-gmt-register-clients.component';

describe('CatMgrGmtRegisterClientsComponent', () => {
  let component: CatMgrGmtRegisterClientsComponent;
  let fixture: ComponentFixture<CatMgrGmtRegisterClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrGmtRegisterClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrGmtRegisterClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
