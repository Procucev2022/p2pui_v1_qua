import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryListComponent } from '../category-list/category-list.component';
import { CategoryService } from '../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { ItemListComponent } from '../item-list/item-list.component';

@Component({
  selector: 'app-create-item-category',
  templateUrl: './create-item-category.component.html',
  styleUrls: ['./create-item-category.component.scss']
})
export class CreateItemCategoryComponent implements OnInit {
  itemCategoryForm: FormGroup;


  itemList = [];
  filtered_itemList = [];

  isShowSubmit: boolean;
  uomList: any = [];
  filtered_uomList = [];

  segmentList = [];
  filtered_segmentList = [];
  familyList = [];
  filtered_familyList = [];
  categoryClassList = [];
  filtered_categoryClassList = [];
  commodityList = [];
  filtered_commodityList = [];
  hsnCodeList = [];
  filtered_hsnCodeList = [];

  // for Names

  segmentNameList = [];
  filtered_segmentNameList = [];
  familyNameList = [];
  filtered_familyNameList = [];
  categoryClassNameList = [];
  filtered_categoryClassNameList = [];
  commodityNameList = [];
  filtered_commodityNameList = [];
  hsnCodeNameList = [];
  filtered_hsnCodeNameList = [];

  sectionCodeList  = [] ;
  filtered_sectionCodeList  = [] ;
  headingCodeList = [];
  filtered_headingCodeList  = [] ;
  groupCodeList = [];
  filtered_groupCodeList  = [] ;
  sacCodeList = [];
  filtered_sacCodeList = [];
  subCategoryList = [];
  filtered_subCategoryList = [];

  sectionNameList  = [] ;
  filtered_sectionNameList  = [] ;
  headingNameList = [];
  filtered_headingNameList  = [] ;
  groupNameList = [];
  filtered_groupNameList  = [] ;
  sacNameList = [];
  filtered_sacNameList = [];
  subCategoryNameList = [];
  filtered_subCategoryNameList = [];

  sacCodeObj: any;
  itemListCompnent: ItemListComponent;
  productCodeCheck: boolean = true;
  productNameCheck: boolean = true;
  serviceCodeCheck: boolean = true;
  serviceNameCheck: boolean = true;

  constructor(public dialogRef: MatDialogRef<CategoryListComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data, private fb: FormBuilder, private catService: CategoryService,
    private toaster: ToastrService) { }

  ngOnInit() {
    this.createForm();
    // this.getAllUoms();
    this.getHSNCodes(0);
    this.getSacCodes(0);
    this.getHSNNames(0)
    this.getSacNames(0);
  }

  // getAllUoms() {
  //   this.catService.getAllUOM().subscribe((res) => {
  //     if (Array.isArray(res)) {
  //       res.forEach(ele => {
  //         this.uomList.push({label: ele.description, value: ele.id});
  //       });
  //     }
  //   });
  // }

  get type() { return this.itemCategoryForm.controls.type; }
  get segment () { return this.itemCategoryForm.controls.segment; }
  get family () { return this.itemCategoryForm.controls.family; }
  get categoryClass () { return this.itemCategoryForm.controls.categoryClass; }
  get commodity () { return this.itemCategoryForm.controls.commodity; }

  get segmentName () { return this.itemCategoryForm.controls.segmentName; }
  get familyName () { return this.itemCategoryForm.controls.familyName; }
  get className () { return this.itemCategoryForm.controls.className; }
  get commodityName () { return this.itemCategoryForm.controls.commodityName; }

  get sectionCode () { return this.itemCategoryForm.controls.sectionCode; }
  get headingCode () { return this.itemCategoryForm.controls.headingCode; }
  get groupCode () { return this.itemCategoryForm.controls.groupCode; }
  get sacCode () { return this.itemCategoryForm.controls.sacCode; }
  get hsncode() { return this.itemCategoryForm.controls.hsncode; }

  get hsnName() { return this.itemCategoryForm.controls.hsnName; }
  get sacName() { return this.itemCategoryForm.controls.sacName; }
  get subCategoryName() { return this.itemCategoryForm.controls.subCategoryName; }
  get subCategoryNumber() { return this.itemCategoryForm.controls.subCategoryNumber; }
  get itemName() { return this.itemCategoryForm.controls.itemName; }
  get itemNumber() { return this.itemCategoryForm.controls.itemNumber; }
  // get itemuom() { return this.itemCategoryForm.controls.itemuom; }
  get specification() { return this.itemCategoryForm.controls.specification; }
  get upcCode() { return this.itemCategoryForm.controls.upcCode; }
  get categoryName() {  return this.itemCategoryForm.controls.categoryName; }

