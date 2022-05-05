import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthLogComponent } from './admin/auth-log/auth-log.component';
import { ErrorLogComponent } from './admin/error-log/error-log.component';
import { AdminAuthGuard } from './auth/guards/admin.guard';
import { HowToUseComponent } from './general-pages/how-to-use/how-to-use.component';
import { HomeComponent } from './general-pages/home/home.component';
import { ForbiddenComponent } from './shared/http-error/forbidden/forbidden.component';
import { NotFoundComponent } from './shared/http-error/not-found/not-found.cmponent';



const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(a => a.AuthModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(a => a.AdminModule) },
  { path: 'customers', loadChildren: () => import('./customers/customers.module').then(c => c.CustomersModule) },
  { path: 'support', loadChildren: () => import('./support/support.module').then(s => s.SupportModule) },
  { path: '401', component: ForbiddenComponent },
  { path: 'errors', component: ErrorLogComponent, canActivate: [AdminAuthGuard]},
  { path: 'auth-log', component: AuthLogComponent, canActivate: [AdminAuthGuard] },
  { path: 'how', component: HowToUseComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo:'404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
