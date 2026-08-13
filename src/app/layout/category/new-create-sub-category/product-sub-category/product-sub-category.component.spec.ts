import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { ProductSubCategoryComponent } from './product-sub-category.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { CategoryService } from '../../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ProductSubCategoryComponent', () => {
  let component: ProductSubCategoryComponent;
  let fixture: ComponentFixture<ProductSubCategoryComponent>;
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
    categoryService.getHSNCodesAndNames.and.returnValue(
      of([
        { name: 'Seg', code: '10', fullcode: '1010', id: 'h1' },
        { name: 'Other', code: '20' },
      ])
    );
    categoryService.getAllUOM.and.returnValue(of([{ id: 'u1' }]));
    categoryService.getSubCategoryByHSN.and.returnValue(
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
      declarations: [ProductSubCategoryComponent],
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
      .overrideTemplate(ProductSubCategoryComponent, '')
      .overrideComponent(ProductSubCategoryComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(ProductSubCategoryComponent);
    component = fixture.componentInstance;
    component.data = dialogData;
    component.model = {};
    component.categoryListComponent = { getAllSubCategoryList: jasmine.createSpy('getAll') } as any;
    seedComponent(component as any);
  });

  it('should init with and without existing item', () => {
    component.ngOnInit();
    expect(component.getAllHsnCodes.length).toBe(2);
    expect(component.uomList.length).toBe(1);

    categoryService.getHSNCodesAndNames.and.returnValue(of({ status: 'Failure' }));
    categoryService.getAllUOM.and.returnValue(of({ status: 'Failure' }));
    component.data = { id: 'x', description: 'D', specification: 'S', type: 'Item' };
    component.ngOnInit();
    expect(component.isExistedItem).toBe(true);
    expect(component.uomList).toEqual([]);
  });

  it('should filter helpers', () => {
    component.getAllHsnCodes = [
      { name: 'Alpha', code: '10' },
      { name: 'Beta', code: '20' },
    ];
    component.filterSegment({ query: 'al' });
    expect(component.productSegments.length).toBe(1);
    component.getAllHsnfamilyCodes = [{ name: 'Fam', code: '11' }];
    component.filterFamily({ query: 'fa' });
    expect(component.productFamilys.length).toBe(1);
    component.getAllClassHsnCodes = [{ name: 'Cls', code: '12' }];
    component.filterClass({ query: 'cl' });
    expect(component.productClass.length).toBe(1);
    component.getAllCommodityHsnCodes = [{ name: 'Com', code: '13' }];
    component.filterCommodity({ query: 'co' });
    expect(component.productCommodity.length).toBe(1);
    component.getAllSubCategoryHsnCodes = [{ subCategoryName: 'SubA' }];
    component.filterAutoCompleteData({ query: 'su' });
    expect(component.subCategoryList.length).toBe(1);
    component.getAllItemList = [{ description: 'Drill' }];
    component.filterItems({ query: 'dr' });
    expect(component.itemList.length).toBe(1);
  });

  it('should onSelect cascade segment family class commodity', () => {
    component.model = {};
    component.onSelect({ code: '10' }, 'segment');
    expect(component.getAllHsnfamilyCodes.length).toBe(2);
    component.onSelect({ code: '11' }, 'family');
    expect(component.getAllClassHsnCodes.length).toBe(2);
    component.onSelect({ code: '12' }, 'categoryClass');
    expect(component.getAllCommodityHsnCodes.length).toBe(2);

    categoryService.getHSNCodesAndNames.and.returnValue(
      of([{ name: 'Comm', code: '13', fullcode: '101013', id: 'h9' }])
    );
    component.onSelect({ code: '13' }, 'commodity');
    expect(component.model.categoryName).toBe('Comm');
    expect(component.getAllSubCategoryHsnCodes.length).toBe(1);

    categoryService.getHSNCodesAndNames.and.returnValue(of([{ name: 'NoCode', code: 'x', id: 'h0' }]));
    component.onSelect({ code: 'x' }, 'commodity');

    categoryService.getHSNCodesAndNames.and.returnValue(of({ status: 'Failure' }));
    component.onSelect({ code: '10' }, 'segment');
  });

  it('should onSelect subcategory and item branches', () => {
    component.data = { type: 'Categories' };
    component.onSelect({ subCategoryNumber: 'SN1' }, 'subCategory');
    expect(component.model.subCategoryNumber).toBe('SN1');

    component.data = { type: 'Item' };
    component.onSelect({ subCategoryNumber: 'SN2', id: 'sc1' }, 'subCategory');
    expect(component.getAllItemList.length).toBe(1);
    component.onSelect({ subCategoryNumber: null }, 'subCategory');

    component.onSelect({ itemNumber: 'IN1' }, 'item');
    expect(component.model.itemNumber).toBe('IN1');
    component.onSelect({ itemNumber: null }, 'item');

    component.data = { id: 'exist', description: 'Desc', specification: 'Spec', type: 'Item' };
    component.isExistedItem = true;
    component.onSelect({ itemNumber: 'X' }, 'item');
    expect(component.newItemName).toBe('Desc');
  });

  it('should getItemMasterBySubCategory and create flows', () => {
    component.subCategory = {};
    component.getItemMasterBySubCategory();
    component.subCategory = { id: 'sc1' };
    component.getItemMasterBySubCategory();
    expect(component.getAllItemList.length).toBe(1);

    component.subCategoryInfo = { id: 'h1', fullcode: '1010' };
    component.newSubCategoryName = 'NewSub';
    component.model = { categoryName: 'C' };
    component.createCategoryProduct();
    expect(toaster.success).toHaveBeenCalled();
    expect(modalDialog.closeAll).toHaveBeenCalled();

    categoryService.createSubCategory.and.returnValue(of({}));
    component.createCategoryProduct();

    component.data = { type: 'Item' };
    component.isExistedItem = false;
    component.subCategory = { id: 'sc1' };
    component.subCategoryInfo = { id: 'h1' };
    component.newItemName = 'NewItem';
    component.model = { upcCode: 'U', specification: 'S', uom: 'u1' };
    component.createItemProd();
    expect(toaster.success).toHaveBeenCalled();

    component.isExistedItem = true;
    component.data = { id: 'e1', specification: 'S', price: 1, type: 'Item' };
    categoryService.createItemMasterByHsnOrSac.and.returnValue(of({ status: 'Failure' }));
    component.createItemProd();
    expect(toaster.warning).toHaveBeenCalled();
  });
});
