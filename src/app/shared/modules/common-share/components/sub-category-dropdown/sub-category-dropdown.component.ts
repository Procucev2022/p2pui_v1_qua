import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClientService } from 'src/app/layout/client/services/client-service.service';

@Component({
  selector: 'app-sub-category-dropdown',
  templateUrl: './sub-category-dropdown.component.html',
  styleUrls: ['./sub-category-dropdown.component.scss']
})
export class SubCategoryDropdownComponent implements OnInit {

  @Input('isMultipleSelect') isMultipleSelect: string;
  @Input('isAdjustCol') isAdjustCol: boolean = false;
  @Output() updateSelection = new EventEmitter();
  selectedSubCategory: any = '';
  dropDownConfig = {
    search: true,
    placeholder: 'Select',
    searchPlaceholder: 'Search',
    height: 'auto',
    displayKey: 'subCategoryName'
  };
  filtered_subCategoryList: any[];
  constructor(private clientService: ClientService) { }

  ngOnInit() {
    this.getSubCategoryList();
  }
  getSubCategoryList() {
    this.clientService.getSubCategoryList({id: localStorage.getItem('orgId')}).subscribe((res: any) => {
      if (Array.isArray(res)) {
        this.filtered_subCategoryList = res;
      }
    });
  }

  onSubCategoryChange(event: any) {
    this.updateSelection.emit(event);
    if (!event) {
      this.selectedSubCategory = '';
    }
  }

}
