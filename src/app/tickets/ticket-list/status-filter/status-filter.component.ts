import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { DetectIsMobile } from 'src/app/shared/interface/detectIsMobile.interface';
import { Helpers } from 'src/app/utils/helpers';



@Component({
  selector: 'app-status-filter',
  templateUrl: './status-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusFilterComponent implements DetectIsMobile
{
  isMobile:boolean;

  ngOnInit(): void {
    this.detectWindowWidth();
  }

  @HostListener('window:resize', ['$event'])
    onResize() {
      this.detectWindowWidth();
    }

  detectWindowWidth(){
    this.isMobile = Helpers.detectWindowWidth();
  }
}
