import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-procu-vendor-search',
  templateUrl: './procu-vendor-search.component.html',
  styleUrls: ['./procu-vendor-search.component.scss']
})
export class ProcuVendorSearchComponent implements OnInit {
  gridApi: any;
  gridColumnApi: any;

  constructor() {
    this.defaultColDef = { resizable: true };
   }

  columnDefs = [
    {headerName: 'Make', field: 'make' },
    {headerName: 'Model', field: 'model' },
    {headerName: 'Price', field: 'price'}
];

rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 }
];

  private defaultColDef;


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }


  ngOnInit() {
  }

}
