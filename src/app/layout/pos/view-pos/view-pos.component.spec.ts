import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPosComponent } from './view-pos.component';

describe('ViewPosComponent', () => {
  let component: ViewPosComponent;
  let fixture: ComponentFixture<ViewPosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
