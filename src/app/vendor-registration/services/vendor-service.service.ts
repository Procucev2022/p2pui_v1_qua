import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

    GeneralformData = [];
    BranchformData = [];

  constructor(private httpService: HttpClient) { }

  getRfqData() {
    return this.httpService.get('/assets/jsons/vendorDashboardRfqs.json');
  }

  // fetching products and services data in vendor registration screen
  getProductsData(){
    return this.httpService.get('/assets/jsons/vendorProductsData.json');
  }

  getServicesData(){
    return this.httpService.get('/assets/jsons/vendorServicesData.json');
  }

  getVendorContactsData(){
    return this.httpService.get('/assets/jsons/vendorContactsData.json');
  }

  getClientRefData(){
    return this.httpService.get('/assets/jsons/vendorClientRefData.json');
  }

  getGeneralForm(companyName:string,pan:string,gstin:string,address:string){
        const formdata ={
            companyName:companyName,
            pan:pan,
            gstin:gstin,
            address:address
        };
        this.GeneralformData.push(formdata);
        console.log(this.GeneralformData);
  }

  getBranchesForm(branchName:string,branchAddress:string){
    const B_formdata ={
        branchName:branchName,
        branchAddress:branchAddress,
    };
    this.BranchformData.push(B_formdata);
    console.log(this.BranchformData);
  }

}
