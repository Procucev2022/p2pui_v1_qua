import { Component, Inject,Optional } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export interface ProductService {
  id:number;
  hsnCode:string;
  sacCode: string;
  productName:string;
  description: string;
  others:string;
}

@Component({
  selector: 'app-vendor-contacts',
  templateUrl: './vendor-contacts.component.html',
  styleUrls: ['./vendor-contacts.component.scss'],
  standalone: true,
  imports:[FormsModule,ReactiveFormsModule, MatDialogModule]
})
export class VendorContactsComponent  {

  model: any = {};
  action:string;
  local_data:any;

  constructor(
    public dialogRef: MatDialogRef<VendorContactsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ProductService) {
    console.log(data);
    this.local_data = {...data};
    this.action = this.local_data.action;
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

  onAddContact(addForm){
      if(addForm.invalid){
          return;
      }
    this.dialogRef.close({event:'submit', data: addForm.value});
  }

}
