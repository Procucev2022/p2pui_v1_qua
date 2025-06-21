import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotInfoComponent } from './quot-info.component';

describe('QuotInfoComponent', () => {
  let component: QuotInfoComponent;
  let fixture: ComponentFixture<QuotInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
