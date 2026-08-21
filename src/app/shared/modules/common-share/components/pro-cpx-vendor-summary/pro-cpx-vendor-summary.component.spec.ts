import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef, SimpleChange } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { ProCpxVendorSummaryComponent } from './pro-cpx-vendor-summary.component';
import { defaultAppConfig } from 'src/testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { CatProcuQuotationsService, CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { EncryDecryService } from 'src/app/shared/services';
import { MatDialog } from '@angular/material/dialog';

describe('ProCpxVendorSummaryComponent', () => {
  let component: ProCpxVendorSummaryComponent;
  let fixture: ComponentFixture<ProCpxVendorSummaryComponent>;
  let quotsService: any;
  let encryDecryService: any;

  const mockClientInitiatorData = {
    details: {
      org: { id: 'org-client-1' },
      role: { roleName: 'ClientInitiator' }
    }
  };

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');

    quotsService = {
      getVendorsByClientId: jasmine.createSpy('getVendorsByClientId').and.returnValue(of([
        { vendorId: 'v1', vendorName: 'Vendor 1', subCategory: 'IT', city: 'NY', phone: '1234', vendorRank: 'A' }
      ]))
    };

    encryDecryService = {
      get: jasmine.createSpy('get').and.returnValue(JSON.stringify(mockClientInitiatorData))
    };

    await TestBed.configureTestingModule({
      declarations: [ProCpxVendorSummaryComponent],
      imports: [CommonModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => undefined, detectChanges: () => undefined } },
        { provide: CatProcuRequestsService, useValue: {} },
        { provide: CatProcuQuotationsService, useValue: quotsService },
        { provide: MatDialog, useValue: {} },
        { provide: EncryDecryService, useValue: encryDecryService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(ProCpxVendorSummaryComponent, '')
      .overrideComponent(ProCpxVendorSummaryComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(ProCpxVendorSummaryComponent);
    component = fixture.componentInstance;
    component.clientData = { id: 'c-100' };
  });

  it('should create and load vendors for ClientInitiator and ClientApprover on ngOnInit', () => {
    component.loggedUserDetails = { roleName: 'ClientInitiator' };
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(quotsService.getVendorsByClientId).toHaveBeenCalled();

    // ClientApprover
    component.loggedUserDetails = { roleName: 'ClientApprover' };
    component.ngOnInit();

    // Other role
    component.loggedUserDetails = { roleName: 'Other' };
    component.ngOnInit();
  });

  it('should handle ngOnChanges for category manager role (non-client role)', () => {
    encryDecryService.get.and.returnValue(JSON.stringify({
      details: { role: { roleName: 'CategoryManager' } }
    }));

    component.ngOnChanges({
      clientData: new SimpleChange(null, { id: 'c-100' }, true)
    });

    expect(quotsService.getVendorsByClientId).toHaveBeenCalledWith({ id: 'c-100' });

    // Client data null
    component.clientData = null;
    component.getVendorListByClient();
    expect(quotsService.getVendorsByClientId).toHaveBeenCalledWith({ id: null });

    // Client role without org
    component.loggedUserDetails = { role: { roleName: 'ClientApprover' } };
    component.getVendorListByClient();
    expect(quotsService.getVendorsByClientId).toHaveBeenCalledWith({ id: null });

    // Non array response
    quotsService.getVendorsByClientId.and.returnValue(of(null));
    component.getVendorListByClient();
    expect(component.vendorList).toEqual([]);
  });

  it('should handle getRFQs, getCloseRFQs, getLineItems, onPage, and viewQuotDetails', () => {
    const vendor = { id: 'v1', vendorName: 'Vendor 1' };
    component.getRFQs(vendor);
    expect(component.expandedRows['v1']).toBe(1);
    expect(component.selectedVendorsList).toEqual([vendor]);

    component.getCloseRFQs(vendor, {});
    expect(component.expandedRows).toEqual({});

    component.getLineItems({ target: {} });
    component.onPage({ pageIndex: 1 });
    expect(component.paginatoryDetails.pageIndex).toBe(1);

    component.viewQuotDetails({});
  });
});
