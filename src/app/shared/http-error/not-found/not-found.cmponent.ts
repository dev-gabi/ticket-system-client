import { ChangeDetectionStrategy, Component} from '@angular/core';


@Component({
  selector: 'app-forbidden',
  template: '<h1 class="text-center m-5">Oops, Page Not Found</h1>',
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class NotFoundComponent 
{

}
