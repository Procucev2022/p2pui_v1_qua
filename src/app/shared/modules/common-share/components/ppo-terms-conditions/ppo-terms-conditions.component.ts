import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ppo-terms-conditions',
  templateUrl: './ppo-terms-conditions.component.html',
  styleUrls: ['./ppo-terms-conditions.component.scss']
})
export class PpoTermsConditionsComponent implements OnInit {
  @Input ('ppoData') ppoData ;
  constructor() { }

  ngOnInit() {
    console.log(this.ppoData);
    
  }

}
