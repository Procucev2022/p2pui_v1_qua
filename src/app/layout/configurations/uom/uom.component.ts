import { Component, OnInit, ViewChild } from '@angular/core';
import { UomService } from './services/uom.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.scss']
})
export class UomComponent implements OnInit {
  uomList: any[];
  @ViewChild('createModal') createModal;
  selectedUOM: any;

  constructor(private uomService: UomService, private modalDialog: MatDialog, private toastr: ToastrService) { }
  uomGridCoreData: any;
  uomData = [];
  description;
  ngOnInit() {

  this.getAllUOMs();
  }
  getAllUOMs() {
    this.uomGridCoreData = null;
    this.uomService.getAllUOMs().subscribe((res) => {
      if (Array.isArray(res)) {
        this.uomList = res;
      } else {
        this.uomList = [];
      }


    const gridHeaders = [
      {
        field: 'description',
        header: 'Description',
        isLink: false,
        width: '280px',
        fieldType: 'text',
      }, {
        field: 'createdTS',
        header: 'Creation Date',
        isLink: false,
        width: '180px',
        fieldType: 'date',
      },
    ];
    const actionEvents = [
      {
        name: 'Edit',
        className: 'fa fa-pencil view',
        eventName: 'editUOM',
        iconType: 'regular',
      }];
      const gridTopActions = [
        {
          name: 'Create',
          btnColor: 'primary',
          btnName: 'Create',
          btnEventName: 'createUOM',
          btnType: 'button'
        }
      ];

      this.uomGridCoreData = {
        actionEvents: [...actionEvents],
        gridTopButtonActions  : [...gridTopActions],
        gridColumnData:  this.uomList || [],
        gridHeaders: [...gridHeaders],
        gridTitle: '',
        displayParentLabel: '',
        displayParentId: '',
        rowEventClickEventName: '',
        editableCells : [],
        gridSelectionCheckbox: {
          showSelction: true,
          allowMultipleSelection: false
        }

      };
    });
  }

  onClickCommonGrid(event) {
    this[event.eventName](event.rowData);
  }

  editUOM(data) {
    this.selectedUOM = Object.assign({}, data );
    this.description = this.selectedUOM.description;
    this.openModal();
  }

  openModal() {
    this.modalDialog.open(this.createModal, {
      width: '40%',
      minHeight: '30vh',
      data: {hsnList: []}
    }).afterClosed().subscribe((res) => {
      if (res) {
      this.getAllUOMs();
      }
    });
  }

  createUOM() {
    this.selectedUOM = null;
    this.openModal();
  }

  close() {
    this.modalDialog.closeAll();
    this.selectedUOM = null;
    this.description = '';
  }

  saveUOM() {
    if (this.description) {
      if (this.selectedUOM) {
        const reqObj =  {...this.selectedUOM, ...{'description': this.description}};
        this.uomService.editUOM(reqObj).subscribe((res) => {
          if ( res['status'] && res['status'].toLowerCase() === 'success') {
            this.close();
            this.getAllUOMs();
            this.toastr.success('UOM updated successfully', 'Success');
          } else {
            this.toastr.success('UOM updation failed', 'Failed');
          }
        });
      } else {
        this.uomService.createUOM({description: this.description}).subscribe((res) => {
          if ( res['status'] && res['status'].toLowerCase() === 'success') {
            this.close();
            this.getAllUOMs();
            this.toastr.success('UOM Created successfully', 'Success');
          } else {
            this.toastr.success('UOM Creation failed', 'Failed');
          }
        });
      }

    }
  }
}
