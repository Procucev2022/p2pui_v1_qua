import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { VendorAiProfileComponent } from './vendor-ai-profile.component';
import { AiVendorProcessingService } from '../services/ai-vendor-processing.service';
import { BuyerVendorService } from '../services/buyer-vendor.service';
import { AiVendorAnalysisItem } from '../models/ai-vendor-analysis.model';

describe('VendorAiProfileComponent', () => {
  let component: VendorAiProfileComponent;
  let fixture: ComponentFixture<VendorAiProfileComponent>;
  let aiServiceSpy: jasmine.SpyObj<AiVendorProcessingService>;
  let vendorServiceSpy: jasmine.SpyObj<BuyerVendorService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  const mockVendor: AiVendorAnalysisItem = {
    vendorCode: 'VND-001',
    vendorName: 'Tata Steel Trading Co',
    searchTerm: 'Tata Steel',
    industry: 'Steel & Metals',
    category: 'Metals & Alloys',
    subCategories: ['Structural Steel', 'Plates'],
    capabilities: ['Bulk Supply', 'ISO Certified'],
    credentials: {
      gstin: { verified: true, value: '27AAACT2727Q1ZW', verifiedDate: '2026-08-20', source: 'Provided in Import' },
      pan: { verified: true, value: 'AAACT2727Q', verifiedDate: '2026-08-20', source: 'Provided in Import' },
      companyInfo: { verified: true, value: 'Mumbai, Maharashtra', source: 'Master Data' },
      contactInfo: { verified: true, value: '+91-9820112345', source: 'Primary Phone' }
    },
    qualification: 'Qualified',
    aiScore: 92,
    scoreBreakdown: {
      financialStability: 92,
      operationalScope: 90,
      compliance: 95,
      supplyReliability: 90
    },
    suitableProcurementCategories: ['Direct Steel Sourcing', 'Structural Works'],
    contactInfo: {
      phone1: '9820112345',
      phone2: '02266658282',
      email: 'vnd001@vendor-hub.com',
      addressLine: 'Bombay House, 24 Homi Mody Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India'
    },
    typeOfBusiness: 'Manufacturer & Distributor',
    vendorGroup: 'Strategic Supplier',
    sourcingScope: 'Client Only',
    verificationStatus: '100% Provided',
    complianceStatus: 'Compliant',
    processedAt: '2026-08-20T10:00:00Z',
    status: 'Active'
  };

  beforeEach(async () => {
    aiServiceSpy = jasmine.createSpyObj('AiVendorProcessingService', ['getVendorByCode']);
    vendorServiceSpy = jasmine.createSpyObj('BuyerVendorService', ['getVendorById', 'updateVendorStatus']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning', 'info']);

    aiServiceSpy.getVendorByCode.and.returnValue(of(mockVendor));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [VendorAiProfileComponent],
      providers: [
        { provide: AiVendorProcessingService, useValue: aiServiceSpy },
        { provide: BuyerVendorService, useValue: vendorServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ code: 'VND-001' })),
            queryParamMap: of(convertToParamMap({ tab: 'overview' })),
            snapshot: { paramMap: convertToParamMap({ code: 'VND-001' }) }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorAiProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load vendor profile', () => {
    expect(component).toBeTruthy();
    expect(aiServiceSpy.getVendorByCode).toHaveBeenCalledWith('VND-001');
    expect(component.vendor).toEqual(mockVendor);
    expect(component.isPreferredVendor).toBe(true);
    expect(component.kycStatus).toBe('VERIFIED');
  });

  it('should build 6 lifecycle stages properly', () => {
    expect(component.lifecycleStages.length).toBe(6);
    expect(component.lifecycleStages[0].name).toBe('Imported');
    expect(component.lifecycleStages[5].name).toBe('Active');
  });

  it('should initialize empty document repository when no files uploaded', () => {
    expect(component.documents.length).toBe(0);
  });

  it('should calculate risk assessment based on real data', () => {
    expect(component.riskAssessment.overallRisk).toBe('Low');
    expect(component.riskAssessment.complianceRisk).toBe('Low');
    expect(component.riskAssessment.performanceRisk).toBe('Review Required');
  });

  it('should switch tabs', () => {
    component.selectTab('documents');
    expect(component.activeTab).toBe('documents');
  });

  it('should verify document and show toast', () => {
    const testDoc = {
      id: 'doc-1',
      name: 'GST Registration Certificate',
      documentType: 'Tax Document',
      documentNumber: '27AAACT2727Q1ZW',
      uploadDate: '2026-08-20',
      verificationStatus: 'Pending' as const,
      isBackendRequired: false
    };
    component.documents = [testDoc];
    component.triggerDocVerification(testDoc);
    expect(testDoc.verificationStatus).toBe('Verified');
    expect(toastrSpy.success).toHaveBeenCalled();
  });
});
