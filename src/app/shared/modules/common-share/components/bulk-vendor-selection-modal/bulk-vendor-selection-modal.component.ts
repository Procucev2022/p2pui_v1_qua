import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-bulk-vendor-selection-modal',
  templateUrl: './bulk-vendor-selection-modal.component.html',
  styleUrls: ['./bulk-vendor-selection-modal.component.scss']
})
export class BulkVendorSelectionModalComponent implements OnInit {
  vendorList: any[] = [];
  totalEntered: number = 0;
  foundCount: number = 0;
  notFoundItems: string[] = [];
  selectedVendors: any[] = [];
  selectAll: boolean = true;
  existingCartVendorIds: Set<string> = new Set();

  constructor(
    public dialogRef: MatDialogRef<BulkVendorSelectionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.vendorList = Array.isArray(this.data.vendorList) ? [...this.data.vendorList] : [];
      this.totalEntered = this.data.totalEntered || this.vendorList.length;
      this.foundCount = this.vendorList.length;
      this.notFoundItems = Array.isArray(this.data.notFoundItems)
        ? this.data.notFoundItems
        : (Array.isArray(this.data.notFoundEmails) ? this.data.notFoundEmails : []);

      if (Array.isArray(this.data.existingCartVendorIds)) {
        this.existingCartVendorIds = new Set(this.data.existingCartVendorIds);
      }

      this.vendorList = this.vendorList.map((v, idx) => ({
        ...v,
        rowNum: idx + 1,
        selected: true,
        alreadyInCart: v.id ? this.existingCartVendorIds.has(v.id) : false
      }));

      this.updateSelectionState();
    }
  }

  toggleSelectAll(): void {
    this.vendorList.forEach(v => {
      if (!v.alreadyInCart) {
        v.selected = this.selectAll;
      }
    });
    this.updateSelectionState();
  }

  onVendorSelectChange(): void {
    this.updateSelectionState();
  }

  updateSelectionState(): void {
    this.selectedVendors = this.vendorList.filter(v => v.selected && !v.alreadyInCart);
    const selectableVendors = this.vendorList.filter(v => !v.alreadyInCart);
    this.selectAll = selectableVendors.length > 0 && selectableVendors.every(v => v.selected);
  }

  onAddSelectedToCart(): void {
    const vendorsToAdd = this.selectedVendors.filter(v => !v.alreadyInCart);
    this.dialogRef.close({ action: 'addVendors', selectedVendors: vendorsToAdd });
  }

  onClose(): void {
    this.dialogRef.close({ action: 'cancel' });
  }
}
