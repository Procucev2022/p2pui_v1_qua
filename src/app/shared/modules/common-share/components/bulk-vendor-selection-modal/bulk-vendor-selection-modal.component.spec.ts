import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BulkVendorSelectionModalComponent } from './bulk-vendor-selection-modal.component';

describe('BulkVendorSelectionModalComponent', () => {
  let component: BulkVendorSelectionModalComponent;
  let fixture: ComponentFixture<BulkVendorSelectionModalComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<BulkVendorSelectionModalComponent>>;

  const mockData = {
    vendorList: [
      { id: 'v1', companyName: 'Vendor One' },
      { id: 'v2', companyName: 'Vendor Two' },
      { id: 'v3', companyName: 'Vendor Three' }
    ],
    totalEntered: 5,
    notFoundItems: ['missing1@test.com', 'missing2@test.com'],
    existingCartVendorIds: ['v2']
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [BulkVendorSelectionModalComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BulkVendorSelectionModalComponent);
    component = fixture.componentInstance;
  });

  it('should create and initialize correctly with full data', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.vendorList.length).toBe(3);
    expect(component.totalEntered).toBe(5);
    expect(component.foundCount).toBe(3);
    expect(component.notFoundItems).toEqual(['missing1@test.com', 'missing2@test.com']);
    expect(component.existingCartVendorIds.has('v2')).toBeTrue();
    expect(component.vendorList[0].alreadyInCart).toBeFalse();
    expect(component.vendorList[1].alreadyInCart).toBeTrue();
    expect(component.vendorList[0].rowNum).toBe(1);
    expect(component.selectedVendors.length).toBe(2);
    expect(component.selectAll).toBeTrue();
  });

  it('should initialize correctly with empty or alternative data properties', () => {
    component.data = {
      vendorList: null,
      notFoundEmails: ['fallback@test.com']
    };
    component.ngOnInit();
    expect(component.vendorList).toEqual([]);
    expect(component.totalEntered).toBe(0);
    expect(component.foundCount).toBe(0);
    expect(component.notFoundItems).toEqual(['fallback@test.com']);

    // When data is null
    component.data = null;
    component.ngOnInit();
    expect(component.vendorList).toEqual([]);
  });

  it('should toggle select all for selectable vendors only', () => {
    fixture.detectChanges();
    expect(component.selectAll).toBeTrue();

    // Toggle off
    component.selectAll = false;
    component.toggleSelectAll();
    expect(component.selectedVendors.length).toBe(0);
    expect(component.vendorList[0].selected).toBeFalse();
    expect(component.vendorList[1].alreadyInCart).toBeTrue();

    // Toggle on
    component.selectAll = true;
    component.toggleSelectAll();
    expect(component.selectedVendors.length).toBe(2);
    expect(component.vendorList[0].selected).toBeTrue();
  });

  it('should handle onVendorSelectChange and update selectAll state', () => {
    fixture.detectChanges();

    // Deselect one vendor
    component.vendorList[0].selected = false;
    component.onVendorSelectChange();
    expect(component.selectAll).toBeFalse();
    expect(component.selectedVendors.length).toBe(1);

    // Re-select vendor
    component.vendorList[0].selected = true;
    component.onVendorSelectChange();
    expect(component.selectAll).toBeTrue();
    expect(component.selectedVendors.length).toBe(2);
  });

  it('should correctly handle updateSelectionState when all vendors are already in cart', () => {
    component.data = {
      vendorList: [{ id: 'v1' }, { id: 'v2' }],
      existingCartVendorIds: ['v1', 'v2']
    };
    component.ngOnInit();
    expect(component.selectedVendors.length).toBe(0);
    expect(component.selectAll).toBeFalse();
  });

  it('should close dialog with selected vendors on onAddSelectedToCart', () => {
    fixture.detectChanges();
    component.onAddSelectedToCart();
    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      action: 'addVendors',
      selectedVendors: [
        jasmine.objectContaining({ id: 'v1' }),
        jasmine.objectContaining({ id: 'v3' })
      ]
    });
  });

  it('should close dialog with cancel action on onClose', () => {
    component.onClose();
    expect(dialogRefSpy.close).toHaveBeenCalledWith({ action: 'cancel' });
  });
});
