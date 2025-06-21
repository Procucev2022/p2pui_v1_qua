import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { EncryDecryService } from 'src/app/shared/services';
import { RaiseIssuesService } from '../../services/raise-issues.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-view-issue',
    templateUrl: './view-issue.component.html',
    styleUrls: ['./view-issue.component.scss']
})
export class ViewIssueComponent implements OnInit {
    commentsList: any[] = [];
    newComment: any
    loggedUserData: any;
    vendorProDoc: any;
    constructor(public dialogRef: MatDialogRef<ViewIssueComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data,
        private encryDecryService: EncryDecryService,
        private raiseIssuesSer: RaiseIssuesService,
        private toaster: ToastrService) { }

    ngOnInit() {

        this.data.answer.forEach(ele => {
            var temp = {
                answer: ele.answer,
                answersBy: ele.answersBy
            }
            this.commentsList.push(temp)
        });
        this.vendorProDoc = this.data.vendorprocucevdocuments
        //this.commentsList = this.data.answer;
        let temp =  JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')) );
        this.loggedUserData = temp;
        console.log(this.loggedUserData);

    }

    onSubmit() {
        var req = {
            "id":this.data.id,
            "clientId": {id: this.data.clientId.id},
            "vendorId": {id: this.data.vendorId.id},
            "questions": this.data.questions,
            "answer" : this.commentsList
        }
        this.raiseIssuesSer.updateQuery(req).subscribe((res: any) => {
            if (res.status == 'Success') {
                this.toaster.success(res.message, 'Success');
                //this.dialogRef.close({ event: 'submit' });
            } else {
                this.toaster.error(res.message, 'Error')
            }

        })
    }

    addNewComment() {
        if(this.newComment.length){
            this.commentsList.push(
                {
                    "answer": this.newComment,
                    "answersBy": this.loggedUserData.details.fullName || '',
                }
            );
            this.onSubmit();
        }
        this.newComment = '';
        console.log(this.commentsList);

    }

    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }
}
