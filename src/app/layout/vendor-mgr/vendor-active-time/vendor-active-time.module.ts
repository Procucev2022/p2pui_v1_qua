import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorActiveTimeRoutingModule } from './vendor-active-time-routing.module';
import { VendorActiveTimesComponent } from './vendor-active-times/vendor-active-times.component';
import { CommonShareModule } from 'src/app/shared/modules/common-share/common-share.module';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    VendorActiveTimeRoutingModule,
    CommonShareModule,
    MatIconModule,
    SelectDropDownModule,
  ],
  declarations: [VendorActiveTimesComponent],
  exports: [VendorActiveTimesComponent]
})
export class VendorActiveTimeModule { }
