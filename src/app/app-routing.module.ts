import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthLogComponent } from './admin/logs/auth-log/auth-log.component';
import { ErrorLogComponent } from './admin/logs/error-log/error-log.component';
import { AdminAuthGuard } from './auth/guards/admin.guard';
import { AuthGuard } from './auth/guards/auth.guard';
import { EmployeeAuthGuard } from './auth/guards/employee.guard';

import { LogoutComponent } from './general-pages/logout/logout.component';
import { HomeComponent } from './general-pages/home/home.component';
import { HowToUseComponent } from './general-pages/how-to-use/how-to-use.component';
import { ForbiddenComponent } from './shared/http-error/forbidden/forbidden.component';
import { NotFoundComponent } from './shared/http-error/not-found/not-found.cmponent';




const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(a => a.AuthModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(a => a.AdminModule), canActivateChild: [AdminAuthGuard] },
  { path: 'customers', loadChildren: () => import('./customers/customers.module').then(c => c.CustomersModule), canActivateChild: [AuthGuard] },
  { path: 'support', loadChildren: () => import('./support/support.module').then(s => s.SupportModule), canActivateChild: [EmployeeAuthGuard] },
  { path: '401', component: ForbiddenComponent },
  { path: 'errors', component: ErrorLogComponent, canActivate: [AdminAuthGuard]},
  { path: 'auth-log', component: AuthLogComponent, canActivate: [AdminAuthGuard] },
  { path: 'how', component: HowToUseComponent },
  { path: 'logout', component: LogoutComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo:'404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabledBlocking' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
