import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfsMyBidsComponent } from './bfs-my-bids.component';

describe('BfsMyBidsComponent', () => {
  let component: BfsMyBidsComponent;
  let fixture: ComponentFixture<BfsMyBidsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfsMyBidsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfsMyBidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
