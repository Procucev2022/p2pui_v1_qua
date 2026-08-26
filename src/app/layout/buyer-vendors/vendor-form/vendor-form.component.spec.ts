import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { VendorFormComponent } from './vendor-form.component';
import { BuyerVendorService } from '../services/buyer-vendor.service';
import { AiVendorProcessingService } from '../services/ai-vendor-processing.service';

describe('VendorFormComponent', () => {
  let component: VendorFormComponent;
  let fixture: ComponentFixture<VendorFormComponent>;
  let vendorServiceSpy: jasmine.SpyObj<BuyerVendorService>;
  let aiServiceSpy: jasmine.SpyObj<AiVendorProcessingService>;
  let router: Router;

  function setup(paramId: string | null = null) {
    vendorServiceSpy = jasmine.createSpyObj('BuyerVendorService', ['getVendorById', 'createVendor', 'updateVendor']);
    aiServiceSpy = jasmine.createSpyObj('AiVendorProcessingService', ['getVendors', 'enrichImportedVendors', 'getVendorByCode']);
    aiServiceSpy.enrichImportedVendors.and.returnValue(of([]));
    aiServiceSpy.getVendorByCode.and.returnValue(of(undefined));

    vendorServiceSpy.getVendorById.and.returnValue(of({
      statusCode: '200', message: '', status: '',
      data: { vendor: { vendorCode: 'V001', vendorName: 'Test Vendor', phone1: '1234567890', status: 'Active', sourcingScope: 'Client Only', country: 'IN' } }
    }));
    vendorServiceSpy.createVendor.and.returnValue(of({ statusCode: '200', message: '', status: '', data: { vendor: { vendorCode: 'V001' } } } as any));
    vendorServiceSpy.updateVendor.and.returnValue(of({ statusCode: '200', message: '', status: '', data: { vendor: { vendorCode: 'V001' } } } as any));

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [VendorFormComponent],
      providers: [
        { provide: BuyerVendorService, useValue: vendorServiceSpy },
        { provide: AiVendorProcessingService, useValue: aiServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => paramId } } } }
      ]
    }).compileComponents();


    fixture = TestBed.createComponent(VendorFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  }

  describe('Create mode', () => {
    beforeEach(() => setup(null));

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be in create mode', () => {
      expect(component.isEditMode).toBe(false);
      expect(component.vendorId).toBeNull();
    });

    it('should have an invalid form initially', () => {
      expect(component.vendorForm.valid).toBe(false);
    });

    it('should validate required fields', () => {
      component.onSubmit();
      expect(component.f['vendorCode'].errors?.['required']).toBeTruthy();
      expect(component.f['vendorName'].errors?.['required']).toBeTruthy();
      expect(component.f['phone1'].errors?.['required']).toBeTruthy();
    });

    it('should validate PAN pattern', () => {
      component.vendorForm.patchValue({ pan: 'INVALID' });
      expect(component.f['pan'].errors?.['pattern']).toBeTruthy();

      component.vendorForm.patchValue({ pan: 'ABCDE1234F' });
      expect(component.f['pan'].errors).toBeNull();
    });

    it('should validate GSTIN pattern', () => {
      component.vendorForm.patchValue({ gstin: 'INVALID' });
      expect(component.f['gstin'].errors?.['pattern']).toBeTruthy();

      component.vendorForm.patchValue({ gstin: '29ABCDE1234F1Z5' });
      expect(component.f['gstin'].errors).toBeNull();
    });

    it('should validate postal code pattern', () => {
      component.vendorForm.patchValue({ postalCode: '123' });
      expect(component.f['postalCode'].errors?.['pattern']).toBeTruthy();

      component.vendorForm.patchValue({ postalCode: '560001' });
      expect(component.f['postalCode'].errors).toBeNull();
    });

    it('should validate phone1 pattern', () => {
      component.vendorForm.patchValue({ phone1: '123' });
      expect(component.f['phone1'].errors?.['pattern']).toBeTruthy();

      component.vendorForm.patchValue({ phone1: '1234567890' });
      expect(component.f['phone1'].errors).toBeNull();
    });

    it('should validate vendorName minLength', () => {
      component.vendorForm.patchValue({ vendorName: 'AB' });
      expect(component.f['vendorName'].errors?.['minlength']).toBeTruthy();

      component.vendorForm.patchValue({ vendorName: 'ABC' });
      expect(component.f['vendorName'].errors).toBeNull();
    });

    it('should not submit when form is invalid', () => {
      component.onSubmit();
      expect(vendorServiceSpy.createVendor).not.toHaveBeenCalled();
    });

    it('should create vendor when form is valid', () => {
      spyOn(router, 'navigate');
      component.vendorForm.patchValue({
        vendorCode: 'V001', vendorName: 'Test Vendor', phone1: '1234567890'
      });
      component.onSubmit();
      expect(vendorServiceSpy.createVendor).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors']);
    });

    it('should handle create error', () => {
      vendorServiceSpy.createVendor.and.returnValue(throwError(() => new Error('fail')));
      component.vendorForm.patchValue({
        vendorCode: 'V001', vendorName: 'Test Vendor', phone1: '1234567890'
      });
      component.onSubmit();
      expect(component.loading).toBe(false);
    });

    it('should navigate on cancel', () => {
      spyOn(router, 'navigate');
      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors']);
    });
  });

  describe('Edit mode', () => {
    beforeEach(() => setup('abc123'));

    it('should be in edit mode', () => {
      expect(component.isEditMode).toBe(true);
      expect(component.vendorId).toBe('abc123');
    });

    it('should load vendor data', () => {
      expect(vendorServiceSpy.getVendorById).toHaveBeenCalledWith('abc123');
      expect(component.vendorForm.get('vendorName')?.value).toBe('Test Vendor');
    });

    it('should handle load error', () => {
      vendorServiceSpy.getVendorById.and.returnValue(throwError(() => new Error('fail')));
      component.loadVendor('abc123');
      expect(component.loading).toBe(false);
    });

    it('should handle null data in response', () => {
      vendorServiceSpy.getVendorById.and.returnValue(of({ statusCode: '200', message: '', status: '', data: null } as any));
      component.loadVendor('abc123');
      expect(component.loading).toBe(false);
    });

    it('should update vendor when form is valid', () => {
      spyOn(router, 'navigate');
      component.vendorForm.patchValue({
        vendorCode: 'V001', vendorName: 'Updated Vendor', phone1: '1234567890'
      });
      component.onSubmit();
      expect(vendorServiceSpy.updateVendor).toHaveBeenCalledWith('abc123', jasmine.any(Object));
      expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors']);
    });

    it('should handle update error', () => {
      vendorServiceSpy.updateVendor.and.returnValue(throwError(() => new Error('fail')));
      component.vendorForm.patchValue({
        vendorCode: 'V001', vendorName: 'Updated Vendor', phone1: '1234567890'
      });
      component.onSubmit();
      expect(component.loading).toBe(false);
    });
  });
});