  get section () { return this.itemCategoryForm.controls.section; }
  get heading () { return this.itemCategoryForm.controls.heading; }
  get groupdescription () { return this.itemCategoryForm.controls.groupdescription; }
  get sac () { return this.itemCategoryForm.controls.sac; }

  closeModal() {
    // this.createForm();
  }

  createForm() {
    this.itemCategoryForm = this.fb.group({
      type: ['hsn'],
      hsncode: [''],
      hsnName: [''],


      sacName: [''],
      subCategoryName: [''],
      subCategoryNumber: [''],
      itemName: [''],
      itemNumber: [''],
      // itemuom: [''],
      upcCode: [''],
      specification: [''],

      segment: [''],
      family: [''],
      categoryClass: [''],
      commodity: [''],

      segmentName: [''],
      familyName: [''],
      className: [''],
      commodityName: [''],

      sectionCode: [''],
      headingCode: [''],
      groupCode: [''],
      sacCode: [''],
      categoryName: [''],

      section: [''],
      heading: [''],
      groupdescription: [''],
      sac: [''],

    });

    this.hsnName.disable();
    this.sacName.disable();
    this.subCategoryNumber.disable();
    this.itemNumber.disable();
    this.categoryName.disable();

    this.hsnCodeList = [...this.data.hsnList];
    this.hsnCodeNameList = [...this.data.hsnList];
    console.log("mncx",[...this.data.hsnList]);

    // this.getAllHSNCodeList();

    this.type.valueChanges.subscribe((change) => {
      if (!!change) {
        this.setOrRemoveValidations(change);
        if (change === 'hsn') {
          if (this.segmentList.length <= 0) {
            this.getHSNCodes(0);
          }
          if (this.segmentNameList.length <= 0) {
            this.getHSNNames(0);
          }
         this.resetForm();
        }
        if (change === 'sac') {
          if (this.sectionCodeList.length <= 0) {
            this.getSacCodes(0);
          }
          if (this.sectionNameList.length <= 0) {
            this.getSacNames(0);
          }
          // this.subCategoryForm.reset();
          this.resetForm();
        }
      }
    });
    this.hsncode.valueChanges.subscribe((change) => {
      this.categoryFormReset();
      if (!!change && change.label && change.value) {
        this.hsnName.setValue(change.label);
        this.getSubCategoriesByHSNCode();
      }
    });

    // this.sacCode.valueChanges.subscribe((change) => {
    //   if (!!change && change.label && change.value) {
    //     this.sacName.setValue(change.label);
    //     // this.getSubCategoriesBySacCode();
    //   }
    // });

    this.subCategoryName.valueChanges.subscribe((change) => {
      this.itemList = [];
      this.filtered_itemList = [];
      this.itemNumber.reset();
      this.itemName.reset();
      if (!!change) {
        this.subCategoryNumber.setValue(change.value);
        this.getItemMasterBySubCategory();
      }
    });

    this.itemName.valueChanges.subscribe((change) => {
      this.itemNumber.reset();
      if (!!change) {
        if (this.filtered_itemList.length === 0) {
          this.isShowSubmit = true;
        } else {
          this.isShowSubmit = false;
          this.itemNumber.setValue(change.value);
        }
      }
    });


    this.sectionCode.valueChanges.subscribe((change) => {
      this.headingCode.reset();
      this.headingCodeList = [];
      this.filtered_headingCodeList = [];
      this.groupCode.reset();
      this.groupCodeList = [];
      this.filtered_groupCodeList = [];
      this.sacCode.reset();
      this.sacCodeList = [];
      this.filtered_sacCodeList = [];
      this.categoryFormReset();
      if (change  && change.label && change.value) {
        this.getSacCodes(1);
      }
  });

  this.headingCode.valueChanges.subscribe((change) => {
    this.groupCode.reset();
    this.groupCodeList = [];
    this.filtered_groupCodeList = [];
    this.sacCode.reset();
    this.sacCodeList = [];
    this.filtered_sacCodeList = [];
    this.categoryFormReset();
      if (change  && change.label && change.value) {
        this.getSacCodes(2);
      }
  });

  this.groupCode.valueChanges.subscribe((change) => {
    this.sacCode.reset();
    this.sacCodeList = [];
    this.filtered_sacCodeList = [];
    this.categoryFormReset();
      if (change && change.label && change.value) {
        this.getSacCodes(3);
      }

  });

  this.sacCode.valueChanges.subscribe((change) => {
    this.categoryFormReset();
      if (change  && change.label && change.value) {
        this.getSacCodes(4);
        this.serviceNameCheck = false;
        this.getSubCategoriesBySacCode();
      }

  });

  this.section.valueChanges.subscribe((change) => {
    this.heading.reset();
    this.headingNameList = [];
    this.filtered_headingNameList = [];
    this.groupdescription.reset();
    this.groupNameList = [];
    this.filtered_groupNameList = [];
    this.sac.reset();
    this.sacNameList = [];
    this.filtered_sacNameList = [];
    this.categoryFormReset();
    if (!!change && change.label && change.value) {
        this.getSacNames(1);
      }
  });

  this.heading.valueChanges.subscribe((change) => {
    this.groupdescription.reset();
    this.groupNameList = [];
    this.filtered_groupNameList = [];
    this.sac.reset();
    this.sacNameList = [];
    this.filtered_sacNameList = [];
    this.categoryFormReset();
    if (!!change && change.label && change.value) {
        this.getSacNames(2);
      }
  });

  this.groupdescription.valueChanges.subscribe((change) => {
    this.sac.reset();
    this.sacNameList = [];
    this.filtered_sacNameList = [];
    this.categoryFormReset();
    if (!!change && change.label && change.value) {
        this.getSacNames(3);
      }
      this.sac.reset();
      this.sacNameList = [];
  });

  this.sac.valueChanges.subscribe((change) => {
    this.categoryFormReset();
    if (!!change && change.label && change.value) {
        this.getSacNames(4);
        // this.getSubCategoriesBySacCode();
        this.serviceCodeCheck = false
      }

  });



  this.segment.valueChanges.subscribe((change) => {
    this.familyList = [];
    this.filtered_familyList = [];
    this.family.reset();
    this.categoryClassList = [];
    this.filtered_categoryClassList = [];
    this.categoryClass.reset();
    this.commodityList = [];
    this.filtered_commodityList = [];
    this.commodity.reset();
    this.categoryFormReset();
    if (!!change && change.label && change.value) {
      this.getHSNCodes(1);
    }
 });
  this.family.valueChanges.subscribe((change) => {
    this.categoryClassList = [];
    this.filtered_categoryClassList = [];
    this.categoryClass.reset();
    this.commodityList = [];
    this.filtered_commodityList = [];
    this.commodity.reset();
    this.categoryFormReset();
    if (!!change && change.label && change.value) {
      this.getHSNCodes(2);
    }
   });
  this.categoryClass.valueChanges.subscribe((change) => {
    this.commodityList = [];
    this.filtered_commodityList = [];
    this.commodity.reset();
    this.categoryFormReset();
    if (!!change && change.label && change.value) {
        this.getHSNCodes(3);
      }
  });
  this.commodity.valueChanges.subscribe((change) => {
    if (!!change && change.label && change.value) {
      this.getHSNCodes(4);
      this.productNameCheck = false;
    }
    this.categoryFormReset();
   });


   this.segmentName.valueChanges.subscribe((change) => {
    this.familyNameList = [];
    this.filtered_familyNameList = [];
    this.familyName.reset();
    this.categoryClassNameList = [];
    this.filtered_categoryClassNameList = [];
    this.className.reset();
    this.commodityNameList = [];
    this.filtered_commodityNameList = [];
    this.commodityName.reset();
    this.categoryFormReset();
    if (!!change && change.label && change.value) {
      this.getHSNNames(1);
    }
 });
  this.familyName.valueChanges.subscribe((change) => {
    this.categoryClassNameList = [];
    this.filtered_categoryClassNameList = [];
    this.className.reset();
    this.commodityNameList = [];
    this.filtered_commodityNameList = [];
    this.commodityName.reset();
    this.categoryFormReset();
    if (!!change && change.label && change.value) {
      this.getHSNNames(2);
    }
   });
  this.className.valueChanges.subscribe((change) => {
    this.commodityNameList = [];
    this.filtered_commodityNameList = [];
    this.commodityName.reset();
    this.categoryFormReset();
    if (!!change && change.label && change.value) {
        this.getHSNNames(3);
      }
  });
  this.commodityName.valueChanges.subscribe((change) => {
    if (!!change && change.label && change.value) {
      this.getHSNNames(4);
      this.productCodeCheck = false
    }
    this.categoryFormReset();
   });
   this.setOrRemoveValidations(this.type.value);
  }

