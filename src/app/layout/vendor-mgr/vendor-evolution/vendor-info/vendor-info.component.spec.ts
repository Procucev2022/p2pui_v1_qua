import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { VendorInfoComponent } from './vendor-info.component';
import { defaultAppConfig } from 'src/testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { VendorMgrService } from '../../services/vendor-mgr.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';

describe('VendorInfoComponent', () => {
  let component: VendorInfoComponent;
  let fixture: ComponentFixture<VendorInfoComponent>;

  const mockVendorData = {
    id: 'v1',
    vendorName: 'Acme Corp',
    address: '123 Main St',
    location: 'Metropolis',
    email: 'acme@test.com',
    phone: '1234567890',
    pan: 'ABCDE1234F',
    gst: '22ABCDE1234F1Z5',
    annualTurnOver: 5000000,
    goodsType: 'Manufacturer',
    client: [{ clientName: 'Client 1' }]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendorInfoComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => undefined, detectChanges: () => undefined } },
        DatePipe,
        { provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: () => ({ attach: () => undefined, enable: () => undefined, disable: () => undefined, detach: () => undefined }) },
        { provide: VendorMgrService, useValue: {} },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(VendorInfoComponent, '')
      .overrideComponent(VendorInfoComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(VendorInfoComponent);
    component = fixture.componentInstance;
    component.selectedVendorData = { ...mockVendorData };
  });

  it('should create and initialize vendor details with address', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.model.vendorName).toBe('Acme Corp');
    expect(component.model.address).toBe('123 Main St');
    expect(component.clientsList.length).toBe(2);

    // Initialize without address
    component.selectedVendorData = { ...mockVendorData, address: null, client: [] };
    component.clientsList = [];
    component.ngOnInit();
    expect(component.model.address).toBe('');
  });

  it('should handle addOneMoreinternals with and without button ref, and removeinternals', () => {
    const mockElement = { nativeElement: { focus: jasmine.createSpy('focus') } };
    component.addInternalBtn = mockElement as any;

    component.clientsList = [];
    component.addOneMoreinternals();
    expect(component.clientsList.length).toBe(1);
    expect(mockElement.nativeElement.focus).toHaveBeenCalled();

    // Without addInternalBtn
    component.addInternalBtn = null;
    component.addOneMoreinternals();
    expect(component.clientsList.length).toBe(2);

    component.removeinternals(0);
    expect(component.clientsList.length).toBe(1);
  });

  it('should handle onVendorInfoSubmit and onVendorInfoSaveAndExit', () => {
    component.vendorInfoForm = { valid: true } as FormGroup;
    spyOn(component.vendoeDetails, 'emit');

    component.onVendorInfoSubmit();
    expect(component.vendoeDetails.emit).toHaveBeenCalledWith({
      data: component.model,
      isExit: false,
      vendorInfoFormValidatity: true
    });

    component.onVendorInfoSaveAndExit();
    expect(component.vendoeDetails.emit).toHaveBeenCalledWith({
      data: component.model,
      isExit: true,
      vendorInfoFormValidatity: true
    });
  });

  it('should handle onNext and onReset', () => {
    spyOn(component.next, 'emit');
    component.onNext();
    expect(component.next.emit).toHaveBeenCalled();

    component.onReset();
    expect(component.model).toEqual({});
    expect(component.clientsList.length).toBe(1);
  });
});
