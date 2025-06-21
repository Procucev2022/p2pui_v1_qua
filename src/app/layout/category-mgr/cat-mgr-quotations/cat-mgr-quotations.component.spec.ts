import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrQuotationsComponent } from './cat-mgr-quotations.component';

describe('CatMgrQuotationsComponent', () => {
  let component: CatMgrQuotationsComponent;
  let fixture: ComponentFixture<CatMgrQuotationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrQuotationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrQuotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
