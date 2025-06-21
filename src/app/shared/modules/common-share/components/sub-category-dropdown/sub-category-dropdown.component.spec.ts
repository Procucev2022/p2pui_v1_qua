import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoryDropdownComponent } from './sub-category-dropdown.component';

describe('SubCategoryDropdownComponent', () => {
  let component: SubCategoryDropdownComponent;
  let fixture: ComponentFixture<SubCategoryDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubCategoryDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategoryDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
