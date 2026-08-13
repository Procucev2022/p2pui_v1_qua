import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { EditClientLinkingToItemModalComponent } from '../edit-client-linking-to-item-modal/edit-client-linking-to-item-modal.component';
import { EncryDecryService } from 'src/app/shared/services';

@Component({
  selector: 'app-link-client-modal',
  templateUrl: './link-client-modal.component.html',
  styleUrls: ['./link-client-modal.component.scss']
})
export class LinkClientModalComponent implements OnInit {

    @ViewChild('editRegionModal') editRegionModal:any;
    searchForm: FormGroup;
    clientList = [];
    clientHeaders = [
      { field: 'companyName',  header: 'Company Name',  isLink: false, width: '220px', fieldType: 'text' },
      { field: 'city',  header: 'City',  isLink: false, width: '220px', fieldType: 'text' },
      { field: 'vendorEmail',  header: 'Email Id',  isLink: false, width: '220px', fieldType: 'text' },
      { field: 'address1',  header: 'Address',  isLink: false, width: '220px', fieldType: 'text' }
    ];
    selectedData = [];
    loggedUserDetails: any;
    roleName: any;
    regionsList: any =[];
    regionModalRef: any;
    selectedRegion: any = [];

    constructor(private fb: FormBuilder,
      private catService: CategoryService,  private modalDialog: MatDialog,  public dialogRef: MatDialogRef<LinkClientModalComponent >,
      @Optional() @Inject(MAT_DIALOG_DATA) public selectedItemData, private toastr: ToastrService,
      private encryDecryService:EncryDecryService) { }

    ngOnInit() {
      console.log('selectedItemData', this.selectedItemData);
      this.searchForm =  this.fb.group({
        companyName: [''],
        city: [''],
      });
      const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
      this.loggedUserDetails = temp.details;
      this.roleName = this.loggedUserDetails.role.roleName;
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
        this.clientList = res;
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

      const finalLinkedclientList  = [];
      const linkedclientList =  this.clientList.filter((ele) => ele.isLinked);
      this.selectedData.forEach(ele => {
         const clientObj  = {
          'client': {
            'id': ele.id
          },
          "vendor":{
            "id":this.selectedItemData.client['vendorId']
            },
          'item': {
            'id': this.selectedItemData.item['id']
          },
          'regions': this.selectedRegion.map((ele:any) => {return {"region": ele.region}})
         };
        //  const finalpayLoad = {...ele['linkedClientItemDetails'], ...clientObj};
        //  console.log('final payload', finalpayLoad);
         finalLinkedclientList.push(clientObj);
     });
     this.catService.getLinkedVendorsByClient(finalLinkedclientList).subscribe((res) => {
       if (res['status'] === 'Success') {
         this.toastr.success(res['message'], 'Success');
         this.dialogRef.close({event: 'linked'});
       }else{
        this.toastr.error(res['errorMessage'], 'Error');
       }
     });
  }

  showRegionModal(rowData:any){
    this.selectedData =[rowData];
    this.regionsList = []
    this.selectedRegion = [];
    this.catService.getRegionsByOrgId({id: rowData.id}).subscribe((res:any)=>{
        if(Array.isArray(res)){
            this.regionsList = res;
        }
    })
    // this.regionsList = [{region:'South'}]

        this.regionModalRef=  this.modalDialog.open( this.editRegionModal, {
            width: '30%',
            minHeight: '34vh',
            data: rowData

        });


  }


  closeRegionModal(){
    this.regionModalRef.close();
  }
}
