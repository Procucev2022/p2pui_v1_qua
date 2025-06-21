import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-gmt-vendor-info-modal',
    templateUrl: './gmt-vendor-info-modal.component.html',
    styleUrls: ['./gmt-vendor-info-modal.component.scss']
})
export class GmtVendorInfoModalComponent implements OnInit {

    @Input('vendorInfo') vendorInfo: any;
    @Input('selectedVendor') selectedVendor: any;

    constructor() { }

    ngOnInit() {
    }

}
