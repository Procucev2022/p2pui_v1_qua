import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PposRoutingModule } from './ppos-routing.module';
import { GeneratedPposComponent } from './components/generated-ppos/generated-ppos.component';
import { CommonShareModule } from 'src/app/shared/modules/common-share/common-share.module';

@NgModule({
  imports: [
    CommonModule,
    PposRoutingModule,
    CommonShareModule
  ],
  declarations: [GeneratedPposComponent]
})
export class PposModule { }