  resetForm() {
    Object.keys(this.itemCategoryForm.controls).forEach((control) => {
      if (control !== 'type') {
        this[control].reset();
      }
    });
  }
  categoryFormReset() {
    this.subCategoryList = [];
    this.filtered_subCategoryList = [];
    this.subCategoryName.reset();
    this.subCategoryNumber.reset();
    this.itemList = [];
    this.filtered_itemList = [];
    this.itemName.reset();
    this.itemNumber.reset();
    this.upcCode.reset();
    // this.itemuom.reset();
    this.specification.reset();
    this.categoryName.reset();
  }


  getSacCodes(argumentCount) {
    let data = {};
    let controlValue = '';
    switch (argumentCount) {
      case 0:
        data = {};
        controlValue = 'sectionCodeList';
        break;
      case 1:
        data = {sectionCode: this.sectionCode.value.value};
        controlValue = 'headingCodeList';
        break;
      case 2:
        data = {sectionCode: this.sectionCode.value.value, headingCode: this.headingCode.value.value};
        controlValue = 'groupCodeList';
        break;
      case 3:
        data = {sectionCode: this.sectionCode.value.value, headingCode: this.headingCode.value.value, groupCode: this.groupCode.value.value};
        controlValue = 'sacCodeList';
        break;
      case 4:
        controlValue = 'hsnFinalList';
        data = {sectionCode: this.sectionCode.value.value, headingCode: this.headingCode.value.value, groupCode: this.groupCode.value.value, sacCode: this.sacCode.value.value};
        break;
      default:
    }
    this.catService.getSacCodes(data).subscribe((res) => {
      const tempArray = [];
      if (argumentCount <= 3) {
        if (Array.isArray(res)) {
            res.forEach((ele) => {
              tempArray.push({label: ele, value: ele});
            });
        }
        this[controlValue] = [...tempArray];
      }

      if (argumentCount === 4) {
         this.categoryName.setValue(res[2]);
          this.sacCodeObj = {id: res[1], code: res[0], name: res[2] };
        // this[controlValue].push({label: 'Other', value: 'Other'});
      }
      // this[controlValue].push({label: 'Other', value: 'Other'});
    });
    console.log('cat', this[controlValue]);
  }

