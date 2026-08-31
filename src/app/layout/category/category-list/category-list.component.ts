import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { AppConfig } from "src/app/app.config";
import { CommonGridData } from "src/app/shared/modules/common-share/models/commonGridData";
import { EncryDecryService } from "src/app/shared/services";
import { NewCreateSubCategoryComponent } from "../new-create-sub-category/new-create-sub-category.component";
import { CategoryService } from "../services/category.service";
import { FormGroup } from "@angular/forms";

@Component({
    selector: "app-category-list",
    templateUrl: "./category-list.component.html",
    styleUrls: ["./category-list.component.scss"],
})
export class CategoryListComponent implements OnInit {
    subCategoryGridData: CommonGridData;
    selectedCategoryId: string;
    selectedSubCategoryData:any ;
    categorieHeaders = [
        {
            field: "subCategoryName",
            header: "Sub Category Name",
            isLink: false,
            width: "160px",
            fieldType: "text",
        },
        {
            field: "subCategoryNumber",
            header: "Sub Category Number",
            isLink: false,
            width: "170px",
            fieldType: "text",
        },
        {
            field: "categoryName",
            header: "Category Name",
            isLink: false,
            width: "160px",
            fieldType: "text",
        },
        {
            field: "hsnCode",
            header: "Category Number",
            isLink: false,
            width: "160px",
            fieldType: "text",
        },
        {
            field: "status",
            header: "Status",
            isLink: false,
            width: "110px",
            fieldType: "text",
        },
        {
            field: "createdTS",
            header: "Creation Date",
            isLink: false,
            width: "130px",
            fieldType: "date",
        },
    ];
    pageRecordSize: any;
    pageOptions: any;
    categoriesList: any[] = [];
    selectedData: any;
    paginatoryDetails: any;
    loggedUserDetails: any;
  subCategoryName: any;
    constructor(
        private catService: CategoryService,
        private modalDialog: MatDialog,
        private toaster: ToastrService,
        private encryDecryService: EncryDecryService
    ) {}

    ngOnInit() {
        this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
        let temp = JSON.parse(
            this.encryDecryService.get(localStorage.getItem("logData"))
        );
        this.loggedUserDetails = temp.details.role.roleName;
        this.getAllSubCategoryList();
    }

    getAllSubCategoryList() {
        this.subCategoryGridData = null;
        this.catService.getAllSubCategoryList().subscribe((res) => {
            console.log(res);
            res.forEach((ele) => {
                ele["status"] = ele["status"]["uiDisplay"];
                ele["hsnCode"] = ele["hsnCode"]
                    ? ele["hsnCode"]
                    : ele["sacCode"];
            });
            this.categoriesList = res;
            //   const actionEvents = [];
            //   const gridHeaders = [];
            //   this.setSubCategoryGridData(res);
        });
    }

    onPage(event) {
        this.paginatoryDetails = event;
    }

    setSubCategoryGridData(res) {
        const gridTopButtonsEvents = [
            {
                name: "Create SubCategory",
                btnColor: "primary",
                btnName: "Create",
                btnEventName: "createSubCategory",
                btnType: "button",
            },
        ];
        const actionEvents = [];
        const gridHeaders = [
            {
                field: "categoryName",
                header: "Category Name",
                isLink: false,
                width: "150px",
                fieldType: "text",
            },
            {
                field: "subCategoryName",
                header: "Sub Category Name",
                isLink: false,
                width: "150px",
                fieldType: "text",
            },
            {
                field: "subCategoryNumber",
                header: "Sub Category Number",
                isLink: false,
                width: "150px",
                fieldType: "text",
            },
            {
                field: "hsnCode",
                header: "HSN Code",
                isLink: false,
                width: "130px",
                fieldType: "text",
            },
            {
                field: "createdTS",
                header: "Creation Date",
                isLink: false,
                width: "130px",
                fieldType: "date",
            },
        ];
        this.subCategoryGridData = {
            actionEvents: [...actionEvents],
            gridTopButtonActions: [...gridTopButtonsEvents],
            gridColumnData: res || [],
            gridHeaders: [...gridHeaders],
            gridTitle: "",
            displayParentLabel: " ",
            displayParentId: "",
            rowEventClickEventName: "",
            editableCells: [],
            gridSelectionCheckbox: {
                showSelction: false,
                allowMultipleSelection: false,
            },
        };
    }

    onClickCommonGrid(event) {
        this[event.eventName](event);
    }

    approve(data) {
        console.log(data);
        let obj = {
            id: data.id,
        };
        this.catService.approveSubCategory(obj).subscribe((res) => {
            this.successCallBack(res);
        });
    }
    reject(data) {
        let obj = {
            id: data.id,
        };
        this.catService.rejectSubCategory(obj).subscribe((res) => {
            this.successCallBack(res);
        });
    }
    successCallBack(res: any) {
        if (res.status == "Success") {
            this.toaster.success(res.message, "Success");
        } else {
            this.toaster.error(res.message, "Error");
        }
        this.getAllSubCategoryList();
    }

    createSubCategory() {
        this.modalDialog
            .open(NewCreateSubCategoryComponent, {
                width: "80%",
                minHeight: "400px",
                data: {type:"Categories"},
            })
            .afterClosed()
            .subscribe((result) => {
                // if (result) {
                this.getAllSubCategoryList();
                // }
            });
    }

    editSubCategory(rowData: any, editSubCategoryDialog: any) {
      this.selectedSubCategoryData = rowData;
      this.subCategoryName = rowData.subCategoryName;
        this.modalDialog.open(editSubCategoryDialog, {
            width: "30%",
            minHeight: "250px",
            data: "Su",
        }).afterClosed().subscribe((res:any)=>{
          this.subCategoryName = '';
          this.selectedSubCategoryData =null;
        })
    }
    updateSubCategoryData(editSubCatForm:FormGroup){
      if(editSubCatForm.valid){
        const obj ={
          "subCategoryName": this.subCategoryName,
          "id": this.selectedSubCategoryData.id
        }
        this.catService.updateSubCategoryData(obj).subscribe((res:any)=>{
            if (res.status == "Success") {
                this.toaster.success(res.message, "Success");
                this.getAllSubCategoryList();
            } else {
                this.toaster.error(res.message, "Error");
            }
            this.modalDialog.closeAll();
        })
      }

    }
}
