import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BuyerVendorService } from './buyer-vendor.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

describe('BuyerVendorService', () => {
  let service: BuyerVendorService;
  let httpMock: HttpTestingController;
  const baseUrl = AppApiConfig.apiEndpoint + AppApiConfig.BUYER_VENDORS;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BuyerVendorService]
    });
    service = TestBed.inject(BuyerVendorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get vendors with pagination only', () => {
    service.getVendors(0, 10).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(r => r.url === baseUrl && r.params.get('page') === '0' && r.params.get('size') === '10');
    expect(req.request.method).toBe('GET');
    req.flush({ statusCode: '200', data: { vendors: [], totalRecords: 0, totalPages: 0, currentPage: 0 } });
  });

  it('should get vendors with all filters', () => {
    service.getVendors(1, 5, 'test', 'Active', 'MRO').subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(r =>
      r.url === baseUrl &&
      r.params.get('search') === 'test' &&
      r.params.get('status') === 'Active' &&
      r.params.get('industry') === 'MRO'
    );
    expect(req.request.method).toBe('GET');
    req.flush({ statusCode: '200', data: { vendors: [], totalRecords: 0, totalPages: 0, currentPage: 1 } });
  });

  it('should get vendors without optional filters when they are empty', () => {
    service.getVendors(0, 10, '', '', '').subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(r => r.url === baseUrl);
    expect(req.request.params.has('search')).toBe(false);
    expect(req.request.params.has('status')).toBe(false);
    expect(req.request.params.has('industry')).toBe(false);
    req.flush({ statusCode: '200', data: { vendors: [], totalRecords: 0, totalPages: 0, currentPage: 0 } });
  });

  it('should get vendor by id', () => {
    service.getVendorById('abc123').subscribe(res => {
      expect(res.data.vendor.vendorName).toBe('Test Vendor');
    });

    const req = httpMock.expectOne(`${baseUrl}/abc123`);
    expect(req.request.method).toBe('GET');
    req.flush({ statusCode: '200', data: { vendor: { vendorName: 'Test Vendor' } } });
  });

  it('should create vendor', () => {
    const vendor: any = { vendorCode: 'V001', vendorName: 'New Vendor', phone1: '1234567890', status: 'Active', sourcingScope: 'Client Only', country: 'IN' };
    service.createVendor(vendor).subscribe(res => {
      expect(res.data.vendor.vendorCode).toBe('V001');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(vendor);
    req.flush({ statusCode: '200', data: { vendor: { vendorCode: 'V001' } } });
  });

  it('should update vendor', () => {
    const vendor: any = { vendorCode: 'V001', vendorName: 'Updated Vendor', phone1: '1234567890', status: 'Active', sourcingScope: 'Client Only', country: 'IN' };
    service.updateVendor('abc123', vendor).subscribe(res => {
      expect(res.data.vendor.vendorName).toBe('Updated Vendor');
    });

    const req = httpMock.expectOne(`${baseUrl}/abc123`);
    expect(req.request.method).toBe('PUT');
    req.flush({ statusCode: '200', data: { vendor: { vendorName: 'Updated Vendor' } } });
  });

  it('should update vendor status', () => {
    service.updateVendorStatus('abc123', 'Inactive').subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/abc123/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'Inactive' });
    req.flush({ statusCode: '200', message: 'Status updated' });
  });

  it('should delete vendor', () => {
    service.deleteVendor('VND-001').subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/VND-001`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ statusCode: '200', message: 'Vendor deleted successfully' });
  });
});

