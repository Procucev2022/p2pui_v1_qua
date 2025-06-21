import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpoDocumentsComponent } from './ppo-documents.component';

describe('PpoDocumentsComponent', () => {
  let component: PpoDocumentsComponent;
  let fixture: ComponentFixture<PpoDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpoDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpoDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
