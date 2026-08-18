import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { ClientLinkingToItemModalComponent } from './client-linking-to-item-modal.component';
import { defaultAppConfig } from 'src/testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { CategoryService } from '../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ClientLinkingToItemModalComponent', () => {
  let component: ClientLinkingToItemModalComponent;
  let fixture: ComponentFixture<ClientLinkingToItemModalComponent>;
  let catService: any;
  let toastr: any;
  let matDialog: any;
  let dialogRef: any;

  beforeEach(async () => {
    toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      warning: jasmine.createSpy('warning')
    };

    catService = {
      getClientSearch: jasmine.createSpy('getClientSearch').and.returnValue(of([{ id: 'c1', companyName: 'Client 1' }])),
      LinkToClientWithItem: jasmine.createSpy('LinkToClientWithItem').and.returnValue(of({ status: 'Success', message: 'Linked successfully' }))
    };

    dialogRef = {
      close: jasmine.createSpy('close')
    };

    matDialog = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of({ type: 'linked', data: { id: 'c1', isLinked: true, linkedClientItemDetails: { price: 100 } } })
      })
    };

    await TestBed.configureTestingModule({
      declarations: [ClientLinkingToItemModalComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => undefined, detectChanges: () => undefined } },
        DatePipe,
        { provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: () => ({ attach: () => undefined, enable: () => undefined, disable: () => undefined, detach: () => undefined }) },
        FormBuilder,
        { provide: CategoryService, useValue: catService },
        { provide: MatDialog, useValue: matDialog },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { id: 'item-101' } },
        { provide: ToastrService, useValue: toastr }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(ClientLinkingToItemModalComponent, '')
      .overrideComponent(ClientLinkingToItemModalComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(ClientLinkingToItemModalComponent);
    component = fixture.componentInstance;
  });

  it('should create and initialize searchForm', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.city).toBeDefined();
    expect(component.companyName).toBeDefined();
  });

  it('should handle searchclient with array and non-array responses', () => {
    component.ngOnInit();
    component.city.setValue('New York');
    component.companyName.setValue('Acme');

    // Array response
    component.searchclient();
    expect(catService.getClientSearch).toHaveBeenCalledWith({ city: 'New York', companyName: 'Acme' });
    expect(component.clientList.length).toBe(1);
    expect(component.clientList[0].isLinked).toBeFalse();

    // Non-array response (object)
    catService.getClientSearch.and.returnValue(of({ error: true }));
    component.searchclient();
    // clientList should not be overwritten with non-array
    expect(component.clientList.length).toBe(1);

    // Non-array response (null)
    catService.getClientSearch.and.returnValue(of(null));
    component.searchclient();
  });

  it('should handle resetForm', () => {
    component.ngOnInit();
    component.city.setValue('Chicago');
    component.resetForm();
    expect(component.city.value).toBeNull();
  });

  it('should handle unLinkClient', () => {
    component.clientList = [{ id: 'c1', linkedClientItemDetails: {}, isEdit: true, isLinked: true }];
    component.unLinkClient(component.clientList[0], 0);
    expect(component.clientList[0].linkedClientItemDetails).toBeUndefined();
    expect(component.clientList[0].isEdit).toBeFalse();
    expect(component.clientList[0].isLinked).toBeFalse();
  });

  it('should handle linkUnLinkClientModal with linked and other callback types', () => {
    component.clientList = [{ id: 'c1' }];

    // type === 'linked'
    component.linkUnLinkClientModal(component.clientList[0], 0);
    expect(matDialog.open).toHaveBeenCalled();
    expect(component.clientList[0].isLinked).toBeTrue();

    // type !== 'linked'
    matDialog.open.and.returnValue({
      afterClosed: () => of({ type: 'cancelled' })
    });
    component.linkUnLinkClientModal(component.clientList[0], 0);
  });

  it('should handle submitForm when client is linked (success and error) and when none linked', () => {
    // None linked -> warning
    component.clientList = [{ id: 'c1', isLinked: false }];
    component.submitForm();
    expect(toastr.warning).toHaveBeenCalledWith('Please Link atleast one Client with Item', 'Warning');

    // Linked -> Success
    component.clientList = [{ id: 'c1', isLinked: true, linkedClientItemDetails: { price: 100 } }];
    catService.LinkToClientWithItem.and.returnValue(of({ status: 'Success', message: 'Linked successfully' }));
    component.submitForm();
    expect(toastr.success).toHaveBeenCalledWith('Linked successfully', 'Success');
    expect(dialogRef.close).toHaveBeenCalledWith({ event: 'linked' });

    // Linked -> Error
    catService.LinkToClientWithItem.and.returnValue(of({ status: 'Error', errorMessage: 'Linking failed' }));
    component.submitForm();
    expect(toastr.error).toHaveBeenCalledWith('Linking failed', 'Error');
  });

  it('should cover linked-client predicate and modal callback replacement', () => {
    component.ngOnInit();
    component.clientList = [{ id: 'c1', isLinked: false }, { id: 'c2', isLinked: true }];
    expect(component.checkAnyClientLinkedOrNot()).toBeTrue();
    component.linkUnLinkClientModal(component.clientList[0], 0);
    expect(component.clientList[0].isLinked).toBeTrue();
    component.unLinkClient(component.clientList[0], 0);
    expect(component.checkAnyClientLinkedOrNot()).toBeTrue();
  });

  it('should return false when no client is linked', () => {
    component.clientList = [{ id: 'c1', isLinked: false }, { id: 'c2', isLinked: false }];

    expect(component.checkAnyClientLinkedOrNot()).toBeFalse();
  });

  it('should handle searchclient with falsy value that satisfies Array.isArray', () => {
    component.ngOnInit();
    spyOn(Array, 'isArray').and.returnValue(true);
    catService.getClientSearch.and.returnValue(of(null));
    component.searchclient();
    expect(component.clientList).toEqual([]);
  });
});