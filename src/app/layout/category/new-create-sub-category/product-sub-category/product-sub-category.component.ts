import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CategoryListComponent } from '../../category-list/category-list.component';
import { ItemListComponent } from '../../item-list/item-list.component';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-product-sub-category',
  templateUrl: './product-sub-category.component.html',
  styleUrls: ['./product-sub-category.component.scss']
})
export class ProductSubCategoryComponent implements OnInit {
  categoryListComponent: CategoryListComponent;
  itemListCompnent: ItemListComponent;
  model: any = {

  };
  getAllHsnCodes: any[] = [];

  getAllCommodityHsnCodes: any[] = [];
  getAllClassHsnCodes: any[] = [];
  getAllHsnfamilyCodes: any[] = [];
  getAllSegmentCodes: any[] = [];

  productSegments: any[] = [];
  productFamilys: any[] = [];
  productClass: any[] = [];
  productCommodity: any[] = [];
  getAllSubCategoryHsnCodes: any[] = [];

  codeObj:any = {};
  nameObj:any = {};
  subCategoryList: any[] = [];
  subCategoryInfo: any;
  newSubCategoryName: any;
  getAllItemList: any[] = [];
  newItemName: any;
  itemList: any[] = [];
  subCategory: any;
  @Input('selecteItemData') selecteItemData:any;
    isExistedItem: boolean = false;
    uomList: any =[];

  constructor(private categoryService: CategoryService,
    public dialogRef: MatDialogRef<CategoryListComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,private modalDialog: MatDialog,
    private toaster: ToastrService) { }

  ngOnInit() {
    console.log('DATA.....',this.data);
    this.isExistedItem = this.data && this.data.id ? true: false;
    this.categoryService.getHSNCodesAndNames({}).subscribe((res) => {
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
  filterSegment(event) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    console.log(event.query);
    for (let i = 0; i < this.getAllHsnCodes.length; i++) {
      let segment = this.getAllHsnCodes[i];
      if (segment.name.toLowerCase().indexOf(query.toLowerCase()) == 0 || segment.code.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(segment);
      }
    }
    this.productSegments = filtered;
  }
  filterFamily(event) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    console.log(event.query);
    for (let i = 0; i < this.getAllHsnfamilyCodes.length; i++) {
      let family = this.getAllHsnfamilyCodes[i];
      if (family.name.toLowerCase().indexOf(query.toLowerCase()) == 0 || family.code.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(family);
      }
    }
    this.productFamilys = filtered;
  }
  filterClass(event) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    console.log(event.query);
    for (let i = 0; i < this.getAllClassHsnCodes.length; i++) {
      let classes = this.getAllClassHsnCodes[i];
      if (classes.name.toLowerCase().indexOf(query.toLowerCase()) == 0 || classes.code.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(classes);
      }
    }
    this.productClass = filtered;
  }
  filterCommodity(event) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    console.log(event.query);
    for (let i = 0; i < this.getAllCommodityHsnCodes.length; i++) {
      let commodity = this.getAllCommodityHsnCodes[i];
      if (commodity.name.toLowerCase().indexOf(query.toLowerCase()) == 0 || commodity.code.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(commodity);
      }
    }
    this.productCommodity = filtered;
  }

  filterAutoCompleteData(event) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    this.newSubCategoryName = event.query;
    console.log(event.query);
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

    if(res == 'segment' && event.code){
      this.codeObj['segment'] = event.code
      this.codeObj['family'] = undefined
      this.codeObj['categoryClass'] = undefined
      this.codeObj['commodity'] = undefined
      this.categoryService.getHSNCodesAndNames(this.codeObj).subscribe((res) => {
        this.model.selectedProductFamilys = {}
        this.model.selectedProductClass = {}
        this.model.selectedProductCommodity = {}
        this.model.categoryName = undefined
        this.model.selectedSubCategoryName = {}
        this.model.subCategoryNumber = undefined
        if (Array.isArray(res)) {
            this.getAllHsnfamilyCodes = res
        }
      })
    }
    if(res == 'family' && event.code){
      this.codeObj['family'] = event.code
      this.codeObj['categoryClass'] = undefined
      this.codeObj['commodity'] = undefined
      this.categoryService.getHSNCodesAndNames(this.codeObj).subscribe((res) => {
        this.model.selectedProductClass = {}
        this.model.selectedProductCommodity = {}
        this.model.categoryName = undefined
        this.model.selectedSubCategoryName = {}
        this.model.subCategoryNumber = undefined
        if (Array.isArray(res)) {
          this.getAllClassHsnCodes = res
        }
      })
    }
    if(res == 'categoryClass' && event.code){
      this.codeObj['categoryClass'] = event.code
      this.codeObj['commodity'] = undefined
      this.categoryService.getHSNCodesAndNames(this.codeObj).subscribe((res) => {
        this.model.selectedProductCommodity = {}
        this.model.categoryName = undefined
        this.model.selectedSubCategoryName = {}
        this.model.subCategoryNumber = undefined
        if (Array.isArray(res)) {
          this.getAllCommodityHsnCodes = res
        }
      })
    }
    if(res == 'commodity' && event.code){
      this.codeObj['commodity'] = event.code
      this.categoryService.getHSNCodesAndNames(this.codeObj).subscribe((res) => {
        this.getAllSubCategoryHsnCodes = []
        this.model.categoryName = undefined
        this.model.selectedSubCategoryName = {}
        this.model.subCategoryNumber = undefined
        if (Array.isArray(res)) {
          this.subCategoryInfo = res[0]
          this.model.categoryName = res[0].name
          if(res[0].fullcode){
            this.categoryService.getSubCategoryByHSN({hsnCode : res[0].fullcode}).subscribe((data) => {
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
          this.model.subCategoryNumber = event.subCategoryNumber;

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
  createCategoryProduct(){
    let obj = {
      categoryName: this.model.categoryName,
      createdBy: localStorage.getItem('userFullName'),
      hsn: {id: this.subCategoryInfo.id},
      hsnCode: this.subCategoryInfo.fullcode,
      subCategoryName: this.newSubCategoryName,
      type: "hsn",
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
        //  this.getSubCategoryByHSN();
        this.modalDialog.closeAll();
        this.categoryListComponent.getAllSubCategoryList();
      }
  });
  }
  createItemProd(){
    let obj = {
       description: this.newItemName,
       upcCode: this.model.upcCode,
       subcategory:{"id": this.subCategory['id']},
       specification: this.model.specification,
       type:"hsn",
       hsncode:{"id": this.subCategoryInfo.id},
       itemuom : {id: this.model.uom}
    }
    if(this.isExistedItem){
      obj['id']= this.data.id;
      obj['specification'] = this.data.specification;
      obj['price']= this.data.price;
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
