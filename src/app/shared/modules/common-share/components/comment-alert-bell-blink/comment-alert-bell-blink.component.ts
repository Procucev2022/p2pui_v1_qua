import { Component, OnInit, Input } from '@angular/core';
import { EncryDecryService } from 'src/app/shared/services';

@Component({
  selector: 'app-comment-alert-bell-blink',
  templateUrl: './comment-alert-bell-blink.component.html',
  styleUrls: ['./comment-alert-bell-blink.component.scss']
})
export class CommentAlertBellBlinkComponent implements OnInit {

  @Input('rowData') rowData: any;
  @Input('isInternalComments') isInternalComments: any;
  loggedUserData: any;
  constructor(private encryDecryService: EncryDecryService) { }

  ngOnInit() {
    const temp =  JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')) );
    this.loggedUserData = temp.details;
  }

}
