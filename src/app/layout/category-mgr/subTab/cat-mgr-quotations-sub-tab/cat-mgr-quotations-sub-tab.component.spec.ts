import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrQuotationsSubTabComponent } from './cat-mgr-quotations-sub-tab.component';

describe('CatMgrQuotationsSubTabComponent', () => {
  let component: CatMgrQuotationsSubTabComponent;
  let fixture: ComponentFixture<CatMgrQuotationsSubTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrQuotationsSubTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrQuotationsSubTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
