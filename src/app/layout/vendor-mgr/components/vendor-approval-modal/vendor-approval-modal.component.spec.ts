import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { swalConfirm } from 'src/app/shared/helpers/swal-confirm';
import { VendorApprovalModalComponent } from './vendor-approval-modal.component';
import { defaultAppConfig } from 'src/testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { VendorNamesService } from '../../services/vendor-names.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule, FormBuilder, NgForm } from '@angular/forms';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('VendorApprovalModalComponent', () => {
  let component: VendorApprovalModalComponent;
  let fixture: ComponentFixture<VendorApprovalModalComponent>;
  let vendorApprovalSer: any;
  let toastr: any;
  let dialogRef: any;

  const mockData = {
    id: 'v-100',
    pan: 'ABCDE1234F',
    action: 'Approve'
  };

  beforeEach(async () => {
    toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      warning: jasmine.createSpy('warning')
    };

    vendorApprovalSer = {
      getProductsByVendor: jasmine.createSpy('getProductsByVendor').and.returnValue(of([{ id: 'p1', productName: 'Prod 1' }])),
      getServicesByVendor: jasmine.createSpy('getServicesByVendor').and.returnValue(of([{ id: 's1', serviceName: 'Serv 1' }])),
      getVendorClassificationDataForServices: jasmine.createSpy('getVendorClassificationDataForServices').and.returnValue(of(['Sec 1', 'Sec 2'])),
      getVendorOrClientByType: jasmine.createSpy('getVendorOrClientByType').and.returnValue(of([{ name: 'Manufacturer' }])),
      getVendorClassificationData: jasmine.createSpy('getVendorClassificationData').and.returnValue(of(['Seg 1', 'Seg 2'])),
      approveVendorRegistration: jasmine.createSpy('approveVendorRegistration').and.returnValue(of({ status: 'Success', message: 'Approved' }))
    };

    dialogRef = {
      close: jasmine.createSpy('close')
    };

    await TestBed.configureTestingModule({
      declarations: [VendorApprovalModalComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => undefined, detectChanges: () => undefined } },
        DatePipe,
        { provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: () => ({ attach: () => undefined, enable: () => undefined, disable: () => undefined, detach: () => undefined }) },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: VendorNamesService, useValue: vendorApprovalSer },
        { provide: ToastrService, useValue: toastr },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(VendorApprovalModalComponent, '')
      .overrideComponent(VendorApprovalModalComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(VendorApprovalModalComponent);
    component = fixture.componentInstance;
  });

  it('should create and initialize dropdowns and products/services', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(vendorApprovalSer.getProductsByVendor).toHaveBeenCalledWith({ id: 'v-100' });
    expect(vendorApprovalSer.getServicesByVendor).toHaveBeenCalledWith({ id: 'v-100' });
    expect(component.productsData.length).toBe(1);
    expect(component.servicesData.length).toBe(1);
  });

  it('should handle adding, removing, and selectChangeHandler for products and services', () => {
    component.ngOnInit();

    // Adding and removing service
    component.adding(0);
    expect(component.approvalListForServices.length).toBe(2);
    component.removing(1);
    expect(component.approvalListForServices.length).toBe(1);

    // Add and remove product
    component.add(0, 'Product');
    expect(component.approvalList.length).toBe(2);
    component.remove(1);
    expect(component.approvalList.length).toBe(1);

    // selectChangeHandler Product and Service
    component.selectChangeHandler({ target: { value: 'Product' } }, 0, 'Product');
    expect(component.selectedProductor_Service).toBe('Product');

    component.selectChangeHandler({ target: { value: 'Service' } }, 0, 'Service');
    expect(component.selectedProductor_Service).toBe('Service');
  });

  it('should handle cascading dropdown lookups for Services (getHeadings, getGroupDescriptions, getSacs, getSacCode, onSectionChange, onHeadingChange, onGroupDescriptionChange, onSacChange)', () => {
    component.ngOnInit();

    component.getHeadings('Sec 1', 0);
    expect(component.approvalList[0].headings).toEqual(['Sec 1', 'Sec 2']);

    component.getGroupDescriptions('Head 1', 'Sec 1', 0);
    expect(component.approvalList[0].groupdescriptions).toEqual(['Sec 1', 'Sec 2']);

    component.getSacs('Grp 1', 'Sec 1', 'Head 1', 0);
    expect(component.approvalList[0].sacs).toBeDefined();

    component.getSacCode('Sac 1', 'Sec 1', 'Head 1', 'Grp 1', 0);

    component.onSectionChange('Sec 1', 0);
    expect(component.sacCodeed).toBeTrue();
    component.onSectionChange(undefined, 0);
    expect(component.sacCodeed).toBeFalse();

    component.onHeadingChange('Head 1', 'Sec 1', 0);
    component.onGroupDescriptionChange('Grp 1', 'Sec 1', 'Head 1', 0);
    component.onSacChange('Sac 1', 'Sec 1', 'Head 1', 'Grp 1', 0);
  });

  it('should handle cascading dropdown lookups for Products (getFamilies, getClasses, getCommodities, getHsnCodes, onSegmentChange, onFamilyChange, onClassChange, onCommodityChange)', () => {
    component.ngOnInit();

    component.getFamilyNames('Seg 1', 0);
    component.getClassNames('Fam 1', 'Seg 1', 0);
    component.getCommodityNames('Class 1', 'Fam 1', 'Seg 1', 0);
    component.getHsnCode('Comm 1', 'Class 1', 'Fam 1', 'Seg 1', 0);

    component.onSegmentChange('Seg 1', 0);
    expect(component.hsnCodeed).toBeTrue();
    component.onSegmentChange(undefined, 0);
    expect(component.hsnCodeed).toBeFalse();

    component.onFamilyChange('Fam 1', 'Seg 1', 0);
    component.onClassChange('Class 1', 'Fam 1', 'Seg 1', 0);
    component.onCommodityChange('Comm 1', 'Class 1', 'Fam 1', 'Seg 1', 0);
  });

  it('should handle onSacCoded and onHsnCoded with data and error codes', () => {
    component.classificationList = [
      { typeName: 'Service', sacCode: '123' },
      { typeName: 'Product', hsnCode: '456' }
    ];

    // onSacCoded with success array
    vendorApprovalSer.getVendorClassificationDataForServices.and.returnValue(of(['Sec', 'Head', 'Grp', 'Sac']));
    component.onSacCoded();
    expect(component.classificationList[0].section).toBe('Sec');

    // onSacCoded with error code
    vendorApprovalSer.getVendorClassificationDataForServices.and.returnValue(of({ errorCode: '404' }));
    component.onSacCoded();
    expect(component.classificationList[0].section).toEqual([]);

    // onHsnCoded with success array
    vendorApprovalSer.getVendorClassificationData.and.returnValue(of(['Seg', 'Fam', 'Class', 'Comm']));
    component.onHsnCoded();
    expect(component.classificationList[1].segmentName).toBe('Seg');

    // onHsnCoded with error code
    vendorApprovalSer.getVendorClassificationData.and.returnValue(of({ errorCode: '404' }));
    component.onHsnCoded();
    expect(component.classificationList[1].segmentName).toEqual([]);
  });

  it('should handle onSubmit with approval and rejection callbacks', fakeAsync(() => {
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));

    component.classificationList = [
      { typeName: 'Product', segmentName: 'Seg 1', hsnCode: '111' },
      { typeName: 'Service', section: 'Sec 1', sacCode: '222' }
    ];
    component.vendorType = 'Others';
    component.others = 'Custom Type';
    component.eagerNess = 'High';

    // Submit success
    component.onSubmit({} as NgForm, 'Product');
    tick();
    expect(vendorApprovalSer.approveVendorRegistration).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('Approved', 'Success');
    expect(dialogRef.close).toHaveBeenCalledWith({ event: 'submit' });

    // Submit failure
    vendorApprovalSer.approveVendorRegistration.and.returnValue(of({ status: 'Failure', errorMessage: 'Approval failed' }));
    component.onSubmit({} as NgForm, 'Product');
    tick();
    expect(toastr.error).toHaveBeenCalledWith('Approval failed', 'Failure');

    // Dismiss callback
    (swalConfirm.open as jasmine.Spy).and.returnValue(Promise.resolve({ dismiss: 'cancel' }));
    component.onSubmit({} as NgForm, 'Product');
    tick();

    // Required fields warning
    component.classificationList = [];
    component.onSubmit({} as NgForm, 'Product');
    expect(toastr.error).toHaveBeenCalledWith('Please select the required field', 'Warning');

    flush();
  }));

  it('should handle resetPanel', () => {
    component.resetPanel();
    expect(component.hsnCodeed).toBeFalse();
    expect(component.sacCodeed).toBeFalse();
    expect(component.approvalList.length).toBe(1);
    expect(component.classificationList.length).toBe(1);
  });
});
