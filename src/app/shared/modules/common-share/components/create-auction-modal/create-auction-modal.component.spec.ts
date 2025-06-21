import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAuctionModalComponent } from './create-auction-modal.component';

describe('CreateAuctionModalComponent', () => {
  let component: CreateAuctionModalComponent;
  let fixture: ComponentFixture<CreateAuctionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAuctionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAuctionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
