import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageHeaderComponent } from './page-header.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageHeaderComponent],
      imports: [RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept heading input', () => {
    component.heading = 'Test Heading';
    fixture.detectChanges();
    expect(component.heading).toBe('Test Heading');
  });

  it('should accept icon input', () => {
    component.icon = 'fa-home';
    fixture.detectChanges();
    expect(component.icon).toBe('fa-home');
  });

  it('ngOnInit should not throw', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });
});
