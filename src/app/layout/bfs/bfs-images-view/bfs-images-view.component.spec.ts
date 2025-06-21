import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfsImagesViewComponent } from './bfs-images-view.component';

describe('BfsImagesViewComponent', () => {
  let component: BfsImagesViewComponent;
  let fixture: ComponentFixture<BfsImagesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfsImagesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfsImagesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
