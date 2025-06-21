import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BfsItemsService } from '../bfs-items.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-bfs-user-info-details',
  templateUrl: './bfs-user-info-details.component.html',
  styleUrls: ['./bfs-user-info-details.component.scss']
})
export class BfsUserInfoDetailsComponent implements OnInit {
    selectedRowData: any;
    @ViewChild('viewItemDetailsTemplate') viewItemDetailsTemplate: any;
    @Input('selectedId') selectedId:any;
    @Input('labelName') labelName:string;


  constructor(private bfsService: BfsItemsService, private toaster: ToastrService, private dialog: MatDialog) { }

  ngOnInit() {
  }

  onViewItemDetails(rowData: any) {

}

  getDetails(){
    if(!this.selectedId){
        this.toaster.warning("Buyer/Seller Id details not available", "Warning");
        return
    }

    this.bfsService.selectedIdDetails({id: this.selectedId}).subscribe((res:any)=>{
        if(res && res.email){
            this.selectedRowData= res;
            const dialogConfig = new MatDialogConfig();
            // dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;
            dialogConfig.data = null;
            dialogConfig.minWidth = 400;
            dialogConfig.minHeight = 500;
            dialogConfig.maxWidth = 'none';
            dialogConfig.width = '35%';
            const dialogRef = this.dialog.open(this.viewItemDetailsTemplate, dialogConfig).afterClosed().subscribe(result => {

            });
        }else{
            this.toaster.error(res.errorMessage, "Error");
            this.selectedRowData= null;
        }
    })

  }
}
