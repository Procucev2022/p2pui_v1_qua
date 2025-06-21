import { NgModule } from '@angular/core';
import { RaisedIssuesComponent } from './components/raised-issues/raised-issues.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {    path: 'issues', component: RaisedIssuesComponent   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RaiseIssueRoutingModule { }
