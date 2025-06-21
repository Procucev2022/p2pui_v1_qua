import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrRfqTabComponent } from './cat-mgr-rfq-tab.component';

describe('CatMgrRfqTabComponent', () => {
  let component: CatMgrRfqTabComponent;
  let fixture: ComponentFixture<CatMgrRfqTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrRfqTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrRfqTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
