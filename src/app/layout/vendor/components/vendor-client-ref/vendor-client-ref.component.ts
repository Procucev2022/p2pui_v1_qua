import { Component, Inject,Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-vendor-client-ref',
  templateUrl: './vendor-client-ref.component.html',
  styleUrls: ['./vendor-client-ref.component.scss'],
  standalone: true,
  imports:[FormsModule,ReactiveFormsModule, MatDialogModule]
})
export class VendorClientRefComponent {

  model:any = {};
  action:string;
  local_data:any;
  selectedDocumentsArray: any[] = [];
  selectedDocuments: any = [];

  constructor(
    public dialogRef: MatDialogRef<VendorClientRefComponent>,
    private convertService: ConvertToBase64Service,
    private convertSer: ConvertToBase64Service) {
  }

  onSubmit(addVendorCliRef: NgForm){
      if(addVendorCliRef.invalid){
          return;
      }
    var temp = this.model;
    temp.files = this.selectedDocuments; // changing model value directly will throw error
    this.dialogRef.close({event:'submit', data:temp});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

  onFileUpload(event:any){
    this.selectedDocumentsArray = Array.from(event.target.files);

    this.selectedDocumentsArray.forEach(file => {
      this.convertSer.getBase64(file).then((data:string)=>{
        var temp = {
          fileName: file.name,
          file: data.split(',')[1]
        }
        this.selectedDocuments.push(temp);
        //this.model.file = this.selectedDocuments;
      })

    });
    console.log(this.model.file);
    console.log(this.model.files);
}
}

