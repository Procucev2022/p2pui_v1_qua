import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { VendorListComponent } from './vendor-list.component';
import { BuyerVendorService } from '../services/buyer-vendor.service';
import { BuyerVendorPageResponse } from '../models/buyer-vendor.model';

describe('VendorListComponent', () => {
  let component: VendorListComponent;
  let fixture: ComponentFixture<VendorListComponent>;
  let vendorServiceSpy: jasmine.SpyObj<BuyerVendorService>;
  let router: Router;

  const mockPageResponse: BuyerVendorPageResponse = {
    statusCode: '200',
    message: 'Success',
    status: 'Success',
    data: {
      vendors: [
        { id: '1', vendorCode: 'V001', vendorName: 'Vendor One', phone1: '1234567890', status: 'Active', sourcingScope: 'Client Only', country: 'IN' },
        { id: '2', vendorCode: 'V002', vendorName: 'Vendor Two', phone1: '0987654321', status: 'Inactive', sourcingScope: 'Client Only', country: 'IN' }
      ],
      totalRecords: 2,
      totalPages: 1,
      currentPage: 0
    }
  };

  beforeEach(async () => {
    vendorServiceSpy = jasmine.createSpyObj('BuyerVendorService', ['getVendors', 'updateVendorStatus']);
    vendorServiceSpy.getVendors.and.returnValue(of(mockPageResponse));
    vendorServiceSpy.updateVendorStatus.and.returnValue(of({ statusCode: '200' }));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      declarations: [VendorListComponent],
      providers: [
        { provide: BuyerVendorService, useValue: vendorServiceSpy }
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

  it('should load vendors on init', () => {
    expect(vendorServiceSpy.getVendors).toHaveBeenCalledWith(0, 10, '', '', '');
    expect(component.vendors.length).toBe(2);
    expect(component.totalRecords).toBe(2);
  });

  it('should handle null data in response', () => {
    vendorServiceSpy.getVendors.and.returnValue(of({ statusCode: '200', message: '', status: '', data: null } as any));
    component.loadVendors();
    expect(component.loading).toBe(false);
  });

  it('should handle error on load', () => {
    vendorServiceSpy.getVendors.and.returnValue(throwError(() => new Error('fail')));
    component.loadVendors();
    expect(component.loading).toBe(false);
  });

  it('should reset page on search', () => {
    component.currentPage = 3;
    component.searchText = 'test';
    component.onSearch();
    expect(component.currentPage).toBe(0);
    expect(vendorServiceSpy.getVendors).toHaveBeenCalled();
  });

  it('should reset page on filter change', () => {
    component.currentPage = 2;
    component.onFilterChange();
    expect(component.currentPage).toBe(0);
  });

  it('should change page', () => {
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
    expect(vendorServiceSpy.getVendors).toHaveBeenCalled();
  });

  it('should navigate to add vendor', () => {
    spyOn(router, 'navigate');
    component.addVendor();
    expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors/new']);
  });

  it('should navigate to edit vendor', () => {
    spyOn(router, 'navigate');
    component.editVendor({ id: '1', vendorCode: 'V001', vendorName: 'V', phone1: '1234567890', status: 'Active', sourcingScope: 'Client Only', country: 'IN' });
    expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors', '1', 'edit']);
  });

  it('should navigate to view vendor', () => {
    spyOn(router, 'navigate');
    component.viewVendor({ id: '1', vendorCode: 'V001', vendorName: 'V', phone1: '1234567890', status: 'Active', sourcingScope: 'Client Only', country: 'IN' });
    expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/buyer-vendors', '1']);
  });

  it('should deactivate an active vendor', () => {
    component.deactivateVendor({ id: '1', vendorCode: 'V001', vendorName: 'V', phone1: '1234567890', status: 'Active', sourcingScope: 'Client Only', country: 'IN' });
    expect(vendorServiceSpy.updateVendorStatus).toHaveBeenCalledWith('1', 'Inactive');
  });

  it('should activate an inactive vendor', () => {
    component.deactivateVendor({ id: '2', vendorCode: 'V002', vendorName: 'V', phone1: '1234567890', status: 'Inactive', sourcingScope: 'Client Only', country: 'IN' });
    expect(vendorServiceSpy.updateVendorStatus).toHaveBeenCalledWith('2', 'Active');
  });

  it('should not deactivate vendor without id', () => {
    component.deactivateVendor({ vendorCode: 'V001', vendorName: 'V', phone1: '1234567890', status: 'Active', sourcingScope: 'Client Only', country: 'IN' });
    expect(vendorServiceSpy.updateVendorStatus).not.toHaveBeenCalled();
  });

  it('should calculate totalPages', () => {
    component.totalRecords = 25;
    component.pageSize = 10;
    expect(component.totalPages).toBe(3);
  });

  it('should return pages array', () => {
    component.totalRecords = 30;
    component.pageSize = 10;
    expect(component.pages).toEqual([0, 1, 2]);
  });

  it('should handle response with empty vendors array', () => {
    vendorServiceSpy.getVendors.and.returnValue(of({
      statusCode: '200', message: '', status: '', data: { vendors: [], totalRecords: 0, totalPages: 0, currentPage: 0 }
    }));
    component.loadVendors();
    expect(component.vendors.length).toBe(0);
  });
});
