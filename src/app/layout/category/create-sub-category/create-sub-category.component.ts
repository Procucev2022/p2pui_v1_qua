import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import {MenuItem} from 'primeng/api';
import {SelectItem} from 'primeng/api';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Optional } from 'ag-grid-community';
import { CategoryListComponent } from '../category-list/category-list.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-create-sub-category',
  templateUrl: './create-sub-category.component.html',
  styleUrls: ['./create-sub-category.component.scss']
})
export class CreateSubCategoryComponent implements OnInit {

  categoryListComponent: CategoryListComponent;
  subCategoryForm: FormGroup;
  segmentList = [];
  familyList = [];
  categoryClassList = [];
  commodityList = [];
  hsnFinalList = [];
  sectionCodeList  = [] ;
  headingCodeList = [];
  groupCodeList = [];
  sacCodeList = [];
  sacFinalList = [];
  subCategoryList = [];

  filtered_headingCodeList = [];
  filtered_groupCodeList = [];
  filtered_sacCodeList = [];
  filtered_segmentList = [];
  filtered_familyList = [];
  filtered_categoryClassList = [];
  filtered_commodityList = [];
  filtered_hsnCodeList = [];
  filtered_sectionCodeList = [];
  filtered_subCategoryList  = [];
  hsncodeobj: any;

    // for Product Names

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

    productCodeCheck: boolean = true;
    productNameCheck: boolean = true;
    serviceCodeCheck: boolean = true;
    serviceNameCheck: boolean = true;

  constructor(private fb: FormBuilder,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<CategoryListComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private toaster: ToastrService) { }

  ngOnInit() {
    this.createForm();
    this.getHSNCodes(0);
    this.getSacCodes(0);
    this.getHSNNames(0)
    this.getSacNames(0);

    this.type.valueChanges.subscribe((change) => {
      console.log('type', change);
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
      this.categoryFormReset();
      if (!!change && change.label && change.value) {
        this.getHSNCodes(4);
        this.productNameCheck = false;
      }

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
        this.productCodeCheck = false;
      }
      this.categoryFormReset();
     });

    this.categoryName.valueChanges.subscribe((change) => {
      if (change) {
        if (this.type.value === 'hsn') {
         this.getSubCategoryByHSN();
        }
        if (this.type.value === 'sac') {
          this.getSubCategoryBySac();
        }
      }
    });

    this.subCategoryName.valueChanges.subscribe((change) => {
      this.subCategoryNumber.reset();
      if (!!change && change.label && change.value) {
        this.subCategoryNumber.setValue(change.value);
      }
    });

    this.subCategoryNumber.valueChanges.subscribe((change) => {

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
      if (!!change && change.label && change.value) {
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
      if (!!change && change.label && change.value) {
          this.getSacCodes(2);
        }
    });

    this.groupCode.valueChanges.subscribe((change) => {
      this.sacCode.reset();
      this.sacCodeList = [];
      this.filtered_sacCodeList = [];
      this.categoryFormReset();
      if (!!change && change.label && change.value) {
          this.getSacCodes(3);
        }
        this.sacCode.reset();
        this.sacCodeList = [];
    });

    this.sacCode.valueChanges.subscribe((change) => {
      this.categoryFormReset();
      if (!!change && change.label && change.value) {
          this.getSacCodes(4);
          this.serviceNameCheck = false;
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
          this.serviceCodeCheck = false
        }

    });

  }

  categoryFormReset() {
    this.subCategoryList = [];
    this.hsnFinalList = [];
    this.sacFinalList  = [];
    this.subCategoryName.reset();
    this.categoryName.reset();
    this.subCategoryNumber.reset();
    this.subCategoryList = [];
    this.filtered_subCategoryList = [];
  }

  setSubCategoryName() {
    const findElement = this.subCategoryList.filter((ele) => ele.value === this.subCategoryName.value);
    if (findElement.length > 0) {
      this.subCategoryNumber.setValue(findElement[0]['value'].toString());
    } else {
      this.subCategoryNumber.setValue('');
    }
  }

  resetForm() {
    Object.keys(this.subCategoryForm.controls).forEach((control) => {
      if (control !== 'type') {
        this[control].reset();
      }
    });
  }

