import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatComponent } from './stat.component';

describe('StatComponent', () => {
  let component: StatComponent;
  let fixture: ComponentFixture<StatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StatComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept inputs', () => {
    component.bgClass = 'bg-primary';
    component.icon = 'fa-users';
    component.count = 42;
    component.label = 'Users';
    component.data = 100;
    fixture.detectChanges();
    expect(component.bgClass).toBe('bg-primary');
    expect(component.icon).toBe('fa-users');
    expect(component.count).toBe(42);
    expect(component.label).toBe('Users');
    expect(component.data).toBe(100);
  });

  it('should have event emitter', () => {
    expect(component.event).toBeDefined();
  });

  it('ngOnInit should not throw', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });
});
