import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { LoaderComponent } from './loader.component';
import { LoaderService } from '../services/loader.service';
import { NgxSpinnerService } from 'ngx-spinner';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;
  let loaderService: jasmine.SpyObj<LoaderService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let isLoading$: Subject<boolean>;

  beforeEach(async () => {
    isLoading$ = new Subject<boolean>();
    loaderService = jasmine.createSpyObj('LoaderService', [], {
      isLoading: isLoading$
    });
    spinner = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      declarations: [LoaderComponent],
      providers: [
        { provide: LoaderService, useValue: loaderService },
        { provide: NgxSpinnerService, useValue: spinner }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
  });

  it('should create and hide spinner initially', () => {
    expect(component).toBeTruthy();
    expect(spinner.hide).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
  });

  it('should show spinner when isLoading emits true', () => {
    isLoading$.next(true);
    expect(component.isLoading).toBe(true);
    expect(spinner.show).toHaveBeenCalled();
  });

  it('should not show spinner when isLoading emits false', () => {
    spinner.show.calls.reset();
    isLoading$.next(false);
    expect(component.isLoading).toBe(false);
    expect(spinner.show).not.toHaveBeenCalled();
  });

  it('should show spinner on error when already loading', () => {
    component.isLoading = true;
    spinner.show.calls.reset();
    isLoading$.error(new Error('fail'));
    expect(spinner.show).toHaveBeenCalled();
  });

  it('should not show spinner on error when not loading', () => {
    const local$ = new Subject<boolean>();
    const localLoader = jasmine.createSpyObj('LoaderService', [], { isLoading: local$ });
    const localSpinner = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [LoaderComponent],
      providers: [
        { provide: LoaderService, useValue: localLoader },
        { provide: NgxSpinnerService, useValue: localSpinner }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    const f = TestBed.createComponent(LoaderComponent);
    localSpinner.show.calls.reset();
    local$.error(new Error('fail'));
    expect(localSpinner.show).not.toHaveBeenCalled();
    expect(f.componentInstance).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
});
