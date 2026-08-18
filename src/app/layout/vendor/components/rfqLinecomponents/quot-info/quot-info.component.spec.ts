import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef, SimpleChange } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { QuotInfoComponent } from './quot-info.component';
import { defaultAppConfig } from 'src/testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { RfqService } from '../../../services/rfq.service';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';

describe('QuotInfoComponent', () => {
  let component: QuotInfoComponent;
  let fixture: ComponentFixture<QuotInfoComponent>;
  let rfqService: any;
  let toastr: any;
  let encryDecryService: any;

  const mockLoggedUserData = {
    details: {
      listofPermission: ['VIEW_QUOT_INFO']
    }
  };

  beforeEach(async () => {
    toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error')
    };

    rfqService = {
      getLineitemsById: jasmine.createSpy('getLineitemsById').and.returnValue(of([{ unitprice: 100, quantity: 2, unitofMeasures: 'PCS', totalamount: 200 }]))
    };

    encryDecryService = {
      get: jasmine.createSpy('get').and.returnValue(JSON.stringify(mockLoggedUserData))
    };

    await TestBed.configureTestingModule({
      declarations: [QuotInfoComponent],
      imports: [CommonModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => undefined, detectChanges: () => undefined } },
        DatePipe,
        { provide: RfqService, useValue: rfqService },
        { provide: ToastrService, useValue: toastr },
        { provide: EncryDecryService, useValue: encryDecryService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(QuotInfoComponent, '')
      .overrideComponent(QuotInfoComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(QuotInfoComponent);
    component = fixture.componentInstance;
    component.rfqData = { rfq: { id: 'rfq-100' } };
  });

  it('should create and initialize permissions', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.loggedUserPermissions).toEqual(['VIEW_QUOT_INFO']);
  });

  it('should handle getQuotInfo with array and non-array response', () => {
    component.getQuotInfo();
    expect(rfqService.getLineitemsById).toHaveBeenCalledWith({ id: 'rfq-100' });
    expect(component.quotInfoList.length).toBe(1);

    // Non-array
    rfqService.getLineitemsById.and.returnValue(of(null));
    component.getQuotInfo();
    expect(component.quotInfoList).toEqual([]);
  });

  it('should handle ngOnChanges with and without rfqId', () => {
    component.rfqId = 'rfq-100';
    component.ngOnChanges({ rfqId: new SimpleChange(null, 'rfq-100', true) });
    expect(rfqService.getLineitemsById).toHaveBeenCalled();

    component.rfqId = null;
    component.ngOnChanges({ rfqId: new SimpleChange('rfq-100', null, false) });
  });

  it('should handle getRFQs and getThirdTab stubs', () => {
    component.getRFQs({}, {});
    component.getThirdTab({});
    expect(component).toBeTruthy();
  });
});
