import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateItemCategoryComponent } from './create-item-category.component';

describe('CreateItemCategoryComponent', () => {
  let component: CreateItemCategoryComponent;
  let fixture: ComponentFixture<CreateItemCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateItemCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateItemCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
