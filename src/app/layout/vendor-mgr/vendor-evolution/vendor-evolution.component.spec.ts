import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { VendorEvolutionComponent } from './vendor-evolution.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { EncryDecryService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { VendorReqService } from '../../vendor-request/services/vendor-req.service';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('VendorEvolutionComponent', () => {
  let component: VendorEvolutionComponent;
  let fixture: ComponentFixture<VendorEvolutionComponent>;
  let vendorReqService: any;
  let toaster: any;
  let dialogRef: any;

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    vendorReqService = autoMock('VendorReqService');
    toaster = autoMock('ToastrService');
    dialogRef = autoMock('MatDialogRef');
    vendorReqService.saveVendorInfo.and.returnValue(of({ vendor: 'v1', id: '1' }));
    vendorReqService.submitVendorInfo.and.returnValue(of({ status: 'Success', message: 'ok' }));

    await TestBed.configureTestingModule({
      declarations: [VendorEvolutionComponent],
      imports: [CommonModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: autoMock('ChangeDetectorRef') },
        DatePipe,
        {
          provide: MAT_DIALOG_SCROLL_STRATEGY,
          useValue: () => ({
            attach: () => undefined,
            enable: () => undefined,
            disable: () => undefined,
            detach: () => undefined,
          }),
        },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { vendor: 'v1', name: 'Acme' } },
        { provide: EncryDecryService, useValue: autoMock('EncryDecryService') },
        { provide: ToastrService, useValue: toaster },
        { provide: MatDialog, useValue: autoMock('MatDialog') },
        { provide: VendorReqService, useValue: vendorReqService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(VendorEvolutionComponent, '')
      .overrideComponent(VendorEvolutionComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(VendorEvolutionComponent);
    component = fixture.componentInstance;
    component.tabGroup = { selectedIndex: 0 } as any;
    component.vendorDetails = { id: '1' };
    seedComponent(component as any);
  });

  it('should init selected vendor', () => {
    component.ngOnInit();
    expect(component.selecetedVendor.id).toBe('v1');
  });

  it('should submit advance tab and exit paths', () => {
    component.selectedIndex = 0;
    component.tabGroup = { selectedIndex: 0 } as any;
    component.submit({ a: 1 });
    expect(component.selectedIndex).toBe(1);

    component.selectedIndex = 4;
    vendorReqService.saveVendorInfo.and.returnValue(of({ vendor: 'v1' }));
    component.submit({ a: 1 }, true);
    expect(toaster.success).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalled();

    vendorReqService.saveVendorInfo.and.returnValue(of({}));
    component.submit({ a: 1 }, true);
    expect(toaster.error).toHaveBeenCalled();
  });

  it('should handle vendor info and capability submits', () => {
    component.vendorInfoSubmit({
      vendorInfoFormValidatity: true,
      isExit: false,
      data: { x: 1 },
    });
    expect(component.vendorInfoFormValidatity).toBe(true);

    component.vendorInfoFormValidatity = false;
    component.onVendorCapabilitySubmit({
      capabilityFormValidatity: true,
      data: {
        manPower: 1,
        managerial: 1,
        nonManagerial: 1,
        machineTypes: 'm',
        serviceCapacity: 1,
        bussinessAge: 1,
        capacityUtilization: 1,
      },
    });
    expect(toaster.warning).toHaveBeenCalled();
    expect(component.selectedIndex).toBe(0);

    component.vendorInfoFormValidatity = true;
    component.vendorDetails = {};
    component.onVendorCapabilitySubmit({
      capabilityFormValidatity: true,
      data: {
        manPower: 2,
        managerial: 1,
        nonManagerial: 1,
        machineTypes: 'm',
        serviceCapacity: 1,
        bussinessAge: 1,
        capacityUtilization: 1,
      },
    });
    expect(component.capabilityFormValidatity).toBe(true);
  });

  it('should handle quality and commercial submits', () => {
    component.capabilityFormValidatity = false;
    component.onVendorQualitySubmit({ qualityFormValidatity: true, data: {} });
    expect(toaster.warning).toHaveBeenCalled();

    component.capabilityFormValidatity = true;
    component.vendorDetails = {};
    vendorReqService.saveVendorInfo.and.callFake((payload: any) => of(payload));
    component.onVendorQualitySubmit({
      qualityFormValidatity: true,
      data: {
        qualityCertification: 'yes',
        certification: 'ISO',
        materialSource: 'src',
        testCertifcates: 'yes',
        qualityTesting: 'no',
        ensureQuality: 'eq',
        packingQuality: 'p',
        clientRejections: 0,
        subContracting: 'no',
      },
    });
    expect(component.vendorDetails.qualityCertification).toBe(true);
    expect(component.vendorDetails.testCertifcates).toBe(true);
    expect(component.vendorDetails.qualityTesting).toBe(false);
    expect(component.vendorDetails.subContracting).toBe(false);

    component.vendorDetails = {};
    component.onVendorQualitySubmit({
      qualityFormValidatity: true,
      data: {
        qualityCertification: 'no',
        certification: null,
        materialSource: 'src',
        testCertifcates: 'no',
        qualityTesting: 'yes',
        ensureQuality: null,
        packingQuality: 'p',
        clientRejections: 0,
        subContracting: 'yes',
      },
    });
    expect(component.vendorDetails.qualityCertification).toBe(false);

    component.qualityFormValidatity = false;
    component.onVendorCommercialSubmit({ commercialFormValidatity: true, data: {} });
    expect(toaster.warning).toHaveBeenCalled();

    component.qualityFormValidatity = true;
    component.vendorDetails = {};
    component.onVendorCommercialSubmit({
      commercialFormValidatity: true,
      data: {
        enquires: 1,
        conversionRate: 1,
        clientService: 1,
        billDiscounting: 1,
        financialStability: 1,
        paymentCycle: 1,
      },
    });
    expect(component.commercialFormValidatity).toBe(true);
  });

  it('should handle client submit success and missing prior data branches', () => {
    component.commercialFormValidatity = false;
    component.onVendorClientSubmit({ data: {} });
    expect(toaster.warning).toHaveBeenCalledWith('Please enter previous page details', 'Warning');

    component.commercialFormValidatity = true;
    component.vendorDetails = { enquires: 1, materialSource: 'm', manPower: 1 };
    component.selectedIndex = 3;
    component.tabGroup = { selectedIndex: 3 } as any;
    component.onVendorClientSubmit({
      data: { existingClients: [], reffernceFeedback: 'ok', feedback: 'f' },
    });
    expect(vendorReqService.submitVendorInfo).toHaveBeenCalled();

    component.vendorDetails = { enquires: 1 };
    component.onVendorClientSubmit({ data: {} });
    expect(component.selectedIndex).toBe(3);

    component.vendorDetails = { qualityCertification: true };
    component.onVendorClientSubmit({ data: {} });
    expect(component.selectedIndex).toBe(2);

    component.vendorDetails = {};
    component.onVendorClientSubmit({ data: {} });
    expect(component.selectedIndex).toBe(1);
  });

  it('should navigate next/back and success callbacks', () => {
    component.tabGroup = { selectedIndex: 2 } as any;
    component.onNext({});
    expect(component.selectedIndex).toBe(3);
    component.onBack({});
    expect(component.selectedIndex).toBe(1);
    component.successCallBack({ id: 'x' });
    expect(component.vendorDetails.id).toBe('x');
    component.submitSuccessCallBack({ status: 'Success', message: 'ok' });
    component.submitSuccessCallBack({ status: 'Error', message: 'bad' });
  });
});