  setOrRemoveValidations(changeType) {
    Object.keys(this.subCategoryForm.controls).forEach((control) => {
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

  get type() { return this.subCategoryForm.controls.type; }
  get segment () { return this.subCategoryForm.controls.segment; }
  get family () { return this.subCategoryForm.controls.family; }
  get categoryClass () { return this.subCategoryForm.controls.categoryClass; }
  get commodity () { return this.subCategoryForm.controls.commodity; }

  get segmentName () { return this.subCategoryForm.controls.segmentName; }
  get familyName () { return this.subCategoryForm.controls.familyName; }
  get className () { return this.subCategoryForm.controls.className; }
  get commodityName () { return this.subCategoryForm.controls.commodityName; }

  get categoryName () { return this.subCategoryForm.controls.categoryName; }
  get subCategoryName () { return this.subCategoryForm.controls.subCategoryName; }
  get subCategoryNumber () { return this.subCategoryForm.controls.subCategoryNumber; }

  get sectionCode () { return this.subCategoryForm.controls.sectionCode; }
  get headingCode () { return this.subCategoryForm.controls.headingCode; }
  get groupCode () { return this.subCategoryForm.controls.groupCode; }
  get sacCode () { return this.subCategoryForm.controls.sacCode; }

  get section () { return this.subCategoryForm.controls.section; }
  get heading () { return this.subCategoryForm.controls.heading; }
  get groupdescription () { return this.subCategoryForm.controls.groupdescription; }
  get sac () { return this.subCategoryForm.controls.sac; }

  createForm() {
    this.subCategoryForm = this.fb.group({
      type: ['hsn'],
      segment: [''],
      family: [''],
      categoryClass: [''],
      commodity: [''],

      segmentName: [''],
      familyName: [''],
      className: [''],
      commodityName: [''],

      categoryName: [''],
      subCategoryName: [''],
      subCategoryNumber: [''],

      sectionCode: [''],
      headingCode: [''],
      groupCode: [''],
      sacCode: [''],

      section: [''],
      heading: [''],
      groupdescription: [''],
      sac: [''],

    });
    this.categoryName.disable();
    this.subCategoryNumber.disable();
    this.getHSNCodes(0);
    this.categoryFormReset();

    this.setOrRemoveValidations(this.type.value);
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
    this.categoryService.getSacCodes(data).subscribe((res) => {
      const tempArray = [];
      if (Array.isArray(res)) {
         res.forEach((ele) => {
          tempArray.push({label: ele, value: ele});
         });
      }
      this[controlValue] = [...tempArray];
      if (argumentCount === 4) {
        this.hsncodeobj = {name: res[2] , code: res[0], id: res[1] };
            this.categoryName.setValue(this.hsncodeobj.name);
      }
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
    this.categoryService.getSacNames(data).subscribe((res) => {
      const tempArray = [];
      if (Array.isArray(res)) {
         res.forEach((ele) => {
          tempArray.push({label: ele, value: ele});
         });
      }
      this[controlValue] = [...tempArray];
      if (argumentCount === 4) {
        this.hsncodeobj = {name: res[2] , code: res[0], id: res[1] };
            this.categoryName.setValue(this.hsncodeobj.name);
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
    this.categoryService.getHSNCodes(data).subscribe((res) => {
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
            this.hsncodeobj = {name: res[2] , code: res[0], id: res[1] };
            this.categoryName.setValue(this.hsncodeobj.name);

          }
        }
      }
    });
    console.log('cat', this[controlValue]);
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
    this.categoryService.getHSNNames(data).subscribe((res) => {
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
            this.hsncodeobj = {name: res[2] , code: res[0], id: res[1] };
            this.categoryName.setValue(this.hsncodeobj.name);

          }
        }
      }
    });
  }

  getSubCategoryByHSN() {
    this.filtered_subCategoryList = [];
    this.subCategoryList = [];
    this.categoryService.getSubCategoryByHSN({hsnCode: this.hsncodeobj.code}).subscribe((res) => {
      if (res && Array.isArray(res)) {
        this.subCategoryList = [];
          res.forEach(ele => { this.subCategoryList.push({label: ele.subCategoryName, value: ele.subCategoryNumber}); });
      }
    });
  }

  getSubCategoryBySac() {
    this.filtered_subCategoryList = [];
    this.subCategoryList = [];
    this.categoryService.getSubCategoryBySac({sacCode: this.hsncodeobj.code}).subscribe((res) => {
      if (res && Array.isArray(res)) {
        this.subCategoryList = [];
          res.forEach(ele => { this.subCategoryList.push({label: ele.subCategoryName, value: ele.subCategoryNumber}); });
      }
    });
  }

  createSubCategory() {
    console.log(this.subCategoryForm.controls);
    // if (this.subCategoryForm.valid) {
      const sacObj = {
        'sacCode': this.hsncodeobj.code,
        'type': 'sac',
        'sac': {
          'id': this.hsncodeobj.id
        },
      };

      const hsnObj = {
        'hsnCode': this.hsncodeobj.code,
        'type': 'hsn',
        'hsn': {
          'id': this.hsncodeobj.id
        },
      };

      const obj  = this.type.value === 'hsn' ? {...hsnObj} : {...sacObj};
      const finalObj = { ...{'categoryName': this.categoryName.value,
      'subCategoryName':  this.subCategoryName.value,
      'createdBy': localStorage.getItem('userFullName')},
      ...obj
      };

      console.log('obj', finalObj);

      this.categoryService.createSubCategory(finalObj).subscribe((response) => {
          if (response['id']) {
            this.toaster.success('Sub Category Created Successfully', 'Success');
            this.subCategoryName.setValue({label: this.subCategoryName.value, value: response['subCategoryNumber']});
            this.subCategoryNumber.setValue(response['subCategoryNumber']);
            this.filtered_subCategoryList.push({label: this.subCategoryName.value, value: response['subCategoryNumber']});
            if (this.type.value === 'hsn') {
             this.getSubCategoryByHSN();
            } else {
              this.getSubCategoryBySac();
            }
            this.categoryListComponent.getAllSubCategoryList();
          }
      });

    // } else {

    // }
  }
  cearOrResetFormControls(controlName) {

  }

  closeModal() {
    this.dialogRef.close({event: 'close'});
  }

  filterAutoCompleteData(event, inputArrayName, outputArrayName, searchFieldName, isStringType) {
    const filtered: any[] = [];
    this[outputArrayName]  = [];
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

}
