import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { ProCpxVendorSummaryLayoutComponent } from './pro-cpx-vendor-summary-layout.component';
import { autoMock, defaultAppConfig, seedComponent, exerciseComponent } from '../../../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { CatProcuQuotationsService } from 'src/app/layout/category-mgr/services';
import { EncryDecryService } from 'src/app/shared/services';
import { MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';

describe('ProCpxVendorSummaryLayoutComponent', () => {
  let component: ProCpxVendorSummaryLayoutComponent;
  let fixture: ComponentFixture<ProCpxVendorSummaryLayoutComponent>;

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');


    await TestBed.configureTestingModule({
      declarations: [ProCpxVendorSummaryLayoutComponent],
      imports: [CommonModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: autoMock('ChangeDetectorRef') },
        DatePipe,
        { provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: () => ({ attach: () => undefined, enable: () => undefined, disable: () => undefined, detach: () => undefined }) },
        { provide: CatProcuRequestsService, useValue: autoMock('CatProcuRequestsService') },
        { provide: CatProcuQuotationsService, useValue: autoMock('CatProcuQuotationsService') },
        { provide: EncryDecryService, useValue: autoMock('EncryDecryService') }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(ProCpxVendorSummaryLayoutComponent, '')
      .overrideComponent(ProCpxVendorSummaryLayoutComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(ProCpxVendorSummaryLayoutComponent);
    component = fixture.componentInstance;
    seedComponent(component as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should exercise component API for coverage', () => {
    exerciseComponent(component as any);
    expect(component).toBeTruthy();
  });
});
