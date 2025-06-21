import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CategoryListComponent } from '../../category-list/category-list.component';
import { ItemListComponent } from '../../item-list/item-list.component';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-service-sub-category',
  templateUrl: './service-sub-category.component.html',
  styleUrls: ['./service-sub-category.component.scss']
})
export class ServiceSubCategoryComponent implements OnInit {
  categoryListComponent: CategoryListComponent;
  itemListCompnent: ItemListComponent;
  model: any = {};
  getAllHsnCodes: any[] = [];

  getAllSacHsnCodes: any[] = [];
  getAllGroupHsnCodes: any[] = [];
  getAllHsnheadingCodes: any[] = [];
  getAllSectionCodes: any[] = [];

  serviceSections: any[] = [];
  serviceHeadings: any[] = [];
  serviceGroups: any[] = [];
  serviceSac: any[] = [];
  getAllSubCategoryHsnCodes: any[] = [];

  codeObj:any = {};
  nameObj:any = {};
  subCategoryList: any[] = [];
  subCategoryInfo: any;
  newSubCategoryName: any;
  subCategory: any;
  getAllItemList: any[] = [];
  newItemName: any;
  itemList: any[] = [];
@Input('selecteItemData') selecteItemData: any;
    isExistedItem: boolean =false;
    uomList: any =[];
  constructor(private categoryService: CategoryService,
    public dialogRef: MatDialogRef<CategoryListComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private toaster: ToastrService,
    private modalDialog: MatDialog) { }

  ngOnInit() {
    this.isExistedItem = this.data && this.data.id ? true: false;
    this.categoryService.getSACCodesAndNames({}).subscribe((res) => {
      if (Array.isArray(res)) {
        this.getAllHsnCodes = res
      }
    });
    this.getAllUoms();
  }


