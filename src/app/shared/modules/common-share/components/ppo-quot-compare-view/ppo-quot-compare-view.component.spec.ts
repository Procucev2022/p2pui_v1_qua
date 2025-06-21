import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpoQuotCompareViewComponent } from './ppo-quot-compare-view.component';

describe('PpoQuotCompareViewComponent', () => {
  let component: PpoQuotCompareViewComponent;
  let fixture: ComponentFixture<PpoQuotCompareViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpoQuotCompareViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpoQuotCompareViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
