import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationsRoutingModule } from './configurations-routing.module';
import { UomComponent } from './uom/uom.component';
import { CommonShareModule } from '../../shared/modules/common-share/common-share.module';

@NgModule({
  imports: [
    CommonModule,
    ConfigurationsRoutingModule,
    CommonShareModule
  ],
  declarations: [UomComponent]
})
export class ConfigurationsModule { }
