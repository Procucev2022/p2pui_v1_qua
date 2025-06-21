import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapexAuctionsComponent } from './capex-auctions.component';

describe('CapexAuctionsComponent', () => {
  let component: CapexAuctionsComponent;
  let fixture: ComponentFixture<CapexAuctionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapexAuctionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapexAuctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
