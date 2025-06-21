import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrQuotSubTabVendorsComponent } from './cat-mgr-quot-sub-tab-vendors.component';

describe('CatMgrQuotSubTabVendorsComponent', () => {
  let component: CatMgrQuotSubTabVendorsComponent;
  let fixture: ComponentFixture<CatMgrQuotSubTabVendorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrQuotSubTabVendorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrQuotSubTabVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
