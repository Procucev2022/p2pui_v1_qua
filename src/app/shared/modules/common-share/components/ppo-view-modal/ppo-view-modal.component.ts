import { Component, OnInit, Optional, Inject, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { EncryDecryService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from 'src/app/layout/client/services/client-service.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { PoCreateComponent } from '../po/po-create/po-create.component';
import jsPDF from 'jspdf';
import {DatePipe} from '@angular/common';
import autoTable from 'jspdf-autotable';
import { PposService } from 'src/app/layout/ppos/services/ppos.service';
import { swalConfirm } from 'src/app/shared/helpers/swal-confirm';
@Component({
    selector: 'app-ppo-view-modal',
    templateUrl: './ppo-view-modal.component.html',
    styleUrls: ['./ppo-view-modal.component.scss']
})
export class PpoViewModalComponent implements OnInit {
    selectedIndex = 0;
    prDetails: any;
    loggedUserDetails: any;
    loggedUserPermissions: any;
    defaultPermissions;
    dialog_width = 80;
    selectedPoItems: any;
    roleName: any;
    selectedauctionData: any;
    ppoItemsHeaders: any = [
        { field: 'description', header: 'Description', isLink: false, width: '300px' },
        { field: 'brand', header: 'Specification', isLink: false, width: '170px' },
        { field: 'quantity', header: 'PR Quantity', isLink: false, width: '140px' },
        { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '100px' },
        { field: 'unitprice', header: 'Unit Price'  , isLink: false, width: '140px'},
        { field: 'excludetaxamount', header: 'Basic Amount', isLink: false, width: '150px' },
        { field: 'gstValue', header: 'GST Value', isLink: false, width: '145px' },
        { field: 'totalamount', header: 'Total Amount', isLink: false, width: '155px' },
    ];
    prLineItemsDetails: any = [
        { field: 'serialNo', header: 'S.No', isLink: false, width: '100px' },
        { field: 'description', header: 'Product/Service Description', isLink: false, width: '250px' },
        { field: 'brand', header: 'Specifications', isLink: false, width: '170px' },

        { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '170px' },

        { field: 'quantity', header: 'Quantity', isLink: false, width: '150px' },

      ];
    constructor(public dialogRef: MatDialogRef<PpoViewModalComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data,
        private encryDecryService: EncryDecryService,
        private toaster: ToastrService,
        private clientService: ClientService,
        private modalDialog: MatDialog,
        private  ppoSer: PposService) { }

    ngOnInit() {
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        const temp =  JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')) );
        this.loggedUserDetails = temp.details;
        this.roleName = this.loggedUserDetails.role.roleName;
        this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
    }

    convertPo() {
        if (this.selectedPoItems == null || !this.selectedPoItems) {
            this.toaster.warning('Warning', 'Please select vendor from PPO Line Items tab');
            return false;
        }
        const dialog = this.modalDialog.open(PoCreateComponent, {
            width: '80%',
            minHeight: '400px',
             data: {
                 isPoCreate: true,
                 ppoId: this.data.ppoId,
                 prId: this.data.prId,
                 poItemsData: this.selectedPoItems,
                 ppoData: this.data
             }
         });
    }
    acceptPPO(actionType:string){
        this.data['approverId']=this.loggedUserDetails.id;
        const ppos =[this.data];
        if (actionType === 'Reject') {

            swalConfirm.open({
                title: '<h6>Please Confirm!!<h6>',
                html: '<h4>Are you sure you want to reject ppo?</h4>',
                confirmButtonText: 'Yes',
                confirmButtonColor: '#006dd5',
                cancelButtonColor: '#d63636',
                showCancelButton: true,
                reverseButtons: true
               }).then((result) => {
                if (result.value) {
                    this.ppoSer.rejectPPO(ppos).subscribe((res) => {
                        if (res['status'] === 'Success' || res['statusCode'] === 'Success') {
                            this.toaster.success(res.message, 'Success');
                            this.ppoSer.updateAcceptPPOViaService(true)
                            this.modalDialog.closeAll();
                        } else {
                            this.toaster.error('PPO Rejection failed', 'Failed');
                        }
                    });
                }
              });
        }
        if (actionType === 'Accept') {

            swalConfirm.open({
                title: '<h6>Please Confirm!!<h6>',
                html: '<h4>Are you sure you want to accept ppo?</h4>',
                confirmButtonText: 'Yes',
                confirmButtonColor: '#006dd5',
                cancelButtonColor: '#d63636',
                showCancelButton: true,
                reverseButtons: true
               }).then((result) => {
                if (result.value) {

                    this.ppoSer.acceptPPO(ppos).subscribe((res) => {
                        if (res['status'] === 'Success' || res['statusCode'] === 'Success') {
                            this.toaster.success(res.message, 'Success');
                           this.ppoSer.updateAcceptPPOViaService(true)
                           this.modalDialog.closeAll();
                        } else {
                            this.toaster.error('PPO Acceptance failed', 'Failed');
                        }
                    });

                }
              });
        }
    }

    onSelectedVendorFromPo(event) {
        this.selectedPoItems = event || null;
    }


    back() {
        this.selectedIndex--;
    }
    next() {
        this.selectedIndex++;
    }

    zoomout() {
        this.dialogRef.updateSize('70%');
    }

    zoomin() {
        this.dialogRef.updateSize('100%');
    }

    downloadPPO() {
        console.log('Download PPO is calling' + this.prDetails);



        let y = 30;
        const z = 0;
        const doc = new jsPDF();
        const column_names = this.prLineItemsDetails.map(col => ({ title: col.header, dataKey: col.field }));

        const pageHeight = doc.internal.pageSize.height;
        for (let i = 0; i < 10; i++) {
            doc.setLineWidth(0.3);
            doc.rect(5, 5, 200, pageHeight - 10);
            doc.addPage();

        }

        doc.setPage(1);
        doc.setFontSize(16);
        doc.setFont('helvetica');
        doc.setFontType('bold');
        doc.text(50, 15, 'Procurement Request Summary');
        const imgData = AppApiConfig.LOGO_IMG_BASE64_DATA;
        doc.addImage(imgData, 'png', 155, 8, 45, 20);
        doc.setFontSize(10);
        doc.setFont('helvetica');
        doc.setFontType('normal');
        doc.text('PR ID', 12, y);
        doc.text(': ' + ' ' +  this.prDetails.prId, 75, y);
        doc.text('Department name', 12, y = y + 8);
        doc.text(': ' + ' ' + this.prDetails.deptName, 75, y);
        doc.text('Single vendor ?', 12, y = y + 8);
        if ( this.prDetails.singleVendor === true) {
            doc.text(': ' + ' Yes', 75, y);
        } else {
            doc.text(': ' + ' No', 75, y);
        }
        doc.text('PR Corresponds', 12, y = y + 8);
        doc.text(': ' + ' ' +  this.prDetails.prCorrespond, 75, y);
        doc.text('Project Description', 12, y = y + 8);
        doc.text(': ' + ' ' +  this.prDetails.prDescription, 75, y);
        doc.text('suggested vendors ?', 12, y = y + 8);
        if ( this.prDetails.suggestNewVendor === true) {
            doc.text(': ' + ' Yes', 75, y);
        } else {
            doc.text(': ' + ' No', 75, y);
        }
        doc.text('Quote/Rate Card Available ?', 12, y = y + 8);
        if ( this.prDetails.rateCardAvailable === true) {
            doc.text(': ' + ' Yes', 75, y);
        } else {
            doc.text(': ' + ' No', 75, y);
        }
        doc.text('Priority', 12, y = y + 8);
        doc.text(': ' + ' ' +  this.prDetails.priority, 75, y);
        doc.text('Estimated PR Value (in INR)', 12, y = y + 8);
        doc.text(': ' + ' ' +  this.prDetails.estimatedPrvalue, 75, y);
        doc.text('Future Requirement Plan', 12, y = y + 8);
        doc.text(': ' + ' ' +  this.prDetails.futureRequirement, 75, y);
        doc.text('Expected Time', 12, y = y + 8);
        const datePipe = new DatePipe('en-US');
        const updated_date = datePipe.transform( this.prDetails.dueDate, 'dd-MM-yyyy');
        doc.text(': ' + ' ' + updated_date, 75, y);

        if (this.prDetails.prVendors.length !== 0) {
            doc.setFontSize(12);
            doc.setFont('helvetica');
            doc.setFontType('bold');
            doc.text('Vendors', 12, y = y + 15);
            const vendors_matrix = [];
            const vendors_headers = ['companyName', 'contactPerson', 'email', 'phone'];

            this.prDetails.prVendors.forEach((item, index) => {
                const row = [];
                vendors_headers.forEach(element => {
                    row.push(item[element]);
                });
                vendors_matrix.push(row);
            });

            autoTable(doc, {
                startY: y = y + 10 ,
                head: [vendors_headers],
                body: vendors_matrix

            });
            y = (doc as any).lastAutoTable.finalY  + 10;
        } else {
            y = y + 10;
        }
        doc.setFontSize(12);
        doc.setFont('helvetica');
        doc.setFontType('bold');
        doc.text('Items', 12, y );
        const ppoheaders = [];

        column_names.forEach(col => {
            ppoheaders.push(col.title);
        });
        const data_matrix = [];

        this.prDetails.pritems.forEach((item, index) => {
            const row = [];
            column_names.forEach(element => {
                row.push(item[element.dataKey]);
            });
            data_matrix.push(row);

        });
        autoTable(doc, {
            startY: y = y + 10 ,
            head: [ppoheaders],
            body: data_matrix

        });

        y = (doc as any).lastAutoTable.finalY  + 10;
        doc.setFontSize(12);
        doc.setFont('helvetica');
        doc.setFontType('bold');
        doc.text('Delivery Address Location :', 12, y );

        const address_headers = ['address', 'city', 'state'];
        const address_matrix = [];
        this.prDetails.clientdeliverylocation.forEach(item => {
            const row = [];
            address_headers.forEach(element => {
                if (item[element].length === 0) {
                    row.push('NA');
                } else {
                    row.push(item[element]);
                }

            });
            address_matrix.push(row);
        });

        autoTable(doc, {
            startY: y = y + 10 ,
            head: [address_headers],
            body: address_matrix

        });



        y = (doc as any).lastAutoTable.finalY ;
        // post auction comparision
    if (this.selectedauctionData != null ) {
        if ((doc as any).lastAutoTable.finalY + 20 > pageHeight - 20) {
            doc.setPage(doc.internal.getCurrentPageInfo().pageNumber + 1);
            y = 0;
        } else {}
        doc.setFontSize(16);
        doc.setFont('helvetica');
        doc.setFontType('bold');
        doc.text(70, y = y + 10, 'Post Auction Comparision');

        const auction_headers = ['Item/Vendor'];
        const auction_vids = [];
        for (const item of this.selectedauctionData.headers) {

            auction_headers.push(item.vname + ' - ' + item.qid);
            auction_vids.push(item.vid);
        }

        const auction_data = [];


        for (const obj of this.selectedauctionData.items) {
        const row = [];
        row.push(obj.description);

            for (const head_item of auction_vids) {
                for (const obj_item of obj.data) {
                    if (obj_item.vendorid === head_item) {
                        row.push(obj_item.totalamount);
                        break;
                    }
                }
            }

            auction_data.push(row);
        }

        autoTable(doc, {
            startY: y = y + 10 ,
            head: [auction_headers],
            body: auction_data

        });
        y = (doc as any).lastAutoTable.finalY ;

    }







    //     ppo items
    if (doc.lastAutoTable.finalY + 20 > pageHeight - 20) {
        doc.setPage(doc.internal.getCurrentPageInfo().pageNumber + 1);
        y = 10;
    } else {}

    doc.setFontSize(16);
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.text(70, y = y + 10, 'PPO items');

        doc.setFontSize(10);
        doc.setFont('helvetica');
        doc.setFontType('normal');
        doc.text('PPO Id ', 12, y = y + 15);

        doc.text(': ' + ' ' + this.data.ppoId, 75, y );


        doc.text('PPO Value ', 12, y = y + 8);

        doc.text(': ' + ' ' + this.data.ppoValue, 75, y);

        doc.text('PPO Date', 12, y = y + 8);

        doc.text(': ' + ' ' + this.data.createdTS, 75, y );

        const exportColumns = this.ppoItemsHeaders.map(col => ({ title: col.header, dataKey: col.field }));

        const headers = [];

        exportColumns.forEach(col => {
            headers.push(col.title);
        });

        const groupItemsByVendorId = this.data.ppoitems.reduce(function (r, a) {
            r[a.org.id] = r[a.org.id] || [];
            r[a.org.id].push(a);
            return r;
        }, Object.create(null))  ;



        const vendorsList = Object.keys(groupItemsByVendorId);
        for (let i = 0; i < vendorsList.length; i++) {

            const current_vendor_data = groupItemsByVendorId[vendorsList[i]];
            console.log(current_vendor_data[0].org.companyName + '  ' + current_vendor_data.length);
            doc.setTextColor(255, 0, 0);
            doc.text('Vendor Name: ' + current_vendor_data[0].org.companyName, 12,  y = y + 10 );

            const data_matrix = [];

            current_vendor_data.forEach(item => {
                const row = [];
                exportColumns.forEach(element => {

                    row.push(item[element.dataKey]);
                });
                data_matrix.push(row);
            });


            autoTable(doc, {
                startY: y = y + 10 ,
                head: [headers],
                body: data_matrix

            });
            y = (doc as any).lastAutoTable.finalY;
        }

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica');
        doc.setFontType('normal');
        doc.text('Delivery Terms ', 12, doc.lastAutoTable.finalY = doc.lastAutoTable.finalY  + 10 );


        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.setFont('helvetica');
        doc.setFontType('normal');
        doc.text(this.data.deliveryTerms == null ? 'tc' : this.data.deliveryTerms, 12, doc.lastAutoTable.finalY = doc.lastAutoTable.finalY + 5 );


        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica');
        doc.setFontType('normal');
        doc.text('Other Terms ', 12, doc.lastAutoTable.finalY = doc.lastAutoTable.finalY + z + 20);


        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.setFont('helvetica');
        doc.setFontType('normal');
        doc.text(this.data.otherTerms == null ? 'tc' :  this.data.otherTerms, 12, doc.lastAutoTable.finalY = doc.lastAutoTable.finalY + 5);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica');
        doc.setFontType('normal');
        doc.text('Payment Terms', 12 , doc.lastAutoTable.finalY = doc.lastAutoTable.finalY + 20);

        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.setFont('helvetica');
        doc.setFontType('normal');
        doc.text(this.data.paymentTerms == null ? 'tc' : this.data.paymentTerms, 12, doc.lastAutoTable.finalY = doc.lastAutoTable.finalY  + 5);


        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica');
        doc.setFontType('normal');
        doc.text('ApprovedBy:' + this.data.approvedBy, 160, doc.lastAutoTable.finalY = doc.lastAutoTable.finalY + 20);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica');
        doc.setFontType('normal');
        doc.text('ReviewedBy: ' + this.data.submittedBy, 160, doc.lastAutoTable.finalY = doc.lastAutoTable.finalY  + 5);


        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica');
        doc.setFontType('normal');
        doc.text('Submitted: ' + this.data.createdBy, 160, doc.lastAutoTable.finalY = doc.lastAutoTable.finalY + 5);


        const current_page_number = doc.internal.getCurrentPageInfo().pageNumber;
        const pageCount = doc.internal.getNumberOfPages();

        for (let i = current_page_number + 1; i < pageCount; i++) {
            doc.deletePage(current_page_number + 1);
        }
        doc.deletePage(current_page_number + 1);


        doc.save(this.prDetails.prId + '.pdf');  // not using
    }

    getPRdetails(value) {
        this.prDetails = value;
    }

    getAuctionData(data) {
        this.selectedauctionData = data;
        console.log('aunction data ' + JSON.stringify(this.selectedauctionData));
    }

    ppoActions(actionType) {
        let ppos:any = [] ;
        const selectedData = [{'id': this.data.id, approverId: this.loggedUserDetails.id}];
        let check = false;
        if (selectedData.length > 0) {
            selectedData.forEach((data:any) => {
                if (this.data.procucevStatus.uiDisplay === 'Client Accepted' || this.data.procucevStatus.uiDisplay === 'Client Rejected') {
                    this.toaster.error('The following request cant be process as it has already Selected or Rejected PRs. Please unselect selected or rejected PRs', 'Failed');
                    check = true;
                }
            });
            if (actionType === 'Submit' || actionType === 'Reject' || actionType === 'Reject_p') {
                selectedData.forEach(element => {
                    if (this.loggedUserDetails.role.roleName === 'CategoryManager2') {
                    ppos.push({'id': element.id, 'submittedBy': localStorage.getItem('userFullName')});
                    } else {
                    ppos.push({'id': element.id, approverId: this.loggedUserDetails.id});
                    }
                });
            }
           if (actionType === 'Accept') {
               selectedData.forEach((data:any) => {
                if (this.data.procucevStatus.uiDisplay === 'Submitted') {
                    data.approvedBy = localStorage.getItem('userFullName');
                    data.approverId =  this.loggedUserDetails.id
                    ppos.push(data);
                }
               });
            //    ppos = [...this.selectedData];
           }
        }

        if (check) {
            return;
        }
        if (actionType === 'Submit') {
            swalConfirm.open({
                title: '<h6>Please Confirm!!<h6>',
                html: '<h4>Are you sure you want to submit ppo?</h4>',
                confirmButtonText: 'Yes',
                confirmButtonColor: '#006dd5',
                cancelButtonColor: '#d63636',
                showCancelButton: true,
                reverseButtons: true
               }).then((result) => {
                if (result.value) {
                    this.ppoSer.submitPPO(ppos).subscribe((res) => {
                        if (res['status'] === 'Success' || res['statusCode'] === 'Success') {
                            this.toaster.success(res.message, 'Success');
                           this.modalDialog.closeAll();
                        } else {
                            this.toaster.error('PPO submission failed', 'Failed');
                        }
                    });
                }
            });
        }
        if (actionType === 'Accept') {
            swalConfirm.open({
                title: '<h6>Please Confirm!!<h6>',
                html: '<h4>Are you sure you want to accept ppo?</h4>',
                confirmButtonText: 'Yes',
                confirmButtonColor: '#006dd5',
                cancelButtonColor: '#d63636',
                showCancelButton: true,
                reverseButtons: true
               }).then((result) => {
                if (result.value) {

                    this.ppoSer.acceptPPO(ppos).subscribe((res) => {
                        if (res['status'] === 'Success' || res['statusCode'] === 'Success') {
                            this.toaster.success(res.message, 'Success');
                        } else {
                            this.toaster.error('PPO Acceptance failed', 'Failed');
                        }
                    });

                }
              });
        }

        if (actionType === 'Reject') {

            swalConfirm.open({
                title: '<h6>Please Confirm!!<h6>',
                html: '<h4>Are you sure you want to reject ppo?</h4>',
                confirmButtonText: 'Yes',
                confirmButtonColor: '#006dd5',
                cancelButtonColor: '#d63636',
                showCancelButton: true,
                reverseButtons: true
               }).then((result) => {
                if (result.value) {
                    this.ppoSer.rejectPPO(ppos).subscribe((res) => {
                        if (res['status'] === 'Success' || res['statusCode'] === 'Success') {
                            this.toaster.success(res.message, 'Success');
                        } else {
                            this.toaster.error('PPO Rejection failed', 'Failed');
                        }
                    });
                }
              });
        }

        if (actionType === 'Reject_p') {

            swalConfirm.open({
                title: '<h6>Please Confirm!!<h6>',
                html: '<h4>Are you sure you want to reject ppo?</h4>',
                confirmButtonText: 'Yes',
                confirmButtonColor: '#006dd5',
                cancelButtonColor: '#d63636',
                showCancelButton: true,
                reverseButtons: true
               }).then((result) => {
                if (result.value) {
                    this.ppoSer.rejectPPOByCm(ppos).subscribe((res) => {
                        if (res['status'] === 'Success' || res['statusCode'] === 'Success') {
                            this.toaster.success(res.message, 'Success');

                        } else {
                            this.toaster.error('PPO Rejection failed', 'Failed');
                        }
                    });
                }
              });
        }


    }

}
