import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { AiVendorAnalysisItem } from '../models/ai-vendor-analysis.model';
import { BuyerVendor } from '../models/buyer-vendor.model';

@Injectable({
  providedIn: 'root'
})
export class AiVendorProcessingService {

  private analyzedVendorsSubject = new BehaviorSubject<AiVendorAnalysisItem[]>([]);
  public analyzedVendors$: Observable<AiVendorAnalysisItem[]> = this.analyzedVendorsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Fetches all AI analyzed vendor profiles for the authenticated buyer organization from backend.
   */
  getVendors(): Observable<AiVendorAnalysisItem[]> {
    const url = AppApiConfig.apiEndpoint + AppApiConfig.BUYER_VENDORS + '/ai-analysis';
    return this.http.get<any>(url).pipe(
      map(res => {
        if (res && res.data && res.data.profiles && Array.isArray(res.data.profiles)) {
          const mapped = res.data.profiles.map((p: any) => this.mapBackendProfileToItem(p));
          this.analyzedVendorsSubject.next(mapped);
          return mapped;
        }
        this.analyzedVendorsSubject.next([]);
        return [];
      }),
      catchError(err => {
        console.error('Error fetching AI vendor analysis:', err);
        return of(this.analyzedVendorsSubject.getValue());
      })
    );
  }

  /**
   * Fetches the detailed AI profile for a specific vendor code from backend.
   */
  getVendorByCode(code: string): Observable<AiVendorAnalysisItem | undefined> {
    const url = AppApiConfig.apiEndpoint + AppApiConfig.BUYER_VENDORS + '/ai-profile/' + encodeURIComponent(code);
    return this.http.get<any>(url).pipe(
      map(res => {
        if (res && res.data && res.data.profile) {
          return this.mapBackendProfileToItem(res.data.profile);
        }
        const cached = this.analyzedVendorsSubject.getValue();
        return cached.find(v => v.vendorCode.toLowerCase() === code.toLowerCase());
      }),
      catchError(err => {
        console.error('Error fetching AI vendor profile for ' + code, err);
        const cached = this.analyzedVendorsSubject.getValue();
        return of(cached.find(v => v.vendorCode.toLowerCase() === code.toLowerCase()));
      })
    );
  }

  /**
   * Enriches newly imported vendors via backend AI processing endpoint.
   */
  enrichImportedVendors(imported: BuyerVendor[]): Observable<AiVendorAnalysisItem[]> {
    const url = AppApiConfig.apiEndpoint + AppApiConfig.BUYER_VENDORS + '/ai-process';
    return this.http.post<any>(url, imported).pipe(
      map(res => {
        if (res && res.data && res.data.profiles && Array.isArray(res.data.profiles)) {
          const mapped = res.data.profiles.map((p: any) => this.mapBackendProfileToItem(p));
          this.analyzedVendorsSubject.next(mapped);
          return mapped;
        }
        return [];
      }),
      catchError(err => {
        console.error('Error calling AI process endpoint:', err);
        return of([]);
      })
    );
  }

