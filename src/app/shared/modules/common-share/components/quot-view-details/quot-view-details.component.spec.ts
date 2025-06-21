import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotViewDetailsComponent } from './quot-view-details.component';

describe('QuotViewDetailsComponent', () => {
  let component: QuotViewDetailsComponent;
  let fixture: ComponentFixture<QuotViewDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotViewDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
