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
    if(!this.isLoading){
      //spinner.show(); // code written reverse when writing first time
      spinner.hide();
    }
     this.loaderService.isLoading.subscribe((res) =>{

        this.isLoading =res;
        // console.log('this.islo',this.isLoading);
       if(this.isLoading){
         //spinner.hide(); // code written reverse when writing first time
         spinner.show();
       }

    }, (error) =>{
      if(this.isLoading){
        //spinner.hide(); // code written reverse when writing first time
        spinner.show();
      }
    });
  }

  ngOnInit() {

  }

}
