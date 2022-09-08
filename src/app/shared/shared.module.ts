import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { TopNavComponent } from './layout/top-nav/top-nav.component';
import { FooterComponent } from './layout/footer/footer.component';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AlertComponent } from './alert/alert.component';
import { HamburgerMenuComponent } from './layout/hamburger-menu/hamburger-menu.component';
import { ToggleOpenDirective } from './directives/toggle-open.directive';
import { ForbiddenComponent } from './http-error/forbidden/forbidden.component';
import { JwPaginationComponent } from './jw-pagination/jw-pagination.component';
import { TicketStatusColorDirective } from './directives/ticket-status-color.directive';
import { AllowSubmitDirective } from './directives/allow-submit.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { Search2Component } from './search/search2.component';
import { NotFoundComponent } from './http-error/not-found/not-found.cmponent';
import { SearchContentComponent } from './search/search-content/search-content.component';
import { SearchUserComponent } from './search/search-user/search-user.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { LabelValidationDirective } from './directives/label-validation.directive';

@NgModule({
  declarations: [
    TopNavComponent,
    FooterComponent,
    LayoutComponent,
    AlertComponent,
    HamburgerMenuComponent,
    ToggleOpenDirective,
    TicketStatusColorDirective,
    AllowSubmitDirective,
    ForbiddenComponent,
    NotFoundComponent ,
    JwPaginationComponent,
    LabelValidationDirective,
    LoadingSpinnerComponent,
    Search2Component,
    SearchContentComponent,
    SearchUserComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
     CommonModule,
    TopNavComponent,
    FooterComponent,
    LayoutComponent,
    AlertComponent,
    HamburgerMenuComponent,
    ToggleOpenDirective,
    TicketStatusColorDirective,
    AllowSubmitDirective,
    LabelValidationDirective,
    JwPaginationComponent,

    LoadingSpinnerComponent,
    Search2Component,
    ConfirmDialogComponent

  ]
})
export class SharedModule { }
