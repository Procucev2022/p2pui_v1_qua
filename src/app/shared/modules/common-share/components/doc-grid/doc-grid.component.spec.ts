import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocGridComponent } from './doc-grid.component';

describe('DocGridComponent', () => {
  let component: DocGridComponent;
  let fixture: ComponentFixture<DocGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
