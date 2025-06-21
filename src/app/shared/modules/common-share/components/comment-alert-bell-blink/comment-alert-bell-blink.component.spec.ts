import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentAlertBellBlinkComponent } from './comment-alert-bell-blink.component';

describe('CommentAlertBellBlinkComponent', () => {
  let component: CommentAlertBellBlinkComponent;
  let fixture: ComponentFixture<CommentAlertBellBlinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentAlertBellBlinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentAlertBellBlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
