import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from 'src/app/app.config';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import swal from 'sweetalert2';
import { ConvertToBase64Service } from '../../services/convert-to-base64.service';

@Component({
  selector: 'app-linked-pr-ppo-create',
  templateUrl: './linked-pr-ppo-create.component.html',
  styleUrls: ['./linked-pr-ppo-create.component.scss']
})
export class LinkedPrPpoCreateComponent implements OnInit {

    deliveryTerms: any;

    constructor( public dialogRef: MatDialogRef<LinkedPrPpoCreateComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
     private procService: CatProcuRequestsService,
     private toastrService: ToastrService,
     private modalDialog: MatDialog,
     private convertSer: ConvertToBase64Service) { }

    ppoItemsArray: any[] = [];
    ppoData: any;
    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    documentsArray: any[] = [];
    paymentTerms;
    otherTerms;
    ppoItemsTableHeaders: any = [
     { field: 'description', header: 'Description'  , isLink: false},
     { field: 'brand', header: 'Specifications'  , isLink: false},
      { field: 'unitofMeasures', header: 'UOM'  , isLink: false},
      { field: 'quantity', header: 'Quantity'  , isLink: false},
      { field: 'linkedItemPrice', header: 'Unit Price'  , isLink: false},
      { field: 'totalBasicAmount', header: 'Total Basic Amount'  , isLink: false},
      // { field: 'gstValue', header: 'GST Amount'  , isLink: false},
      // { field: 'excludetaxamount', header: 'Total Amount'  , isLink: false}
  ];
    ngOnInit() {
      this.ppoData = this.data;
      this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
      this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
      const ppoData = [...this.ppoData.ppoitems];
      console.log('item', this.ppoItemsArray);
      this.ppoItemsArray = ppoData.filter((data) => {
        data['gstValue'] = 0;
        data['excludetaxamount'] = data['linkedItemPrice'] + 0;
        data['totalBasicAmount'] = data['quantity'] * data['linkedItemPrice'];
        return data;
      });
      console.log('item1', this.ppoItemsArray);
    }

    closeDialog() {
      this.dialogRef.close({event: 'Cancel'});
      // console.log('ngnkwrngk')
    }

    createConfirmPPO() {
      const ppoItems = [];
      this.ppoItemsArray.forEach((element:any) => {
        element['pritemId'] = element.id;
        delete element['isActive'];
        delete element['item_NA'];
        delete element['id'];
        const org  = {
          'id': element.vendorId
        };
        element['org'] = org;
        element['unitprice'] = element['linkedItemPrice'];
        element['excludetaxamount']= element['totalBasicAmount']
        ppoItems.push(element);
      });
      const reqObj = {
        'ppoValue': this.ppoData.ppoValue,
       'pr': {'id': this.ppoData.prId.id},
        'ppoitems': ppoItems,
        'org': {'id': localStorage.getItem('orgId') },
        'otherTerms': this.otherTerms,
        'paymentTerms': this.paymentTerms,
        'deliveryTerms': this.deliveryTerms,
        'submittedBy': localStorage.getItem('userFullName'),
        'createdBy': localStorage.getItem('userFullName'),
        'documents': this.documentsArray,
      };
      swal({
        title: '<h6>Please Confirm!!<h6>',
        html: '<h4>Are you sure you want to create PPO?</h4>',
        confirmButtonText: 'Yes',
        confirmButtonColor: '#006dd5',
        cancelButtonColor: '#d63636',
        showCancelButton: true,
        reverseButtons: true
       }).then((result) => {
        if (result.value) {
      this.procService.createPPO(reqObj).subscribe((response) => {
        if (response['statusCode'] === 'Success' || response['status'] === 'Success') {
          this.toastrService.success('PPO Creation done successfully', 'Success');
          this.dialogRef.close({event: 'ppoCreated'});
          // this.modalDialog.closeAll();
        } else {
          this.toastrService.error('PPO Creation failed ', 'Failed');
        }
      });
      }
    });
    }

    deleteDocuments(index, type) {
    this[type].splice(index, 1);
      if (type === 'documentsArray') {
        this.documentsArray.splice(index, 1);
      }
  }

    uploadDocuments(files) {
      Array.from(files).forEach((file: any) => {
        this.convertSer.getBase64(file).then((data: string) => {
            const temp = {
                fileName: file.name,
                file: data.split(',')[1]
            };
            this.documentsArray.push(temp);
        });
    });
    }

    uploadFile($event) {
      console.log($event);

  }

}
