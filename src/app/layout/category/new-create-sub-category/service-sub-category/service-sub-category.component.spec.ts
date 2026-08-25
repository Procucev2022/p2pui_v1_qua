import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { ServiceSubCategoryComponent } from './service-sub-category.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { CategoryService } from '../../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ServiceSubCategoryComponent', () => {
  let component: ServiceSubCategoryComponent;
  let fixture: ComponentFixture<ServiceSubCategoryComponent>;
  let categoryService: any;
  let toaster: any;
  let modalDialog: any;
  let dialogData: any;

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('userFullName', 'Tester');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    categoryService = autoMock('CategoryService');
    toaster = autoMock('ToastrService');
    modalDialog = autoMock('MatDialog');
    dialogData = { type: 'Categories' };
    categoryService.getSACCodesAndNames.and.returnValue(
      of([
        { name: 'Sec', code: '10', fullcode: '1010', id: 's1' },
        { name: 'Other', code: '20' },
      ])
    );
    categoryService.getAllUOM.and.returnValue(of([{ id: 'u1' }]));
    categoryService.getSubCategoryBySac.and.returnValue(
      of([{ id: 'sc1', subCategoryName: 'Sub', subCategoryNumber: 'SN1' }])
    );
    categoryService.getItemMasterBySubCategory.and.returnValue(
      of([{ id: 'i1', description: 'ItemA', itemNumber: 'IN1' }])
    );
    categoryService.createSubCategory.and.returnValue(
      of({ id: 'new', subCategoryName: 'N', subCategoryNumber: 'NS1' })
    );
    categoryService.createItemMasterByHsnOrSac.and.returnValue(
      of({ id: 'itemNew', itemNumber: 'IN9' })
    );

    await TestBed.configureTestingModule({
      declarations: [ServiceSubCategoryComponent],
      imports: [CommonModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: autoMock('ChangeDetectorRef') },
        DatePipe,
        {
          provide: MAT_DIALOG_SCROLL_STRATEGY,
          useValue: () => ({
            attach: () => undefined,
            enable: () => undefined,
            disable: () => undefined,
            detach: () => undefined,
          }),
        },
        { provide: CategoryService, useValue: categoryService },
        { provide: MatDialogRef, useValue: autoMock('MatDialogRef') },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: MatDialog, useValue: modalDialog },
        { provide: ToastrService, useValue: toaster },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(ServiceSubCategoryComponent, '')
      .overrideComponent(ServiceSubCategoryComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(ServiceSubCategoryComponent);
    component = fixture.componentInstance;
    component.data = dialogData;
    component.model = {};
    component.categoryListComponent = { getAllSubCategoryList: jasmine.createSpy('getAll') } as any;
    
    const sampleRow: any = {
      id: '1', vendorId: 'v1', ID: '1', name: 'n', status: 'Open', status_ui_display: 'Open',
      description: 'desc1', projectCategory: 'cat1', projectSubCategory: 'subcat1', brand: 'b1',
      quantity: 10, unitofMeasures: 'KG', unitprice: 100, excludetaxamount: 1000, gstValue: 180, totalamount: 1180,
      uom: { description: 'KG', id: 'u1' }, vendorData: ['v1'], action: null, org: { id: 'o1', companyName: 'Org1' },
      certificates: [{ fileName: 'c.pdf', file: 'AAA' }], clientStatus: { uiDisplay: 'Open' },
      createdTS: new Date().toISOString(), query: 'a|b', pricePerUnit: 10, rank: 1, city: 'City1',
      vendorName: 'Vendor1', companyId: 'comp1', lineItems: [], documents: [], items: [],
      rfqData: { id: '1' }, vendorRequest: { id: '1' }, vendorDataObj: { id: '1' },
    };
        (component as any).ppoData = { ppoItems: [sampleRow], id: '1', ppoNumber: 'PPO1', ppoId: '1', prId: '1' };
    (component as any).prDetails = { id: '1', lineItems: [sampleRow] };
    (component as any).data = (component as any).data || { ppoId: '1', prId: '1', id: '1', status: 'Success', items: [sampleRow], lineItems: [sampleRow], vendorProduct: [sampleRow], vendorService: [sampleRow], rfqData: sampleRow, vendors: [sampleRow] };
    (component as any).rfqDataList = [sampleRow];
    (component as any).cache_rfqDataList = [sampleRow];
    (component as any).clientList = [sampleRow];

    seedComponent(component as any);
  });

  it('should init', () => {
    categoryService.getSACCodesAndNames.and.returnValue(of([{ name: 'A', code: '1' }]));
    component.ngOnInit();
    expect(component.getAllHsnCodes.length).toBe(1);
    expect(component.uomList.length).toBe(1);
    categoryService.getSACCodesAndNames.and.returnValue(of({ status: 'Failure' }));
    categoryService.getAllUOM.and.returnValue(of({ status: 'Failure' }));
    component.data = { id: 'x', description: 'D', specification: 'S', type: 'Item' };
    component.ngOnInit();
    expect(component.isExistedItem).toBe(true);
    expect(component.uomList).toEqual([]);
  });

  it('should filter helpers', () => {
    component.getAllHsnCodes = [{ name: 'Alpha', code: '10' }, { name: 'Beta', code: '20' }];
    component.filterSection({ query: 'al' });
    expect(component.serviceSections.length).toBe(1);
    component.getAllHsnheadingCodes = [{ name: 'Head', code: '11' }];
    component.filterHeading({ query: 'he' });
    expect(component.serviceHeadings.length).toBe(1);
    component.getAllGroupHsnCodes = [{ name: 'Grp', code: '12' }];
    component.filterGroup({ query: 'gr' });
    expect(component.serviceGroups.length).toBe(1);
    component.getAllSacHsnCodes = [{ name: 'Sac', code: '13' }];
    component.filterSac({ query: 'sa' });
    expect(component.serviceSac.length).toBe(1);
    component.getAllSubCategoryHsnCodes = [{ subCategoryName: 'SubA' }];
    component.filterAutoCompleteData({ query: 'su' });
    expect(component.subCategoryList.length).toBe(1);
    component.getAllItemList = [{ description: 'Drill' }];
    component.filterItems({ query: 'dr' });
    expect(component.itemList.length).toBe(1);
  });

  it('should onSelect cascade and create', () => {
    component.model = {};
    component.onSelect({ code: '10' }, 'section');
    component.onSelect({ code: '11' }, 'heading');
    component.onSelect({ code: '12' }, 'categoryGroup');
    categoryService.getSACCodesAndNames.and.returnValue(
      of([{ name: 'Sac', code: '13', fullcode: '101013', id: 's9' }])
    );
    component.onSelect({ code: '13' }, 'sac');
    expect(component.model.categoryName).toBe('Sac');

    categoryService.getSACCodesAndNames.and.returnValue(of([{ name: 'No', code: 'x', id: 's0' }]));
    component.onSelect({ code: 'x' }, 'sac');

    component.data = { type: 'Categories' };
    component.onSelect({ subCategoryNumber: 'SN1' }, 'subCategory');
    component.data = { type: 'Item' };
    component.onSelect({ subCategoryNumber: 'SN2', id: 'sc1' }, 'subCategory');
    component.onSelect({ subCategoryNumber: null }, 'subCategory');
    component.onSelect({ itemNumber: 'IN1' }, 'item');
    component.onSelect({ itemNumber: null }, 'item');
    component.data = { id: 'exist', description: 'Desc', specification: 'Spec', type: 'Item' };
    component.isExistedItem = true;
    component.onSelect({ itemNumber: 'X' }, 'item');

    component.subCategory = {};
    component.getItemMasterBySubCategory();
    component.subCategory = { id: 'sc1' };
    component.getItemMasterBySubCategory();

    component.subCategoryInfo = { id: 's1', fullcode: '1010' };
    component.newSubCategoryName = 'NewSub';
    component.model = { categoryName: 'C' };
    component.createCategoryService();
    expect(toaster.success).toHaveBeenCalled();

    component.isExistedItem = false;
    component.subCategory = { id: 'sc1' };
    component.newItemName = 'NewItem';
    component.model = { upcCode: 'U', specification: 'S', uom: 'u1' };
    component.createItemSer();
    expect(toaster.success).toHaveBeenCalled();

    component.isExistedItem = true;
    component.data = { id: 'e1', specification: 'S', type: 'Item' };
    categoryService.createItemMasterByHsnOrSac.and.returnValue(of({ status: 'Failure' }));
    component.createItemSer();
    expect(toaster.warning).toHaveBeenCalled();
  });
});
