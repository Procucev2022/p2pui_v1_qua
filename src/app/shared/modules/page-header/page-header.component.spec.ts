import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageHeaderComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept heading and icon inputs', () => {
    component.heading = 'Dashboard';
    component.icon = 'fa-home';
    component.ngOnInit();
    expect(component.heading).toBe('Dashboard');
    expect(component.icon).toBe('fa-home');
  });

  it('should render with inputs', () => {
    component.heading = 'Title';
    component.icon = 'icon';
    fixture.detectChanges();
    expect(fixture.nativeElement).toBeTruthy();
  });
});
