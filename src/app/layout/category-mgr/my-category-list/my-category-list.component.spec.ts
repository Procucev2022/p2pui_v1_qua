import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCategoryListComponent } from './my-category-list.component';

describe('MyCategoryListComponent', () => {
  let component: MyCategoryListComponent;
  let fixture: ComponentFixture<MyCategoryListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyCategoryListComponent]
    });
    fixture = TestBed.createComponent(MyCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
