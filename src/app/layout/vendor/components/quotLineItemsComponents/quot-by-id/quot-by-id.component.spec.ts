import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef, SimpleChange } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { QuotByIdComponent } from './quot-by-id.component';
import { defaultAppConfig } from 'src/testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { VendorQuotService } from '../../../services/vendor-quot.service';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';

describe('QuotByIdComponent', () => {
  let component: QuotByIdComponent;
  let fixture: ComponentFixture<QuotByIdComponent>;
  let vendorquotService: any;
  let toastr: any;
  let encryDecryService: any;

  const mockLoggedUserData = {
    details: {
      listofPermission: ['VIEW_QUOTATION']
    }
  };

  beforeEach(async () => {
    toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error')
    };

    vendorquotService = {
      getQuotDataByid: jasmine.createSpy('getQuotDataByid').and.returnValue(of([{ id: '1', description: 'Item 1' }]))
    };

    encryDecryService = {
      get: jasmine.createSpy('get').and.returnValue(JSON.stringify(mockLoggedUserData))
    };

    await TestBed.configureTestingModule({
      declarations: [QuotByIdComponent],
      imports: [CommonModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => undefined, detectChanges: () => undefined } },
        DatePipe,
        { provide: VendorQuotService, useValue: vendorquotService },
        { provide: ToastrService, useValue: toastr },
        { provide: EncryDecryService, useValue: encryDecryService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(QuotByIdComponent, '')
      .overrideComponent(QuotByIdComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(QuotByIdComponent);
    component = fixture.componentInstance;
    component.quotData = { id: 'quot-100' };
  });

  it('should create and initialize permissions', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.loggedUserPermissions).toEqual(['VIEW_QUOTATION']);
  });

  it('should handle getQuotInfo with success array and error response', () => {
    component.getQuotInfo();
    expect(vendorquotService.getQuotDataByid).toHaveBeenCalledWith({ id: 'quot-100' });
    expect(component.quotInfoList.length).toBe(1);

    // Error response
    vendorquotService.getQuotDataByid.and.returnValue(of(null));
    component.getQuotInfo();
    expect(toastr.error).toHaveBeenCalledWith('Failed');
    expect(component.quotInfoList).toEqual([]);
  });

  it('should handle ngOnChanges with and without quotId', () => {
    component.quotId = 'quot-100';
    component.ngOnChanges({ quotId: new SimpleChange(null, 'quot-100', true) });
    expect(vendorquotService.getQuotDataByid).toHaveBeenCalled();

    component.quotId = null;
    component.ngOnChanges({ quotId: new SimpleChange('quot-100', null, false) });
  });
});
