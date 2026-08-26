import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
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
      id: 'v-1',
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
      vendorGroup: 'Strategic',
      sourcingScope: 'Client Only',
      verificationStatus: '100% Provided',
      complianceStatus: 'Compliant',
      status: 'Active'
    },
    {
      id: 'v-2',
      vendorCode: 'VND-002',
      vendorName: 'Reliance Petrochem Ltd',
      searchTerm: 'Reliance',
      industry: 'Chemicals',
      category: 'Petrochemicals',
      subCategories: ['Polymers', 'Solvents'],
      capabilities: ['Direct Manufacturing'],
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
      vendorGroup: 'Standard',
      sourcingScope: 'Client + Procucev',
      verificationStatus: 'Partial Information',
      complianceStatus: 'Pending Review',
      status: 'Inactive'
    }
  ];

  beforeEach(async () => {
    vendorServiceSpy = jasmine.createSpyObj('BuyerVendorService', ['getVendors', 'updateVendorStatus', 'bulkCreateVendors', 'deleteVendor', 'bulkDeleteVendors']);
    aiServiceSpy = jasmine.createSpyObj('AiVendorProcessingService', ['getVendors', 'enrichImportedVendors']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning', 'info']);

    aiServiceSpy.getVendors.and.returnValue(of(mockVendors));
    aiServiceSpy.enrichImportedVendors.and.returnValue(of(mockVendors));
    vendorServiceSpy.updateVendorStatus.and.returnValue(of({ statusCode: '200' }));
    vendorServiceSpy.deleteVendor.and.returnValue(of({ statusCode: '200' }));
    vendorServiceSpy.bulkDeleteVendors.and.returnValue(of({ statusCode: '200', data: { deletedCount: 2 } }));
    vendorServiceSpy.bulkCreateVendors.and.returnValue(of({ statusCode: '200', data: { savedCount: 2 } }));

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

  it('should create and load vendors on init', () => {
    expect(component).toBeTruthy();
    expect(aiServiceSpy.getVendors).toHaveBeenCalled();
    expect(component.enrichedVendors.length).toBe(2);
    expect(component.totalCount).toBe(2);
    expect(component.avgAiScore).toBe(85);
  });

  it('should compute KPI metrics when vendor list is empty', () => {
    aiServiceSpy.getVendors.and.returnValue(of([]));
    component.loadEnrichedVendors();
    expect(component.totalCount).toBe(0);
    expect(component.avgAiScore).toBe(0);
  });

  it('should refresh directory on demand', () => {
    component.refreshDirectory();
    expect(toastrSpy.success).toHaveBeenCalled();
  });

  it('should handle refresh error', () => {
    aiServiceSpy.getVendors.and.returnValue(throwError(() => new Error('Refresh failed')));
    component.loadEnrichedVendors(true);
    expect(toastrSpy.error).toHaveBeenCalled();
    expect(component.loading).toBe(false);
  });

  it('should test filter permutations', () => {
    // Search text by name
    component.searchText = 'Tata Steel';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);

    // Search text by code
    component.searchText = 'VND-002';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);

    // Search text by search term alias
    component.searchText = 'Reliance';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);

    // Search text by category
    component.searchText = 'Metals & Alloys';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);

    // Search text by industry
    component.searchText = 'Chemicals';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);

    // Search text by email
    component.searchText = 'vnd001@vendor-hub.com';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);

    // Search text by capabilities
    component.searchText = 'ISO Certified';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);

    // Search text by pan
    component.searchText = 'AAACT2727Q';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);

    // Search text by gstin
    component.searchText = '27AAACT2727Q1ZW';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);

    // Filter by industry, category, qualification
    component.searchText = '';
    component.industryFilter = 'Steel & Metals';
    component.categoryFilter = 'Metals & Alloys';
    component.qualificationFilter = 'Qualified';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);

    // Filter by sourcing scope and vendor group
    component.industryFilter = '';
    component.categoryFilter = '';
    component.qualificationFilter = '';
    component.sourcingScopeFilter = 'Client Only';
    component.vendorGroupFilter = 'Strategic';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);

    // Score filter preferred / high / standard
    component.sourcingScopeFilter = '';
    component.vendorGroupFilter = '';
    component.scoreFilter = 'preferred';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);

    component.scoreFilter = 'high';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);

    component.scoreFilter = 'standard';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);

    // Verification filter verified / pending
    component.scoreFilter = '';
    component.verificationFilter = 'verified';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);

    component.verificationFilter = 'pending';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);

    // Compliance filter compliant / review
    component.verificationFilter = '';
    component.complianceFilter = 'compliant';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);

    component.complianceFilter = 'review';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);
  });

  it('should reset filters properly', () => {
    component.searchText = 'search';
    component.scoreFilter = 'high';
    component.resetFilters();
    expect(component.searchText).toBe('');
    expect(component.scoreFilter).toBe('');
    expect(component.filteredVendors.length).toBe(2);
  });

  it('should handle pagination and page changes', () => {
    component.pageSize = 1;
    expect(component.totalPages).toBe(2);
    expect(component.paginatedVendors.length).toBe(1);

    component.onPageChange(1);
    expect(component.currentPage).toBe(1);
    expect(component.paginatedVendors[0].vendorCode).toBe('VND-002');
  });

  it('should return score color classes correctly', () => {
    expect(component.getScoreColorClass(90)).toBe('score-high');
    expect(component.getScoreColorClass(75)).toBe('score-mid');
    expect(component.getScoreColorClass(60)).toBe('score-low');
  });

  it('should calculate KYC status text for verified, partial, and pending', () => {
    expect(component.getKycStatusText(mockVendors[0])).toBe('VERIFIED');
    expect(component.getKycStatusText(mockVendors[1])).toBe('PARTIAL');

    const pendingVendor: any = { credentials: { gstin: { verified: false }, pan: { verified: false } } };
    expect(component.getKycStatusText(pendingVendor)).toBe('PENDING');
  });

  it('should navigate to viewAiProfile, viewDocuments, viewPerformance, addVendor, editVendor', () => {
    spyOn(router, 'navigate');

    component.viewAiProfile(mockVendors[0]);
    expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors/ai-profile', 'VND-001']);

    component.viewAiProfile(mockVendors[0], 'credentials');
    expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors/ai-profile', 'VND-001'], { queryParams: { tab: 'credentials' } });

    component.viewAiProfile(null as any);
    component.viewAiProfile({ vendorCode: '' } as any);

    component.viewDocuments(mockVendors[0]);
    expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors/ai-profile', 'VND-001'], { queryParams: { tab: 'documents' } });

    component.viewPerformance(mockVendors[0]);
    expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors/ai-profile', 'VND-001'], { queryParams: { tab: 'performance' } });

    component.addVendor();
    expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors/new']);

    component.editVendor(mockVendors[0]);
    expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors', 'VND-001', 'edit']);
  });

  it('should toggle vendor status and handle error with optimistic update', () => {
    const target = { ...mockVendors[0] };
    component.toggleVendorStatus(target);
    expect(vendorServiceSpy.updateVendorStatus).toHaveBeenCalled();
    expect(target.status).toBe('Inactive');
    expect(toastrSpy.success).toHaveBeenCalled();

    vendorServiceSpy.updateVendorStatus.and.returnValue(throwError(() => new Error('Status err')));
    component.toggleVendorStatus(target);
    expect(target.status).toBe('Active');
    expect(toastrSpy.info).toHaveBeenCalled();
  });

  it('should handle single vendor deletion on confirmation with fallback id', async () => {
    const { swalConfirm } = await import('src/app/shared/helpers/swal-confirm');
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    component.selectedVendorCodes.add('VND-001');
    component.deleteVendor({ ...mockVendors[0], id: undefined as any });
    await fixture.whenStable();

    expect(vendorServiceSpy.deleteVendor).toHaveBeenCalledWith('VND-001');
    expect(component.selectedVendorCodes.has('VND-001')).toBe(false);
    expect(toastrSpy.success).toHaveBeenCalled();
  });

  it('should handle single vendor deletion error', async () => {
    const { swalConfirm } = await import('src/app/shared/helpers/swal-confirm');
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));
    vendorServiceSpy.deleteVendor.and.returnValue(throwError(() => new Error('delete err')));

    component.deleteVendor(mockVendors[0]);
    await fixture.whenStable();

    expect(toastrSpy.error).toHaveBeenCalled();
  });

  it('should not delete single vendor if vendor is null or cancelled', async () => {
    component.deleteVendor(null as any);
    expect(vendorServiceSpy.deleteVendor).not.toHaveBeenCalled();

    const { swalConfirm } = await import('src/app/shared/helpers/swal-confirm');
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: false }));

    component.deleteVendor(mockVendors[0]);
    await fixture.whenStable();
    expect(vendorServiceSpy.deleteVendor).not.toHaveBeenCalled();
  });

  it('should handle deleteAllVendorsConfirmation when no vendors available', () => {
    component.enrichedVendors = [];
    component.deleteAllVendorsConfirmation();
    expect(toastrSpy.warning).toHaveBeenCalled();
  });

  it('should handle deleteAllVendorsConfirmation success and event checkbox reset', async () => {
    const { swalConfirm } = await import('src/app/shared/helpers/swal-confirm');
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));

    const mockCheckbox = document.createElement('input');
    mockCheckbox.type = 'checkbox';
    mockCheckbox.checked = true;
    const mockEvent = { preventDefault: jasmine.createSpy('preventDefault'), target: mockCheckbox } as any;

    component.deleteAllVendorsConfirmation(mockEvent);
    await fixture.whenStable();

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockCheckbox.checked).toBe(false);
    expect(vendorServiceSpy.bulkDeleteVendors).toHaveBeenCalledWith(['v-1', 'v-2']);
    expect(toastrSpy.success).toHaveBeenCalled();
  });

  it('should handle deleteAllVendorsConfirmation error handling', async () => {
    const { swalConfirm } = await import('src/app/shared/helpers/swal-confirm');
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));
    vendorServiceSpy.bulkDeleteVendors.and.returnValue(throwError(() => new Error('Bulk delete err')));

    component.deleteAllVendorsConfirmation();
    await fixture.whenStable();

    expect(toastrSpy.error).toHaveBeenCalled();
    expect(component.loading).toBe(false);
  });

  it('should test selection helper methods', () => {
    expect(component.isPartiallySelected()).toBe(false);
    expect(component.isAllSelected()).toBe(false);

    component.toggleSelectAll({ target: { checked: true } });
    expect(component.isAllSelected()).toBe(true);
    expect(component.selectedVendorCodes.size).toBe(2);

    component.toggleSelectAll({ target: { checked: false } });
    expect(component.isAllSelected()).toBe(false);
    expect(component.selectedVendorCodes.size).toBe(0);

    component.toggleSelectVendor('VND-001');
    expect(component.isPartiallySelected()).toBe(true);
    expect(component.isAllSelected()).toBe(false);
    expect(component.isVendorSelected('VND-001')).toBe(true);
    expect(component.isVendorSelected('')).toBe(false);

    component.toggleSelectVendor('VND-001'); // remove
    expect(component.isVendorSelected('VND-001')).toBe(false);

    component.toggleSelectVendor('VND-002');
    component.toggleSelectVendor('');
    component.clearSelection();
    expect(component.selectedVendorCodes.size).toBe(0);

    // Empty paginatedVendors branches
    component.filteredVendors = [];
    expect(component.isPartiallySelected()).toBe(false);
    expect(component.isAllSelected()).toBe(false);
  });

  it('should call deleteAllVendorsConfirmation on bulkDeleteSelectedVendors', () => {
    spyOn(component, 'deleteAllVendorsConfirmation');
    component.bulkDeleteSelectedVendors();
    expect(component.deleteAllVendorsConfirmation).toHaveBeenCalled();
  });

  it('should test Excel modal and drag & drop events', () => {
    component.openUploadModal();
    expect(component.showUploadModal).toBe(true);

    component.isUploading = true;
    component.closeUploadModal();
    expect(component.showUploadModal).toBe(true);

    component.isUploading = false;
    component.closeUploadModal();
    expect(component.showUploadModal).toBe(false);

    const mockDragEvent = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation'),
      dataTransfer: { files: [] }
    } as any;

    component.onDragOver(mockDragEvent);
    expect(component.isDragging).toBe(true);

    component.onDragLeave(mockDragEvent);
    expect(component.isDragging).toBe(false);

    component.onDrop(mockDragEvent);
    expect(component.isDragging).toBe(false);

    const mockDropWithFile = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation'),
      dataTransfer: { files: [new File(['dummy'], 'invalid.txt')] }
    } as any;
    component.onDrop(mockDropWithFile);

    const mockFileSelected = { target: { files: [new File(['dummy'], 'invalid.txt')] } };
    component.onFileSelected(mockFileSelected);

    component.onFileSelected({ target: null });
  });

  it('should download template', () => {
    expect(() => component.downloadTemplate()).not.toThrow();
  });

  it('should validate file extension in processFile', () => {
    const invalidFile = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    component.processFile(invalidFile);
    expect(toastrSpy.error).toHaveBeenCalled();
  });

  it('should parse and validate rows comprehensively via direct method invocation', () => {
    const rawRows = [
      {
        'Vendor Code *': ' V001 ',
        'Vendor Name *': ' Alpha Corp ',
        'Search Alias': ' Alpha ',
        'Primary Phone *': ' 9876-543-210 ',
        'Phone 2 (Alternate)': ' 9876-543-211 ',
        'PAN': ' abcde1234f ',
        'GSTIN': ' 29abcde1234f1z5 ',
        'Postal Code': ' 560001 ',
        'Address Line': ' MG Road ',
        'City': ' Bangalore ',
        'District': ' Bangalore Urban ',
        'State': ' KA ',
        'Country': ' India ',
        'Type of Business': ' Trading ',
        'Type of Industry': ' MRO ',
        'Vendor Group': ' Strategic ',
        'Sourcing Scope': ' Client Only '
      },
      {
        'Code': 'V002',
        'Company Name': 'Beta Tech',
        'Mobile': '9876543212',
        'PAN': 'XYZ',
        'GSTIN': 'XYZ',
        'Postal Code': '123'
      },
      {
        // Missing required fields
        'Vendor Code': '',
        'Vendor Name': 'X',
        'Phone': '123'
      },
      {
        // Completely empty row
        'Vendor Code': '',
        'Vendor Name': '',
        'Phone': ''
      },
      null,
      'not an object'
    ];

    component['parseAndValidateRows'](rawRows);
    expect(component.parsedRows.length).toBe(3);
    expect(component.validCount).toBe(1);
    expect(component.invalidCount).toBe(2);
  });

  it('should test extractFieldValue helper direct and fallback branches', () => {
    const obj = { 'Company Name': 'Acme Inc', 'Vendor_Code': 'AC01' };
    expect(component['extractFieldValue'](obj, ['Vendor Code', 'Company Name'])).toBe('Acme Inc');
    expect(component['extractFieldValue'](obj, ['vendorcode'])).toBe('AC01');
    expect(component['extractFieldValue'](obj, ['NonExistent'])).toBe('');
  });

  it('should test uploadVendors validation and execution', () => {
    component.selectedFileName = '';
    component.parsedRows = [];
    component.uploadVendors();
    expect(toastrSpy.warning).toHaveBeenCalled();

    component.selectedFileName = 'test.xlsx';
    component.parsedRows = [{ isValid: false, vendor: {} as any, errors: ['Error'] }];
    component.uploadVendors();
    expect(toastrSpy.warning).toHaveBeenCalled();

    component.parsedRows = [{ isValid: true, vendor: { vendorCode: 'V001' } as any, errors: [] }];
    spyOn(component, 'startAiProcessingPipeline');
    component.uploadVendors();
    expect(vendorServiceSpy.bulkCreateVendors).toHaveBeenCalled();
    expect(component.startAiProcessingPipeline).toHaveBeenCalledWith(1);
  });

  it('should handle bulkCreateVendors error in uploadVendors gracefully', () => {
    vendorServiceSpy.bulkCreateVendors.and.returnValue(throwError(() => new Error('Upload error')));
    component.selectedFileName = 'test.xlsx';
    component.parsedRows = [{ isValid: true, vendor: { vendorCode: 'V001' } as any, errors: [] }];
    spyOn(component, 'startAiProcessingPipeline');

    component.uploadVendors();
    expect(component.startAiProcessingPipeline).toHaveBeenCalled();
  });

  it('should run AI processing pipeline progression with timers', fakeAsync(() => {
    component.startAiProcessingPipeline(4);
    expect(component.showAiProcessingModal).toBe(true);
    expect(component.aiSteps[1].status).toBe('processing');

    tick(750); // Step 2 -> 3
    expect(component.aiSteps[1].status).toBe('completed');
    expect(component.aiSteps[2].status).toBe('processing');

    tick(650); // Step 3 -> 4
    expect(component.aiSteps[2].status).toBe('completed');
    expect(component.aiSteps[3].status).toBe('processing');

    tick(650); // Step 4 -> 5
    expect(component.aiSteps[3].status).toBe('completed');
    expect(component.aiSteps[4].status).toBe('processing');

    tick(650); // Step 5 -> 6
    expect(component.aiSteps[4].status).toBe('completed');
    expect(component.aiSteps[5].status).toBe('processing');

    tick(650); // Completion
    expect(component.aiSteps[5].status).toBe('completed');
    expect(component.aiProcessingComplete).toBe(true);

    component.finishAiProcessing();
    expect(component.showAiProcessingModal).toBe(false);

    component.closeAiProcessingModal();
    expect(component.showAiProcessingModal).toBe(false);
  }));

  it('should export vendors to excel with non-array subCategories/capabilities and missing optional fields', () => {
    component.filteredVendors = [
      {
        vendorCode: 'V010',
        vendorName: 'Bare Vendor',
        industry: 'Other',
        category: 'Misc',
        qualification: 'Pending',
        credentials: { gstin: { verified: false }, pan: { verified: false } }
      } as any,
      {
        ...mockVendors[0],
        subCategories: undefined as any,
        capabilities: undefined as any
      }
    ];
    component.exportVendorsToExcel();
    expect(toastrSpy.success).toHaveBeenCalled();
  });

  it('should export warning when exporting empty vendor list', () => {
    component.filteredVendors = [];
    component.enrichedVendors = [];
    component.exportVendorsToExcel();
    expect(toastrSpy.warning).toHaveBeenCalled();
  });

  it('should cover branch defaults for isPreferredVendor, status toggling, and bulk deletion response without saved/deleted counts', async () => {
    // isPreferredVendor undefined score
    expect(component.isPreferredVendor({ aiScore: undefined } as any)).toBe(false);

    // toggleVendorStatus without status and without id
    const bareVendor: any = { vendorCode: 'V009', vendorName: 'Bare', status: undefined };
    component.toggleVendorStatus(bareVendor);
    expect(vendorServiceSpy.updateVendorStatus).toHaveBeenCalledWith('V009', 'Inactive');

    // deleteAllVendorsConfirmation with isConfirmed and response without data.deletedCount
    const { swalConfirm } = await import('src/app/shared/helpers/swal-confirm');
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
    vendorServiceSpy.bulkDeleteVendors.and.returnValue(of({ statusCode: '200' }));

    component.enrichedVendors = [{ vendorCode: 'V009', vendorName: 'Bare', id: undefined } as any];
    component.deleteAllVendorsConfirmation();
    await fixture.whenStable();
    expect(toastrSpy.success).toHaveBeenCalled();

    // uploadVendors with response without data.savedCount
    component.selectedFileName = 'test.xlsx';
    component.parsedRows = [{ isValid: true, vendor: { vendorCode: 'V001' } as any, errors: [] }];
    vendorServiceSpy.bulkCreateVendors.and.returnValue(of({ statusCode: '200' }));
    spyOn(component, 'startAiProcessingPipeline');
    component.uploadVendors();
    expect(component.startAiProcessingPipeline).toHaveBeenCalledWith(1);

    // startAiProcessingPipeline with 0 count
    (component.startAiProcessingPipeline as jasmine.Spy).and.callThrough();
    component.startAiProcessingPipeline(0);
    expect(component.aiTotalToProcess).toBe(2);
  });

  it('should handle vendors with undefined aiScore in metrics and score filtering', () => {
    const noScoreVendors: any[] = [
      { vendorCode: 'VND-NO-SCORE', vendorName: 'No Score', qualification: 'Qualified', credentials: { gstin: { verified: true }, pan: { verified: true } }, complianceStatus: 'Compliant' }
    ];
    aiServiceSpy.getVendors.and.returnValue(of(noScoreVendors));
    component.loadEnrichedVendors();
    expect(component.aiRecommendedCount).toBe(0);

    component.scoreFilter = 'preferred';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(0);

    component.scoreFilter = 'high';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(0);

    component.scoreFilter = 'standard';
    component.applyFilters();
    expect(component.filteredVendors.length).toBe(1);
  });
});
