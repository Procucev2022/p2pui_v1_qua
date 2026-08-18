import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { VendorDetailComponent } from './vendor-detail.component';
import { BuyerVendorService } from '../services/buyer-vendor.service';

describe('VendorDetailComponent', () => {
  let component: VendorDetailComponent;
  let fixture: ComponentFixture<VendorDetailComponent>;
  let vendorServiceSpy: jasmine.SpyObj<BuyerVendorService>;
  let router: Router;

  const mockVendor = {
    id: 'abc123', vendorCode: 'V001', vendorName: 'Test Vendor', phone1: '1234567890',
    status: 'Active', sourcingScope: 'Client Only', country: 'IN'
  };

  function setup(paramId: string | null = 'abc123') {
    vendorServiceSpy = jasmine.createSpyObj('BuyerVendorService', ['getVendorById', 'updateVendorStatus']);
    vendorServiceSpy.getVendorById.and.returnValue(of({
      statusCode: '200', message: '', status: '', data: { vendor: mockVendor }
    }));
    vendorServiceSpy.updateVendorStatus.and.returnValue(of({ statusCode: '200' }));

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [VendorDetailComponent],
      providers: [
        { provide: BuyerVendorService, useValue: vendorServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => paramId } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorDetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  }

  describe('with valid vendor id', () => {
    beforeEach(() => setup('abc123'));

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load vendor on init', () => {
      expect(vendorServiceSpy.getVendorById).toHaveBeenCalledWith('abc123');
      expect(component.vendor).toEqual(mockVendor as any);
    });

    it('should handle load error', () => {
      vendorServiceSpy.getVendorById.and.returnValue(throwError(() => new Error('fail')));
      component.loadVendor('abc123');
      expect(component.loading).toBe(false);
    });

    it('should handle null data response', () => {
      vendorServiceSpy.getVendorById.and.returnValue(of({ statusCode: '200', message: '', status: '', data: null } as any));
      component.loadVendor('abc123');
      expect(component.loading).toBe(false);
    });

    it('should navigate to edit', () => {
      spyOn(router, 'navigate');
      component.editVendor();
      expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors', 'abc123', 'edit']);
    });

    it('should deactivate active vendor', () => {
      component.deactivateVendor();
      expect(vendorServiceSpy.updateVendorStatus).toHaveBeenCalledWith('abc123', 'Inactive');
    });

    it('should activate inactive vendor', () => {
      component.vendor = { ...mockVendor, status: 'Inactive' } as any;
      component.deactivateVendor();
      expect(vendorServiceSpy.updateVendorStatus).toHaveBeenCalledWith('abc123', 'Active');
    });

    it('should not deactivate if vendor is null', () => {
      component.vendor = null;
      component.deactivateVendor();
      expect(vendorServiceSpy.updateVendorStatus).not.toHaveBeenCalled();
    });

    it('should navigate back', () => {
      spyOn(router, 'navigate');
      component.goBack();
      expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors']);
    });
  });

  describe('without vendor id', () => {
    beforeEach(() => setup(null));

    it('should not load vendor when id is null', () => {
      expect(vendorServiceSpy.getVendorById).not.toHaveBeenCalled();
    });

    it('should not navigate to edit when vendorId is null', () => {
      spyOn(router, 'navigate');
      component.editVendor();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should not deactivate when vendorId is null', () => {
      component.vendor = mockVendor as any;
      component.vendorId = null;
      component.deactivateVendor();
      expect(vendorServiceSpy.updateVendorStatus).not.toHaveBeenCalled();
    });
  });
});
