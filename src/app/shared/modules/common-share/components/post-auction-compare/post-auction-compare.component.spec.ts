import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostAuctionCompareComponent } from './post-auction-compare.component';

describe('PostAuctionCompareComponent', () => {
  let component: PostAuctionCompareComponent;
  let fixture: ComponentFixture<PostAuctionCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostAuctionCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostAuctionCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
