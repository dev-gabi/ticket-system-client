import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { TicketComponent } from './ticket/ticket.component';
import { RouterModule } from '@angular/router';
import { NewTicketComponent } from './new-ticket/new-ticket.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { TicketReplyComponent } from './ticket/ticket-reply/ticket-reply.component';

import { CategoryFilterComponent } from './ticket-list/category-filter/category-filter.component';
import { StatusFilterComponent } from './ticket-list/status-filter/status-filter.component';  
import { ImagePreviewComponent } from './new-ticket/image-preview/image-preview.component';



@NgModule({
  declarations: [
    TicketListComponent,
    TicketComponent,
    NewTicketComponent,
    TicketReplyComponent,
    ImagePreviewComponent,
    CategoryFilterComponent,
    StatusFilterComponent

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    TicketListComponent
  ]
})
export class TicketsModule { }
