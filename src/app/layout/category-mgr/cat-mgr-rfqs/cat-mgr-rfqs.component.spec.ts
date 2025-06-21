import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrRfqsComponent } from './cat-mgr-rfqs.component';

describe('CatMgrRfqsComponent', () => {
  let component: CatMgrRfqsComponent;
  let fixture: ComponentFixture<CatMgrRfqsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrRfqsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrRfqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
