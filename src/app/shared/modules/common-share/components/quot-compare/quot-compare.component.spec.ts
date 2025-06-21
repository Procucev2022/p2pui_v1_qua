import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotCompareComponent } from './quot-compare.component';

describe('QuotCompareComponent', () => {
  let component: QuotCompareComponent;
  let fixture: ComponentFixture<QuotCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