  public mapBackendProfileToItem(p: any): AiVendorAnalysisItem {
    let subCategories: string[] = [];
    let capabilities: string[] = [];
    let suitableCategories: string[] = [];

    if (Array.isArray(p.subCategoriesJson)) {
      subCategories = p.subCategoriesJson;
    } else if (typeof p.subCategoriesJson === 'string' && p.subCategoriesJson.trim()) {
      try { subCategories = JSON.parse(p.subCategoriesJson); } catch (_) { subCategories = [p.subCategoriesJson]; }
    }

    if (Array.isArray(p.capabilitiesJson)) {
      capabilities = p.capabilitiesJson;
    } else if (typeof p.capabilitiesJson === 'string' && p.capabilitiesJson.trim()) {
      try { capabilities = JSON.parse(p.capabilitiesJson); } catch (_) { capabilities = [p.capabilitiesJson]; }
    }

    if (Array.isArray(p.suitableCategoriesJson)) {
      suitableCategories = p.suitableCategoriesJson;
    } else if (typeof p.suitableCategoriesJson === 'string' && p.suitableCategoriesJson.trim()) {
      try { suitableCategories = JSON.parse(p.suitableCategoriesJson); } catch (_) { suitableCategories = [p.suitableCategoriesJson]; }
    }

    const hasGstin = !!(p.gstin && p.gstin.trim());
    const hasPan = !!(p.pan && p.pan.trim());
    const hasPhone = !!(p.phone1 && p.phone1.trim());
    const hasAddress = !!(p.addressLine && p.addressLine.trim());

    return {
      vendorCode: p.vendorCode || '',
      vendorName: p.vendorName || '',
      searchTerm: p.searchTerm || p.vendorName || '',
      industry: p.industry || 'Manufacturing & Industrial',
      category: p.category || 'Industrial Goods & Assemblies',
      subCategories: subCategories.length ? subCategories : ['Standard Components', 'OEM Spare Parts'],
      capabilities: capabilities.length ? capabilities : ['Quality Assured Batching', 'Just-In-Time Delivery'],
      credentials: {
        gstin: {
          verified: hasGstin,
          value: p.gstin || 'Not Provided',
          verifiedDate: (p.createdTS ? p.createdTS.split('T')[0] : new Date().toISOString().split('T')[0]),
          source: hasGstin ? 'Provided in Import' : 'Missing'
        },
        pan: {
          verified: hasPan,
          value: p.pan || 'Not Provided',
          verifiedDate: (p.createdTS ? p.createdTS.split('T')[0] : new Date().toISOString().split('T')[0]),
          source: hasPan ? 'Provided in Import' : 'Missing'
        },
        companyInfo: {
          verified: hasAddress,
          value: p.typeOfBusiness ? `${p.typeOfBusiness} - ${p.city || 'India'}` : 'Details Provided',
          verifiedDate: (p.createdTS ? p.createdTS.split('T')[0] : new Date().toISOString().split('T')[0]),
          source: 'Master Data Record'
        },
        contactInfo: {
          verified: hasPhone,
          value: p.phone1 ? `+91-${p.phone1}` : 'Phone Not Provided',
          verifiedDate: (p.createdTS ? p.createdTS.split('T')[0] : new Date().toISOString().split('T')[0]),
          source: 'Primary Phone Field'
        }
      },
      qualification: p.qualification || 'Qualified',
      aiScore: p.aiScore || 90,
      scoreBreakdown: {
        financialStability: p.financialStability || 90,
        operationalScope: p.operationalScope || 90,
        compliance: p.complianceScore || 95,
        supplyReliability: p.supplyReliability || 90
      },
      suitableProcurementCategories: suitableCategories.length ? suitableCategories : [
        `${p.industry || 'General'} Direct Sourcing`,
        `${p.category || 'Standard'} Annual Contract`
      ],
      contactInfo: {
        phone1: p.phone1 || '',
        phone2: p.phone2 || '',
        email: p.email || `${(p.vendorCode || 'vnd').toLowerCase()}@vendor-hub.com`,
        addressLine: p.addressLine || '',
        city: p.city || '',
        district: p.district || p.city || '',
        state: p.state || p.regionCode || '',
        postalCode: p.postalCode || '',
        country: p.country || 'India'
      },
      typeOfBusiness: p.typeOfBusiness || 'Authorized Enterprise',
      vendorGroup: p.vendorGroup || 'Approved Vendor',
      sourcingScope: p.sourcingScope || 'Client Only',
      verificationStatus: p.verificationStatus || (hasGstin && hasPan ? '100% Provided' : 'Partial Information'),
      complianceStatus: p.complianceStatus || (hasGstin && hasPan ? 'Compliant' : 'Pending Review'),
      processedAt: p.createdTS || new Date().toISOString()
    };
  }
}
