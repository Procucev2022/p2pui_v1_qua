import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExcelService } from './excel.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import * as fileSaver from 'file-saver';

describe('ExcelService', () => {
  let service: ExcelService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExcelService]
    });
    service = TestBed.inject(ExcelService);
    httpMock = TestBed.inject(HttpTestingController);
    spyOn(fileSaver, 'saveAs').and.stub();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should exportAsExcelFile and save', () => {
    spyOn(service, 'saveAsExcelFile').and.callThrough();
    service.exportAsExcelFile([{ a: 1 }], 'report');
    expect(service.saveAsExcelFile).toHaveBeenCalled();
    expect(fileSaver.saveAs).toHaveBeenCalled();
  });

  it('should call getPRAuditHistory', () => {
    service.getPRAuditHistory({ id: 1 }).subscribe((res: any) => expect(res).toEqual({ ok: true }));
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_APPROVAL_AUDIT_HISTORY);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getPPOAuditHistory', () => {
    service.getPPOAuditHistory({ id: 1 }).subscribe((res: any) => expect(res).toEqual({ ok: true }));
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PPO_APPROVAL_AUDIT_HISTORY);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
