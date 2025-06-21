import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { RaiseIssuesService } from '../../services/raise-issues.service';
import { CreateIssueComponent } from '../create-issue/create-issue.component';
import { ViewIssueComponent } from '../view-issue/view-issue.component';

@Component({
  selector: 'app-raised-issues',
  templateUrl: './raised-issues.component.html',
  styleUrls: ['./raised-issues.component.scss']
})
export class RaisedIssuesComponent implements OnInit {
    selectedData :any = [];
    raisedIssiesList:any = [];
    pageRecordSize: any;
    pageOptions: any;
    raisedIssueHeaders: any = [
        { field: 'clientId', header: 'Client Name', isLink: false, width: '220px' },
        { field: 'vendorId', header: 'Vendor Name', isLink: false , width: '220px'},
        { field: 'questions', header: 'Issue Description', isLink: false , width: '220px'},
    ];
    paginatoryDetails: any;

  constructor(private modalDialog: MatDialog,
    private toaster: ToastrService,
    private raiseIssueSer: RaiseIssuesService) { }

  ngOnInit() {
    this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
    this.getAllRaisedIssues();
  }

  getAllRaisedIssues(){
    this.raiseIssueSer.getRaisedIssues().subscribe((res:any)=>{
        if(Array.isArray(res)){
            this.raisedIssiesList = res;
        }else{
            if(res.statusCode == 'Failure'){
                this.toaster.error('Failed to fetch data','Error')
            }
        }
    })
  }

  createIssue(){

        const dialog =  this.modalDialog.open(CreateIssueComponent,{
            width: '920px',
          })

       dialog.afterClosed().subscribe(result => {
        if(result.event == 'submit'){
            this.getAllRaisedIssues()
        }
        });
  }

  viewIssue(rowData){
    const dialog =  this.modalDialog.open(ViewIssueComponent,{
        width: '920px',
        data: rowData
      })

   dialog.afterClosed().subscribe(result => {
    if(result.event == 'Cancel'){
        this.getAllRaisedIssues()
    }
    });
  }

  onPage(event) {
    this.paginatoryDetails = event;
  }

  showToaster(res){
    if(res.statusCode == 'Success'){
        this.toaster.success(res.errorMessage,'Success');
        //this.getAllReqVendors();
        this.selectedData = [];
    }else{
        this.toaster.error(res.errorMessage,'Failure')
    }
}
}
