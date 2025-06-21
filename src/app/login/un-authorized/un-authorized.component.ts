import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-un-authorized',
  templateUrl: './un-authorized.component.html',
  styleUrls: ['./un-authorized.component.scss']
})
export class UnAuthorizedComponent implements OnInit {

  constructor(private modalDialog: MatDialog) { }

  ngOnInit() {
    this.modalDialog.closeAll();
    localStorage.clear();
  }

}
