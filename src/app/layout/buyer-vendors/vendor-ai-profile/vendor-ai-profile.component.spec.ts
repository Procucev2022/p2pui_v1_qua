import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
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
  let router: Router;

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

  function createComponent(routeParams = { code: 'VND-001' }, queryParams: any = { tab: 'credentials' }) {
    aiServiceSpy = jasmine.createSpyObj('AiVendorProcessingService', ['getVendorByCode']);
    vendorServiceSpy = jasmine.createSpyObj('BuyerVendorService', ['getVendorById', 'updateVendorStatus']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning', 'info']);

    aiServiceSpy.getVendorByCode.and.returnValue(of(mockVendor));

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [VendorAiProfileComponent],
      providers: [
        { provide: AiVendorProcessingService, useValue: aiServiceSpy },
        { provide: BuyerVendorService, useValue: vendorServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap(routeParams)),
            queryParamMap: of(convertToParamMap(queryParams)),
            snapshot: { paramMap: convertToParamMap(routeParams) }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorAiProfileComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  }

  describe('Standard initialization', () => {
    beforeEach(() => createComponent());

    it('should create and load vendor profile', () => {
      expect(component).toBeTruthy();
      expect(aiServiceSpy.getVendorByCode).toHaveBeenCalledWith('VND-001');
      expect(component.vendor).toEqual(mockVendor);
      expect(component.isPreferredVendor).toBe(true);
      expect(component.kycStatus).toBe('VERIFIED');
      expect(component.activeTab).toBe('credentials');
    });

    it('should handle load vendor profile error', () => {
      aiServiceSpy.getVendorByCode.and.returnValue(throwError(() => new Error('fail')));
      component.loadVendorProfile();
      expect(component.loading).toBe(false);
    });

    it('should build 6 lifecycle stages properly', () => {
      expect(component.lifecycleStages.length).toBe(6);
      expect(component.lifecycleStages[0].name).toBe('Imported');
      expect(component.lifecycleStages[5].name).toBe('Active');
    });

    it('should calculate risk assessment based on real data', () => {
      expect(component.riskAssessment.overallRisk).toBe('Low');
      expect(component.riskAssessment.complianceRisk).toBe('Low');
      expect(component.riskAssessment.financialRisk).toBe('Low');
      expect(component.riskAssessment.performanceRisk).toBe('Review Required');
    });

    it('should switch tabs and navigate with query params', () => {
      spyOn(router, 'navigate');
      component.selectTab('compliance');
      expect(component.activeTab).toBe('compliance');
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should test isPreferredVendor when vendor is null or score is low', () => {
      component.vendor = undefined;
      expect(component.isPreferredVendor).toBe(false);

      component.vendor = { ...mockVendor, aiScore: 60 };
      expect(component.isPreferredVendor).toBe(false);
    });

    it('should test kycStatus branches', () => {
      component.vendor = undefined;
      expect(component.kycStatus).toBe('PENDING');

      component.vendor = {
        ...mockVendor,
        credentials: { ...mockVendor.credentials, gstin: { verified: true }, pan: { verified: false } }
      };
      expect(component.kycStatus).toBe('PARTIAL');

      component.vendor = {
        ...mockVendor,
        credentials: { ...mockVendor.credentials, gstin: { verified: false }, pan: { verified: true } }
      };
      expect(component.kycStatus).toBe('PARTIAL');

      component.vendor = {
        ...mockVendor,
        credentials: { ...mockVendor.credentials, gstin: { verified: false }, pan: { verified: false } }
      };
      expect(component.kycStatus).toBe('PENDING');

      component.vendor = {
        ...mockVendor,
        credentials: undefined as any
      };
      expect(component.kycStatus).toBe('PENDING');
    });

    it('should test lifecycleCurrentStatus branches', () => {
      component.vendor = undefined;
      expect(component.lifecycleCurrentStatus).toBe('Imported');

      component.vendor = { ...mockVendor, status: 'Active' };
      expect(component.lifecycleCurrentStatus).toBe('Active');

      component.vendor = { ...mockVendor, status: 'Inactive', qualification: 'Qualified' };
      expect(component.lifecycleCurrentStatus).toBe('Qualified');

      component.vendor = {
        ...mockVendor,
        status: 'Inactive',
        qualification: 'Pending',
        credentials: { ...mockVendor.credentials, gstin: { verified: true }, pan: { verified: true } }
      };
      expect(component.lifecycleCurrentStatus).toBe('Credentials Verified');

      component.vendor = {
        ...mockVendor,
        status: 'Inactive',
        qualification: 'Pending',
        credentials: { ...mockVendor.credentials, gstin: { verified: false }, pan: { verified: false } }
      };
      expect(component.lifecycleCurrentStatus).toBe('AI Processed');
    });

    it('should test buildLifecycleStages when vendor is undefined or has varied qualification/score', () => {
      component.vendor = undefined;
      component['buildLifecycleStages']();
      expect(component.lifecycleStages.length).toBe(6);

      // Partial credentials and high score
      component.vendor = {
        ...mockVendor,
        qualification: 'Pending',
        aiScore: 75,
        credentials: { ...mockVendor.credentials, gstin: { verified: true }, pan: { verified: false } }
      };
      component['buildLifecycleStages']();
      expect(component.lifecycleStages[2].status).toBe('current');
      expect(component.lifecycleStages[3].status).toBe('current');
      expect(component.lifecycleStages[5].status).toBe('completed');

      // No credentials and low score
      component.vendor = {
        ...mockVendor,
        qualification: 'Pending',
        aiScore: 50,
        credentials: { ...mockVendor.credentials, gstin: { verified: false }, pan: { verified: false } }
      };
      component['buildLifecycleStages']();
      expect(component.lifecycleStages[2].status).toBe('pending');
      expect(component.lifecycleStages[3].status).toBe('pending');
    });

    it('should test buildRiskAssessment when vendor is undefined or has varied risk profiles', () => {
      component.vendor = undefined;
      component['buildRiskAssessment']();
      expect(component.riskAssessment.overallRisk).toBe('Low');

      component.vendor = {
        ...mockVendor,
        credentials: { ...mockVendor.credentials, gstin: { verified: false }, pan: { verified: true } },
        complianceStatus: 'Pending Review',
        aiScore: 65
      };
      component['buildRiskAssessment']();
      expect(component.riskAssessment.overallRisk).toBe('Review Required');
      expect(component.riskAssessment.complianceRisk).toBe('Review Required');
      expect(component.riskAssessment.financialRisk).toBe('Review Required');
      expect(component.riskAssessment.documentRisk).toBe('Medium');

      // Fully compliant, verified, but score < 75
      component.vendor = {
        ...mockVendor,
        credentials: { ...mockVendor.credentials, gstin: { verified: true }, pan: { verified: true } },
        complianceStatus: 'Fully Compliant',
        aiScore: 72
      };
      component['buildRiskAssessment']();
      expect(component.riskAssessment.overallRisk).toBe('Medium');
      expect(component.riskAssessment.complianceRisk).toBe('Low');
      expect(component.riskAssessment.financialRisk).toBe('Review Required');
      expect(component.riskAssessment.documentRisk).toBe('Low');
    });

    it('should open and close upload modal with and without explicit docType', () => {
      component.openUploadDocModal();
      expect(component.uploadModalOpen).toBe(true);
      expect(component.selectedDocForUpload).toBe('General');

      component.openUploadDocModal('Tax Document');
      expect(component.selectedDocForUpload).toBe('Tax Document');

      component.closeUploadDocModal();
      expect(component.uploadModalOpen).toBe(false);
    });

    it('should verify document and handle already verified document', () => {
      const testDoc = {
        id: 'doc-1',
        name: 'GST Certificate',
        documentType: 'Tax Document',
        uploadDate: '2026-08-20',
        verificationStatus: 'Pending' as const
      };
      component.triggerDocVerification(testDoc);
      expect(testDoc.verificationStatus).toBe('Verified');
      expect(toastrSpy.success).toHaveBeenCalled();

      component.triggerDocVerification(testDoc);
      expect(toastrSpy.info).toHaveBeenCalled();
    });

    it('should download document', () => {
      const testDoc = {
        id: 'doc-1',
        name: 'GST Certificate',
        documentType: 'Tax Document',
        uploadDate: '2026-08-20',
        verificationStatus: 'Verified' as const
      };
      component.downloadDoc(testDoc);
      expect(toastrSpy.info).toHaveBeenCalled();
    });

    it('should navigate to edit vendor details when vendor exists and not when vendor is undefined', () => {
      spyOn(router, 'navigate');
      component.editVendorDetails();
      expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors', 'VND-001', 'edit']);

      component.vendor = undefined;
      component.editVendorDetails();
      expect(router.navigate).toHaveBeenCalledTimes(1);
    });

    it('should navigate goBack and goToDirectory', () => {
      spyOn(router, 'navigate');
      component.goBack();
      expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors/ai-analysis']);

      component.goToDirectory();
      expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors']);
    });

    it('should return score color classes correctly', () => {
      expect(component.getScoreColorClass(90)).toBe('score-high');
      expect(component.getScoreColorClass(75)).toBe('score-mid');
      expect(component.getScoreColorClass(50)).toBe('score-low');
    });
  });

  describe('Route params with empty code and invalid tab', () => {
    beforeEach(() => createComponent({ code: '' }, { tab: 'non-existent-tab' }));

    it('should handle empty code param and invalid tab fallback', () => {
      expect(component.vendorCode).toBe('');
      expect(component.activeTab).toBe('overview');
    });
  });
});
