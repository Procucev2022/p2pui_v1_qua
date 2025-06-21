import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRarAuctionComponent } from './create-rar-auction.component';

describe('CreateRarAuctionComponent', () => {
  let component: CreateRarAuctionComponent;
  let fixture: ComponentFixture<CreateRarAuctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRarAuctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRarAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
