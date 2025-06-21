import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRaiAuctionComponent } from './create-rai-auction.component';

describe('CreateRaiAuctionComponent', () => {
  let component: CreateRaiAuctionComponent;
  let fixture: ComponentFixture<CreateRaiAuctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRaiAuctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRaiAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
