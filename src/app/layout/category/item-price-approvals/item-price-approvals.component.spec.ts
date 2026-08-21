import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { ItemPriceApprovalsComponent } from './item-price-approvals.component';
import { defaultAppConfig } from 'src/testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { CategoryService } from '../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';

describe('ItemPriceApprovalsComponent', () => {
  let component: ItemPriceApprovalsComponent;
  let fixture: ComponentFixture<ItemPriceApprovalsComponent>;
  let catService: any;
  let toastr: any;
  let encryDecryService: any;

  const mockLoggedUserData = {
    details: {
      username: 'approver1',
      listofPermission: ['APPROVE_ITEM_PRICE']
    }
  };

  beforeEach(async () => {
    toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error')
    };

    catService = {
      getAllItemPriceApprovals: jasmine.createSpy('getAllItemPriceApprovals').and.returnValue(of([
        { id: '1', itemId: 'i1', vendorId: 'v1', pricePerUnit: 100, status: { uiDisplay: 'Pending' } }
      ])),
      approveItemPrice: jasmine.createSpy('approveItemPrice').and.returnValue(of({ status: 'Success', message: 'Approved successfully' }))
    };

    encryDecryService = {
      get: jasmine.createSpy('get').and.returnValue(JSON.stringify(mockLoggedUserData))
    };

    await TestBed.configureTestingModule({
      declarations: [ItemPriceApprovalsComponent],
      imports: [CommonModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => undefined, detectChanges: () => undefined } },
        DatePipe,
        { provide: CategoryService, useValue: catService },
        { provide: ToastrService, useValue: toastr },
        { provide: EncryDecryService, useValue: encryDecryService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(ItemPriceApprovalsComponent, '')
      .overrideComponent(ItemPriceApprovalsComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(ItemPriceApprovalsComponent);
    component = fixture.componentInstance;
  });

  it('should create, initialize permissions and load approval items', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.loggedUserDetails.username).toBe('approver1');
    expect(component.itemApprovalsList.length).toBe(1);
    expect(component.itemApprovalsList[0].status).toBe('Pending');
  });

  it('should handle getAllApprovalItem with non-array response', () => {
    catService.getAllItemPriceApprovals.and.returnValue(of(null));
    component.getAllApprovalItem();
    expect(component.itemApprovalsList).toEqual([]);
  });

  it('should handle onPage', () => {
    component.onPage({ pageIndex: 1, pageSize: 10 });
    expect(component.paginatoryDetails.pageIndex).toBe(1);
  });

  it('should handle approve and successCallBack (success and error paths)', () => {
    component.ngOnInit();
    const itemData = { id: '1', itemId: 'i1', vendorId: 'v1', pricePerUnit: 100 };

    // Approve success
    component.approve(itemData);
    expect(catService.approveItemPrice).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('Approved successfully', 'Success');

    // Approve failure
    catService.approveItemPrice.and.returnValue(of({ status: 'Error', message: 'Approval failed' }));
    component.approve(itemData);
    expect(toastr.error).toHaveBeenCalledWith('Approval failed', 'Error');
  });
});
