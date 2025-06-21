import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RaiseIssueRoutingModule } from './raise-issue-routing.module';
import { RaisedIssuesComponent } from './components/raised-issues/raised-issues.component';
import { CommonShareModule } from 'src/app/shared/modules/common-share/common-share.module';
import { CreateIssueComponent } from './components/create-issue/create-issue.component';
import { ViewIssueComponent } from './components/view-issue/view-issue.component';

@NgModule({
  imports: [
    CommonModule,
    RaiseIssueRoutingModule,
    CommonShareModule
  ],
  declarations: [RaisedIssuesComponent, CreateIssueComponent, ViewIssueComponent],
  // entryComponents: [CreateIssueComponent,ViewIssueComponent]
})
export class RaiseIssueModule { }
