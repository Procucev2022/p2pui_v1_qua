import { Component, Input, OnInit } from '@angular/core';
import { ClientService } from 'src/app/layout/client/services/client-service.service';

@Component({
  selector: 'app-ppo-documents',
  templateUrl: './ppo-documents.component.html',
  styleUrls: ['./ppo-documents.component.scss']
})
export class PpoDocumentsComponent implements OnInit {
  @Input ('ppoData') ppoData ;
  ppoDocuments: any = [];
  constructor(private clientService: ClientService) { }

  ngOnInit() {
    const reqObj = {
      'id': this.ppoData.id
    };
    this.clientService.getPpoDocuments(reqObj).subscribe((data) => this.successCallBack(data));
  }
  successCallBack(data) {
    console.log(data);
    if (Array.isArray(data) || data['errorCode'] === 204) {
    this.ppoDocuments = Array.isArray(data) ? [...data] : [];
    }
  }

}
