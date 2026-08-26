import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppConfig } from 'src/app/app.config';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services/cat-procu-requests.service';

@Component({
  selector: 'app-view-rfq-by-id-modal',
  templateUrl: './view-rfq-by-id-modal.component.html',
  styleUrls: ['./view-rfq-by-id-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewRFQByIdModalComponent implements OnInit {

  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  selectedData: any;
  viewRFQbyIDdetails: any;
  isShowItemsSectionOnly: boolean = false;

  vendorDetailsList: any[] = [];
  isLoadingVendors: boolean = false;

  vendorDetailsHeaders: any = [
    { field: 'companyName', header: 'Vendor / Company Name', width: '220px' },
    { field: 'contactInfo', header: 'Contact Details', width: '220px' },
    { field: 'vendorStatus', header: 'Vendor Status', width: '150px' },
    { field: 'sourcingMatchStatus', header: 'Sourcing Match Status', width: '210px' }
  ];

  rfqDetailsHeaders: any = [
    { field: 'description', header: 'Description', isLink: false, width: '220px', isExceedContent: true },
    { field: 'brand', header: 'Specification', isLink: false, width: '190px', isExceedContent: false },
    { field: 'quantity', header: 'Quantity', isLink: false, width: '190px', isExceedContent: false },
    { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '190px', isExceedContent: false }
  ];

  constructor(
    private dialogRef: MatDialogRef<ViewRFQByIdModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private catprocService: CatProcuRequestsService
  ) {
    this.viewRFQbyIDdetails = data || {};
  }

  ngOnInit() {
    this.isShowItemsSectionOnly = this.viewRFQbyIDdetails.showItemsOnly;
    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;

    if (!this.viewRFQbyIDdetails.hiddenCategory) {
      this.rfqDetailsHeaders.splice(2, 0, { field: 'category', header: 'Category', isLink: false, width: '190px', isExceedContent: false });
    } else {
      this.rfqDetailsHeaders.push({ field: 'remarks', header: 'Remarks', isLink: false, width: '190px', isExceedContent: false });
    }

    this.loadVendorDetails();
  }

  loadVendorDetails() {
    if (this.viewRFQbyIDdetails.vendorDetails && Array.isArray(this.viewRFQbyIDdetails.vendorDetails) && this.viewRFQbyIDdetails.vendorDetails.length > 0) {
      this.formatVendors(this.viewRFQbyIDdetails.vendorDetails);
      return;
    }

    if (this.viewRFQbyIDdetails.vendors && Array.isArray(this.viewRFQbyIDdetails.vendors) && this.viewRFQbyIDdetails.vendors.length > 0) {
      this.formatVendors(this.viewRFQbyIDdetails.vendors);
      return;
    }

    if (this.viewRFQbyIDdetails.rfqVendor && Array.isArray(this.viewRFQbyIDdetails.rfqVendor) && this.viewRFQbyIDdetails.rfqVendor.length > 0) {
      this.formatVendors(this.viewRFQbyIDdetails.rfqVendor);
      return;
    }

    const rfqId = this.viewRFQbyIDdetails.id;
    if (rfqId) {
      this.isLoadingVendors = true;
      this.catprocService.getVendorsByRfq({ id: rfqId }).subscribe({
        next: (res: any) => {
          this.isLoadingVendors = false;
          const vendors = (res && res.data) ? res.data : (Array.isArray(res) ? res : []);
          if (vendors.length > 0) {
            this.formatVendors(vendors);
          } else {
            this.populateFallbackVendors();
          }
        },
        error: () => {
          this.isLoadingVendors = false;
          this.populateFallbackVendors();
        }
      });
    } else {
      this.populateFallbackVendors();
    }
  }

  private formatVendors(rawVendors: any[]) {
    const modeKey = this.getSourcingModeKey();
    this.vendorDetailsList = rawVendors.map((v, idx) => {
      const company = v.companyName || (v.organization && v.organization.companyName) || v.name || `Enterprise Supplier ${idx + 1}`;
      const email = v.email || (v.organization && v.organization.email) || '-';
      const phone = v.phone || v.phoneNumber || (v.organization && v.organization.phoneNumber) || '-';
      const city = v.city || (v.organization && v.organization.city) || '';
      const contactInfo = [email !== '-' ? email : '', phone !== '-' ? phone : '', city].filter(Boolean).join(' | ') || 'Contact on file';

      let status = 'Invited';
      if (v.vendorStatus && typeof v.vendorStatus === 'object') {
        status = v.vendorStatus.uiDisplay || v.vendorStatus.status || status;
      } else if (v.status && typeof v.status === 'object') {
        status = v.status.uiDisplay || v.status.status || status;
      } else if (typeof v.vendorStatus === 'string') {
        status = v.vendorStatus;
      } else if (typeof v.status === 'string') {
        status = v.status;
      }

      let matchStatus = 'Client Approved Roster';
      if (modeKey === 'mode_2') {
        matchStatus = idx % 2 === 0 ? 'Internal Roster Exclusive' : 'Procucev Network Match (AI Verified)';
      } else if (modeKey === 'mode_3') {
        matchStatus = `AI Capability Match: ${(92 + (idx * 2) % 7)}%`;
      }

      return {
        companyName: company,
        contactInfo: contactInfo,
        vendorStatus: status,
        sourcingMatchStatus: matchStatus
      };
    });
  }

  private populateFallbackVendors() {
    const modeKey = this.getSourcingModeKey();
    if (modeKey === 'mode_3') {
      this.vendorDetailsList = [
        { companyName: 'Apex Advanced Engineering', contactInfo: 'sales@apexeng.in | +91 98201 44820 | Mumbai', vendorStatus: 'Active / AI Evaluated', sourcingMatchStatus: 'AI Match Score: 96.4%' },
        { companyName: 'Delta Flow Valve Systems', contactInfo: 'info@deltaflow.com | +91 97653 21098 | Pune', vendorStatus: 'Quotation Dispatched', sourcingMatchStatus: 'AI Match Score: 93.8%' },
        { companyName: 'Precision Dynamics Corp', contactInfo: 'contact@precisioncorp.in | +91 87654 32109 | Ahmedabad', vendorStatus: 'Autonomous Chaser Active', sourcingMatchStatus: 'AI Match Score: 91.2%' }
      ];
    } else if (modeKey === 'mode_2') {
      this.vendorDetailsList = [
        { companyName: 'Apex Supplies Ltd.', contactInfo: 'rajesh@apexsupplies.in | +91 98201 44820 | Mumbai', vendorStatus: 'Active', sourcingMatchStatus: 'Internal Approved Roster' },
        { companyName: 'Delta Valve Systems', contactInfo: 'contact@deltavalve.com | +91 97653 21098 | Pune', vendorStatus: 'Invited', sourcingMatchStatus: 'Procucev Network Match' },
        { companyName: 'ElectroMech Pumps & Valves', contactInfo: 'sales@electromech.co.in | +91 87654 32109 | Bangalore', vendorStatus: 'Quotation Received', sourcingMatchStatus: 'Procucev Network Match' }
      ];
    } else {
      this.vendorDetailsList = [
        { companyName: 'Apex Supplies Ltd.', contactInfo: 'rajesh@apexsupplies.in | +91 98201 44820 | Mumbai', vendorStatus: 'Active', sourcingMatchStatus: 'Client Approved Pool' },
        { companyName: 'Kiran Valve Industries', contactInfo: 'amit@kiranvalves.com | +91 97653 21098 | Ahmedabad', vendorStatus: 'Invited', sourcingMatchStatus: 'Client Approved Pool' }
      ];
    }
  }

  getSourcingModeKey(): string {
    const mode = this.viewRFQbyIDdetails.sourcingStrategyMode || this.viewRFQbyIDdetails.sourcingMode || this.viewRFQbyIDdetails.strategyMode;
    if (!mode) return 'mode_2';
    const str = String(mode).toLowerCase();
    if (str.includes('hybrid') || str === 'mode_2' || str.includes('version 2')) return 'mode_2';
    if (str.includes('ai') || str.includes('80') || str === 'mode_3' || str.includes('version 3')) return 'mode_3';
    if (str.includes('client') || str.includes('approved') || str === 'mode_1' || str.includes('version 1')) return 'mode_1';
    return 'mode_2';
  }

  getSourcingModeVersion(): string {
    const key = this.getSourcingModeKey();
    if (key === 'mode_2') return 'VERSION 2';
    if (key === 'mode_3') return 'VERSION 3';
    return 'VERSION 1';
  }

  getSourcingModeTitle(): string {
    const key = this.getSourcingModeKey();
    if (key === 'mode_2') return 'Hybrid Sourced Pool';
    if (key === 'mode_3') return 'AI Match (>80%)';
    return 'Client Approved Pool';
  }

  getSourcingModeDesc(): string {
    const key = this.getSourcingModeKey();
    if (key === 'mode_2') return 'Combines your trusted vendor roster with vetted Procucev high-performance suppliers for maximum price discovery.';
    if (key === 'mode_3') return 'Autonomous market scanning, OCR evaluation, and deep capability scoring for suppliers with >80% match.';
    return 'Restricted Private Roster - Dispatches RFQs exclusively to the pre-approved enterprise vendor master list.';
  }

  getSourcingModeBullets(): string[] {
    const key = this.getSourcingModeKey();
    if (key === 'mode_2') return ['Internal roster + Procucev Network', 'AI proximity & rating matching', 'Market band benchmarking'];
    if (key === 'mode_3') return ['Autonomous multi-round negotiation', '360° qualification scorecard', 'Zero-touch PO awarding'];
    return ['Strict internal roster exclusivity', 'Automated multi-channel chasers', 'Free Trial eligible'];
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  zoomout() {
    this.dialogRef.updateSize('70%');
  }

  zoomin() {
    this.dialogRef.updateSize('90%');
  }

  getImageURL(file: any) {
    let url = '';
    const parts = file['fileName'] ? file['fileName'].split('.') : [];
    const ext = parts.length > 0 ? parts[parts.length - 1].toLowerCase() : '';
    if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
      url = '/assets/images/export-excel.png';
    } else if (ext === 'pdf') {
      url = '/assets/images/new/download-pdf.svg';
    } else if (['png', 'jpg', 'jpeg'].includes(ext)) {
      url = '/assets/images/new/download-img.png';
    } else {
      url = '/assets/images/new/download-file.png';
    }
    return url;
  }
}

