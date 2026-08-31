import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AiVendorProcessingService } from './ai-vendor-processing.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { BuyerVendor } from '../models/buyer-vendor.model';

describe('AiVendorProcessingService', () => {
  let service: AiVendorProcessingService;
  let httpMock: HttpTestingController;
  const baseUrl = AppApiConfig.apiEndpoint + AppApiConfig.BUYER_VENDORS;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AiVendorProcessingService]
    });
    service = TestBed.inject(AiVendorProcessingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getVendors', () => {
    it('should fetch and map AI vendor profiles from API', () => {
      const mockProfiles = [
        {
          vendorCode: 'VND-001',
          vendorName: 'Tata Steel',
          industry: 'Steel',
          category: 'Metals',
          subCategoriesJson: '["Structural Steel"]',
          capabilitiesJson: '["Bulk Supply"]',
          suitableCategoriesJson: '["Direct Sourcing"]',
          gstin: '27AAACT2727Q1ZW',
          pan: 'AAACT2727Q',
          phone1: '9820112345',
          addressLine: 'Bombay House',
          typeOfBusiness: 'Manufacturer',
          city: 'Mumbai',
          aiScore: 92,
          financialStability: 90,
          operationalScope: 90,
          complianceScore: 95,
          supplyReliability: 92,
          createdTS: '2026-08-20T10:00:00Z'
        }
      ];

      service.getVendors().subscribe(items => {
        expect(items.length).toBe(1);
        expect(items[0].vendorCode).toBe('VND-001');
        expect(items[0].subCategories).toEqual(['Structural Steel']);
        expect(items[0].capabilities).toEqual(['Bulk Supply']);
        expect(items[0].suitableProcurementCategories).toEqual(['Direct Sourcing']);
        expect(items[0].credentials.gstin.verified).toBe(true);
      });

      const req = httpMock.expectOne(`${baseUrl}/ai-analysis`);
      expect(req.request.method).toBe('GET');
      req.flush({ statusCode: '200', data: { profiles: mockProfiles } });
    });

    it('should handle response without profiles array and return empty list', () => {
      service.getVendors().subscribe(items => {
        expect(items).toEqual([]);
      });

      const req = httpMock.expectOne(`${baseUrl}/ai-analysis`);
      req.flush({ statusCode: '200', data: null });
    });

    it('should propagate error on getVendors failure', (done) => {
      service.getVendors().subscribe({
        next: () => fail('expected error'),
        error: (err) => {
          expect(err).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/ai-analysis`);
      req.error(new ProgressEvent('Network error'));
    });
  });

  describe('getVendorByCode', () => {
    it('should fetch single vendor profile by code from backend', () => {
      const mockProfile = {
        vendorCode: 'VND-001',
        vendorName: 'Tata Steel',
        gstin: '27AAACT2727Q1ZW',
        pan: 'AAACT2727Q',
        aiScore: '90'
      };

      service.getVendorByCode('VND-001').subscribe(item => {
        expect(item).toBeTruthy();
        expect(item?.vendorCode).toBe('VND-001');
        expect(item?.aiScore).toBe(90);
      });

      const req = httpMock.expectOne(`${baseUrl}/ai-profile/VND-001`);
      expect(req.request.method).toBe('GET');
      req.flush({ statusCode: '200', data: { profile: mockProfile } });
    });

    it('should fallback to cached subject when API returns no profile', () => {
      // First populate cache via getVendors
      service.getVendors().subscribe();
      const req1 = httpMock.expectOne(`${baseUrl}/ai-analysis`);
      req1.flush({
        statusCode: '200',
        data: {
          profiles: [{ vendorCode: 'VND-002', vendorName: 'Cached Vendor' }]
        }
      });

      service.getVendorByCode('VND-002').subscribe(item => {
        expect(item).toBeTruthy();
        expect(item?.vendorCode).toBe('VND-002');
      });

      const req2 = httpMock.expectOne(`${baseUrl}/ai-profile/VND-002`);
      req2.flush({ statusCode: '200', data: null });
    });

    it('should catch error and return matching cached vendor if available', () => {
      service.getVendors().subscribe();
      const req1 = httpMock.expectOne(`${baseUrl}/ai-analysis`);
      req1.flush({
        statusCode: '200',
        data: {
          profiles: [{ vendorCode: 'VND-003', vendorName: 'Error Fallback Vendor' }]
        }
      });

      service.getVendorByCode('VND-003').subscribe(item => {
        expect(item).toBeTruthy();
        expect(item?.vendorCode).toBe('VND-003');
      });

      const req2 = httpMock.expectOne(`${baseUrl}/ai-profile/VND-003`);
      req2.error(new ProgressEvent('Network error'));
    });
  });

  describe('enrichImportedVendors', () => {
    it('should post imported vendors and return AI enriched items', () => {
      const imported: BuyerVendor[] = [
        { vendorCode: 'V001', vendorName: 'Vendor 1', phone1: '9876543210', country: 'IN', status: 'Active', sourcingScope: 'Client Only' }
      ];

      service.enrichImportedVendors(imported).subscribe(res => {
        expect(res.length).toBe(1);
        expect(res[0].vendorCode).toBe('V001');
      });

      const req = httpMock.expectOne(`${baseUrl}/ai-process`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(imported);
      req.flush({
        statusCode: '200',
        data: {
          profiles: [{ vendorCode: 'V001', vendorName: 'Vendor 1', aiScore: 85 }]
        }
      });
    });

    it('should return empty array when response has no profiles', () => {
      service.enrichImportedVendors([]).subscribe(res => {
        expect(res).toEqual([]);
      });

      const req = httpMock.expectOne(`${baseUrl}/ai-process`);
      req.flush({ statusCode: '200', data: null });
    });

    it('should propagate error on enrichImportedVendors failure', (done) => {
      service.enrichImportedVendors([]).subscribe({
        next: () => fail('expected error'),
        error: (err) => {
          expect(err).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/ai-process`);
      req.error(new ProgressEvent('Network error'));
    });
  });

  describe('mapBackendProfileToItem branches', () => {
    it('should handle JSON arrays directly', () => {
      const profile = {
        subCategoriesJson: ['Sub1', 'Sub2'],
        capabilitiesJson: ['Cap1'],
        suitableCategoriesJson: ['Cat1'],
        gstin: '',
        pan: '',
        phone1: '',
        addressLine: ''
      };
      const result = service.mapBackendProfileToItem(profile);
      expect(result.subCategories).toEqual(['Sub1', 'Sub2']);
      expect(result.capabilities).toEqual(['Cap1']);
      expect(result.suitableProcurementCategories).toEqual(['Cat1']);
      expect(result.credentials.gstin.verified).toBe(false);
      expect(result.credentials.pan.verified).toBe(false);
      expect(result.verificationStatus).toBe('Pending Verification');
      expect(result.complianceStatus).toBe('Pending Review');
    });

    it('should handle invalid JSON strings as fallback single-item array', () => {
      const profile = {
        subCategoriesJson: 'Plain String Sub',
        capabilitiesJson: 'Plain String Cap',
        suitableCategoriesJson: 'Plain String Cat',
        gstin: '27AAACT2727Q1ZW',
        pan: '',
        phone1: '9820112345',
        addressLine: 'Some street',
        typeOfBusiness: '',
        city: 'Pune',
        regionCode: 'MH',
        aiScore: 0
      };
      const result = service.mapBackendProfileToItem(profile);
      expect(result.subCategories).toEqual(['Plain String Sub']);
      expect(result.capabilities).toEqual(['Plain String Cap']);
      expect(result.suitableProcurementCategories).toEqual(['Plain String Cat']);
      expect(result.credentials.gstin.verified).toBe(true);
      expect(result.credentials.pan.verified).toBe(false);
      expect(result.credentials.companyInfo.value).toBe('Address Provided');
      expect(result.contactInfo.state).toBe('MH');
      expect(result.verificationStatus).toBe('Partial Information');
    });

    it('should handle typeOfBusiness without city and verified GSTIN & PAN', () => {
      const profile = {
        typeOfBusiness: 'Manufacturer',
        gstin: '27AAACT2727Q1ZW',
        pan: 'AAACT2727Q',
        city: '',
        addressLine: 'Address line 1',
        verificationStatus: 'Custom Verified',
        complianceStatus: 'Custom Compliant'
      };
      const result = service.mapBackendProfileToItem(profile);
      expect(result.credentials.companyInfo.value).toBe('Manufacturer');
      expect(result.verificationStatus).toBe('Custom Verified');
      expect(result.complianceStatus).toBe('Custom Compliant');
    });
  });
});
