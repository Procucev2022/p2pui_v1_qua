import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaisedIssuesComponent } from './raised-issues.component';

describe('RaisedIssuesComponent', () => {
  let component: RaisedIssuesComponent;
  let fixture: ComponentFixture<RaisedIssuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaisedIssuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaisedIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
