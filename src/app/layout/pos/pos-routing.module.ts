import { NgModule } from '@angular/core';
import { PosComponent } from './pos/pos.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {    path: 'pos', component:  PosComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosRoutingModule { }
