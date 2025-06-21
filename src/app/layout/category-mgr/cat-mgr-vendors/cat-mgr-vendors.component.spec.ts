import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrVendorsComponent } from './cat-mgr-vendors.component';

describe('CatMgrVendorsComponent', () => {
  let component: CatMgrVendorsComponent;
  let fixture: ComponentFixture<CatMgrVendorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrVendorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
