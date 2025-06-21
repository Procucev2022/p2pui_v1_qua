import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapexCatMgrPostAuctionComparComponent } from './capex-cat-mgr-post-auction-compar.component';

describe('CapexCatMgrPostAuctionComparComponent', () => {
  let component: CapexCatMgrPostAuctionComparComponent;
  let fixture: ComponentFixture<CapexCatMgrPostAuctionComparComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapexCatMgrPostAuctionComparComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapexCatMgrPostAuctionComparComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
