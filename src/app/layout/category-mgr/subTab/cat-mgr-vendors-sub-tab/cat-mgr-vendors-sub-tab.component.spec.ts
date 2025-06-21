import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrVendorsSubTabComponent } from './cat-mgr-vendors-sub-tab.component';

describe('CatMgrVendorsSubTabComponent', () => {
  let component: CatMgrVendorsSubTabComponent;
  let fixture: ComponentFixture<CatMgrVendorsSubTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrVendorsSubTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrVendorsSubTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
