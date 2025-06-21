import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRFQByIdModalComponent } from './view-rfq-by-id-modal.component';

describe('ViewRFQByIdModalComponent', () => {
  let component: ViewRFQByIdModalComponent;
  let fixture: ComponentFixture<ViewRFQByIdModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRFQByIdModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRFQByIdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
