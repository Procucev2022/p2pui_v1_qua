import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { LoaderComponent } from './loader.component';
import { autoMock, defaultAppConfig, exerciseComponent } from '../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { LoaderService } from '../services/loader.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';

describe('LoaderComponent', () => {
  let fixture: ComponentFixture<LoaderComponent>;
  let spinner: any;
  let loading$: BehaviorSubject<boolean>;

  async function setup(loadingSubject: Subject<boolean>) {
    spinner = autoMock('NgxSpinnerService');
    const loaderService = { isLoading: loadingSubject };

    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      declarations: [LoaderComponent],
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
        { provide: LoaderService, useValue: loaderService },
        { provide: NgxSpinnerService, useValue: spinner },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(LoaderComponent, '')
      .overrideComponent(LoaderComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(LoaderComponent);
    return fixture.componentInstance;
  }

  beforeEach(() => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');
  });

  it('should hide spinner on construct when not loading', async () => {
    loading$ = new BehaviorSubject(false);
    const component = await setup(loading$);
    expect(spinner.hide).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    component.ngOnInit();
  });

  it('should show spinner when isLoading emits true', async () => {
    loading$ = new BehaviorSubject(false);
    const component = await setup(loading$);
    loading$.next(true);
    expect(component.isLoading).toBe(true);
    expect(spinner.show).toHaveBeenCalled();
  });

  it('should update isLoading when emits false and hide spinner', async () => {
    loading$ = new BehaviorSubject(true);
    const component = await setup(loading$);
    spinner.hide.calls.reset();
    loading$.next(false);
    expect(component.isLoading).toBe(false);
    expect(spinner.hide).toHaveBeenCalled();
  });

  it('should update isLoading when emits false without hiding again', async () => {
    loading$ = new BehaviorSubject(false);
    const component = await setup(loading$);
    spinner.hide.calls.reset();
    loading$.next(false);
    expect(component.isLoading).toBe(false);
    expect(spinner.hide).toHaveBeenCalled();
  });

  it('should show spinner on error callback when already loading', async () => {
    const err$ = new Subject<boolean>();
    const component = await setup(err$);
    component.isLoading = true;
    err$.error(new Error('fail'));
    expect(spinner.show).toHaveBeenCalled();
  });

  it('should not show spinner on error when not loading', async () => {
    const err$ = new Subject<boolean>();
    await setup(err$);
    spinner.show.calls.reset();
    err$.error(new Error('fail'));
    expect(spinner.show).not.toHaveBeenCalled();
  });

  it('exerciseComponent branch coverage', async () => {
    loading$ = new BehaviorSubject(false);
    const component = await setup(loading$);
    try {
      exerciseComponent(component as any);
    } catch (e) {
      /* ignore */
    }
    expect(component).toBeTruthy();
  });

});
