import { TestBed } from '@angular/core/testing';
import { ExportPdfService } from './export-pdf.service';
import { EncryDecryService } from 'src/app/shared/services/encry-decry.service';

describe('ExportPdfService', () => {
  let service: ExportPdfService;
  let encry: jasmine.SpyObj<EncryDecryService>;

  beforeEach(() => {
    encry = jasmine.createSpyObj('EncryDecryService', ['get', 'set']);
    encry.get.and.returnValue(JSON.stringify({
      details: { fullName: 'Tester', role: { description: 'Admin' } }
    }));
    localStorage.setItem('logData', 'enc');

    TestBed.configureTestingModule({
      providers: [
        ExportPdfService,
        { provide: EncryDecryService, useValue: encry }
      ]
    });
    service = TestBed.inject(ExportPdfService);
    spyOn(service, 'addFooters').and.stub();
  });

  it('should be created and load logged user', () => {
    expect(service).toBeTruthy();
    expect(service.loggedUserDetails.fullName).toBe('Tester');
  });

  it('should refresh logged user details', () => {
    encry.get.and.returnValue(JSON.stringify({
      details: { fullName: 'Other', role: { description: 'CM' } }
    }));
    service.getLoggedUserDetails();
    expect(service.loggedUserDetails.fullName).toBe('Other');
  });

  it('should format getDateTime', () => {
    expect(service.getDateTime()).toMatch(/\d{1,2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}/);
  });

  it('should format getDateForGivenDateTime', () => {
    expect(service.getDateForGivenDateTime('2020-01-02T03:04:05Z')).toContain('2020');
  });

  it('should handle utcToIst branches', () => {
    expect(service.utcToIst('')).toBe('');
    expect(service.utcToIst(null as any)).toBe('');
    expect(service.utcToIst('2020-01-01T00:00:00Z')).toBeTruthy();
  });

  it('should increment page in footer', () => {
    const doc: any = { text: jasmine.createSpy('text'), page: 1 };
    service.footer(doc);
    expect(doc.page).toBe(2);
  });

  it('should run addFooters when not stubbed path covered via callThrough once', () => {
    (service.addFooters as jasmine.Spy).and.callThrough();
    const doc: any = {
      internal: {
        getNumberOfPages: () => 1,
        pageSize: { height: 200, width: 100 }
      },
      setFont: jasmine.createSpy('setFont'),
      setFontSize: jasmine.createSpy('setFontSize'),
      setPage: jasmine.createSpy('setPage'),
      text: jasmine.createSpy('text'),
      rect: jasmine.createSpy('rect'),
      addImage: jasmine.createSpy('addImage')
    };
    service.addFooters(doc);
    expect(doc.setPage).toHaveBeenCalled();
  });

  it('should export PR details PDF with vendors and items', () => {
    const prDetails = {
      prId: 'PR1',
      prCorrespond: 'c',
      deptName: 'D',
      prDescription: 'desc',
      singleVendor: true,
      suggestNewVendor: false,
      rateCardAvailable: true,
      ratecardName: 'RC',
      futureRequirement: 'yes',
      priority: 'High',
      dueDate: '2020-01-02T10:00:00Z',
      estimatedPrvalue: 100,
      prVendors: [
        { companyName: 'V1', contactPerson: 'P', email: 'a@b.com', phone: '1' }
      ],
      pritems: [
        { description: 'item', brand: 'b', unitofMeasures: 'u', quantity: 1 }
      ],
      clientdeliverylocation: [
        { address: 'A1', city: 'C1', state: 'S1' }
      ]
    };
    expect(() => service.exportAsPDF_PRDetails(prDetails, { ppoId: 'PPO1' })).not.toThrow();
  });

  it('should export PR details PDF without optional fields', () => {
    const prDetails = {
      prId: 'PR2',
      prCorrespond: 'c',
      deptName: null,
      prDescription: 'desc',
      singleVendor: false,
      suggestNewVendor: true,
      rateCardAvailable: false,
      futureRequirement: null,
      priority: null,
      dueDate: null,
      estimatedPrvalue: 0,
      prVendors: [],
      pritems: [],
      clientdeliverylocation: []
    };
    expect(() => service.exportAsPDF_PRDetails(prDetails, { ppoId: 'PPO2' })).not.toThrow();
  });

  it('should download quote comparison PDF', () => {
    const vendorColHeaders = [
      { vendorName: 'qty', quotationId: 'q0' },
      { vendorName: 'uom', quotationId: 'q1' },
      { vendorName: 'VendorA', quotationId: 'q2', paymentTerms: 'p', deliveryTerms: 'd', otherTerms: 'o' }
    ];
    const itemRowHeaders = [{ serialNo: 1, id: 'i1' }];
    const itemArrayList = [{
      pritemId: 'i1',
      quotationId: 'q2',
      serialNo: 1,
      description: 'desc',
      quantity: 1,
      unitofMeasures: 'EA',
      unitprice: 10
    }];
    expect(() =>
      service.downloadPDFForQuoteComp(vendorColHeaders, itemRowHeaders, itemArrayList, { ppoId: 'PPO3' })
    ).not.toThrow();
  });

  it('should download quote comparison with total rows', () => {
    const vendorColHeaders = [
      { vendorName: 'VendorA', quotationId: 'q2', paymentTerms: null, deliveryTerms: null, otherTerms: null }
    ];
    const itemRowHeaders = [
      { serialNo: 1, id: 'quotTotId123' },
      { serialNo: 2, id: 'quotTotId1234' },
      { serialNo: 3, id: 'quotTotId12345' }
    ];
    const itemArrayList = [
      { pritemId: 'quotTotId123', quotationId: 'q2', serialNo: 1, unitprice: 1 },
      { pritemId: 'quotTotId1234', quotationId: 'q2', serialNo: 2, basicAmount: 2 },
      { pritemId: 'quotTotId12345', quotationId: 'q2', serialNo: 3, gstValues: 3 }
    ];
    expect(() =>
      service.downloadPDFForQuoteComp(vendorColHeaders, itemRowHeaders, itemArrayList, { ppoId: 'PPO4' })
    ).not.toThrow();
  });

  it('should download quote comparison with missing items and page overflow', () => {
    const vendorColHeaders = [
      { vendorName: 'qty', quotationId: 'q0' },
      { vendorName: 'VendorA', quotationId: 'q2', paymentTerms: 'p', deliveryTerms: 'd', otherTerms: 'o' },
      { vendorName: 'VendorB', quotationId: 'q3', paymentTerms: 'p2', deliveryTerms: 'd2', otherTerms: 'o2' }
    ];
    const itemRowHeaders = [
      { serialNo: 1, id: 'i1' },
      { serialNo: 2, id: 'i2' }
    ];
    const itemArrayList = [
      {
        pritemId: 'i1',
        quotationId: 'q2',
        serialNo: 1,
        description: 'desc',
        quantity: 1,
        unitofMeasures: 'EA',
        unitprice: 10
      }
      // i2 intentionally missing for VendorA/B to hit empty cell branches
    ];
    expect(() =>
      service.downloadPDFForQuoteComp(vendorColHeaders, itemRowHeaders, itemArrayList, { ppoId: 'PPO5' })
    ).not.toThrow();
  });

  it('should format getDateTime for single-digit and double-digit parts', () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2020, 0, 5, 3, 4, 5));
    const small = service.getDateTime();
    expect(small).toContain('2020');
    expect(small).toContain('03:04:05');
    jasmine.clock().mockDate(new Date(2020, 10, 15, 14, 25, 36));
    const large = service.getDateTime();
    expect(large).toContain('14:25:36');
    jasmine.clock().uninstall();
  });

  it('should format getDateForGivenDateTime for padded and unpadded values', () => {
    expect(service.getDateForGivenDateTime(new Date(2020, 0, 5, 3, 4, 5))).toContain('03:04:05');
    expect(service.getDateForGivenDateTime(new Date(2020, 10, 15, 14, 25, 36))).toContain('14:25:36');
  });

  it('should download quote comparison covering second-vendor inserted path', () => {
    const vendorColHeaders = [
      { vendorName: 'VendorA', quotationId: 'q2', paymentTerms: 'p', deliveryTerms: 'd', otherTerms: 'o' },
      { vendorName: 'VendorB', quotationId: 'q3', paymentTerms: 'p2', deliveryTerms: 'd2', otherTerms: 'o2' }
    ];
    const itemRowHeaders = [{ serialNo: 1, id: 'i1' }];
    const itemArrayList = [
      {
        pritemId: 'i1',
        quotationId: 'q2',
        serialNo: 1,
        description: 'desc',
        quantity: 1,
        unitofMeasures: 'EA',
        unitprice: 10
      },
      {
        pritemId: 'i1',
        quotationId: 'q3',
        serialNo: 1,
        description: 'desc',
        quantity: 1,
        unitofMeasures: 'EA',
        unitprice: 20
      }
    ];
    expect(() =>
      service.downloadPDFForQuoteComp(vendorColHeaders, itemRowHeaders, itemArrayList, { ppoId: 'PPO7' })
    ).not.toThrow();
  });

  it('should download quote comparison covering second-vendor total-row path', () => {
    const vendorColHeaders = [
      { vendorName: 'VendorA', quotationId: 'q2', paymentTerms: 'p', deliveryTerms: 'd', otherTerms: 'o' },
      { vendorName: 'VendorB', quotationId: 'q3', paymentTerms: 'p2', deliveryTerms: 'd2', otherTerms: 'o2' }
    ];
    const itemRowHeaders = [
      { serialNo: 1, id: 'quotTotId123' },
      { serialNo: 2, id: 'quotTotId1234' },
      { serialNo: 3, id: 'quotTotId12345' }
    ];
    const itemArrayList = [
      { pritemId: 'quotTotId123', quotationId: 'q2', serialNo: 1, unitprice: 1 },
      { pritemId: 'quotTotId123', quotationId: 'q3', serialNo: 1, unitprice: 11 },
      { pritemId: 'quotTotId1234', quotationId: 'q2', serialNo: 2, basicAmount: 2 },
      { pritemId: 'quotTotId1234', quotationId: 'q3', serialNo: 2, basicAmount: 22 },
      { pritemId: 'quotTotId12345', quotationId: 'q2', serialNo: 3, gstValues: 3 },
      { pritemId: 'quotTotId12345', quotationId: 'q3', serialNo: 3, gstValues: 33 }
    ];
    expect(() =>
      service.downloadPDFForQuoteComp(vendorColHeaders, itemRowHeaders, itemArrayList, { ppoId: 'PPO8' })
    ).not.toThrow();
  });

  it('should export PR details with many vendors to force page breaks', () => {
    const vendors = Array.from({ length: 12 }).map((_, i) => ({
      companyName: 'V' + i,
      contactPerson: 'P' + i,
      email: 'a' + i + '@b.com',
      phone: String(i)
    }));
    const locations = Array.from({ length: 8 }).map((_, i) => ({
      address: 'A' + i,
      city: 'C' + i,
      state: 'S' + i
    }));
    const prDetails = {
      prId: 'PR3',
      prCorrespond: 'c',
      deptName: 'D',
      prDescription: 'desc',
      singleVendor: false,
      suggestNewVendor: false,
      rateCardAvailable: false,
      futureRequirement: 'x',
      priority: 'Low',
      dueDate: '2020-06-01T00:00:00Z',
      estimatedPrvalue: 50,
      prVendors: vendors,
      pritems: [
        { description: 'item1', brand: 'b', unitofMeasures: 'u', quantity: 1 },
        { description: 'item2', brand: 'b2', unitofMeasures: 'u2', quantity: 2 }
      ],
      clientdeliverylocation: locations
    };
    expect(() => service.exportAsPDF_PRDetails(prDetails, { ppoId: 'PPO6' })).not.toThrow();
  });
});