  getSacNames(argumentCount) {
    let data = {};
    let controlValue = '';
    switch (argumentCount) {
      case 0:
        data = {};
        controlValue = 'sectionNameList';
        break;
      case 1:
        data = {section: this.section.value.value};
        controlValue = 'headingNameList';
        break;
      case 2:
        data = {section: this.section.value.value, heading: this.heading.value.value};
        controlValue = 'groupNameList';
        break;
      case 3:
        data = {section: this.section.value.value, heading: this.heading.value.value, groupdescription: this.groupdescription.value.value};
        controlValue = 'sacNameList';
        break;
      case 4:
        controlValue = 'hsnFinalList';
        data = {section: this.section.value.value, heading: this.heading.value.value, groupdescription: this.groupdescription.value.value, sac: this.sac.value.value};
        break;
      default:
    }
    this.catService.getSacNames(data).subscribe((res) => {
      const tempArray = [];
      if (Array.isArray(res)) {
         res.forEach((ele) => {
          tempArray.push({label: ele, value: ele});
         });
      }
      this[controlValue] = [...tempArray];
      if (argumentCount === 4) {
        this.categoryName.setValue(res[2]);
        this.sacCodeObj = {id: res[1], code: res[0], name: res[2] };
        this.getSubCategoriesBySacCode()
      }
    });
    console.log('cat', this[controlValue]);
  }

