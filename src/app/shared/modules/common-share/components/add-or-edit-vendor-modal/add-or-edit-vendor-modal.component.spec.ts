import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { AddOrEditVendorModalComponent } from './add-or-edit-vendor-modal.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { EncryDecryService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { VendorReqService } from '../../../../../layout/vendor-request/services/vendor-req.service';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('AddOrEditVendorModalComponent', () => {
  let component: AddOrEditVendorModalComponent;
  let fixture: ComponentFixture<AddOrEditVendorModalComponent>;
  let encry: any;
  let toaster: any;
  let vendorReqService: any;
  let dialogRef: any;
  let convertSer: any;

  function setupRole(roleName: string, data: any = null) {
    encry.get.and.returnValue(
      JSON.stringify({ details: { role: { roleName } } })
    );
    // recreate component with new data via assignment
    (component as any).data = data;
  }

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('userFullName', 'Tester');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    encry = autoMock('EncryDecryService');
    toaster = autoMock('ToastrService');
    vendorReqService = autoMock('VendorReqService');
    dialogRef = autoMock('MatDialogRef');
    convertSer = autoMock('ConvertToBase64Service');
    encry.get.and.returnValue(
      JSON.stringify({ details: { role: { roleName: 'VendorManager' } } })
    );
    convertSer.getBase64.and.returnValue(Promise.resolve('data:application/vnd;base64,QQ=='));
    vendorReqService.createPreVendorDetails.and.returnValue(of({ status: 'Success', message: 'ok' }));
    vendorReqService.createVendorByExecutive.and.returnValue(of({ status: 'Success', message: 'ok' }));
    vendorReqService.editPreVendorDetails.and.returnValue(of({ status: 'Success', message: 'ok' }));
    vendorReqService.createClientVendorsDetails.and.returnValue(of({ status: 'Success', message: 'ok' }));

    await TestBed.configureTestingModule({
      declarations: [AddOrEditVendorModalComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: autoMock('ChangeDetectorRef') },
        DatePipe,
        FormBuilder,
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
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: EncryDecryService, useValue: encry },
        { provide: ToastrService, useValue: toaster },
        { provide: MatDialog, useValue: autoMock('MatDialog') },
        { provide: VendorReqService, useValue: vendorReqService },
        { provide: ConvertToBase64Service, useValue: convertSer },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(AddOrEditVendorModalComponent, '')
      .overrideComponent(AddOrEditVendorModalComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(AddOrEditVendorModalComponent);
    component = fixture.componentInstance;
    seedComponent(component as any);
  });

  it('should init new vendor VendorManager and VendorManager3 and edit', () => {
    component.data = null;
    component.ngOnInit();
    expect(component.isNewVendor).toBe(true);
    expect(component.vendoryEntryType).toBe('singleEntry');
    expect(component.f.companyName).toBeTruthy();

    encry.get.and.returnValue(
      JSON.stringify({ details: { role: { roleName: 'VendorManager3' } } })
    );
    component.data = null;
    component.ngOnInit();
    expect(component.vendoryEntryType).toBe('bulkEntry');

    encry.get.and.returnValue(
      JSON.stringify({ details: { role: { roleName: 'VendorManager' } } })
    );
    component.data = {
      id: 'v1',
      email: 'e@x.com',
      organizationPhonenumber: '9',
      vendorcategory: 'c',
      subCategory: 's',
      city: 'Hyd',
      hsncode: 'h',
    };
    component.ngOnInit();
    expect(component.isNewVendor).toBe(false);
    expect(component.vendorForm.value.city).toBe('Hyd');
  });

  it('should save single new VendorManager success failure and executive', () => {
    component.data = null;
    component.ngOnInit();
    component.saveVendor();
    expect(toaster.warning).toHaveBeenCalled();

    component.vendorForm.setValue({
      companyName: 'C',
      email: 'e@x.com',
      organizationPhonenumber: '9',
      city: 'Hyd',
      contactPerson: 'P',
      vendorcategory: 'cat',
      subCategory: 'sub',
      hsncode: 'h',
      website: 'w',
    });
    component.saveVendor();
    expect(dialogRef.close).toHaveBeenCalled();

    vendorReqService.createPreVendorDetails.and.returnValue(
      of({ status: 'Failure', errorMessage: 'bad' })
    );
    component.saveVendor();
    expect(toaster.error).toHaveBeenCalled();

    component.loggedUserDetails = 'Other';
    vendorReqService.createVendorByExecutive.and.returnValue(of({ status: 'Success', message: 'ok' }));
    component.saveVendor();
    vendorReqService.createVendorByExecutive.and.returnValue(
      of({ status: 'Failure', errorMessage: 'bad2' })
    );
    component.saveVendor();
  });

  it('should edit vendor and bulk entry paths', () => {
    component.data = {
      id: 'v1',
      email: 'e@x.com',
      organizationPhonenumber: '9',
      vendorcategory: 'c',
      subCategory: 's',
      city: 'Hyd',
      hsncode: 'h',
    };
    component.ngOnInit();
    component.saveVendor();
    expect(vendorReqService.editPreVendorDetails).toHaveBeenCalled();

    vendorReqService.editPreVendorDetails.and.returnValue(
      of({ status: 'Failure', errorMessage: 'e' })
    );
    component.saveVendor();

    component.vendoryEntryType = 'bulkEntry';
    component.boqFile = null;
    component.saveVendor();
    expect(toaster.warning).toHaveBeenCalled();

    component.boqFile = { fileName: 'a.xlsx', file: 'AAA' };
    component.loggedUserDetails = 'VendorManager';
    vendorReqService.createPreVendorDetails.and.returnValue(of({ status: 'Success', message: 'ok' }));
    component.saveVendor();

    vendorReqService.createPreVendorDetails.and.returnValue(
      of({ status: 'Failure', errorMessage: 'f' })
    );
    component.saveVendor();

    component.loggedUserDetails = 'VendorManager3';
    vendorReqService.createClientVendorsDetails.and.returnValue(of({ status: 'Success', message: 'ok' }));
    component.saveVendor();
    vendorReqService.createClientVendorsDetails.and.returnValue(
      of({ status: 'Failure', errorMessage: 'f2' })
    );
    component.saveVendor();

    component.loggedUserDetails = 'Exec';
    vendorReqService.createVendorByExecutive.and.returnValue(of({ status: 'Success', message: 'ok' }));
    component.saveVendor();
    vendorReqService.createVendorByExecutive.and.returnValue(
      of({ status: 'Failure', errorMessage: 'f3' })
    );
    component.saveVendor();
  });

  it('should upload reset remove and type change', async () => {
    component.data = null;
    component.ngOnInit();
    component.onVendorTypeChange();
    component.reset();
    expect(component.f).toBeTruthy();

    const bad = { target: { files: [{ name: 'a.pdf' }] } };
    component.uploadBOQFile(bad);
    expect(toaster.warning).toHaveBeenCalled();

    await component.uploadBOQFile({ target: { files: [{ name: 'a.XLSX' }] } });
    expect(component.boqFile.fileName).toBe('a.XLSX');
    component.removeFile();
    expect(component.boqFile).toBeNull();
  });
});
