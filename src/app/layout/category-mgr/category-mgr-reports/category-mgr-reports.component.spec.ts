import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryMgrReportsComponent } from './category-mgr-reports.component';

describe('CategoryMgrReportsComponent', () => {
  let component: CategoryMgrReportsComponent;
  let fixture: ComponentFixture<CategoryMgrReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryMgrReportsComponent]
    });
    fixture = TestBed.createComponent(CategoryMgrReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
