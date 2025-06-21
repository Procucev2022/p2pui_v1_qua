import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Component({
    selector: 'app-ven-req-view-modal',
    templateUrl: './ven-req-view-modal.component.html',
    styleUrls: ['./ven-req-view-modal.component.scss']
})
export class VenReqViewModalComponent implements OnInit {
    selectedPriority: any;
    priorityTypes: any[] = ['High', 'Moderate', 'Low'];
    description;
    selectProductorService = ['Product', 'Service'];
    dropDownConfig = {
        search: true,
        placeholder: 'Select',
        searchPlaceholder: 'Search',
        height: 'auto'
    };
    classificationList: any = [{
        typeName: null,
        segmentName: '',
        familyName: '',
        className: '',
        commodityName: '',
        hsnCode: '',

        section: '',
        heading: '',
        groupdescription: '',
        sac: '',
        sacCode: ''
    }];

    approvalList: any[] = [{
        segmentName: '',
        familyName: '',
        className: '',
        commodityName: '',
        hsnCode: '',
        hsnCodes: [],
        segmentNames: [],
        familyNames: [],
        classNames: [],
        commodityNames: [],
        typeName: '',

        section: '',
        heading: '',
        groupdescription: '',
        sac: '',
        sacCode: '',
        sacCodes: [],
        sections: [],
        headings: [],
        groupdescriptions: [],
        sacs: []
    }];
    type: any;
    productList: any;
    serviceList: any;
    vendorDetails: any = [];
    vendorDetailsHeaders: any = [
        { field: 'vendorId', header: 'Vendor ID', isLink: false },
        { field: 'vendorName', header: 'Vendor Name', isLink: false },

    ];
    pageRecordSize: number;
    pageOptions: number[];
    paginatoryDetails: any;
    vendorDocuments: any;

    constructor(public dialogRef: MatDialogRef<VenReqViewModalComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data) {
            console.log(data);

         }

    ngOnInit() {
        // this.classificationList = this.data.vendorServiceApprove;
        this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
        this.selectedPriority = this.data.priority;
        this.description = this.data.description;
        this.type = this.data.type;
        this.vendorDocuments =  this.data.vendorreqDocuments;
        this.vendorDetails = this.data.requestVendorDetails;
        this.productList = this.data.vendorCategory;
        this.serviceList = this.data.vendorServiceApprove;
    }

    // closeDialog() {
    //     this.dialogRef.close({ event: 'Cancel' });
    // }
}
