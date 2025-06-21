import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCreateSubCategoryComponent } from './new-create-sub-category.component';

describe('NewCreateSubCategoryComponent', () => {
  let component: NewCreateSubCategoryComponent;
  let fixture: ComponentFixture<NewCreateSubCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCreateSubCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCreateSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
