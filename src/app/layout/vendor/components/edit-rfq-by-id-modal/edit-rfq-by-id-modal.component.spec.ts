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
        { provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: () => ({ attach: () => undefined, enable: () => undefined, disable: () => undefined, detach: () => undefined }) },
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

  it('should handle onChangeDivision and filterAutoCompleteData', () => {
    component.onChangeDivision(false);
    expect(createRfqService.getGMTCategoriesByDivision).toHaveBeenCalled();
    expect(component.categoryList).toEqual(['Cat 1', 'Cat 3']);

    component.onChangeDivision(true);

    component.categoryList = ['Laptops', 'Servers', 'Desktops'];
    component.filterAutoCompleteData({ query: 'lap' }, 'categoryList', 'filtered_categoryList', true);
    expect(component.filtered_categoryList).toEqual(['Laptops']);
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
    component.fileUploadEvent([file]);
    tick();
    expect(component.commentFilesDataList.length).toBe(1);

    component.viewRFQbyIDdetails.rfqDocument = [{ name: 'doc1' }, { name: 'doc2' }];
    component.onDeleteExistedAttachment(0);
    expect(component.viewRFQbyIDdetails.rfqDocument.length).toBe(1);
    flush();
  }));

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

  it('should handle onSaveAndSend with validations, success, and error paths', () => {
    component.ngOnInit();

    // Missing projectDesc
    component.viewRFQbyIDdetails.projectDesc = '';
    component.onSaveAndSend();
    expect(toastr.warning).toHaveBeenCalledWith('Please Enter Project Description/Reference', 'Warning');

    // Missing category
    component.viewRFQbyIDdetails.projectDesc = 'Desc';
    component.viewRFQbyIDdetails.rfqItem = [{ category: '' }];
    component.onSaveAndSend();

    // Missing vendors
    component.viewRFQbyIDdetails.rfqItem = [{ category: 'Hardware' }];
    component.viewRFQbyIDdetails.vendors = [];
    component.onSaveAndSend();
    expect(toastr.warning).toHaveBeenCalledWith('Without  Vendor assignment, Not able to send RFQ', 'Warning');

    // Success path
    component.viewRFQbyIDdetails.vendors = [{ id: 'v1' }];
    component.onSaveAndSend();
    expect(createRfqService.onSaveAndSend).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('RFQ sent', 'Success');

    // Failure path
    createRfqService.onSaveAndSend.and.returnValue(of({ status: 'Failed', message: 'Send failed' }));
    component.onSaveAndSend();
    expect(toastr.error).toHaveBeenCalledWith('Send failed', 'Failed');
  });

  it('should handle onSaveRFQByClientInitiator and isValidationPassed', () => {
    component.ngOnInit();

    // Invalid validation
    component.viewRFQbyIDdetails.projectDesc = '';
    component.onSaveRFQByClientInitiator();
    expect(createRfqService.editRFQByClient).not.toHaveBeenCalled();

    // Validation checks for items and delivery locations
    component.viewRFQbyIDdetails.projectDesc = 'Valid Desc';
    component.viewRFQbyIDdetails.rfqItem = [
      { description: 'Item 1', brand: 'Brand 1', quantity: 0, unitofMeasures: 'PCS' }
    ];
    expect(component.isValidationPassed()).toBeFalse();

    component.viewRFQbyIDdetails.rfqItem = [
      { description: 'Item 1', brand: 'Brand 1', quantity: 5, unitofMeasures: '10PCS' }
    ];
    expect(component.isValidationPassed()).toBeFalse();

    component.viewRFQbyIDdetails.rfqItem = [
      { description: 'Item 1', brand: 'Brand 1', quantity: 5, unitofMeasures: 'PCS' }
    ];
    component.viewRFQbyIDdetails.clientdeliverylocationrfq = [
      { city: 'Mumbai', state: 'Maharashtra', pincode: '111111', isValidPincode: true }
    ];
    expect(component.isValidationPassed()).toBeFalse(); // Repeated digits

    component.viewRFQbyIDdetails.clientdeliverylocationrfq = [
      { city: 'Mumbai', state: 'Maharashtra', pincode: '400001', isValidPincode: true }
    ];
    expect(component.isValidationPassed()).toBeTrue();

    // Successful save
    component.onSaveRFQByClientInitiator();
    expect(createRfqService.editRFQByClient).toHaveBeenCalled();
  });

  it('should handle closeModal with confirmation', fakeAsync(() => {
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));
    component.closeModal();
    tick();
    expect(dialogRef.close).toHaveBeenCalled();
  }));

  it('should handle onSelectCategoryModal, closeModalItemModal, and saveCategory', () => {
    const item = { category: 'IT' };
    component.onSelectCategoryModal(item, 0, {} as TemplateRef<any>);
    expect(matDialog.open).toHaveBeenCalled();

    // saveCategory success
    component.selectedItemCategory = 'Hardware';
    component.saveCategory();
    expect(component.viewRFQbyIDdetails.rfqItem[0].category).toBe('Hardware');

    // saveCategory warning
    component.selectedItemCategory = '';
    component.saveCategory();
    expect(toastr.warning).toHaveBeenCalledWith('Please select Category', 'Warning');

    component.closeModalItemModal();
  });
});
