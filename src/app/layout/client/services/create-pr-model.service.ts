import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Injectable({
  providedIn: 'root'
})
export class CreatePrModelService {

  constructor(public http: HttpClient) { }




  saveCreatePr(description: string, materialSpftn: string, quantity: number, unitMeasure: number, file: File) {
      const createPr = {
        description: description,
        materialSpftn: materialSpftn,
        quantity: quantity,
        unitMeasure: unitMeasure,
        file: file
      };
      console.log(createPr);
  }

  submitPrdetails(data) {
    console.log('data---', data);
    console.log('dataidd---', data.id);
    // if (data.id && data.id !== '') {

    //   return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.EDIT_PR, data, {});
    // }

    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.SUBMIT_CREATE_PR_DETAILS_MODEL, data, {});

  }

  getClientCostCentreByorgId(data) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.GET_CLIENT_COST_CENTRE_BY_ORG_ID, data, {});
  }

  editPr(payload) {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.EDIT_PR, payload, {});
}

savePR(data) {
  return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_PR_BY_CLIENT, data, {});
}

convertBOQToPR(data) {
  return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.CONVER_BOQ_TO_PR, data, {});
}


}
