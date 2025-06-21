import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridPageInfoComponent } from './grid-page-info.component';

describe('GridPageInfoComponent', () => {
  let component: GridPageInfoComponent;
  let fixture: ComponentFixture<GridPageInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridPageInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridPageInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
