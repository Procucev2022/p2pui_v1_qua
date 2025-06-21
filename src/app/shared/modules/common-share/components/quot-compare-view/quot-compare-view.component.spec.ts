import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotCompareViewComponent } from './quot-compare-view.component';

describe('QuotCompareViewComponent', () => {
  let component: QuotCompareViewComponent;
  let fixture: ComponentFixture<QuotCompareViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotCompareViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotCompareViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
