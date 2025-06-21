import { Routes, RouterModule } from '@angular/router';
import { PdfReadableComponent } from './PdfReadable.component';
import { NgModule } from '@angular/core';


const routes: Routes = [
     {path: '', component: PdfReadableComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PDFReadableRouterModule {}
