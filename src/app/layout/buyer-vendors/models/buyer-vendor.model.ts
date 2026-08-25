export interface BuyerVendor {
  id?: string;
  vendorCode: string;
  vendorName: string;
  searchTerm?: string;
  pan?: string;
  gstin?: string;
  country: string;
  regionCode?: string;
  addressLine?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  phone1: string;
  phone2?: string;
  typeOfBusiness?: string;
  typeOfIndustry?: string;
  vendorGroup?: string;
  status: string;
  sourcingScope: string;
  buyerOrgId?: string;
  createdBy?: string;
  createdTS?: string;
  lastModifiedTS?: string;
}

export interface BuyerVendorPageResponse {
  statusCode: string;
  message: string;
  status: string;
  data: {
    vendors: BuyerVendor[];
    totalRecords: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface BuyerVendorSingleResponse {
  statusCode: string;
  message: string;
  status: string;
  data: {
    vendor: BuyerVendor;
  };
}

export const INDUSTRY_TYPES: string[] = [
  'MRO', 'Manufacturing', 'Trading', 'Services', 'Construction',
  'IT', 'Logistics', 'Agriculture', 'Chemicals', 'Textiles', 'Other'
];

export const VENDOR_GROUPS: string[] = ['Z001', 'Z002', 'Z003', 'Z004'];

export const SOURCING_SCOPES: string[] = ['Client Only', 'Client+Procucev'];
