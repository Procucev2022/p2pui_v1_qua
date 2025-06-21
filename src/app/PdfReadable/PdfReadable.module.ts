import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfReadableComponent } from './PdfReadable.component';
import { CommonShareModule } from '../shared/modules/common-share/common-share.module';
import { PDFReadableRouterModule } from './PdfReadable.routing';

@NgModule({
  imports: [
    CommonModule,
    CommonShareModule,
    PDFReadableRouterModule
],
  declarations: [PdfReadableComponent]
})
export class PdfReadableModule {
  fileData:any;
 }
