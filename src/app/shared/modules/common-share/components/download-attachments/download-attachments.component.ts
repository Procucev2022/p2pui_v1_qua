import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-download-attachments',
    templateUrl: './download-attachments.component.html',
    styleUrls: ['./download-attachments.component.scss']
})
export class DownloadAttachmentsComponent implements OnInit {

    @Input('filesList') filesList: any = [];
    constructor() { }

    ngOnInit() {
    }

}
