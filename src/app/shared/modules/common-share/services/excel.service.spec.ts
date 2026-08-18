import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExcelService } from './excel.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import * as XLSX from 'xlsx';
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
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('exportAsExcelFile should generate and save a file', () => {
    spyOn(fileSaver, 'saveAs').and.stub();
    const data = [{ name: 'Item1', value: 10 }];
    service.exportAsExcelFile(data, 'test-file');
    expect(fileSaver.saveAs).toHaveBeenCalled();
  });

  it('saveAsExcelFile should call saveAs', () => {
    spyOn(fileSaver, 'saveAs').and.stub();
    const buffer = new ArrayBuffer(8);
    service.saveAsExcelFile(buffer, 'report');
    expect(fileSaver.saveAs).toHaveBeenCalled();
  });

  it('getPRAuditHistory should POST', () => {
    service.getPRAuditHistory({ id: 1 }).subscribe(r => expect(r).toBeTruthy());
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PR_APPROVAL_AUDIT_HISTORY);
    expect(req.request.method).toBe('POST');
    req.flush({ data: [] });
  });

  it('getPPOAuditHistory should POST', () => {
    service.getPPOAuditHistory({ id: 1 }).subscribe(r => expect(r).toBeTruthy());
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PPO_APPROVAL_AUDIT_HISTORY);
    expect(req.request.method).toBe('POST');
    req.flush({ data: [] });
  });
});
