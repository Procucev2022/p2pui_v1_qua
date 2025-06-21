import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { EditClientLinkingToItemModalComponent } from '../edit-client-linking-to-item-modal/edit-client-linking-to-item-modal.component';

@Component({
  selector: 'app-client-linking-to-item-modal',
  templateUrl: './client-linking-to-item-modal.component.html',
  styleUrls: ['./client-linking-to-item-modal.component.scss']
})
export class ClientLinkingToItemModalComponent implements OnInit {
  searchForm: FormGroup;
  clientList = [];
  clientHeaders = [
    { field: 'companyName',  header: 'Company Name',  isLink: false, width: '220px', fieldType: 'text' },
    { field: 'city',  header: 'City',  isLink: false, width: '220px', fieldType: 'text' },
    { field: 'vendorEmail',  header: 'Email Id',  isLink: false, width: '220px', fieldType: 'text' },
    { field: 'address1',  header: 'Address',  isLink: false, width: '220px', fieldType: 'text' }
  ];
  selectedData = [];

  constructor(private fb: FormBuilder,
    private catService: CategoryService,  private modalDialog: MatDialog,  public dialogRef: MatDialogRef<ClientLinkingToItemModalComponent >,
    @Optional() @Inject(MAT_DIALOG_DATA) public selectedItemData, private toastr: ToastrService) { }

  ngOnInit() {
    console.log('selectedItemData', this.selectedItemData);
    this.searchForm =  this.fb.group({
      companyName: [''],
      city: [''],
    });

  }

 get city() {return this.searchForm.controls.city ; }
 get companyName() {return this.searchForm.controls.companyName ; }

 searchclient() {
  const reqPayload = {
    city: this.city.value,
    companyName: this.companyName.value,
  };
  this.catService.getClientSearch(reqPayload).subscribe((res) => {
    if (Array.isArray(res)) {
      this.clientList = res || [];
      this.clientList.forEach(element => {
        element['isLinked'] = false;
      });
    }
  });
 }

 resetForm() {
   this.searchForm.reset();
 }



 checkAnyClientLinkedOrNot() {
  return this.clientList.some((ele) => ele['isLinked']);
}

unLinkClient(rowData, index) {
  delete this.clientList[index]['linkedClientItemDetails'];
  this.clientList[index]['isEdit'] = false;
  this.clientList[index]['isLinked'] = false;
 }

linkUnLinkClientModal(rowData, index) {
  this.modalDialog.open(EditClientLinkingToItemModalComponent, {
  width: '80%',
  minHeight: '44vh',
  data: rowData

  }).afterClosed().subscribe((event) => {
    if (event.type === 'linked') {
    this.clientList[index] = Object.assign({}, event['data']);
    }
  });
}

submitForm() {
  if (this.checkAnyClientLinkedOrNot()) {
    const finalLinkedclientList  = [];
    const linkedclientList =  this.clientList.filter((ele) => ele.isLinked);
    linkedclientList.forEach(ele => {
       const clientObj  = {
        'client': {
          'id': ele.id
        },
        'item': {
          'id': this.selectedItemData.id
        }
       };
       const finalpayLoad = {...ele['linkedClientItemDetails'], ...clientObj};
       console.log('final payload', finalpayLoad);
       finalLinkedclientList.push(finalpayLoad);
   });
   this.catService.LinkToClientWithItem(finalLinkedclientList).subscribe((res) => {
     if (res['status'] === 'Success') {
       this.toastr.success(res['message'], 'Success');
       this.dialogRef.close({event: 'linked'});
     }else{
        this.toastr.error(res['errorMessage'], 'Error');
     }
   });
  } else {
    this.toastr.warning('Please Link atleast one Client with Item', 'Warning');
  }
}
}
