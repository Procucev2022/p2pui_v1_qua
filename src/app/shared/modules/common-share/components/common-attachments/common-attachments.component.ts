import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConvertToBase64Service } from '../../services/convert-to-base64.service';

@Component({
  selector: 'app-common-attachments',
  templateUrl: './common-attachments.component.html',
  styleUrls: ['./common-attachments.component.scss']
})
export class CommonAttachmentsComponent implements OnInit {
  @Output() actionEvent: EventEmitter<any> = new EventEmitter();
  @Input('attachments') attachments;
  @Input('isViewOnly') isViewOnly;
  filesDataList: any;
  fileData: any;
  fileType: any;

  constructor(private toastrService: ToastrService, private convertSer: ConvertToBase64Service) { }

  ngOnInit() {
  }

  callEventEmitter() {
      this.actionEvent.emit({'attachedDocuments': this.attachments});
  }

  filesDropped(event) {
    const fileData = event;
    console.log('event', event);
    const file = event[0];
    if (!this.validateFileFormat(file.name)) {
      return ;
    }
    this.convertSer.getBase64(file).then((data: string) => {
      const temp = {
        fileName: file.name,
        file: data.split(',')[1]
      };
      this.attachments.push(temp);
    });
   this.callEventEmitter();
  }

  fileUploadEvent(event, isDropped) {
    const fileData = event;
    console.log('event1', event);
    const file = event.target.files[0];
    if (!this.validateFileFormat(file.name)) {
      return ;
    }
    this.convertSer.getBase64(file).then((data: string) => {
      const temp = {
        fileName: file.name,
        file: data.split(',')[1]
      };
      // For Muliple files upload
      this.attachments.push(temp);
    });
    this.callEventEmitter();
  }

  deleteAttachments(index) {
    this.attachments.splice(index, 1);
    this.callEventEmitter();
  }

  validateFileFormat(fileData) {
    let isValid = false;
    if (fileData) {
      const fileType = fileData.split('.').pop();
      const allowFileTypes = ['txt', 'jpg', 'jpeg', 'png', 'xls', 'xlsx', 'doc', 'docx', 'pdf'];
      const index = allowFileTypes.findIndex((item) => item === (fileType).toLowerCase());
      if (index > -1) {
        isValid = true;
      } else {
        this.toastrService.warning(
          'Please upload suggested file formats only',
          'Warning'
        );
        isValid = false;
      }
    }
    return isValid;
  }
}
