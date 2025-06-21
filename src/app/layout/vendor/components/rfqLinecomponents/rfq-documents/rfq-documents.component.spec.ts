import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqDocumentsComponent } from './rfq-documents.component';

describe('RfqDocumentsComponent', () => {
  let component: RfqDocumentsComponent;
  let fixture: ComponentFixture<RfqDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