  getAllUoms(){
    this.categoryService.getAllUOM().subscribe((res:any)=>{
        this.uomList = Array.isArray(res)? res: []
    })
  }
  filterSection(event) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    console.log(event.query);
    for (let i = 0; i < this.getAllHsnCodes.length; i++) {
      let section = this.getAllHsnCodes[i];
      if (section.name.toLowerCase().indexOf(query.toLowerCase()) == 0 || section.code.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(section);
      }
    }
    this.serviceSections = filtered;
  }
  filterHeading(event) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    console.log(event.query);
    for (let i = 0; i < this.getAllHsnheadingCodes.length; i++) {
      let heading = this.getAllHsnheadingCodes[i];
      if (heading.name.toLowerCase().indexOf(query.toLowerCase()) == 0 || heading.code.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(heading);
      }
    }
    this.serviceHeadings = filtered;
  }
  filterGroup(event) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    console.log(event.query);
    for (let i = 0; i < this.getAllGroupHsnCodes.length; i++) {
      let groups = this.getAllGroupHsnCodes[i];
      if (groups.name.toLowerCase().indexOf(query.toLowerCase()) == 0 || groups.code.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(groups);
      }
    }
    this.serviceGroups = filtered;
  }
  filterSac(event) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    console.log(event.query);
    for (let i = 0; i < this.getAllSacHsnCodes.length; i++) {
      let sac = this.getAllSacHsnCodes[i];
      if (sac.name.toLowerCase().indexOf(query.toLowerCase()) == 0 || sac.code.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(sac);
      }
    }
    this.serviceSac = filtered;
  }

  filterAutoCompleteData(event) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    console.log(event.query);
    this.newSubCategoryName = event.query;
    for (let i = 0; i < this.getAllSubCategoryHsnCodes.length; i++) {
      let category = this.getAllSubCategoryHsnCodes[i];
      if (category.subCategoryName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(category);
      }
    }
    this.subCategoryList = filtered;
  }
  filterItems(event) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    this.newItemName = event.query;
    console.log(event.query);
    for (let i = 0; i < this.getAllItemList.length; i++) {
      let item = this.getAllItemList[i];
      if (item.description.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }
    this.itemList = filtered;
  }

  onSelect(event,res){

    if(res == 'section' && event.code){
      this.codeObj['sectionCode'] = event.code
      this.codeObj['headingCode'] = undefined
      this.codeObj['groupCode'] = undefined
      this.codeObj['sacCode'] = undefined
      this.categoryService.getSACCodesAndNames(this.codeObj).subscribe((res) => {
        this.model.selectedServiceHeadings = {}
        this.model.selectedServiceGroup = {}
        this.model.selectedServiceSac = {}
        this.model.categoryName = undefined
        this.model.selectedSubCategoryName = {}
        this.model.subCategoryNumber = undefined
        if (Array.isArray(res)) {
            this.getAllHsnheadingCodes = res
        }
      })
    }
    if(res == 'heading' && event.code){
      this.codeObj['headingCode'] = event.code
      this.codeObj['groupCode'] = undefined
      this.codeObj['sacCode'] = undefined
      this.categoryService.getSACCodesAndNames(this.codeObj).subscribe((res) => {
        this.model.selectedServiceGroup = {}
        this.model.selectedServiceSac = {}
        this.model.categoryName = undefined
        this.model.selectedSubCategoryName = {}
        this.model.subCategoryNumber = undefined
        if (Array.isArray(res)) {
          this.getAllGroupHsnCodes = res
        }
      })
    }
    if(res == 'categoryGroup' && event.code){
      this.codeObj['groupCode'] = event.code
      this.codeObj['sacCode'] = undefined
      this.categoryService.getSACCodesAndNames(this.codeObj).subscribe((res) => {
        this.model.selectedServiceSac = {}
        this.model.categoryName = undefined
        this.model.selectedSubCategoryName = {}
        this.model.subCategoryNumber = undefined
        if (Array.isArray(res)) {
          this.getAllSacHsnCodes = res
        }
      })
    }
    if(res == 'sac' && event.code){
      this.codeObj['sacCode'] = event.code
      this.categoryService.getSACCodesAndNames(this.codeObj).subscribe((res) => {
        this.getAllSubCategoryHsnCodes = []
        this.model.categoryName = undefined
        this.model.selectedSubCategoryName = {}
        this.model.subCategoryNumber = undefined
        if (Array.isArray(res)) {
          this.subCategoryInfo = res[0]
          this.model.categoryName = res[0].name
          if(res[0].fullcode){
            this.categoryService.getSubCategoryBySac({sacCode : res[0].fullcode}).subscribe((data) => {
              if (Array.isArray(data)) {
                this.getAllSubCategoryHsnCodes = data
              }
            })
          }
        }
      })
    }
    if(res == 'subCategory'){
      if(event.subCategoryNumber){
        this.newSubCategoryName = undefined
        if(this.data.type == 'Categories'){
          console.log(event.subCategoryNumber);
          this.model.subCategoryNumber = event.subCategoryNumber
        }else if(this.data.type == 'Item' && event.id){
          this.subCategory = event
          this.model.subCategoryNumber = event.subCategoryNumber
          this.categoryService.getItemMasterBySubCategory({id: event.id}).subscribe((data) => {
            if (Array.isArray(data)) {
              this.getAllItemList = data
            }
          })
        }
      }else{
        this.model.subCategoryNumber = event.subCategoryNumber
        this.newSubCategoryName = undefined
      }
    }
    if(res == 'item' && this.data.type == 'Item'){
      if(event.itemNumber){
        console.log(event.itemNumber);
        this.newItemName = undefined
        this.model.itemNumber = event.itemNumber
      }else{
        this.model.itemNumber = event.itemNumber
        this.newItemName = undefined
      }
    }
     if(this.data && this.data.id && this.isExistedItem){
      this.model.itemNumber = undefined;
      this.newItemName = this.data.description
      this.model.selectedItemName = this.data.description;
      this.model.specification = this.data.specification;
    }
  }

  getItemMasterBySubCategory(){
    this.getAllItemList = []
    this.itemList = []
    if(this.subCategory.id){
      this.categoryService.getItemMasterBySubCategory({id: this.subCategory.id}).subscribe((data) => {
        if (Array.isArray(data)) {
          this.getAllItemList = data
        }
      })
    }
  }

  createCategoryService(){
    let obj = {
      categoryName: this.model.categoryName,
      createdBy: localStorage.getItem('userFullName'),
      sac: {id: this.subCategoryInfo.id},
      sacCode: this.subCategoryInfo.fullcode,
      subCategoryName: this.newSubCategoryName,
      type: "sac",
    }
    this.categoryService.createSubCategory(obj).subscribe((response:any) => {
      if (response['id']) {
        this.toaster.success('Sub Category Created Successfully', 'Success');
        this.model.subCategoryNumber = response['subCategoryNumber']
        this.getAllSubCategoryHsnCodes.push({
          id: response.id,
          subCategoryName: response.subCategoryName,
          subCategoryNumber: response.subCategoryNumber
        });
        this.modalDialog.closeAll();
        //  this.getSubCategoryByHSN();
        this.categoryListComponent.getAllSubCategoryList();
      }
  });
  }

  createItemSer(){
    let obj = {
       description: this.newItemName,
       upcCode: this.model.upcCode,
       subcategory:{"id": this.subCategory['id']},
       specification: this.model.specification,
       type:"sac",
       saccode:{"id": this.subCategoryInfo.id},
       itemuom: {id: this.model.uom}
    }
    if(this.isExistedItem){
        obj['id']= this.data.id;
        obj['specification'] = this.data.specification;
        obj["createdTS"] =(new Date().toISOString()).split('Z')[0]
      }
    this.categoryService.createItemMasterByHsnOrSac(obj).subscribe((response) => {
      if (response['id']) {
        this.toaster.success('Item Created Successfullty', 'Successfully');
        this.model.itemNumber = response['itemNumber']
        this.getItemMasterBySubCategory();
        this.getAllItemList.push(response);
        this.modalDialog.closeAll();
        // this.itemListCompnent?.getAllItemsMaster();

      } else {
        this.toaster.warning('Item Creation Failed', 'Failed');
      }
  });
  }
}
