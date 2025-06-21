import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfsUserInfoDetailsComponent } from './bfs-user-info-details.component';

describe('BfsUserInfoDetailsComponent', () => {
  let component: BfsUserInfoDetailsComponent;
  let fixture: ComponentFixture<BfsUserInfoDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfsUserInfoDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfsUserInfoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
