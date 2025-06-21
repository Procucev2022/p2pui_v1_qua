import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ClientService } from 'src/app/layout/client/services/client-service.service';
import { AppConfig } from 'src/app/app.config';
import { ExportPdfService } from 'src/app/layout/category-mgr/services/export-pdf.service';


@Component({
  selector: 'app-pr-details-view',
  templateUrl: './pr-details-view.component.html',
  styleUrls: ['./pr-details-view.component.scss']
})
export class PrDetailsViewComponent implements OnInit {
  viewPrByIdList: any;
 @Input('prId') prId ;
 @Input('ppoData') ppoData;
 @Output() public prDetails = new EventEmitter<any>();
  selectedIndex = 0;
  selectedFilesArray: any[];
  documentsArray: any[] = [];
  regId: any;
  createModel: any;
  documentsToBase64: any[] = [];
  estimatedPrvalue: any;
  singleVendor: boolean;
  suggestNewVendor: boolean;
  rateCardAvailable: boolean;
  rateCardArray: any[] = [];
  defaultPermissions: any  ;
  todayDate: Date = new Date();
  minDate: any;
  dropdownSettings: IDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
  };
  selectedCostCentreItems: any[] = [];
  costCentreList: any[] = [];
  priorities = ['High', 'Low', 'Medium'];
  selectedPriorty: any;
  loggedUserData: any;
  deptName: Date;
  BOQDocument: any;
  BOQDocToBase64: any = [];
  rateCardDocToBase64: any = [];
  rateCardDoc: any;
  loggedUserDetails: any;
  loggedUserPermissions: any;

  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  selectedData: any;

  prLineItemsDetails: any = [
      { field: 'description', header: 'Product/Service Description', isLink: false, width: '250px' },
      { field: 'brand', header: 'Specifications', isLink: false , width: '170px'},

      { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '170px' },

      { field: 'quantity', header: 'Quantity', isLink: false, width: '140px' },

    ];

 constructor(private clientService: ClientService, private exportService: ExportPdfService) {
   console.log(' this.prId -----------------------', this.prId);


 }
  numberOnly(event): boolean {
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
      }
      return true;
  }

  public singleVendorform: any[] = [
      {
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
      },
  ];

  public createPRformList: any[] = [
      {
          description: '',
          brand: '',
          unitofMeasures: '',
          quantity: '',
      },
  ];

  bindTurnOver() {
          this.createPRformList = this.viewPrByIdList.pritems || [];
  }
  bindDeliverylocation() {
      console.log(
          'deliveryLocationList',
          this.viewPrByIdList.clientdeliverylocation
      );
      if (this.viewPrByIdList.clientdeliverylocation.length > 0) {
          this.deliveryLocationList =
              this.viewPrByIdList.clientdeliverylocation || [];
      }
  }

  bindPriorities() {
      console.log('priorities', this.viewPrByIdList.priority);
      if (this.viewPrByIdList.priority !== null) {
          this.priorities = this.viewPrByIdList.priority || '';
      }
  }
  bindSelectedCost() {
      console.log(
          'selectedCostCentreItems',
          this.viewPrByIdList.clientcostcentre
      );
      if (this.viewPrByIdList.clientcostcentre.length > 0) {
          this.selectedCostCentreItems =
              this.viewPrByIdList.clientcostcentre || [];
      }
  }

  public deliveryLocationList: any[] = [
      {
          address: '',
          city: '',
          state: '',
      },
  ];


  addItem() {
      if (this.createPRformList.length < 10) {
          this.createPRformList.push({
              description: '',
              brand: '',
              unitofMeasures: '',
              quantity: '',
          });
      } else {
      }
  }
  removeItem(i: number) {
      this.createPRformList.splice(i, 1);
  }

  addLocation() {
      if (this.deliveryLocationList.length < 10) {
          this.deliveryLocationList.push({
              description: '',
              brand: '',
              unitofMeasures: '',
              quantity: '',
          });
      } else {
      }
  }
  removeLocation(i: number) {
      this.deliveryLocationList.splice(i, 1);
  }

  addNewVendor() {
      if (this.singleVendorform.length < 5) {
          this.singleVendorform.push({
              companyName: '',
              contactPerson: '',
              email: '',
              phone: '',
          });
      } else {
          // this.toaster.error("You can add maximum 5 vendors only", "Error");
      }
  }

  removing(i: number) {
      this.singleVendorform.splice(i, 1);
  }
  onItemSelect(item: any) {
      console.log(item);
  }
  onSelectAll(items: any) {
      console.log(items);
  }



  ngOnInit() {
    console.log('id', this.prId);

    const temp = {
      id: this.prId
    };
    this.clientService.getPrById(temp).subscribe((res: any) => {

      if (res) {
          this.viewPrByIdList = res || {};
          this.prDetails.emit(this.viewPrByIdList);
          console.log('this.viewPrByIdList', this.viewPrByIdList);
      } else {
      //   this.toaster.error('Failed to Fetch data', 'Failure')
      }
      this.minDate = this.viewPrByIdList ? this.viewPrByIdList.dueDate : null;
      this.bindTurnOver();
      this.bindDeliverylocation();
      this.bindPriorities();
    });
      const date = new Date();

      // add a day
      date.setDate(date.getDate() + 1);
      const tomorrow = date.toLocaleDateString();
      // this.minDate = new Date(tomorrow);

      this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
      this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;

  }
  closeDialog() {
  }

  next() {
      //   console.log(form.value)
      //   form.value['regId'] = this.regId;
      // this.createPrService.saveCreatePr(form.value.description, form.value.materialSpecifications,
      //     form.value.unit_of_Measures, form.value.quantity,form.value.fileupload);
      this.selectedIndex++;
  }

  back() {
      this.selectedIndex--;
  }

  downloadAsPDF() {
    this.exportService.exportAsPDF_PRDetails(this.viewPrByIdList, this.ppoData);
  }

}
