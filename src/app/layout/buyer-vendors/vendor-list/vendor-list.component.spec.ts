import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VendorListComponent } from './vendor-list.component';
import { BuyerVendorService } from '../services/buyer-vendor.service';
import { AiVendorProcessingService } from '../services/ai-vendor-processing.service';
import { AiVendorAnalysisItem } from '../models/ai-vendor-analysis.model';

describe('VendorListComponent', () => {
  let component: VendorListComponent;
  let fixture: ComponentFixture<VendorListComponent>;
  let vendorServiceSpy: jasmine.SpyObj<BuyerVendorService>;
  let aiServiceSpy: jasmine.SpyObj<AiVendorProcessingService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let router: Router;

  const mockVendors: AiVendorAnalysisItem[] = [
    {
      vendorCode: 'VND-001',
      vendorName: 'Tata Steel Trading Co',
      searchTerm: 'Tata Steel',
      industry: 'Steel & Metals',
      category: 'Metals & Alloys',
      subCategories: ['Structural Steel', 'Plates'],
      capabilities: ['Bulk Supply', 'ISO Certified'],
      credentials: {
        gstin: { verified: true, value: '27AAACT2727Q1ZW' },
        pan: { verified: true, value: 'AAACT2727Q' },
        companyInfo: { verified: true },
        contactInfo: { verified: true }
      },
      qualification: 'Qualified',
      aiScore: 92,
      scoreBreakdown: {
        financialStability: 92,
        operationalScope: 90,
        compliance: 95,
        supplyReliability: 90
      },
      suitableProcurementCategories: ['Direct Steel Sourcing'],
      contactInfo: {
        phone1: '9820112345',
        email: 'vnd001@vendor-hub.com',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India'
      },
      sourcingScope: 'Client Only',
      verificationStatus: '100% Provided',
      complianceStatus: 'Compliant'
    },
    {
      vendorCode: 'VND-002',
      vendorName: 'Reliance Petrochem Ltd',
      searchTerm: 'Reliance',
      industry: 'Chemicals',
      category: 'Petrochemicals',
      subCategories: ['Polymers', 'Solvents'],
      capabilities: ['Direct Manufacturing'],
      credentials: {
        gstin: { verified: false, value: 'Not Provided' },
        pan: { verified: true, value: 'AABCR1234F' },
        companyInfo: { verified: true },
        contactInfo: { verified: true }
      },
      qualification: 'Pending',
      aiScore: 78,
      scoreBreakdown: {
        financialStability: 75,
        operationalScope: 80,
        compliance: 85,
        supplyReliability: 76
      },
      suitableProcurementCategories: ['Chemicals Annual Supply'],
      contactInfo: {
        phone1: '9820556789',
        email: 'vnd002@vendor-hub.com',
        city: 'Jamnagar',
        state: 'Gujarat',
        country: 'India'
      },
      sourcingScope: 'Client + Procucev',
      verificationStatus: 'Partial Information',
      complianceStatus: 'Pending Review'
    }
  ];

  beforeEach(async () => {
    vendorServiceSpy = jasmine.createSpyObj('BuyerVendorService', ['getVendors', 'updateVendorStatus', 'bulkCreateVendors']);
    aiServiceSpy = jasmine.createSpyObj('AiVendorProcessingService', ['getVendors', 'enrichImportedVendors']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning', 'info']);

    aiServiceSpy.getVendors.and.returnValue(of(mockVendors));
    vendorServiceSpy.updateVendorStatus.and.returnValue(of({ statusCode: '200' }));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      declarations: [VendorListComponent],
      providers: [
        { provide: BuyerVendorService, useValue: vendorServiceSpy },
        { provide: AiVendorProcessingService, useValue: aiServiceSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load enriched vendors and compute accurate KPIs on init', () => {
    expect(aiServiceSpy.getVendors).toHaveBeenCalled();
    expect(component.enrichedVendors.length).toBe(2);
    expect(component.totalCount).toBe(2);
    expect(component.qualifiedCount).toBe(1);
    expect(component.kycVerifiedCount).toBe(1);
    expect(component.complianceIssuesCount).toBe(1);
    expect(component.aiRecommendedCount).toBe(1);
    expect(component.pendingVerificationCount).toBe(1);
    expect(component.avgAiScore).toBe(85);
  });

  it('should apply text search filter', () => {
    component.searchText = 'Reliance';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);
    expect(component.filteredVendors[0].vendorCode).toBe('VND-002');
  });

  it('should apply industry and qualification filter', () => {
    component.industryFilter = 'Steel & Metals';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);
    expect(component.filteredVendors[0].vendorCode).toBe('VND-001');
  });

  it('should apply AI score preferred filter', () => {
    component.scoreFilter = 'preferred';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);
    expect(component.filteredVendors[0].aiScore).toBeGreaterThan(80);
  });

  it('should reset filters properly', () => {
    component.searchText = 'abc';
    component.industryFilter = 'Chemicals';
    component.resetFilters();
    expect(component.searchText).toBe('');
    expect(component.industryFilter).toBe('');
    expect(component.filteredVendors.length).toBe(2);
  });

  it('should navigate to add vendor', () => {
    spyOn(router, 'navigate');
    component.addVendor();
    expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors/new']);
  });

  it('should navigate to edit vendor', () => {
    spyOn(router, 'navigate');
    component.editVendor(mockVendors[0]);
    expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors', 'VND-001', 'edit']);
  });

  it('should navigate to AI profile with tabs', () => {
    spyOn(router, 'navigate');
    component.viewAiProfile(mockVendors[0]);
    expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors/ai-profile', 'VND-001']);

    component.viewDocuments(mockVendors[0]);
    expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors/ai-profile', 'VND-001'], { queryParams: { tab: 'documents' } });

    component.viewPerformance(mockVendors[0]);
    expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors/ai-profile', 'VND-001'], { queryParams: { tab: 'performance' } });
  });

  it('should calculate preferred vendor status correctly', () => {
    expect(component.isPreferredVendor(mockVendors[0])).toBe(true);
    expect(component.isPreferredVendor(mockVendors[1])).toBe(false);
  });

  it('should calculate KYC status text', () => {
    expect(component.getKycStatusText(mockVendors[0])).toBe('VERIFIED');
    expect(component.getKycStatusText(mockVendors[1])).toBe('PARTIAL');
  });

  it('should export vendors to excel', () => {
    expect(() => component.exportVendorsToExcel()).not.toThrow();
    expect(toastrSpy.success).toHaveBeenCalled();
  });
});

