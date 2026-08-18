import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { CorrespondenceComponent } from './correspondence.component';
import { defaultAppConfig } from 'src/testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { CommentsService } from '../../services/comments.service';
import { ToastrService } from 'ngx-toastr';
import { ConvertToBase64Service } from '../../services/convert-to-base64.service';
import { EncryDecryService } from 'src/app/shared/services';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('CorrespondenceComponent', () => {
  let component: CorrespondenceComponent;
  let fixture: ComponentFixture<CorrespondenceComponent>;
  let commentsService: any;
  let toastr: any;
  let convertSer: any;
  let encryDecryService: any;

  const mockDialogData = {
    id: 'pr-1',
    rfquuid: 'rfq-uuid-1',
    commentRootPath: 'RFQ-COMMENTS-MODAL',
    dropDownFlag: true
  };

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('orgId', 'org-1');
    localStorage.setItem('loggedUser', 'user1');

    toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      warning: jasmine.createSpy('warning')
    };

    commentsService = {
      getVendorsByRfq: jasmine.createSpy('getVendorsByRfq').and.returnValue(of([{ id: 'v1', companyName: 'Vendor 1' }])),
      getRFQComments: jasmine.createSpy('getRFQComments').and.returnValue(of([{ comment: 'Hi' }])),
      getRFQCommentsByRFQandVendor: jasmine.createSpy('getRFQCommentsByRFQandVendor').and.returnValue(of([{ comment: 'Hi' }])),
      getCatRFQComments: jasmine.createSpy('getCatRFQComments').and.returnValue(of([{ comment: 'Hi' }])),
      getPRComments: jasmine.createSpy('getPRComments').and.returnValue(of([{ comment: 'Hi' }])),
      getQuoteComments: jasmine.createSpy('getQuoteComments').and.returnValue(of([{ comment: 'Hi' }])),
      getPPOComments: jasmine.createSpy('getPPOComments').and.returnValue(of([{ comment: 'Hi' }])),
      getPrClientCommentByPr: jasmine.createSpy('getPrClientCommentByPr').and.returnValue(of([{ comment: 'Hi' }])),
      getPOComments: jasmine.createSpy('getPOComments').and.returnValue(of([{ comment: 'Hi' }])),
      getDeliveryComments: jasmine.createSpy('getDeliveryComments').and.returnValue(of([{ comment: 'Hi' }])),
      getASNComments: jasmine.createSpy('getASNComments').and.returnValue(of([{ comment: 'Hi' }])),
      saveRFQComments: jasmine.createSpy('saveRFQComments').and.returnValue(of({ status: 'Success' })),
      saveQuoteComments: jasmine.createSpy('saveQuoteComments').and.returnValue(of({ status: 'Success' })),
      savePRComments: jasmine.createSpy('savePRComments').and.returnValue(of({ status: 'Success' })),
      savePrClientComment: jasmine.createSpy('savePrClientComment').and.returnValue(of({ status: 'Success' })),
      savePPOComments: jasmine.createSpy('savePPOComments').and.returnValue(of({ status: 'Success' })),
      savePOComments: jasmine.createSpy('savePOComments').and.returnValue(of({ status: 'Success' })),
      saveDeliveryComments: jasmine.createSpy('saveDeliveryComments').and.returnValue(of({ status: 'Success' })),
      saveASNComments: jasmine.createSpy('saveASNComments').and.returnValue(of({ status: 'Success' }))
    };

    convertSer = {
      getBase64: jasmine.createSpy('getBase64').and.returnValue(Promise.resolve('data:application/pdf;base64,QUJD'))
    };

    encryDecryService = {
      get: jasmine.createSpy('get').and.returnValue(JSON.stringify({ details: { id: 'u1' } }))
    };

    await TestBed.configureTestingModule({
      declarations: [CorrespondenceComponent],
      imports: [CommonModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => undefined, detectChanges: () => undefined } },
        { provide: CommentsService, useValue: commentsService },
        { provide: ToastrService, useValue: toastr },
        { provide: ConvertToBase64Service, useValue: convertSer },
        { provide: EncryDecryService, useValue: encryDecryService },
        { provide: MAT_DIALOG_DATA, useValue: JSON.parse(JSON.stringify(mockDialogData)) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(CorrespondenceComponent, '')
      .overrideComponent(CorrespondenceComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(CorrespondenceComponent);
    component = fixture.componentInstance;
    component.loggedUserDetails = { id: 'u1' };
  });

  it('should create and initialize for dropDownFlag true and false', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(commentsService.getVendorsByRfq).toHaveBeenCalledWith({ id: 'pr-1' });
    expect(component.vendors.length).toBe(1);

    // Non-array vendors
    commentsService.getVendorsByRfq.and.returnValue(of(null));
    component.getVendorsList();
    expect(component.vendors).toEqual([]);
  });

  it('should handle all rootPath types in getComments', () => {
    component.ngOnInit();
    const rootPaths = [
      'RFQ-COMMENTS-MODAL',
      'CAT-RFQ-COMMENTS-MODAL',
      'PR-COMMENTS-MODAL',
      'QUOTES-COMMENTS-MODAL',
      'PPO-COMMENTS-MODAL',
      'PR-INTERNAL-COMMENTS-MODAL',
      'PO-COMMENTS-MODAL',
      'DELIVERY-COMMENTS-MODAL',
      'ASN-COMMENTS-MODAL',
      'UNKNOWN'
    ];

    rootPaths.forEach((path) => {
      component.getComments({ ...mockDialogData, commentRootPath: path });
    });

    // Error handling in getRFQComments & getCatRFQComments
    commentsService.getRFQCommentsByRFQandVendor.and.returnValue(throwError('err'));
    component.getRFQComments();
    expect(component.commentsList).toEqual([]);

    commentsService.getRFQComments.and.returnValue(throwError('err'));
    component.getCatRFQComments();
    expect(component.commentsList).toEqual([]);
  });

  it('should handle saveComment with validations and across all rootPath modes', () => {
    component.ngOnInit();

    // Empty commentText
    component.commentText = '';
    component.saveComment();
    expect(toastr.error).toHaveBeenCalledWith('Please type your comments', 'Warning');

    // Invalid file extension
    component.commentText = 'Valid comment';
    component.commentFileData = 'QUJD';
    component.commentFileType = 'invalid.exe';
    component.saveComment();
    expect(toastr.error).toHaveBeenCalledWith('File  should be either Excel Sheet(.xls / .xlsx) / Word Document(.doc / .docx) / Image(Jpg/Jpeg/Png), text(.txt/.pdf) document', 'Warning');

    // Valid file extension and all rootPath modes
    const rootPaths = [
      'RFQ-COMMENTS-MODAL',
      'CAT-RFQ-COMMENTS-MODAL',
      'QUOTES-COMMENTS-MODAL',
      'PR-COMMENTS-MODAL',
      'PR-INTERNAL-COMMENTS-MODAL',
      'PPO-COMMENTS-MODAL',
      'PO-COMMENTS-MODAL',
      'DELIVERY-COMMENTS-MODAL',
      'ASN-COMMENTS-MODAL',
      'UNKNOWN'
    ];

    rootPaths.forEach((path) => {
      component.commentText = 'Valid comment';
      component.commentFileData = 'QUJD';
      component.commentFileType = 'doc.pdf';
      component.data.commentRootPath = path;
      component.saveComment();
    });

    expect(commentsService.saveRFQComments).toHaveBeenCalled();
    expect(commentsService.saveQuoteComments).toHaveBeenCalled();
    expect(commentsService.savePRComments).toHaveBeenCalled();
    expect(commentsService.savePrClientComment).toHaveBeenCalled();
    expect(commentsService.savePPOComments).toHaveBeenCalled();
    expect(commentsService.savePOComments).toHaveBeenCalled();
    expect(commentsService.saveDeliveryComments).toHaveBeenCalled();
    expect(commentsService.saveASNComments).toHaveBeenCalled();
  });

  it('should handle drag and drop and file upload events', fakeAsync(() => {
    const file = new File(['data'], 'test.pdf', { type: 'application/pdf' });
    const event = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation'),
      dataTransfer: { files: [file] }
    };

    component.onDragOver(event);
    expect(component.dragAreaClass).toBe('droparea');

    component.onDragEnter(event);
    component.onDragEnd(event);
    expect(component.dragAreaClass).toBe('dragarea');

    component.onDragLeave(event);
    component.onDrop(event);
    tick();
    expect(component.commentFilesDataList.length).toBe(1);

    component.filesDropped([file]);
    tick();
    expect(component.commentFilesDataList.length).toBe(2);

    component.removeFile();
    expect(component.commentFileData).toBeNull();

    component.ngOnChanges();
    flush();
  }));
});
