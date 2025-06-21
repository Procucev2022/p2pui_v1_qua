import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Component({
  selector: 'app-item-list-by-vendor',
  templateUrl: './item-list-by-vendor.component.html',
  styleUrls: ['./item-list-by-vendor.component.scss']
})
export class ItemListByVendorComponent implements OnInit {
  // editCheck = true;
   weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(private catService: CategoryService, private toastr: ToastrService) { }
  itemList =  [];
  itemHeaders = [
    { field: 'desc', header: 'Item Description', isLink: false,  width: '500px',  fieldType: 'text'},
    // { field: 'procucevItemCode', header: 'Procucev Item Code', isLink: false,  width: '220px',  fieldType: 'text'},
    { field: 'vendorItemCode', header: 'Item Code', isLink: false,  width: '300px',  fieldType: 'text'},
    { field: 'rank', header: 'Rank', isLink: false,  width: '250px',  fieldType: 'text'},
    { field: 'quantity', header: 'Quantity', isLink: false,  width: '250px',  fieldType: 'date'},
    { field: 'status', header: 'Status', isLink: false,  width: '300px',  fieldType: 'text'},
    { field: 'pricePerUnit', header: 'Price Per Unit(₹)', isLink: false,  width: '320px',  fieldType: 'text'}
  ];
  selectedData  = [];
  paginatoryDetails: any;
  pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
  pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
  ngOnInit() {
    this.getItemsByVendor();
  }

  getItemsByVendor() {
    this.itemList = [];
    this.catService.getItemsByVendorRef({id: localStorage.getItem('orgId')}).subscribe((res) => {
      if (Array.isArray(res)) {
       res.forEach(element => {
         element['isEdit'] = false;
         element['isSaved'] = false;
         element['status'] = element['status'] ? element['status']['uiDisplay'] : 'Approved';
         this.itemList.push(element);
       });
      }
      this.enableEdit();
    });



    setInterval(() => {
      this.enableEdit();
    }, 60000);
  }

  enableEdit() {
    // this.catService.getEditDatesByVendor({id: localStorage.getItem('orgId')}).subscribe((res) => {
      // if (Array.isArray(res)) {
      //  this.itemList.forEach(element => {
        for (let i = 0; i < this.itemList.length; i++) {
          if (this.itemList[i].vendorDynamicPricingEnabled) {
            if (this.itemList[i].dynamicPricingType === 'Weekly') {
              // we should consider day, start and endtime
              if (this.weekday[new Date().getDay()] === this.itemList[i].dynamicPricingDay
              && new Date().getTime() >= new Date(this.dateFormat(this.itemList[i].startTime)).getTime()
              && new Date().getTime() <= new Date(this.dateFormat( this.itemList[i].endTime)).getTime()) {
                this.itemList[i]['editCheck'] = false;
                // console.log(this.editCheck);
              } else {
                this.itemList[i]['editCheck'] = true;
              }

            } else if (this.itemList[i].dynamicPricingType === 'Daily') {
              if (new Date().getTime() >= new Date(this.dateFormat( this.itemList[i].startTime)).getTime()
              && new Date().getTime() <= new Date(this.dateFormat(this.itemList[i].endTime)).getTime()) {
                this.itemList[i]['editCheck'] = false;
                // console.log(this.editCheck);
              } else {
                this.itemList[i]['editCheck'] = true;
              }

            }

          } else {
            this.itemList[i]['editCheck'] = true;
          }
        //  this.startDateFormat(element.dates[0],element.itemEditStarttime)
        //  this.endDateFormat(element.dates[0],element.itemEditEndtime)
        //  console.log(this.startDateFormat(element.dates[0], element.itemEditStarttime)
        //  , this.endDateFormat(element.dates[0], element.itemEditEndtime));

       }
      // }
    // });
  }

  // startDateFormat(date, time) {
  //   const d = date.split('/');
  //   return d[0] + '-' + d[1] + '-' + d[2] + 'T' + time.split('T')[1];
  // }

  // endDateFormat(date, time) {
  //   const d = date.split('/');
  //   return d[0] + '-' + d[1] + '-' + d[2] + 'T' + time.split('T')[1];
  // }
  dateFormat(time) {
    const d = new Date().toString().split(' ');
    d[4] = time + ':00';
    return d.join(' ');
  }

  editVendorData(rowData, index, actionName) {
    if(rowData.editCheck){
      this.toastr.warning('Please Contact Procucev Associate.');
      return true;
    }
    switch (actionName) {
      case 'edit':
        this.itemList[index]['isEdit'] = true;
        this.itemList[index]['isSaved'] = false;
        break;
      case 'save':
        this.itemList[index]['isEdit'] = false;
        this.itemList[index]['isSaved'] = true;
        this.saveItemData(this.itemList[index]);
        break;
      case 'reset':
        this.itemList[index]['isEdit'] = false;
        this.itemList[index]['isSaved'] = false;
        break;
      default:
    }
  }

  bulkSave() {
    const isAnyEdit  =  this.itemList.some(element =>  element.isEdit);
    if (!isAnyEdit) {
      this.toastr.warning('No Records is edit mode', 'Warning');
      return;
    } else {
      const filterData = this.itemList.filter(element =>  element.isEdit);
      this.saveItemData(filterData);
    }
  }

  saveItemData(data) {
    const obj = {
        'item': {'id': data.itemId},
        'pricePerUnit': data.pricePerUnit,
        'vendor': {'id': data.vendorId}
    };
    this.catService.editItemByVendorRef(obj).subscribe((res: any) => {
      if (res['status'] === 'Success') {
        this.toastr.success(res.message, 'Success');
        this.getItemsByVendor();
      }
    });
  }
}
