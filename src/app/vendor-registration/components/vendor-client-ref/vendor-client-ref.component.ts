import { Component  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';

@Component({
  selector: 'app-vendor-client-ref',
  templateUrl: './vendor-client-ref.component.html',
  styleUrls: ['./vendor-client-ref.component.scss'],
  standalone: true,
  imports: [FormsModule, MatDialogModule]
})
export class VendorClientRefComponent {

  model:any = {};
  action:string;
  local_data:any;
  selectedDocumentsArray: any[] = [];
  selectedDocuments: any = [];

  constructor(
    public dialogRef: MatDialogRef<any>,
    private convertService: ConvertToBase64Service,
    private convertSer: ConvertToBase64Service) {
  }

  onSubmit(){
    var temp = this.model;
    temp.file = this.selectedDocuments; // changing model value directly will throw error
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
}
}

