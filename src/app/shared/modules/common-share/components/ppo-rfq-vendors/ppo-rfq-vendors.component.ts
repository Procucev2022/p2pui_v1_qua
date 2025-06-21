import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ClientService } from 'src/app/layout/client/services/client-service.service';

@Component({
  selector: 'app-ppo-rfq-vendors',
  templateUrl: './ppo-rfq-vendors.component.html',
  styleUrls: ['./ppo-rfq-vendors.component.scss']
})
export class PpoRfqVendorsComponent implements OnInit, OnChanges {
  @Input('prId') prId ;
  constructor(private clientService: ClientService) { }
  vendorRFQList:any =[]
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes && changes.prId.currentValue){
      this.clientService.getRFQVendorsByPRId({id:this.prId}).subscribe((res:any)=>{
        if(Array.isArray(res)){
          this.vendorRFQList =res.map((ele) => { return {...ele, ...{'headingName': 'RFQ ID : '+ele.name} } });
        }
        console.log('res', res);
      })
    }
  }
}
