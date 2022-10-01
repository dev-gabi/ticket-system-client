import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketListComponent } from './ticket-list/ticket-list2.component';
import { TicketComponent } from './ticket/ticket.component';
import { RouterModule } from '@angular/router';
import { NewTicketComponent } from './new-ticket/new-ticket.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketReplyComponent } from './ticket/ticket-reply/ticket-reply.component';
import { CategoryFilterComponent } from './ticket-list/category-filter/category-filter.component';
import { StatusFilterComponent } from './ticket-list/status-filter/status-filter.component';  
import { ImagePreviewComponent } from './new-ticket/image-preview/image-preview.component';
import { AddReplyComponent } from './ticket/add-reply/add-reply.component';
import { CategorySelectComponent } from './ticket-list/category-filter/category-select/category-select.component';
import { StatusSelectComponent } from './ticket-list/status-filter/status-select/status-select.component';



@NgModule({
  declarations: [
    TicketListComponent,
    TicketComponent,
    NewTicketComponent,
    TicketReplyComponent,
    ImagePreviewComponent,
    CategoryFilterComponent,
    StatusFilterComponent,
    AddReplyComponent,
    CategorySelectComponent,
    StatusSelectComponent

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
