import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqsDocumentComponent } from './faqs-document.component';

describe('FaqsDocumentComponent', () => {
  let component: FaqsDocumentComponent;
  let fixture: ComponentFixture<FaqsDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqsDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqsDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
