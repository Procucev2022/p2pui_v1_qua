import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorRequestRoutingModule } from './vendor-request-routing,module';
import { VendorRequestComponent } from './components/vendor-request/vendor-request.component';
import { CommonShareModule } from 'src/app/shared/modules/common-share/common-share.module';
import { VendorReqModalComponent } from './components/vendor-req-modal/vendor-req-modal.component';
import { VenReqViewModalComponent } from './components/ven-req-view-modal/ven-req-view-modal.component';
import { ReqCompletedModalComponent } from './components/req-completed-modal/req-completed-modal.component';

@NgModule({
  imports: [
    CommonModule,
    VendorRequestRoutingModule,
    CommonShareModule
  ],
  declarations: [VendorRequestComponent, VendorReqModalComponent, VenReqViewModalComponent, ReqCompletedModalComponent],
  // entryComponents: [VendorReqModalComponent, VenReqViewModalComponent, ReqCompletedModalComponent]
})
export class VendorRequestModule { }
