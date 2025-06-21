
import { Component, OnInit, Inject } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { ConvertToBase64Service } from '../../services/convert-to-base64.service';
import { CategoryService } from 'src/app/layout/category/services/category.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ppo-create',
  templateUrl: './ppo-create.component.html',
  styleUrls: ['./ppo-create.component.scss']
})
export class PpoCreateComponent implements OnInit {
  deliveryTerms: any;
  sumOfGstValue: any;
  sumOfExcludetaxamount: any;

  constructor( public dialogRef: MatDialogRef<PpoCreateComponent>,
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
  message;
  ppoItemsTableHeaders: any = [
   { field: 'description', header: 'Description'  , isLink: false},
   { field: 'brand', header: 'Specifications'  , isLink: false},
    { field: 'unitofMeasures', header: 'UOM'  , isLink: false},
    { field: 'quantity', header: 'Quantity'  , isLink: false},
    { field: 'unitprice', header: 'Unit Price'  , isLink: false},
    { field: 'excludetaxamount', header: 'Total Basic Amount'  , isLink: false},
    // { field: 'gstValue', header: 'GST Amount'  , isLink: false},
    // { field: 'totalamount', header: 'Total Amount'  , isLink: false}
];
  ngOnInit() {
    let ppoData:any;
    if(this.data.isCapex && this.data.isCapex == true){
        this.ppoData = this.data.data;

    }else{
        this.ppoData = this.data;
    }

    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;


    if(this.data.isCapex && this.data.isCapex == true){
        this.sumOfExcludetaxamount = this.data.data.ppoValue;
        ppoData = [...this.ppoData.ppoitems];
        this.ppoItemsArray = ppoData.map((data:any) => {

            return {...data, unitprice: data.unitPrice, excludetaxamount: data.totalBasicAmount};

        });
        console.log('item', this.ppoItemsArray);
        this.sumOfGstValue = this.ppoItemsArray.reduce(function (accumulator, item) {
          return accumulator + parseFloat(item.gstValue);
        }, 0);
    }else{
        const ppoData = [...this.ppoData.ppoitems];
            this.ppoItemsArray = ppoData.filter((data) => {
            if (data.id) {
                return data;
            }
            });
        this.sumOfExcludetaxamount = this.ppoItemsArray.reduce(function (accumulator, item) {
            return accumulator + item.excludetaxamount;
          }, 0);
          console.log('item', this.ppoItemsArray);
          this.sumOfGstValue = this.ppoItemsArray.reduce(function (accumulator, item) {
            return accumulator + parseFloat(item.gstValue);
          }, 0);
    }

    // this.ppoItemsArray.push(
    //   {
    //     'description' : '',
    //     'brand' : '',
    //     'unitofMeasures' : '',
    //     'quantity' : '',
    //     'excludetaxamount' : this.sumOfExcludetaxamount,
    //     'gstValue' : this.sumOfGstValue,
    //     'totalamount' : this.ppoData.ppoValue
    //   }
    // )

  }

  closeDialog() {
    this.dialogRef.close({event: 'Cancel'});
    // console.log('ngnkwrngk')
  }

  createConfirmPPO() {
    const ppoItems = [];
    this.ppoItemsArray.forEach(element => {
      delete element['isActive'];
      delete element['item_NA'];
      delete element['id'];
      const org  = {
        'id': element.vendorId
      };
      element['org'] = org;
      ppoItems.push(element);
    });
    let reqObj = {
      'ppoValue': this.ppoData.ppoValue,
     'pr': {'id': this.data.isCapex ? this.ppoData.pr.id: this.ppoData.prId},
      'ppoitems': ppoItems,
      'org': {'id': localStorage.getItem('orgId') },
      'otherTerms': this.otherTerms,
      'paymentTerms': this.paymentTerms,
      'message': this.message,
      'deliveryTerms': this.deliveryTerms,
      'submittedBy': localStorage.getItem('userFullName'),
      'createdBy': localStorage.getItem('userFullName'),
      'documents': this.documentsArray,
      'rfq': this.ppoData.rfq
    };
    if(this.data.isCapex){
        reqObj['vendor']= this.data.data.vendor
    }
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
        if(this.data.isCapex && this.data.isCapex == true){
            this.procService.createPPO(reqObj).subscribe((res:any)=>{
                if (res.status == 'Success') {
                    this.toastrService.success('PPO Creation done successfully', 'Success');
                    this.modalDialog.closeAll();
                } else {
                    this.toastrService.error('PPO Creation failed ', 'Failed');
                }
              })
        }else{
            this.procService.createPPO(reqObj).subscribe((response) => {
                if (response['statusCode'] === 'Success' || response['status'] === 'Success') {
                  this.toastrService.success('PPO Creation done successfully', 'Success');
                  this.modalDialog.closeAll();
                } else {
                  this.toastrService.error('PPO Creation failed ', 'Failed');
                }
              });
        }

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
