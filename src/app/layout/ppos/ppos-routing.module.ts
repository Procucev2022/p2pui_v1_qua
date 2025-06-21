import { NgModule } from '@angular/core';
import { GeneratedPposComponent } from './components/generated-ppos/generated-ppos.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {    path: 'ppos', component:  GeneratedPposComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PposRoutingModule { }
