import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../services/loader.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  public isLoading: boolean = false;
  constructor(private loaderService: LoaderService, spinner: NgxSpinnerService) {
    // Always start hidden; subscribe drives show/hide thereafter
    spinner.hide();
    this.loaderService.isLoading.subscribe((res) => {
      this.isLoading = res;
      if (this.isLoading) {
        spinner.show();
      } else {
        spinner.hide();
      }
    }, () => {
      if (this.isLoading) {
        spinner.show();
      }
    });
  }

  ngOnInit() {

  }

}
