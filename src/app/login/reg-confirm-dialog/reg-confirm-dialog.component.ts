import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reg-confirm-dialog',
  templateUrl: './reg-confirm-dialog.component.html',
  styleUrls: ['./reg-confirm-dialog.component.scss'],
  standalone: true

})
export class RegConfirmDialogComponent implements OnInit , OnDestroy{

  constructor(private router: Router) { }

  ngOnInit() {
  }


  ngOnDestroy(){
    this.router.navigate(['/login'] );
  }

}
