import { Component, OnInit, OnChanges, Input } from "@angular/core";
import { CustomValidationsService } from '../../services/custom-validations.service';

@Component({
  selector: "app-grid-page-info",
  templateUrl: "./grid-page-info.component.html",
  styleUrls: ["./grid-page-info.component.scss"]
})
export class GridPageInfoComponent implements OnInit, OnChanges {
  @Input("totalRecords") totalRecords;
  @Input("pageData") pageData;
  @Input("selectedMenu") selectedMenu;
  paginatoryDetails: string;
  @Input("auditPageSize") auditPageSize;
  constructor(private pageInfoService: CustomValidationsService) { }

  tempMenu: any;

  ngOnInit() {

    if (this.selectedMenu)
      this.paginatoryDetails = this.pageInfoService.getGridPageInfo(
        this.pageData,
        this.totalRecords
      );
    else {
      if (this.auditPageSize) {
        this.paginatoryDetails = this.pageInfoService.auditGetPageInfo(
          this.totalRecords,
          this.auditPageSize
        );
      } else {
        this.paginatoryDetails = this.pageInfoService.initGetPageInfo(
          this.totalRecords
        );
      }
    }
  }

  ngOnChanges() {
    if (!this.pageData) {
      this.paginatoryDetails = this.pageInfoService.initGetPageInfo(
        this.totalRecords
      );
    } else {
      this.paginatoryDetails = this.pageInfoService.getGridPageInfo(
        this.pageData,
        this.totalRecords
      );
    }
  }
}
