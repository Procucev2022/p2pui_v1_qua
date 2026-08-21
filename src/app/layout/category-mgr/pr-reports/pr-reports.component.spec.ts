import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { PrReportsComponent } from './pr-reports.component';
import { autoMock, defaultAppConfig, seedComponent } from '../../../../testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';
import { CatProcuRequestsService } from '../services';
import { ExcelService } from 'src/app/shared/modules/common-share/services/excel.service';
import { EncryDecryService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';

describe('PrReportsComponent', () => {
  let component: PrReportsComponent;
  let fixture: ComponentFixture<PrReportsComponent>;
  let procuReqService: any;
  let excelService: any;
  let encry: any;
  let toast: any;

  const sample = [
    {
      prId: 'PR1',
      prCorrespond: 'c',
      prDescription: 'd',
      clientStatus: { uiDisplay: 'Open' },
      deptName: 'Ops',
      futureRequirement: 'f',
      clientcostcentre: [{ name: 'CC1' }, { name: 'CC2' }],
      priority: 'High',
      estimatedPrvalue: 10,
      createdTS: '2024-01-05',
      clientApprovalDate: '2024-01-06',
      procucevAcceptDate: '2024-01-07',
      dueDate: '2024-02-01',
      clientdeliverylocation: [{ address: 'A1', city: 'Hyd', state: 'TS' }],
      pritems: [
        {
          serialNo: 1,
          description: 'Item',
          brand: 'B',
          quantity: 2,
          Category: 'Cat',
          itemcode: 'IC',
          vendorName: 'V',
          vendorPrice: 5,
          unitofMeasures: 'EA',
          estimatedItemValue: 10,
          linkedItemPrice: 4,
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

    procuReqService = autoMock('CatProcuRequestsService');
    excelService = autoMock('ExcelService');
    encry = autoMock('EncryDecryService');
    toast = autoMock('ToastrService');
    configure('CategoryManager');
    procuReqService.getClients.and.returnValue(of([{ id: 'c1', companyName: 'Client One' }]));
    procuReqService.getDepartmentsByOrg.and.returnValue(of([{ id: 'd1' }]));
    procuReqService.getUserNamesByOrg.and.returnValue(of([{ id: 'u1' }]));
    procuReqService.getPrByCMAndCreatedTS.and.returnValue(of(sample));
    procuReqService.getPrByOrgAndCreatedTS.and.returnValue(of(sample));

    await TestBed.configureTestingModule({
      declarations: [PrReportsComponent],
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
        { provide: CatProcuRequestsService, useValue: procuReqService },
        { provide: ExcelService, useValue: excelService },
        { provide: EncryDecryService, useValue: encry },
        { provide: ToastrService, useValue: toast },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(PrReportsComponent, '')
      .overrideComponent(PrReportsComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(PrReportsComponent);
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

  it('should init role paths', () => {
    component.ngOnInit();
    expect(procuReqService.getClients).toHaveBeenCalled();
    configure('clientInitiator');
    component.ngOnInit();
    expect(procuReqService.getUserNamesByOrg).toHaveBeenCalled();
    configure('Other');
    component.ngOnInit();
  });

  it('should load clients departments users and filter', () => {
    component.getAllClients();
    procuReqService.getClients.and.returnValue(of(null));
    component.getAllClients();
    expect(component.allClients).toEqual([]);

    component.getDepartments();
    procuReqService.getDepartmentsByOrg.and.returnValue(of({ status: 'Failure' }));
    component.getDepartments();
    expect(component.departments).toEqual([]);

    component.getUserNames();
    procuReqService.getUserNamesByOrg.and.returnValue(of({ status: 'Failure' }));
    component.getUserNames();
    expect(component.userNames).toEqual([]);

    procuReqService.getDepartmentsByOrg.and.returnValue(of([{ id: 'd2' }]));
    procuReqService.getUserNamesByOrg.and.returnValue(of([{ id: 'u2' }]));
    component.getUserNamesandDeptForCM({ id: null });
    component.getUserNamesandDeptForCM({ id: 'c1' });
    expect(component.userNames.length).toBe(1);

    component.allClients = [{ companyName: 'Alpha' }, { companyName: 'Beta' }];
    component.filterClient({ query: 'alp' });
    expect(component.filteredClientList.length).toBe(1);
  });

  it('should download CM and client reports with empty warning', () => {
    configure('CategoryManager');
    component.ngOnInit();
    component.fromDate = new Date(2024, 0, 5);
    component.toDate = new Date(2024, 0, 9);
    component.clientName = 'c1';
    component.userName = 'u';
    component.department = 'Ops';
    component.downloadPRreport();
    expect(excelService.exportAsExcelFile).toHaveBeenCalled();

    procuReqService.getPrByCMAndCreatedTS.and.returnValue(of({ status: 'Failure' }));
    component.downloadPRreport();
    expect(toast.warning).toHaveBeenCalled();

    configure('clientInitiator');
    component.ngOnInit();
    component.fromDate = new Date(2024, 8, 2);
    component.toDate = new Date(2024, 9, 12);
    component.downloadPRreport();
    expect(procuReqService.getPrByOrgAndCreatedTS).toHaveBeenCalled();

    procuReqService.getPrByOrgAndCreatedTS.and.returnValue(of({ status: 'Failure' }));
    component.downloadPRreport();
    expect(toast.warning).toHaveBeenCalled();
  });

  it('should prepareData and formatDate', () => {
    component.prepareData(sample);
    expect(excelService.exportAsExcelFile).toHaveBeenCalled();
    component.prepareData([]);
    expect(component.formatDate(new Date(2024, 0, 5))).toBe('2024-01-05');
    expect(component.formatDate(new Date(2024, 10, 15))).toBe('2024-11-15');
  });
});
