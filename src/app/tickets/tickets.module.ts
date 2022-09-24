import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { TicketComponent } from './ticket/ticket.component';
import { RouterModule } from '@angular/router';
import { NewTicketComponent } from './new-ticket/new-ticket2.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketReplyComponent } from './ticket/ticket-reply/ticket-reply.component';

import { CategoryFilterComponent } from './ticket-list/category-filter/category-filter.component';
import { StatusFilterComponent } from './ticket-list/status-filter/status-filter.component';  
import { ImagePreviewComponent } from './new-ticket/image-preview/image-preview3.component';
import { AddReplyComponent } from './ticket/add-reply/add-reply.component';



@NgModule({
  declarations: [
    TicketListComponent,
    TicketComponent,
    NewTicketComponent,
    TicketReplyComponent,
    ImagePreviewComponent,
    CategoryFilterComponent,
    StatusFilterComponent,
    AddReplyComponent

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    TicketListComponent
  ]
})
export class TicketsModule { }
