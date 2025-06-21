import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrCommonGridComponent } from './cat-mgr-common-grid.component';

describe('CatMgrCommonGridComponent', () => {
  let component: CatMgrCommonGridComponent;
  let fixture: ComponentFixture<CatMgrCommonGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrCommonGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrCommonGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
