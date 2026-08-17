import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { PpoReportsComponent } from './ppo-reports.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { ExcelService } from 'src/app/shared/modules/common-share/services/excel.service';
import { PoService } from 'src/app/shared/modules/common-share/services/po.service';
import { EncryDecryService } from 'src/app/shared/services';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services/cat-procu-requests.service';
import { MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';

describe('PpoReportsComponent', () => {
  let component: PpoReportsComponent;
  let fixture: ComponentFixture<PpoReportsComponent>;
  let excelService: any;
  let poService: any;
  let encry: any;
  let procuReqService: any;

  const sampleRows = [
    {
      ppoId: 'PPO1',
      ppoValue: 100,
      paymentTerms: 'Net30',
      delivaryTerms: 'FOB',
      otherTerms: 'x',
      ppoitems: [
        {
          org: { companyName: 'Acme' },
          description: 'Item',
          brand: 'B',
          unitofMeasures: 'EA',
          quantity: 2,
          unitprice: 10,
          gstValue: 1,
          gstPercentage: 18,
          totalamount: 21,
        },
      ],
    },
  ];

  function configure(roleDescription: string) {
    encry.get.and.returnValue(
      JSON.stringify({
        details: {
          role: { description: roleDescription },
          org: { id: 'o1' },
        },
      })
    );
  }

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');

    excelService = autoMock('ExcelService');
    poService = autoMock('PoService');
    encry = autoMock('EncryDecryService');
    procuReqService = autoMock('CatProcuRequestsService');
    configure('CategoryManager');
    procuReqService.getClients.and.returnValue(of([{ id: 'c1', companyName: 'Client One' }]));
    procuReqService.getDepartmentsByOrg.and.returnValue(of([{ id: 'd1', deptName: 'Ops' }]));
    procuReqService.getUserNamesByOrg.and.returnValue(of([{ id: 'u1', username: 'alice' }]));
    poService.getppobyStatusAndCreatedTS.and.returnValue(of(sampleRows));
    poService.getppoClientbyStatusAndCreatedTS.and.returnValue(of(sampleRows));

    await TestBed.configureTestingModule({
      declarations: [PpoReportsComponent],
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
        { provide: ExcelService, useValue: excelService },
        { provide: PoService, useValue: poService },
        { provide: EncryDecryService, useValue: encry },
        { provide: CatProcuRequestsService, useValue: procuReqService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(PpoReportsComponent, '')
      .overrideComponent(PpoReportsComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(PpoReportsComponent);
    component = fixture.componentInstance;
    
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

  it('should init CategoryManager and clientInitiator paths', () => {
    component.ngOnInit();
    expect(procuReqService.getClients).toHaveBeenCalled();

    configure('clientInitiator');
    component.ngOnInit();
    expect(procuReqService.getDepartmentsByOrg).toHaveBeenCalled();

    configure('Other');
    component.ngOnInit();
  });

  it('should load departments users clients and filter clients', () => {
    component.getAllClients();
    expect(component.allClients.length).toBe(1);

    procuReqService.getClients.and.returnValue(of(null));
    component.getAllClients();
    expect(component.allClients).toEqual([]);

    component.getDepartments();
    expect(component.departments.length).toBe(1);
    procuReqService.getDepartmentsByOrg.and.returnValue(of({ status: 'Failure' }));
    component.getDepartments();
    expect(component.departments).toEqual([]);

    component.getUserNamesandDeptForCM({ id: null });
    component.getUserNamesandDeptForCM({ id: 'c1' });
    expect(component.userNames.length).toBe(1);
    procuReqService.getDepartmentsByOrg.and.returnValue(of([{ id: 'd2' }]));
    procuReqService.getUserNamesByOrg.and.returnValue(of({ status: 'Failure' }));
    component.getUserNamesandDeptForCM({ id: 'c1' });
    expect(component.userNames).toEqual([]);

    component.allClients = [
      { companyName: 'Alpha Co' },
      { companyName: 'Beta Inc' },
    ];
    component.filterClient({ query: 'alp' });
    expect(component.filteredClientList.length).toBe(1);
  });

  it('should download CategoryManager report success and failure', () => {
    configure('CategoryManager');
    component.ngOnInit();
    component.fromDate = new Date(2024, 0, 5);
    component.toDate = new Date(2024, 0, 9);
    component.userName = 'alice';
    component.department = 'Ops';
    component.clientName = 'c1';
    component.downloadPRreport();
    expect(poService.getppobyStatusAndCreatedTS).toHaveBeenCalled();
    expect(excelService.exportAsExcelFile).toHaveBeenCalled();

    poService.getppobyStatusAndCreatedTS.and.returnValue(of({ status: 'Failure' }));
    component.downloadPRreport();
    expect(component.reportData).toEqual([]);
  });

  it('should download clientInitiator report and formatDate padding', () => {
    configure('clientInitiator');
    component.ngOnInit();
    component.fromDate = new Date(2024, 8, 2);
    component.toDate = new Date(2024, 9, 12);
    component.department = 'Ops';
    component.downloadPRreport();
    expect(poService.getppoClientbyStatusAndCreatedTS).toHaveBeenCalled();
    expect(excelService.exportAsExcelFile).toHaveBeenCalled();

    poService.getppoClientbyStatusAndCreatedTS.and.returnValue(of({ status: 'Failure' }));
    component.downloadPRreport();
    expect(component.reportData).toEqual([]);

    expect(component.formatDate(new Date(2024, 0, 5))).toBe('2024-01-05');
    expect(component.formatDate(new Date(2024, 10, 15))).toBe('2024-11-15');
  });

  it('should prepareData export rows', () => {
    component.prepareData(sampleRows);
    expect(excelService.exportAsExcelFile).toHaveBeenCalled();
    component.prepareData([]);
  });
});
