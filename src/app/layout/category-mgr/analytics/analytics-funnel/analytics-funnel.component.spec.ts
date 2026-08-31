import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { AnalyticsFunnelComponent } from './analytics-funnel.component';
import { AnalyticsService } from '../../services/analytics.service';
import { autoMock } from 'src/testing/test-helpers';

describe('AnalyticsFunnelComponent', () => {
  let component: AnalyticsFunnelComponent;
  let fixture: ComponentFixture<AnalyticsFunnelComponent>;
  let analyticsService: any;

  const buyerFunnelResponse = {
    stages: [
      { stageNumber: 1, name: 'Registered Buyer Accounts', usersEntered: 100 },
      { stageNumber: 2, name: 'Active Buyer Accounts', usersEntered: 80, dropOffVolume: 20 }
    ],
    summary: { totalEntered: 100 }
  };

  const sellerFunnelResponse = {
    stages: [
      { stageNumber: 1, name: 'All Onboarded Sellers', usersEntered: 189, dropOffVolume: 0 }
    ],
    summary: { totalEntered: 189, depletedCreditSellers: 53 }
  };

  function setup() {
    analyticsService = autoMock('AnalyticsService');
    TestBed.configureTestingModule({
      declarations: [AnalyticsFunnelComponent],
      providers: [{ provide: AnalyticsService, useValue: analyticsService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideTemplate(AnalyticsFunnelComponent, '');
    fixture = TestBed.createComponent(AnalyticsFunnelComponent);
    component = fixture.componentInstance;
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create and load buyer funnel on init', () => {
    setup();
    analyticsService.getFunnelData.and.returnValue(of(buyerFunnelResponse));
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.stages.length).toBe(2);
    expect(component.summary).toEqual(buyerFunnelResponse.summary);
    expect(component.isLoading).toBe(false);
  });

  it('should handle empty response gracefully', () => {
    setup();
    analyticsService.getFunnelData.and.returnValue(of(null));
    fixture.detectChanges();
    expect(component.isLoading).toBe(false);
  });

  it('should handle error from getFunnelData', () => {
    setup();
    analyticsService.getFunnelData.and.returnValue(throwError(() => new Error('fail')));
    fixture.detectChanges();
    expect(component.isLoading).toBe(false);
  });

  it('should switch tab and reload funnel data', () => {
    setup();
    analyticsService.getFunnelData.and.returnValue(of(buyerFunnelResponse));
    fixture.detectChanges();
    analyticsService.getFunnelData.and.returnValue(of(sellerFunnelResponse));
    component.setTab('seller');
    expect(component.activeTab).toBe('seller');
    expect(analyticsService.getFunnelData).toHaveBeenCalledWith('seller');
  });

  it('should append a synthetic depleted-credit stage for seller tab when missing', () => {
    setup();
    analyticsService.getFunnelData.and.returnValue(of(sellerFunnelResponse));
    component.activeTab = 'seller';
    component.loadFunnel();
    const depleted = component.stages.find((s: any) => s.isAlert);
    expect(depleted).toBeTruthy();
    expect(depleted.usersEntered).toBe(53);
  });

  it('should not duplicate depleted-credit stage when already present via isAlert', () => {
    setup();
    const withDepleted = {
      stages: [{ stageNumber: 5, name: 'Sellers with Depleted Credit', isAlert: true, usersEntered: 10 }],
      summary: { totalEntered: 100 }
    };
    analyticsService.getFunnelData.and.returnValue(of(withDepleted));
    component.activeTab = 'seller';
    component.loadFunnel();
    const depletedStages = component.stages.filter((s: any) => s.isAlert);
    expect(depletedStages.length).toBe(1);
  });

  it('should not duplicate depleted-credit stage when name contains "depleted" without isAlert', () => {
    setup();
    const withDepleted = {
      stages: [{ stageNumber: 5, name: 'Sellers with Depleted Credit', usersEntered: 10 }],
      summary: { totalEntered: 100 }
    };
    analyticsService.getFunnelData.and.returnValue(of(withDepleted));
    component.activeTab = 'seller';
    component.loadFunnel();
    expect(component.stages.length).toBe(1);
  });



  it('should use fallback defaults when summary/stages are missing for seller depleted stage', () => {
    setup();
    analyticsService.getFunnelData.and.returnValue(of({ stages: [], summary: null }));
    component.activeTab = 'seller';
    component.loadFunnel();
    const depleted = component.stages.find((s: any) => s.isAlert);
    expect(depleted).toBeTruthy();
    expect(depleted.usersEntered).toBe(53);
  });

  it('should default stages to empty array when response has no stages field', () => {
    setup();
    analyticsService.getFunnelData.and.returnValue(of({ summary: { totalEntered: 10 } }));
    component.activeTab = 'buyer';
    component.loadFunnel();
    expect(component.stages).toEqual([]);
  });

  it('should render "—" convRateTotal when totalCohort resolves to a non-positive value', () => {
    setup();
    analyticsService.getFunnelData.and.returnValue(
      of({ stages: [], summary: { totalEntered: -5, depletedCreditSellers: 10 } })
    );
    component.activeTab = 'seller';
    component.loadFunnel();
    const depleted = component.stages.find((s: any) => s.isAlert);
    expect(depleted.convRateTotal).toBe('—');
  });

  it('should open stage modal and load stage details, then close it', () => {
    setup();
    analyticsService.getFunnelData.and.returnValue(of(buyerFunnelResponse));
    fixture.detectChanges();
    const records = [{ name: 'Acme Corp', contactPerson: 'Jane', email: 'jane@acme.com', phone: '123' }];
    analyticsService.getFunnelStageDetails.and.returnValue(of({ records }));
    component.openStageModal(buyerFunnelResponse.stages[0]);
    expect(component.isModalOpen).toBe(true);
    expect(component.stageRecords).toEqual(records);
    expect(component.filteredRecords).toEqual(records);
    expect(component.isModalLoading).toBe(false);
    component.closeStageModal();
    expect(component.isModalOpen).toBe(false);
    expect(component.stageRecords).toEqual([]);
  });

  it('should handle error while loading stage details', () => {
    setup();
    analyticsService.getFunnelData.and.returnValue(of(buyerFunnelResponse));
    fixture.detectChanges();
    analyticsService.getFunnelStageDetails.and.returnValue(throwError(() => new Error('fail')));
    component.openStageModal(buyerFunnelResponse.stages[0]);
    expect(component.isModalLoading).toBe(false);
  });

  it('should open stage modal with default stage number when stageNumber is missing', () => {
    setup();
    analyticsService.getFunnelData.and.returnValue(of(buyerFunnelResponse));
    fixture.detectChanges();
    analyticsService.getFunnelStageDetails.and.returnValue(of({ records: [] }));
    component.openStageModal({});
    expect(analyticsService.getFunnelStageDetails).toHaveBeenCalledWith('buyer', 1, '');
  });

  it('should not move stage modal backdrop when it is already attached to body', (done) => {
    setup();
    analyticsService.getFunnelStageDetails.and.returnValue(of({ records: [] }));
    const backdrop = document.createElement('div');
    backdrop.id = 'funnel-modal-backdrop';
    document.body.appendChild(backdrop);
    const appendSpy = spyOn(document.body, 'appendChild').and.callThrough();
    component.openStageModal({ stageNumber: 1 });
    setTimeout(() => {
      expect(appendSpy).not.toHaveBeenCalledWith(backdrop);
      document.body.removeChild(backdrop);
      done();
    }, 10);
  });

  it('should not remove stage modal backdrop on close when it is not attached to body', () => {
    setup();
    const backdrop = document.createElement('div');
    backdrop.id = 'funnel-modal-backdrop';
    const wrapper = document.createElement('div');
    wrapper.appendChild(backdrop);
    const removeSpy = spyOn(document.body, 'removeChild').and.callThrough();
    component.closeStageModal();
    expect(removeSpy).not.toHaveBeenCalled();
  });

  it('should filter stage records by search query across multiple fields', () => {
    setup();
    component.stageRecords = [
      { name: 'Acme Corp', contactPerson: 'Jane', email: 'jane@acme.com', phone: '123', category: 'Steel', companyName: 'Acme', planName: 'Pro' },
      { name: 'Other Co', contactPerson: 'Bob', email: 'bob@other.com', phone: '456', category: 'Cement', companyName: 'Other', planName: 'Basic' }
    ];
    component.modalSearchQuery = 'acme';
    component.filterRecords();
    expect(component.filteredRecords.length).toBe(1);
    expect(component.filteredRecords[0].name).toBe('Acme Corp');

    component.modalSearchQuery = '   ';
    component.filterRecords();
    expect(component.filteredRecords.length).toBe(2);

    component.modalSearchQuery = 'nomatch';
    component.filterRecords();
    expect(component.filteredRecords.length).toBe(0);
  });

  it('should export stage data as CSV when records exist', () => {
    setup();
    component.filteredRecords = [{ name: 'Acme', email: 'a@a.com' }];
    component.selectedStage = { stageNumber: 2 };
    const clickSpy = jasmine.createSpy('click');
    const originalCreateElement = document.createElement.bind(document);
    spyOn(document, 'createElement').and.callFake((tag: string) => {
      const el = originalCreateElement(tag) as any;
      if (tag === 'a') el.click = clickSpy;
      return el;
    });
    component.exportStageData();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should export stage data handling null/undefined values and missing selectedStage', () => {
    setup();
    component.filteredRecords = [{ name: 'Acme', email: null, phone: undefined }];
    component.selectedStage = null;
    const clickSpy = jasmine.createSpy('click');
    const originalCreateElement = document.createElement.bind(document);
    let downloadAttr = '';
    spyOn(document, 'createElement').and.callFake((tag: string) => {
      const el = originalCreateElement(tag) as any;
      if (tag === 'a') {
        el.click = clickSpy;
        const originalSetAttribute = el.setAttribute.bind(el);
        el.setAttribute = (name: string, value: string) => {
          if (name === 'download') downloadAttr = value;
          return originalSetAttribute(name, value);
        };
      }
      return el;
    });
    component.exportStageData();
    expect(clickSpy).toHaveBeenCalled();
    expect(downloadAttr).toContain('_stage_1_records.csv');
  });

  it('should not export stage data when there are no filtered records', () => {
    setup();
    component.filteredRecords = [];
    const appendSpy = spyOn(document.body, 'appendChild');
    component.exportStageData();
    expect(appendSpy).not.toHaveBeenCalled();
  });

  it('should not open dropoff modal when stage has no dropOffVolume', () => {
    setup();
    component.openDropoffModal({ stageNumber: 2, dropOffVolume: 0 });
    expect(component.isDropoffModalOpen).toBe(false);
    component.openDropoffModal(null);
    expect(component.isDropoffModalOpen).toBe(false);
  });

  it('should open dropoff modal and load dropoff details, then close it', () => {
    setup();
    const records = [{ name: 'Dropoff Co', contactPerson: 'Sam', email: 's@d.com', phone: '789' }];
    analyticsService.getFunnelDropoffDetails.and.returnValue(of({ records, title: 'Dropoff Stage' }));
    component.openDropoffModal({ stageNumber: 2, dropOffVolume: 20 });
    expect(component.isDropoffModalOpen).toBe(true);
    expect(component.dropoffRecords).toEqual(records);
    expect(component.dropoffTitle).toBe('Dropoff Stage');
    expect(component.isDropoffLoading).toBe(false);
    component.closeDropoffModal();
    expect(component.isDropoffModalOpen).toBe(false);
    expect(component.dropoffRecords).toEqual([]);
  });

  it('should open dropoff modal using default stage number when missing', () => {
    setup();
    analyticsService.getFunnelDropoffDetails.and.returnValue(of({ records: [], title: '' }));
    component.openDropoffModal({ dropOffVolume: 5 });
    expect(analyticsService.getFunnelDropoffDetails).toHaveBeenCalledWith('buyer', 2, '');
  });

  it('should not move dropoff modal backdrop when already attached to body', (done) => {
    setup();
    analyticsService.getFunnelDropoffDetails.and.returnValue(of({ records: [] }));
    const backdrop = document.createElement('div');
    backdrop.id = 'dropoff-modal-backdrop';
    document.body.appendChild(backdrop);
    const appendSpy = spyOn(document.body, 'appendChild').and.callThrough();
    component.openDropoffModal({ stageNumber: 2, dropOffVolume: 20 });
    setTimeout(() => {
      expect(appendSpy).not.toHaveBeenCalledWith(backdrop);
      document.body.removeChild(backdrop);
      done();
    }, 10);
  });

  it('should not remove dropoff modal backdrop on close when it is not attached to body', () => {
    setup();
    const backdrop = document.createElement('div');
    backdrop.id = 'dropoff-modal-backdrop';
    const wrapper = document.createElement('div');
    wrapper.appendChild(backdrop);
    const removeSpy = spyOn(document.body, 'removeChild').and.callThrough();
    component.closeDropoffModal();
    expect(removeSpy).not.toHaveBeenCalled();
  });

  it('should handle empty response and error for dropoff details', () => {
    setup();
    analyticsService.getFunnelDropoffDetails.and.returnValue(of(null));
    component.openDropoffModal({ stageNumber: 2, dropOffVolume: 20 });
    expect(component.dropoffRecords).toEqual([]);

    analyticsService.getFunnelDropoffDetails.and.returnValue(throwError(() => new Error('fail')));
    component.openDropoffModal({ stageNumber: 2, dropOffVolume: 20 });
    expect(component.isDropoffLoading).toBe(false);
  });

  it('should filter dropoff records by search query', () => {
    setup();
    component.dropoffRecords = [
      { name: 'Acme Corp', contactPerson: 'Jane', companyName: 'Acme', email: 'jane@acme.com', phone: '123' },
      { name: 'Other Co', contactPerson: 'Bob', companyName: 'Other', email: 'bob@other.com', phone: '456' }
    ];
    component.dropoffSearchQuery = 'acme';
    component.filterDropoffRecords();
    expect(component.filteredDropoffRecords.length).toBe(1);

    component.dropoffSearchQuery = '';
    component.filterDropoffRecords();
    expect(component.filteredDropoffRecords.length).toBe(2);
  });

  it('should export dropoff data as CSV when records exist', () => {
    setup();
    component.filteredDropoffRecords = [{ name: 'Acme', email: 'a@a.com' }];
    component.selectedDropoffStage = { stageNumber: 2 };
    const clickSpy = jasmine.createSpy('click');
    const originalCreateElement = document.createElement.bind(document);
    spyOn(document, 'createElement').and.callFake((tag: string) => {
      const el = originalCreateElement(tag) as any;
      if (tag === 'a') el.click = clickSpy;
      return el;
    });
    component.exportDropoffData();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should export dropoff data handling null/undefined values and missing selectedDropoffStage', () => {
    setup();
    component.filteredDropoffRecords = [{ name: 'Acme', email: null, phone: undefined }];
    component.selectedDropoffStage = null;
    const clickSpy = jasmine.createSpy('click');
    const originalCreateElement = document.createElement.bind(document);
    let downloadAttr = '';
    spyOn(document, 'createElement').and.callFake((tag: string) => {
      const el = originalCreateElement(tag) as any;
      if (tag === 'a') {
        el.click = clickSpy;
        const originalSetAttribute = el.setAttribute.bind(el);
        el.setAttribute = (name: string, value: string) => {
          if (name === 'download') downloadAttr = value;
          return originalSetAttribute(name, value);
        };
      }
      return el;
    });
    component.exportDropoffData();
    expect(clickSpy).toHaveBeenCalled();
    expect(downloadAttr).toContain('_stage_1_dropoff.csv');
  });

  it('should not export dropoff data when there are no filtered records', () => {
    setup();
    component.filteredDropoffRecords = [];
    const appendSpy = spyOn(document.body, 'appendChild');
    component.exportDropoffData();
    expect(appendSpy).not.toHaveBeenCalled();
  });

  it('should return known stage info for mapped keys', () => {
    setup();
    component.activeTab = 'buyer';
    const info = component.getStageInfo({ stageNumber: 1 });
    expect(info.title).toBe('Registered Buyer Accounts');
  });

  it('should return fallback stage info for unmapped stage', () => {
    setup();
    component.activeTab = 'buyer';
    const info = component.getStageInfo({ stageNumber: 99, name: 'Unknown Stage' });
    expect(info.title).toBe('Unknown Stage');
  });

  it('should return "Stage Details" title and default stage number when name/stageNumber are missing', () => {
    setup();
    component.activeTab = 'buyer';
    const info = component.getStageInfo({});
    expect(info.title).toBe('Stage Details');
  });

  it('should return generic fallback stage info when stage is null', () => {
    setup();
    const info = component.getStageInfo(null);
    expect(info.title).toBe('Conversion Stage');
  });

  it('should open and close stage info modal, stopping event propagation', () => {
    setup();
    const stopPropagation = jasmine.createSpy('stopPropagation');
    component.openStageInfo({ stageNumber: 1 }, { stopPropagation } as any);
    expect(component.isInfoModalOpen).toBe(true);
    expect(stopPropagation).toHaveBeenCalled();
    component.closeStageInfo();
    expect(component.isInfoModalOpen).toBe(false);
    expect(component.selectedInfoStage).toBeNull();
  });

  it('should open stage info modal without an event', () => {
    setup();
    component.openStageInfo({ stageNumber: 1 });
    expect(component.isInfoModalOpen).toBe(true);
  });

  it('should toggle details info expanded state', () => {
    setup();
    expect(component.isDetailsInfoExpanded).toBe(false);
    component.toggleDetailsInfo();
    expect(component.isDetailsInfoExpanded).toBe(true);
    component.toggleDetailsInfo();
    expect(component.isDetailsInfoExpanded).toBe(false);
  });
});