  getHSNCodes(argumentCount) {
    let data = {};
    let controlValue = '';
    switch (argumentCount) {
      case 0:
        data = {};
        controlValue = 'segmentList';
        break;
      case 1:
        data = {segment: this.segment.value.value};
        controlValue = 'familyList';
        break;
      case 2:
        data = {segment: this.segment.value.value, family: this.family.value.value};
        controlValue = 'categoryClassList';
        break;
      case 3:
        data = {segment: this.segment.value.value, family: this.family.value.value, categoryClass: this.categoryClass.value.value};
        controlValue = 'commodityList';
        break;
      case 4:
        controlValue = 'hsnFinalList';
        data = {segment: this.segment.value.value, family: this.family.value.value, categoryClass: this.categoryClass.value.value, commodity: this.commodity.value.value};
        break;
      default:

    }
    this.catService.getHSNCodes(data).subscribe((res) => {
      const tempArray = [];
      if (Array.isArray(res)) {
        if (argumentCount <= 3) {
         res.forEach((ele) => {
          tempArray.push({label: ele, value: ele});
         });
         this[controlValue] = [...tempArray];
          console.log('cat', this[controlValue]);
        } else {
          if (argumentCount === 4) {
            console.log('res[2][\'label\']', res[2]);
            this.hsnCodeList.push({label: res[2]['label'] , value: res[0], id: res[1] });
            this.hsncode.setValue({label: res[2] , value: res[0], id: res[1] });
            this.hsncode.disable();

          }
        }
      }


      // this[controlValue].push({label: 'Other', value: 'Other'});
    });
  }

  getHSNNames(argumentCount) {
    let data = {};
    let controlValue = '';
    switch (argumentCount) {
      case 0:
        data = {};
        controlValue = 'segmentNameList';
        break;
      case 1:
        data = {segmentName: this.segmentName.value.value};
        controlValue = 'familyNameList';
        break;
      case 2:
        data = {segmentName: this.segmentName.value.value, familyName: this.familyName.value.value};
        controlValue = 'categoryClassNameList';
        break;
      case 3:
        data = {segmentName: this.segmentName.value.value, familyName: this.familyName.value.value, className: this.className.value.value};
        controlValue = 'commodityNameList';
        break;
      case 4:
        controlValue = 'hsnFinalNameList';
        data = {segmentName: this.segmentName.value.value, familyName: this.familyName.value.value, className: this.className.value.value, commodityName: this.commodityName.value.value};
        break;
      default:

    }
    this.catService.getHSNNames(data).subscribe((res) => {
      const tempArray = [];
      if (Array.isArray(res)) {
        if (argumentCount <= 3) {
         res.forEach((ele) => {
          tempArray.push({label: ele, value: ele});
         });
         this[controlValue] = [...tempArray];
          console.log('cat', this[controlValue]);
        } else {
          if (argumentCount === 4) {
            console.log('res[2][\'label\']', res[2]);
            this.hsnCodeNameList.push({label: res[2]['label'] , value: res[0], id: res[1] });
            this.hsncode.setValue({label: res[2] , value: res[0], id: res[1] });
            this.hsncode.disable();

          }
        }
      }


      // this[controlValue].push({label: 'Other', value: 'Other'});
    });
  }

  setOrRemoveValidations(changeType) {
    const controls = Object.keys(this.itemCategoryForm.controls);
    controls.forEach((control) => {
      this[control].setValidators([Validators.required]);
    });
    if (changeType === 'hsn') {
      this.sectionCode.clearValidators();
      this.headingCode.clearValidators();
      this.groupCode.clearValidators();
      this.sacCode.clearValidators();
      this.section.clearValidators();
      this.heading.clearValidators();
      this.groupdescription.clearValidators();
      this.sac.clearValidators();
    }
    if (changeType === 'sac') {
      this.hsncode.clearValidators();
      this.family.clearValidators();
      this.segment.clearValidators();
      this.categoryClass.clearValidators();
      this.commodity.clearValidators();
      this.familyName.clearValidators();
      this.segmentName.clearValidators();
      this.className.clearValidators();
      this.commodityName.clearValidators();
    }
    this.productCodeCheck = true;
    this.productNameCheck = true;
    this.serviceNameCheck = true;
    this.serviceCodeCheck = true;
  }

  getSubCategoriesByHSNCode() {
    this.subCategoryList = [];
    this.filtered_subCategoryList = [];
    if (this.hsncode.value) {
      this.catService.getSubCategoryByHsnCode({ hsnCode: this.hsncode.value.value }).subscribe((res) => {
        if (!!res && Array.isArray(res)) {
          this.subCategoryList = [];
          res.forEach(ele => {
            this.subCategoryList.push({ label: ele.subCategoryName, value: ele.subCategoryNumber , id: ele.id});
          });

        }
      });
    } else {}

  }

