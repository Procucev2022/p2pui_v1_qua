import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadAttachmentsComponent } from './download-attachments.component';

describe('DownloadAttachmentsComponent', () => {
  let component: DownloadAttachmentsComponent;
  let fixture: ComponentFixture<DownloadAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
