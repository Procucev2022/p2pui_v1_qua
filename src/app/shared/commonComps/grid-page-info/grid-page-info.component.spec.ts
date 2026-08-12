import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GridPageInfoComponent } from './grid-page-info.component';
import { CustomValidationsService } from '../../services/custom-validations.service';

describe('GridPageInfoComponent', () => {
  let component: GridPageInfoComponent;
  let fixture: ComponentFixture<GridPageInfoComponent>;
  let pageInfoService: jasmine.SpyObj<CustomValidationsService>;

  beforeEach(async () => {
    pageInfoService = jasmine.createSpyObj('CustomValidationsService', [
      'getGridPageInfo',
      'auditGetPageInfo',
      'initGetPageInfo'
    ]);
    pageInfoService.getGridPageInfo.and.returnValue('grid-info');
    pageInfoService.auditGetPageInfo.and.returnValue('audit-info');
    pageInfoService.initGetPageInfo.and.returnValue('init-info');

    await TestBed.configureTestingModule({
      declarations: [GridPageInfoComponent],
      providers: [{ provide: CustomValidationsService, useValue: pageInfoService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(GridPageInfoComponent);
    component = fixture.componentInstance;
    component.totalRecords = 100;
    component.pageData = { first: 0, rows: 10 };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit with selectedMenu uses getGridPageInfo', () => {
    component.selectedMenu = 'menu';
    component.ngOnInit();
    expect(pageInfoService.getGridPageInfo).toHaveBeenCalledWith(component.pageData, 100);
    expect(component.paginatoryDetails).toBe('grid-info');
  });

  it('ngOnInit without selectedMenu and with auditPageSize uses auditGetPageInfo', () => {
    component.selectedMenu = null;
    component.auditPageSize = 25;
    component.ngOnInit();
    expect(pageInfoService.auditGetPageInfo).toHaveBeenCalledWith(100, 25);
    expect(component.paginatoryDetails).toBe('audit-info');
  });

  it('ngOnInit without selectedMenu and without auditPageSize uses initGetPageInfo', () => {
    component.selectedMenu = null;
    component.auditPageSize = null;
    component.ngOnInit();
    expect(pageInfoService.initGetPageInfo).toHaveBeenCalledWith(100);
    expect(component.paginatoryDetails).toBe('init-info');
  });

  it('ngOnChanges without pageData uses initGetPageInfo', () => {
    component.pageData = null;
    component.ngOnChanges();
    expect(pageInfoService.initGetPageInfo).toHaveBeenCalledWith(100);
    expect(component.paginatoryDetails).toBe('init-info');
  });

  it('ngOnChanges with pageData uses getGridPageInfo', () => {
    component.pageData = { first: 10, rows: 10 };
    component.ngOnChanges();
    expect(pageInfoService.getGridPageInfo).toHaveBeenCalledWith(component.pageData, 100);
    expect(component.paginatoryDetails).toBe('grid-info');
  });
});