  getSubCategoriesBySacCode() {
    this.subCategoryList = [];
    this.filtered_subCategoryList = [];
    if (this.sacCode.value) {
      if(this.sacCode.value.value){
        this.catService.getSubCategoryBySac({ sacCode: this.sacCode.value.value}).subscribe((res) => {
          if (!!res && Array.isArray(res)) {
            this.subCategoryList = [];
            res.forEach(ele => {
              this.subCategoryList.push({ label: ele.subCategoryName, value: ele.subCategoryNumber, id: ele.id });
            });

          }
        });
      }
    }

    if (this.sac.value.value) {
      this.catService.getSubCategoryBySac({ sacCode: this.sacCodeObj.code}).subscribe((res) => {
        if (!!res && Array.isArray(res)) {
          this.subCategoryList = [];
          res.forEach(ele => {
            this.subCategoryList.push({ label: ele.subCategoryName, value: ele.subCategoryNumber, id: ele.id });
          });

        }
      });
    }
  }


  getAllSacCodeList() {
    this.sacCodeList = [];
    this.filtered_sacCodeList = [];
    this.catService.fetchAllSacCodes().subscribe((res) => {
      if (!!res && Array.isArray(res)) {
        res.forEach(ele => {
          this.sacCodeList.push({ label: ele.sac, value: ele.sacCode , id: ele.id});
        });
      }
    });
  }

  getItemMasterBySubCategory() {
    this.itemList = [];
    this.filtered_itemList  = [];
    if (this.subCategoryName.value.id) {
      this.catService.getItemMasterBySubCategory({id: this.subCategoryName.value.id}).subscribe((res) => {
        if (Array.isArray(res)) {
          this.itemList = [];
           res.forEach(element => {
             this.itemList.push({label: element.description, id: element.id, value: element.itemNumber});
           });
        }
      });
    }
    // this.itemList.push({'label': 'test', 'value': 12});
    // console.log('items list', this.itemList);
  }

  filterAutoCompleteData(event, inputArrayName, outputArrayName, searchFieldName, isStringType) {
    const filtered: any[] = [];
    this[outputArrayName] = [];
    const query = isStringType ? event.query.toLowerCase() : event.query;
    for (let i = 0; i < this[inputArrayName].length; i++) {
      const ele = this[inputArrayName][i];
      const searchField = searchFieldName !== '' ? (isStringType ? ele[searchFieldName].toLowerCase() : ele[searchFieldName]) : (isStringType ? ele.toLowerCase() : ele);
      if (searchField.indexOf(query) === 0) { // searchFiled.includes(query)
        filtered.push(ele);
      }
    }

    this[outputArrayName] = filtered;
  }


  onSelect(event, formControlName) {
    console.log('event', event);
    this[formControlName].setValue(event);
  }

  createItemCategory() {
    console.log('thisitemks', this.itemCategoryForm.controls);
    // if (this.itemCategoryForm.valid) {
      const reqObj  = {'description': this.itemName.value,
      'upcCode': this.upcCode.value,
      'subcategory': {'id': this.subCategoryName.value.id},
      // 'itemuom': {'id': this.itemuom.value.value},
      'specification': this.specification.value
    };

      if (this.type.value === 'hsn') {
        reqObj['type'] = 'hsn',
        reqObj['hsncode'] = {id: this.hsncode.value.id};
      }
      if (this.type.value === 'sac') {
        reqObj['type'] = 'sac',
        reqObj['saccode'] = {id: this.sacCodeObj.id};
      }

      console.log('obj', reqObj);
      this.catService.createItemMasterByHsnOrSac(reqObj).subscribe((response) => {
        if (response['id']) {
          this.toaster.success('Item Created Successfullty', 'Successfully');
          this.itemNumber.setValue(response['itemNumber']);
          this.getItemMasterBySubCategory();
          this.filtered_itemList.push({label: response['description'], id: response['id'], value: response['itemNumber']});
          this.itemListCompnent.getAllItemsMaster();
        } else {
          this.toaster.warning('Item Creation Failed', 'Failed');
        }
    });
    // }
  }


}
