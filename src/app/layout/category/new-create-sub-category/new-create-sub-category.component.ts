import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CategoryListComponent } from '../category-list/category-list.component';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-new-create-sub-category',
  templateUrl: './new-create-sub-category.component.html',
  styleUrls: ['./new-create-sub-category.component.scss']
})
export class NewCreateSubCategoryComponent implements OnInit {
  type: string;
  selectedData: any;

  constructor(public dialogRef: MatDialogRef<CategoryListComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.selectedData = this.data;
    this.type = 'hsn'
  }

}
