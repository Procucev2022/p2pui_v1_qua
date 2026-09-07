import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { swalConfirm } from 'src/app/shared/helpers/swal-confirm';
import { EditRfqByIdModalComponent } from './edit-rfq-by-id-modal.component';
import { defaultAppConfig } from 'src/testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { ToastrService } from 'ngx-toastr';
import { CreateRfqService } from 'src/app/layout/category-mgr/services/create-rfq.service';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';
import { EncryDecryService } from 'src/app/shared/services';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

describe('EditRfqByIdModalComponent', () => {
  let component: EditRfqByIdModalComponent;
  let fixture: ComponentFixture<EditRfqByIdModalComponent>;
  let toastr: any;
  let createRfqService: any;
  let convertSer: any;
  let encryDecryService: any;
  let dialogRef: any;
  let matDialog: any;

  const mockRfqData = {
    id: 'rfq-1',
    deliveryDate: new Date().toISOString(),
    projectDesc: 'Project Alpha',
    showItemsOnly: false,
    division: 'Division 1',
    rfqDocument: [{ fileName: 'spec.pdf' }],
    rfqItem: [
      { description: 'Laptop', brand: 'Dell', quantity: 5, unitofMeasures: 'PCS', category: 'IT' }
    ],
    vendors: [{ id: 'v1' }],
    clientdeliverylocationrfq: [
      { city: 'Mumbai', state: 'Maharashtra', pincode: '400001', isValidPincode: true }
    ]
  };

  const mockUserData = {
    details: {
      username: 'catmgr1',
      role: { roleName: 'CategoryManager' },
      listofPermission: ['EDIT_RFQ']
    }
  };

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');

    toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      warning: jasmine.createSpy('warning')
    };

    createRfqService = {
      getGMTDivisions: jasmine.createSpy('getGMTDivisions').and.returnValue(of(['Div 1', 'Div 2'])),
      getGMTCategories: jasmine.createSpy('getGMTCategories').and.returnValue(of(['Cat 1', 'Cat 2'])),
      getGMTCategoriesByDivision: jasmine.createSpy('getGMTCategoriesByDivision').and.returnValue(of(['Cat 1', 'Cat 3'])),
      editRFQByClient: jasmine.createSpy('editRFQByClient').and.returnValue(of({ status: 'Success', message: 'RFQ updated' })),
      onSaveAndSend: jasmine.createSpy('onSaveAndSend').and.returnValue(of({ status: 'Success', message: 'RFQ sent' }))
    };

    convertSer = {
      getBase64: jasmine.createSpy('getBase64').and.returnValue(Promise.resolve('data:application/pdf;base64,QUJD'))
    };

    encryDecryService = {
      get: jasmine.createSpy('get').and.returnValue(JSON.stringify(mockUserData))
    };

    dialogRef = {
      close: jasmine.createSpy('close'),
      updateSize: jasmine.createSpy('updateSize')
    };

    matDialog = {
      open: jasmine.createSpy('open').and.returnValue({
        close: jasmine.createSpy('close')
      })
    };

    await TestBed.configureTestingModule({
      declarations: [EditRfqByIdModalComponent],
      imports: [CommonModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => undefined, detectChanges: () => undefined } },
        {
          provide: MAT_DIALOG_SCROLL_STRATEGY,
          useValue: () => ({
            attach: () => undefined,
            enable: () => undefined,
            disable: () => undefined,
            detach: () => undefined
          })
        },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: JSON.parse(JSON.stringify(mockRfqData)) },
        { provide: ConvertToBase64Service, useValue: convertSer },
        { provide: CreateRfqService, useValue: createRfqService },
        { provide: ToastrService, useValue: toastr },
        { provide: MatDialog, useValue: matDialog },
        { provide: EncryDecryService, useValue: encryDecryService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(EditRfqByIdModalComponent, '')
      .overrideComponent(EditRfqByIdModalComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(EditRfqByIdModalComponent);
    component = fixture.componentInstance;
  });

  it('should create and initialize for CategoryManager and ClientInitiator', () => {
    // CategoryManager initialization
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(createRfqService.getGMTDivisions).toHaveBeenCalled();
    expect(createRfqService.getGMTCategories).toHaveBeenCalled();

    // ClientInitiator initialization
    component.roleName = 'ClientInitiator';
    component.loggedUserDetails.role.roleName = 'ClientInitiator';
    component.ngOnInit();
  });

  it('should use empty defaults for missing dates and service list responses', async () => {
    const noDateData = JSON.parse(JSON.stringify(mockRfqData));
    noDateData.deliveryDate = null;
    const noDateComponent = new EditRfqByIdModalComponent(
      dialogRef,
      encryDecryService,
      noDateData,
      convertSer,
      createRfqService,
      toastr,
      matDialog
    );
    expect(noDateComponent.viewRFQbyIDdetails.deliverDate1).toBe('');

    createRfqService.getGMTDivisions.and.returnValue(of(null));
    createRfqService.getGMTCategories.and.returnValue(of(null));
    createRfqService.getGMTCategoriesByDivision.and.returnValue(of(null));
    noDateComponent.ngOnInit();
    expect(noDateComponent.divisionsList).toEqual([]);
    expect(noDateComponent.categoryList).toEqual([]);
    noDateComponent.onChangeDivision(true);
    expect(noDateComponent.categoryList).toEqual([]);
  });

  it('should retain division category when the initial flag is true', () => {
    component.viewRFQbyIDdetails.category = 'Existing';
    component.onChangeDivision(true);
    expect(component.viewRFQbyIDdetails.category).toBe('Existing');
  });

  it('should handle dialog actions, zoomin, zoomout, and getImageURL', () => {
    component.closeDialog();
    expect(dialogRef.close).toHaveBeenCalledWith({ event: 'Cancel' });

    component.zoomout();
    expect(dialogRef.updateSize).toHaveBeenCalledWith('70%');
    component.zoomin();
    expect(dialogRef.updateSize).toHaveBeenCalledWith('90%');

    expect(component.getImageURL({ fileName: 'file.xlsx' })).toContain('export-excel.png');
    expect(component.getImageURL({ fileName: 'file.pdf' })).toContain('download-pdf.svg');
    expect(component.getImageURL({ fileName: 'file.png' })).toContain('download-img.png');
    expect(component.getImageURL({ fileName: 'file.docx' })).toContain('download-file.png');
  });

  it('should handle fileUploadEvent and onDeleteExistedAttachment', fakeAsync(() => {
    const file = new File(['data'], 'test.pdf', { type: 'application/pdf' });
    (window as any).event = {};
    component.fileUploadEvent([file]);
    tick();
    expect(component.commentFileData).toBe('QUJD');
    expect(component.commentFileType).toBe('test.pdf');
    expect(component.commentFilesDataList).toEqual([{ fileName: 'test.pdf', file: 'QUJD' }]);

    component.viewRFQbyIDdetails.rfqDocument = [{ name: 'doc1' }, { name: 'doc2' }];
    component.onDeleteExistedAttachment(0);
    expect(component.viewRFQbyIDdetails.rfqDocument.length).toBe(1);
    flush();
  }));

  it('should surface a synchronous file conversion failure and remove files', () => {
    const file = new File(['data'], 'broken.pdf', { type: 'application/pdf' });
    (window as any).event = {};
    convertSer.getBase64.and.callFake(() => {
      throw new Error('conversion failed');
    });

    expect(() => component.fileUploadEvent([file])).toThrowError('conversion failed');
    component.commentFileData = 'encoded';
    component.commentFileType = 'broken.pdf';
    component.commentFilesDataList = [{ fileName: 'broken.pdf' }];
    component.removeFile(0);
    expect(component.commentFileData).toBeNull();
    expect(component.commentFileType).toBeNull();
    expect(component.commentFilesDataList).toEqual([]);
  });

  it('should cover autocomplete null entries and non-string queries', () => {
    component.categoryList = [null, 'Laptops', undefined, 'Servers'];
    component.filterAutoCompleteData({ query: 'lap' }, 'categoryList', 'filtered_categoryList', true);
    expect(component.filtered_categoryList).toEqual(['Laptops']);

    component.categoryList = ['1', '10', '20'];
    component.filterAutoCompleteData({ query: 1 }, 'categoryList', 'filtered_categoryList', false);
    expect(component.filtered_categoryList).toEqual(['1', '10']);
  });

  it('should handle pincode status updates and every drag/drop handler', () => {
    component.onupdatePincodeValidationStatus({ pincodeIsValid: false, pincode: '400002' }, 0);
    expect(component.viewRFQbyIDdetails.clientdeliverylocationrfq[0].isValidPincode).toBeFalse();
    expect(component.viewRFQbyIDdetails.clientdeliverylocationrfq[0].pincode).toBe('400002');
    component.onupdatePincodeValidationStatus({ pincodeIsValid: true, pincode: '560001', state: 'Karnataka', city: 'Bengaluru' }, 0);
    expect(component.viewRFQbyIDdetails.clientdeliverylocationrfq[0].isValidPincode).toBeTrue();
    expect(component.viewRFQbyIDdetails.clientdeliverylocationrfq[0].pincode).toBe('560001');
    expect(component.viewRFQbyIDdetails.clientdeliverylocationrfq[0].state).toBe('Karnataka');
    expect(component.viewRFQbyIDdetails.clientdeliverylocationrfq[0].city).toBe('Bengaluru');

    const dragOverEvent: any = { preventDefault: jasmine.createSpy('preventDefault') };
    const dragEnterEvent: any = { preventDefault: jasmine.createSpy('preventDefault') };
    const dragEndEvent: any = { preventDefault: jasmine.createSpy('preventDefault') };
    const dragLeaveEvent: any = { preventDefault: jasmine.createSpy('preventDefault') };
    component.onDragOver(dragOverEvent);
    expect(component.dragAreaClass).toBe('droparea');
    expect(dragOverEvent.preventDefault).toHaveBeenCalled();
    component.onDragEnter(dragEnterEvent);
    expect(component.dragAreaClass).toBe('droparea');
    expect(dragEnterEvent.preventDefault).toHaveBeenCalled();
    component.onDragEnd(dragEndEvent);
    expect(component.dragAreaClass).toBe('dragarea');
    expect(dragEndEvent.preventDefault).toHaveBeenCalled();
    component.onDragLeave(dragLeaveEvent);
    expect(component.dragAreaClass).toBe('dragarea');
    expect(dragLeaveEvent.preventDefault).toHaveBeenCalled();

    const file = new File(['data'], 'drop.pdf', { type: 'application/pdf' });
    const uploadSpy = spyOn(component, 'fileUploadEvent');
    const dropEvent: any = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation'),
      dataTransfer: { files: [file] }
    };
    component.onDrop(dropEvent);
    expect(component.dragAreaClass).toBe('dragarea');
    expect(dropEvent.preventDefault).toHaveBeenCalled();
    expect(dropEvent.stopPropagation).toHaveBeenCalled();
    expect(uploadSpy).toHaveBeenCalledWith(dropEvent.dataTransfer.files);

    const emptyDropEvent: any = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation'),
      dataTransfer: { files: null }
    };
    component.onDrop(emptyDropEvent);
    expect(uploadSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle saveAndAccept with validations, success, and error paths', () => {
    component.ngOnInit();

    // Missing projectDesc
    component.viewRFQbyIDdetails.projectDesc = '';
    component.saveAndAccept();
    expect(toastr.warning).toHaveBeenCalledWith('Please Enter Project Description/Reference', 'Warning');

    // Missing item category
    component.viewRFQbyIDdetails.projectDesc = 'Desc';
    component.viewRFQbyIDdetails.rfqItem = [{ category: '' }];
    component.saveAndAccept();
    expect(toastr.warning).toHaveBeenCalledWith('Please enter Category for all items', 'Warning');

    // Success path
    component.viewRFQbyIDdetails.rfqItem = [{ category: 'Hardware' }];
    component.saveAndAccept();
    expect(createRfqService.editRFQByClient).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('RFQ updated', 'Success');
    expect(dialogRef.close).toHaveBeenCalledWith({ success: true });

    // Failure path
    createRfqService.editRFQByClient.and.returnValue(of({ status: 'Failed', message: 'Update failed' }));
    component.saveAndAccept();
    expect(toastr.error).toHaveBeenCalledWith('Update failed', 'Failed');
  });

  it('should handle save paths for a client and edge vendor values', () => {
    component.ngOnInit();
    component.loggedUserDetails.role.roleName = 'ClientInitiator';
    component.roleName = 'ClientInitiator';
    component.viewRFQbyIDdetails.projectDesc = 'Desc';
    component.viewRFQbyIDdetails.rfqItem = [{ category: 'Hardware' }];
    component.viewRFQbyIDdetails.vendors = undefined;
    component.onSaveAndSend();
    expect(toastr.warning).toHaveBeenCalledWith('Without  Vendor assignment, Not able to send RFQ', 'Warning');

    component.viewRFQbyIDdetails.vendors = [{ id: 'v1' }];
    component.onSaveAndSend();
    expect(createRfqService.onSaveAndSend).toHaveBeenCalled();
    expect(component.viewRFQbyIDdetails.fromClient).toBeTrue();

    component.viewRFQbyIDdetails.rfqItem = [{
      description: 'Item', brand: 'Brand', quantity: 5, unitofMeasures: 'PCS', category: 'Hardware'
    }];
    component.viewRFQbyIDdetails.clientdeliverylocationrfq = [
      { city: 'Mumbai', state: 'Maharashtra', pincode: '400001', isValidPincode: true }
    ];
    createRfqService.editRFQByClient.and.returnValue(of({ status: 'Success', message: 'Client update' }));
    component.onSaveRFQByClientInitiator();
    expect(toastr.success).toHaveBeenCalledWith('Client update', 'Success');
  });

  it('should handle onSaveAndSend success and error paths', () => {
    component.ngOnInit();
    component.viewRFQbyIDdetails.projectDesc = '';
    component.onSaveAndSend();
    expect(toastr.warning).toHaveBeenCalledWith('Please Enter Project Description/Reference', 'Warning');

    component.viewRFQbyIDdetails.projectDesc = 'Desc';
    component.viewRFQbyIDdetails.rfqItem = [{ category: '' }];
    component.onSaveAndSend();
    expect(toastr.warning).toHaveBeenCalledWith('Please enter Category for all items', 'Warning');

    component.viewRFQbyIDdetails.rfqItem = [{ category: 'Hardware' }];
    component.viewRFQbyIDdetails.vendors = [];
    component.onSaveAndSend();
    expect(toastr.warning).toHaveBeenCalledWith('Without  Vendor assignment, Not able to send RFQ', 'Warning');

    component.viewRFQbyIDdetails.vendors = [{ id: 'v1' }];
    component.onSaveAndSend();
    expect(createRfqService.onSaveAndSend).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('RFQ sent', 'Success');

    createRfqService.onSaveAndSend.and.returnValue(of({ status: 'Failed', message: 'Send failed' }));
    component.onSaveAndSend();
    expect(toastr.error).toHaveBeenCalledWith('Send failed', 'Failed');
  });

  it('should report every item and delivery-location validation failure', () => {
    const validItem = { description: 'Item', brand: 'Brand', quantity: 5, unitofMeasures: 'PCS' };
    const validLocation = { city: 'Mumbai', state: 'Maharashtra', pincode: '400001', isValidPincode: true };
    const expectWarning = (item: any, location: any, message: string) => {
      component.viewRFQbyIDdetails.projectDesc = 'Valid Desc';
      component.viewRFQbyIDdetails.rfqItem = [item];
      component.viewRFQbyIDdetails.clientdeliverylocationrfq = [location];
      toastr.warning.calls.reset();
      expect(component.isValidationPassed()).toBeFalse();
      expect(toastr.warning).toHaveBeenCalledWith(message, 'Warning');
    };

    component.viewRFQbyIDdetails.projectDesc = '';
    expect(component.isValidationPassed()).toBeFalse();
    expect(toastr.warning).toHaveBeenCalledWith('Please Enter Project Description/Reference', 'Warning');

    expectWarning({ description: '', brand: 'Brand', quantity: 5, unitofMeasures: 'PCS' }, validLocation,
      'Please Enter all fields for all items');
    expectWarning({ ...validItem, quantity: -1 }, validLocation,
      'Please Enter valid Quantity for all items');
    expectWarning({ ...validItem, quantity: 'not-a-number' }, validLocation,
      'Please Enter valid Quantity for all items');
    expectWarning({ ...validItem, description: 123 }, validLocation,
      'Please Enter valid Description for all items');
    expectWarning({ ...validItem, brand: 123 }, validLocation,
      'Please Enter valid Specification for all items');
    expectWarning({ ...validItem, unitofMeasures: 10 }, validLocation,
      'Please Enter valid UOM for all items');
    expectWarning({ ...validItem, unitofMeasures: 'PCS2' }, validLocation,
      'Please Enter valid UOM for all items');
    expectWarning(validItem, { ...validLocation, city: 123 }, 'Please Enter valid City for all Delivery Location');
    expectWarning(validItem, { ...validLocation, state: 123 }, 'Please Enter valid State for all Delivery Location');
    expectWarning(validItem, { ...validLocation, pincode: '' },
      'Please Enter valid Pincode for all Delivery Location');
    expectWarning(validItem, { ...validLocation, pincode: '400001', isValidPincode: false },
      'Please Validate Pincode for all Delivery Location');
    expectWarning(validItem, { ...validLocation, pincode: '012345' },
      'Please Enter valid Pincode for all Delivery Locations');
    expectWarning(validItem, { ...validLocation, pincode: '111111' },
      'Same digit repeated, Please enter a valid Pincode for all Delivery Locations');

    component.viewRFQbyIDdetails.rfqItem = [validItem];
    component.viewRFQbyIDdetails.clientdeliverylocationrfq = [validLocation];
    expect(component.isValidationPassed()).toBeTrue();
  });

  it('should handle onSaveRFQByClientInitiator validation and service failure', () => {
    component.ngOnInit();
    component.viewRFQbyIDdetails.projectDesc = '';
    component.onSaveRFQByClientInitiator();
    expect(createRfqService.editRFQByClient).not.toHaveBeenCalled();

    component.viewRFQbyIDdetails.projectDesc = 'Valid Desc';
    component.viewRFQbyIDdetails.rfqItem = [{ description: 'Item', brand: 'Brand', quantity: 5, unitofMeasures: 'PCS' }];
    component.viewRFQbyIDdetails.clientdeliverylocationrfq = [
      { city: 'Mumbai', state: 'Maharashtra', pincode: '400001', isValidPincode: true }
    ];
    createRfqService.editRFQByClient.and.returnValue(of({ status: 'Failed', message: 'Client save failed' }));
    component.onSaveRFQByClientInitiator();
    expect(toastr.error).toHaveBeenCalledWith('Client save failed', 'Failed');
  });

  it('should handle closeModal confirmation and cancellation branches', fakeAsync(() => {
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));
    component.closeModal();
    tick();
    expect(dialogRef.close).toHaveBeenCalled();
  }));

  it('should not close when close confirmation is declined', fakeAsync(() => {
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: false }));
    component.closeModal();
    tick();
    expect(dialogRef.close).not.toHaveBeenCalled();
  }));

  it('should handle category dialog empty values and optional dialog references', () => {
    component.closeModalItemModal();
    expect(matDialog.open).not.toHaveBeenCalled();

    component.onSelectCategoryModal({ category: '' }, 0, {} as TemplateRef<any>);
    expect(component.selectedItemCategory).toBe('');
    expect(matDialog.open).toHaveBeenCalled();

    const itemDialogClose = jasmine.createSpy('itemDialogClose');
    component.itemDialogRef = { close: itemDialogClose } as any;
    component.closeModalItemModal();
    expect(itemDialogClose).toHaveBeenCalled();

    component.selectedItemCategory = '  ';
    component.saveCategory();
    expect(toastr.warning).toHaveBeenCalledWith('Please select Category', 'Warning');

    component.selectedItemCategory = 'Hardware';
    component.selectedItemIndex = 0;
    component.saveCategory();
    expect(component.viewRFQbyIDdetails.rfqItem[0].category).toBe('Hardware');
    expect(itemDialogClose).toHaveBeenCalled();
  });

  it('should return true for isEmailRfq only when sourceType is EMAIL', () => {
    component.viewRFQbyIDdetails.sourceType = 'EMAIL';
    expect(component.isEmailRfq()).toBeTrue();

    component.viewRFQbyIDdetails.sourceType = 'email';
    expect(component.isEmailRfq()).toBeTrue();

    component.viewRFQbyIDdetails.sourceType = 'PORTAL';
    expect(component.isEmailRfq()).toBeFalse();

    component.viewRFQbyIDdetails.sourceType = 'WhatsApp';
    expect(component.isEmailRfq()).toBeFalse();

    component.viewRFQbyIDdetails.sourceType = null;
    expect(component.isEmailRfq()).toBeFalse();
  });
});
