import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserIdleService } from 'angular-user-idle';
import { TimeoutModalComponent } from './timeout-modal.component';

describe('TimeoutModalComponent', () => {
  let component: TimeoutModalComponent;
  let fixture: ComponentFixture<TimeoutModalComponent>;
  let activeModal: jasmine.SpyObj<NgbActiveModal>;
  let userIdle: jasmine.SpyObj<UserIdleService>;

  beforeEach(async () => {
    activeModal = jasmine.createSpyObj('NgbActiveModal', ['dismiss', 'close']);
    userIdle = jasmine.createSpyObj('UserIdleService', ['resetTimer', 'stopWatching']);

    await TestBed.configureTestingModule({
      declarations: [TimeoutModalComponent],
      providers: [
        { provide: NgbActiveModal, useValue: activeModal },
        { provide: UserIdleService, useValue: userIdle }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TimeoutModalComponent);
    component = fixture.componentInstance;
    component.name = 'TestUser';
  });

  afterEach(() => {
    if (component.timer) {
      clearInterval(component.timer);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start timer on ngOnInit', () => {
    component.ngOnInit();
    expect(component.timer).toBeTruthy();
  });

  it('should not start timer when counter is 0', () => {
    component.counter = 0;
    component.startTimer();
    expect(component.timer).toBeUndefined();
  });

  it('should decrement counter and close session when timer expires', fakeAsync(() => {
    component.counter = 2;
    component.sessionExtended = false;
    spyOn(component, 'closeSession').and.callThrough();
    component.startTimer();
    tick(1000);
    expect(component.counter).toBe(1);
    tick(1000);
    expect(component.closeSession).toHaveBeenCalled();
    clearInterval(component.timer);
  }));

  it('should not close session when sessionExtended is true', fakeAsync(() => {
    component.counter = 1;
    component.sessionExtended = true;
    spyOn(component, 'closeSession');
    component.startTimer();
    tick(1000);
    expect(component.closeSession).not.toHaveBeenCalled();
    clearInterval(component.timer);
  }));

  it('closeModal should extend session and dismiss', () => {
    component.closeModal();
    expect(component.sessionExtended).toBe(true);
    expect(userIdle.resetTimer).toHaveBeenCalled();
    expect(activeModal.dismiss).toHaveBeenCalledWith('Close click');
  });

  it('closeSession should stop watching and dismiss', () => {
    component.closeSession();
    expect(userIdle.stopWatching).toHaveBeenCalled();
    expect(activeModal.dismiss).toHaveBeenCalledWith('Close click');
  });

  it('ngOnDestroy should clear interval when timer exists', () => {
    component.timer = setInterval(() => {}, 1000);
    const id = component.timer;
    spyOn(window, 'clearInterval').and.callThrough();
    component.ngOnDestroy();
    expect(clearInterval).toHaveBeenCalledWith(id);
  });

  it('ngOnDestroy should be safe without timer', () => {
    component.timer = null;
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});
