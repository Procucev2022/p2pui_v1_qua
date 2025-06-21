import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalpendingTabComponent } from './approvalpending-tab.component';

describe('ApprovalpendingTabComponent', () => {
  let component: ApprovalpendingTabComponent;
  let fixture: ComponentFixture<ApprovalpendingTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalpendingTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalpendingTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
