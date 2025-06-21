import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPRIdDetailsComponent } from './view-pr-id-details.component';

describe('ViewPRIdDetailsComponent', () => {
  let component: ViewPRIdDetailsComponent;
  let fixture: ComponentFixture<ViewPRIdDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPRIdDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPRIdDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
