import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { PrLeadTimeChartComponent } from './pr-lead-time-chart.component';
import { defaultAppConfig } from 'src/testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { ClientService } from '../services/client-service.service';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';

describe('PrLeadTimeChartComponent', () => {
  let component: PrLeadTimeChartComponent;
  let fixture: ComponentFixture<PrLeadTimeChartComponent>;
  let clientService: any;
  let toastr: any;
  let encryDecryService: any;

  const mockLoggedUserData = {
    details: {
      id: 'u1',
      org: { id: 'org-1' },
      role: { roleName: 'ClientInitiator' },
      department: { id: 'dept-1' }
    }
  };

  beforeEach(async () => {
    localStorage.setItem('orgId', 'org-1');
    localStorage.setItem('logData', 'x');

    toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error')
    };

    clientService = {
      prLeadTimeChart: jasmine.createSpy('prLeadTimeChart').and.returnValue(of({
        data: [10, 20, 30],
        header: ['0-5 Days', '6-10 Days', '11+ Days']
      }))
    };

    encryDecryService = {
      get: jasmine.createSpy('get').and.returnValue(JSON.stringify(mockLoggedUserData))
    };

    await TestBed.configureTestingModule({
      declarations: [PrLeadTimeChartComponent],
      imports: [CommonModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => undefined, detectChanges: () => undefined } },
        DatePipe,
        { provide: ClientService, useValue: clientService },
        { provide: ToastrService, useValue: toastr },
        { provide: EncryDecryService, useValue: encryDecryService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(PrLeadTimeChartComponent, '<canvas id="canvas"></canvas>')
      .overrideComponent(PrLeadTimeChartComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(PrLeadTimeChartComponent);
    component = fixture.componentInstance;
  });

  it('should create and load chart data for ClientInitiator and clientInitiator1.1', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(clientService.prLeadTimeChart).toHaveBeenCalled();
    expect(component.prLeadTimeList.length).toBe(3);
    expect(component.disableColorWrapper).toBe(1);

    // clientInitiator1.1
    component.loggedUserDetails.role.roleName = 'clientInitiator1.1';
    component.getChartDetails();
  });

  it('should handle chart details for PRApprover and PRApprover2 with and without department', () => {
    component.chart = { destroy: jasmine.createSpy('destroy') };
    component.loggedUserDetails = {
      id: 'u2',
      role: { roleName: 'PRApprover' },
      department: { id: 'dept-1' }
    };
    component.getChartDetails();
    expect(component.chart.destroy).toHaveBeenCalled();

    // PRApprover2 without department
    component.loggedUserDetails = {
      id: 'u2',
      role: { roleName: 'PRApprover2' },
      department: null
    };
    component.getChartDetails();
  });

  it('should handle chart details when data is null/falsy', () => {
    clientService.prLeadTimeChart.and.returnValue(of({ data: null }));
    component.loggedUserDetails = {
      id: 'u3',
      role: { roleName: 'OtherRole' }
    };
    component.getChartDetails();
    expect(component.isDataPresent).toBe(1);
    expect(component.disableColorWrapper).toBe(0);
  });

  it('should handle onSubmit with valid and invalid dates', () => {
    component.prTimeFromDate = new Date();
    component.prTimeToDate = new Date();
    component.loggedUserDetails = mockLoggedUserData.details;

    component.onSubmit('filter');
    expect(clientService.prLeadTimeChart).toHaveBeenCalled();

    // Invalid dates
    component.prTimeFromDate = null;
    component.onSubmit('filter');
    expect(toastr.error).toHaveBeenCalledWith('Please enter all the required fields', 'Error');
  });
});
