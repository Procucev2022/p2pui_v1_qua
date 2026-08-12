import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PoService } from './po.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';


describe('PoService', () => {
  let service: PoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PoService
      ]
    });
    service = TestBed.inject(PoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getDynamicFieldsByClientId', () => {
    service.getDynamicFieldsByClientId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_DYNAMIC_FIELDS_BY_CLIENT_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call createPO', () => {
    service.createPO({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_PO);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call updatePO', () => {
    service.updatePO({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.UPDATE_PO);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAllPos', () => {
    service.getAllPos().subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ALL_POS);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('should call getPosByVendor', () => {
    service.getPosByVendor({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_POS_BY_VENDOR);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getPosByClient', () => {
    service.getPosByClient({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_POS_BY_CLIENT);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getPosByPrApprover', () => {
    service.getPosByPrApprover({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_POS_BY_PR_APPROVER);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getPoById', () => {
    service.getPoById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PO_BY_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call cancelPoById', () => {
    service.cancelPoById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CANCEL_PO_BY_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call rejectPoById', () => {
    service.rejectPoById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.REJECT_PO_BY_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getItemsByPO', () => {
    service.getItemsByPO({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEMS_BY_PO);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getppobyStatusAndCreatedTS', () => {
    service.getppobyStatusAndCreatedTS({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PPO_BY_STATUS_AND_CREATEDTS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getppoClientbyStatusAndCreatedTS', () => {
    service.getppoClientbyStatusAndCreatedTS({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_PPO_CLIENT_BY_STATUS_AND_CREATEDTS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call acceptPoOrCreateDeliveryHeader', () => {
    service.acceptPoOrCreateDeliveryHeader({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_DELIVERY_HEADERS);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getDeliveryHeadersByPOId', () => {
    service.getDeliveryHeadersByPOId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_DELIVERY_HEADERS_BY_PO_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getItemsByDeliveryId', () => {
    service.getItemsByDeliveryId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ITEMS_BY_DELIVERY_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call reviseDeliveryDate', () => {
    service.reviseDeliveryDate({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.REQUEST_FOR_RIVISE_DELIVERY_DATE);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getDeliveryById', () => {
    service.getDeliveryById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_DELIVERY_BY_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call setRequestDate', () => {
    service.setRequestDate({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SET_DELIVERY_DATE);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call createASN', () => {
    service.createASN({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CREATE_ASN);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getAsnsByDeliveryId', () => {
    service.getAsnsByDeliveryId({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_ASN_BY_DELIVERY_ID);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call acceptDelivery', () => {
    service.acceptDelivery({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.ACCEPT_DELIVERY_DATE);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getASNById', () => {
    service.getASNById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.VIEW_ASN);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call acceptASNById', () => {
    service.acceptASNById({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.ACCEPT_ASN);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getVendorsBranches', () => {
    service.getVendorsBranches({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_BRANCHES);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call poApprovedByClientApproved', () => {
    service.poApprovedByClientApproved({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.PO_APPROVED_BY_CLIENT_APPROVER);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getVendorsByClientAndItem', () => {
    service.getVendorsByClientAndItem({ id: 1 }).subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VENDOR_BY_ITEM);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });
});
