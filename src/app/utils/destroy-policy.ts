import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn:'root'})
export abstract class DestroyPolicy implements OnDestroy
{

    destroy$ =  new Subject<void>();

    ngOnDestroy(): void
    {
      this.destroy$.next();
      this.destroy$.unsubscribe();
    }
}
