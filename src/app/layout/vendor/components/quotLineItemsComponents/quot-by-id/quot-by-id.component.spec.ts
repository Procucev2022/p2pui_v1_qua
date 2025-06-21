import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotByIdComponent } from './quot-by-id.component';

describe('QuotByIdComponent', () => {
  let component: QuotByIdComponent;
  let fixture: ComponentFixture<QuotByIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotByIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
