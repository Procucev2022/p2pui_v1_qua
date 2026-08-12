import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StatComponent } from './stat.component';

describe('StatComponent', () => {
  let component: StatComponent;
  let fixture: ComponentFixture<StatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(StatComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept inputs and call ngOnInit', () => {
    component.bgClass = 'primary';
    component.icon = 'fa-user';
    component.count = 5;
    component.label = 'Users';
    component.data = 10;
    component.ngOnInit();
    expect(component.count).toBe(5);
    expect(component.label).toBe('Users');
  });

  it('should expose event emitter', () => {
    const spy = jasmine.createSpy('event');
    component.event.subscribe(spy);
    component.event.emit({ clicked: true });
    expect(spy).toHaveBeenCalledWith({ clicked: true });
  });
});
