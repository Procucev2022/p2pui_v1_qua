import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TimeoutModalComponent } from './timeout-modal.component';
import { exerciseComponent,  autoMock, defaultAppConfig } from '../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserIdleService } from 'angular-user-idle';
import { MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';

describe('TimeoutModalComponent', () => {
  let component: TimeoutModalComponent;
  let fixture: ComponentFixture<TimeoutModalComponent>;
  let activeModal: any;
  let userIdle: any;

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    activeModal = autoMock('NgbActiveModal');
    userIdle = autoMock('UserIdleService');

    await TestBed.configureTestingModule({
      declarations: [TimeoutModalComponent],
      imports: [CommonModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: autoMock('ChangeDetectorRef') },
        DatePipe,
        {
          provide: MAT_DIALOG_SCROLL_STRATEGY,
          useValue: () => ({
            attach: () => undefined,
            enable: () => undefined,
            disable: () => undefined,
            detach: () => undefined,
          }),
        },
        { provide: NgbActiveModal, useValue: activeModal },
        { provide: UserIdleService, useValue: userIdle },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(TimeoutModalComponent, '')
      .overrideComponent(TimeoutModalComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(TimeoutModalComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    if (component?.timer) {
      clearInterval(component.timer);
      component.timer = null;
    }
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should start timer on init and close session when counter ends', fakeAsync(() => {
    component.counter = 2;
    component.sessionExtended = false;
    component.ngOnInit();
    tick(1000);
    expect(component.counter).toBe(1);
    tick(1000);
    expect(component.counter).toBe(0);
    expect(userIdle.stopWatching).toHaveBeenCalled();
    expect(activeModal.dismiss).toHaveBeenCalledWith('Close click');
    component.ngOnDestroy();
  }));

  it('should not start timer when counter is already 0', () => {
    component.counter = 0;
    component.startTimer();
    expect(component.timer).toBeUndefined();
  });

  it('should extend session on closeModal and clear timer', () => {
    component.counter = 5;
    component.startTimer();
    expect(component.timer).toBeDefined();

    component.closeModal();
    expect(component.sessionExtended).toBe(true);
    expect(component.timer).toBeNull();
    expect(userIdle.resetTimer).toHaveBeenCalled();
    expect(activeModal.dismiss).toHaveBeenCalledWith('Close click');
  });

  it('should not close session in interval when session already extended', fakeAsync(() => {
    component.counter = 1;
    component.sessionExtended = true;
    component.startTimer();
    tick(1000);
    expect(userIdle.stopWatching).not.toHaveBeenCalled();
    component.ngOnDestroy();
  }));

  it('should clear interval on closeSession', () => {
    component.counter = 5;
    component.startTimer();
    expect(component.timer).toBeDefined();

    component.closeSession();
    expect(component.timer).toBeNull();
    expect(userIdle.stopWatching).toHaveBeenCalled();
    expect(activeModal.dismiss).toHaveBeenCalledWith('Close click');
  });

  it('should clear interval on destroy', () => {
    component.counter = 5;
    component.startTimer();
    expect(component.timer).toBeDefined();

    component.ngOnDestroy();
    expect(component.timer).toBeNull();
  });

  it('should handle multiple startTimer calls safely by resetting previous timer', () => {
    component.counter = 5;
    component.startTimer();
    const firstTimer = component.timer;
    expect(firstTimer).toBeDefined();

    component.startTimer();
    const secondTimer = component.timer;
    expect(secondTimer).toBeDefined();

    component.ngOnDestroy();
    expect(component.timer).toBeNull();
  });
});
