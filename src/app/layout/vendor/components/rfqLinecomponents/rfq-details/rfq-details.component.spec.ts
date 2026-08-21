import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef, SimpleChange } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { RfqDetailsComponent } from './rfq-details.component';
import { defaultAppConfig } from 'src/testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { RfqService } from '../../../services/rfq.service';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';

describe('RfqDetailsComponent', () => {
  let component: RfqDetailsComponent;
  let fixture: ComponentFixture<RfqDetailsComponent>;
  let rfqService: any;
  let toastr: any;
  let encryDecryService: any;

  const mockLoggedUserData = {
    details: {
      listofPermission: ['VIEW_RFQ_DETAILS']
    }
  };

  beforeEach(async () => {
    toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error')
    };

    rfqService = {
      getLineitemsById: jasmine.createSpy('getLineitemsById').and.returnValue(of([
        { description: 'Item 1', brand: 'Brand 1', category: 'Cat 1', itemCode: 'IC1', quantity: 10, unitofMeasures: 'PCS' }
      ]))
    };

    encryDecryService = {
      get: jasmine.createSpy('get').and.returnValue(JSON.stringify(mockLoggedUserData))
    };

    await TestBed.configureTestingModule({
      declarations: [RfqDetailsComponent],
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
      .overrideTemplate(RfqDetailsComponent, '')
      .overrideComponent(RfqDetailsComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(RfqDetailsComponent);
    component = fixture.componentInstance;
    component.rfqData = { rfquuid: 'rfq-uuid-100' };
  });

  it('should create and initialize permissions', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.loggedUserPermissions).toEqual(['VIEW_RFQ_DETAILS']);
  });

  it('should handle getRfqsList with array and non-array response', () => {
    component.getRfqsList();
    expect(rfqService.getLineitemsById).toHaveBeenCalledWith({ id: 'rfq-uuid-100' });
    expect(component.rfqdetailsList.length).toBe(1);

    // Non-array
    rfqService.getLineitemsById.and.returnValue(of(null));
    component.getRfqsList();
    expect(component.rfqdetailsList).toEqual([]);
  });

  it('should handle ngOnChanges with and without rfqId', () => {
    component.rfqId = 'rfq-uuid-100';
    component.ngOnChanges({ rfqId: new SimpleChange(null, 'rfq-uuid-100', true) });
    expect(rfqService.getLineitemsById).toHaveBeenCalled();

    component.rfqId = null;
    component.ngOnChanges({ rfqId: new SimpleChange('rfq-uuid-100', null, false) });
  });

  it('should handle getRFQs', () => {
    const row = { id: 'r1' };
    component.getRFQs(row, { srcElement: { lastChild: { data: 'rfq-1' } } });
    expect(component.selectedRFQData).toBe(row);
    expect(component.selectedData).toEqual([row]);
  });

  it('should cover no-change path and RFQ selection event', () => {
    component.rfqId = null;
    component.ngOnChanges(null);
    const row = { id: 'r1' };
    component.getRFQs(row, { srcElement: { lastChild: { data: 'rfq-2' } } });
    expect(component.selectedRFQData).toBe(row);
    expect(component.rfqId).toBe('rfq-2');
    component.getThirdTab({});
  });

  it('should ignore changes without an RFQ id', () => {
    component.rfqId = undefined;

    component.ngOnChanges({ rfqId: new SimpleChange('rfq-100', undefined, false) });

    expect(rfqService.getLineitemsById).not.toHaveBeenCalled();
  });
});