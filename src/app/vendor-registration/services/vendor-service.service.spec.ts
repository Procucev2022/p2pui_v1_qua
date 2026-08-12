import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VendorService } from './vendor-service.service';

describe('VendorService', () => {
  let service: VendorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VendorService]
    });
    service = TestBed.inject(VendorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getRfqData', () => {
    service.getRfqData().subscribe((res: any) => expect(res).toEqual({ ok: true }));
    const req = httpMock.expectOne('/assets/jsons/vendorDashboardRfqs.json');
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should getProductsData', () => {
    service.getProductsData().subscribe((res: any) => expect(res).toEqual([]));
    httpMock.expectOne('/assets/jsons/vendorProductsData.json').flush([]);
  });

  it('should getServicesData', () => {
    service.getServicesData().subscribe((res: any) => expect(res).toEqual([]));
    httpMock.expectOne('/assets/jsons/vendorServicesData.json').flush([]);
  });

  it('should getVendorContactsData', () => {
    service.getVendorContactsData().subscribe((res: any) => expect(res).toEqual([]));
    httpMock.expectOne('/assets/jsons/vendorContactsData.json').flush([]);
  });

  it('should getClientRefData', () => {
    service.getClientRefData().subscribe((res: any) => expect(res).toEqual([]));
    httpMock.expectOne('/assets/jsons/vendorClientRefData.json').flush([]);
  });

  it('should push general form data', () => {
    service.getGeneralForm('Co', 'PAN', 'GST', 'Addr');
    expect(service.GeneralformData.length).toBe(1);
    expect(service.GeneralformData[0].companyName).toBe('Co');
  });

  it('should push branch form data', () => {
    service.getBranchesForm('B1', 'BA');
    expect(service.BranchformData.length).toBe(1);
    expect(service.BranchformData[0].branchName).toBe('B1');
  });
});
