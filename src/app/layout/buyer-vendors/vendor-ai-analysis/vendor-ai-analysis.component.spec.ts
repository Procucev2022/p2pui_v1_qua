import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { VendorAiAnalysisComponent } from './vendor-ai-analysis.component';
import { AiVendorProcessingService } from '../services/ai-vendor-processing.service';
import { AiVendorAnalysisItem } from '../models/ai-vendor-analysis.model';

describe('VendorAiAnalysisComponent', () => {
  let component: VendorAiAnalysisComponent;
  let fixture: ComponentFixture<VendorAiAnalysisComponent>;
  let aiServiceSpy: jasmine.SpyObj<AiVendorProcessingService>;
  let router: Router;

  const mockVendors: AiVendorAnalysisItem[] = [
    {
      vendorCode: 'VND-001',
      vendorName: 'Tata Steel',
      searchTerm: 'Tata',
      industry: 'Steel',
      category: 'Metals',
      subCategories: ['Structural Steel'],
      capabilities: ['Bulk Supply'],
      credentials: {
        gstin: { verified: true, value: '27AAACT2727Q1ZW' },
        pan: { verified: true, value: 'AAACT2727Q' },
        companyInfo: { verified: true },
        contactInfo: { verified: true }
      },
      qualification: 'Qualified',
      aiScore: 92,
      scoreBreakdown: {
        financialStability: 90,
        operationalScope: 90,
        compliance: 95,
        supplyReliability: 90
      },
      suitableProcurementCategories: ['Direct Steel Sourcing'],
      contactInfo: { phone1: '9820112345' },
      sourcingScope: 'Client Only',
      verificationStatus: '100% Provided',
      complianceStatus: 'Compliant'
    },
    {
      vendorCode: 'VND-002',
      vendorName: 'Reliance Chem',
      searchTerm: 'Reliance',
      industry: 'Chemicals',
      category: 'Petrochemicals',
      subCategories: ['Polymers'],
      capabilities: ['Manufacturing'],
      credentials: {
        gstin: { verified: false, value: '' },
        pan: { verified: true, value: 'AABCR1234F' },
        companyInfo: { verified: true },
        contactInfo: { verified: true }
      },
      qualification: 'Pending',
      aiScore: 78,
      scoreBreakdown: {
        financialStability: 75,
        operationalScope: 80,
        compliance: 80,
        supplyReliability: 75
      },
      suitableProcurementCategories: ['Chemicals Supply'],
      contactInfo: { phone1: '9820556789' },
      sourcingScope: 'Client Only',
      verificationStatus: 'Partial',
      complianceStatus: 'Pending Review'
    }
  ];

  beforeEach(async () => {
    aiServiceSpy = jasmine.createSpyObj('AiVendorProcessingService', ['getVendors']);
    aiServiceSpy.getVendors.and.returnValue(of(mockVendors));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      declarations: [VendorAiAnalysisComponent],
      providers: [
        { provide: AiVendorProcessingService, useValue: aiServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorAiAnalysisComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create and load data on init', () => {
    expect(component).toBeTruthy();
    expect(aiServiceSpy.getVendors).toHaveBeenCalled();
    expect(component.vendors.length).toBe(2);
    expect(component.totalCount).toBe(2);
    expect(component.qualifiedCount).toBe(1);
    expect(component.avgAiScore).toBe(85);
    expect(component.verifiedCredentialsCount).toBe(1);
    expect(component.availableIndustries).toEqual(['Steel', 'Chemicals']);
    expect(component.availableCategories).toEqual(['Metals', 'Petrochemicals']);
  });

  it('should handle empty vendor list in computeMetrics', () => {
    aiServiceSpy.getVendors.and.returnValue(of([]));
    component.loadData();
    expect(component.vendors.length).toBe(0);
    expect(component.totalCount).toBe(0);
    expect(component.avgAiScore).toBe(0);
  });

  it('should handle error when loading data', () => {
    aiServiceSpy.getVendors.and.returnValue(throwError(() => new Error('fail')));
    component.loadData();
    expect(component.loading).toBe(false);
  });

  it('should apply search text filter', () => {
    component.searchText = 'Reliance';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);
    expect(component.filteredVendors[0].vendorCode).toBe('VND-002');
  });

  it('should filter by industry, category, and qualification', () => {
    component.industryFilter = 'Steel';
    component.categoryFilter = 'Metals';
    component.qualificationFilter = 'Qualified';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);
    expect(component.filteredVendors[0].vendorCode).toBe('VND-001');

    component.qualificationFilter = 'Pending';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(0);
  });

  it('should navigate to AI profile view', () => {
    spyOn(router, 'navigate');
    component.viewAiProfile(mockVendors[0]);
    expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors/ai-profile', 'VND-001']);
  });

  it('should navigate back to vendor list directory', () => {
    spyOn(router, 'navigate');
    component.goBackToVendorList();
    expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors']);
  });

  it('should return appropriate score color class', () => {
    expect(component.getScoreColorClass(95)).toBe('score-high');
    expect(component.getScoreColorClass(80)).toBe('score-medium');
    expect(component.getScoreColorClass(60)).toBe('score-low');
  });
});
