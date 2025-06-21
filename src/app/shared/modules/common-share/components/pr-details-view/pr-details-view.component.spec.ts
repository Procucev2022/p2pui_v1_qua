import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrDetailsViewComponent } from './pr-details-view.component';

describe('PrDetailsViewComponent', () => {
  let component: PrDetailsViewComponent;
  let fixture: ComponentFixture<PrDetailsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrDetailsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
