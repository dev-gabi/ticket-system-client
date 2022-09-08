import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthUser } from './models/auth-user.model';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor
{
  constructor(private authService: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    const user: AuthUser = this.authService.getLoggedInUser();

      if (!user) { return next.handle(req); }
          const modifiedReq = req.clone({
            headers: req.headers.append('Authorization', 'Bearer ' + user.token)
          })
          return next.handle(modifiedReq);

    //return this.authService.user.pipe(
    //  take(1),
    //  exhaustMap(
    //    user =>
    //    {
    //      if (!user) { return next.handle(req); }
    //      const modifiedReq = req.clone({
    //        headers: req.headers.append('Authorization', 'Bearer ' + user.token)
    //      })
    //      return next.handle(modifiedReq);
    //    }
    //  ) 
    //);
    }

}
