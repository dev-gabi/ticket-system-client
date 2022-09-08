import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { GeneralBase } from '../general-base';

@Component({
  selector: 'app-how-to-use',
  templateUrl: './how-to-use.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HowToUseComponent extends GeneralBase {

  constructor(protected authService: AuthService) { super(authService) }


}
