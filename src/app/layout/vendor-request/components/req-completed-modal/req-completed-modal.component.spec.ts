import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqCompletedModalComponent } from './req-completed-modal.component';

describe('ReqCompletedModalComponent', () => {
  let component: ReqCompletedModalComponent;
  let fixture: ComponentFixture<ReqCompletedModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqCompletedModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqCompletedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
