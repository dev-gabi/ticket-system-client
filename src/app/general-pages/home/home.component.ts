import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [`
.back-img{
    background: url('src/assets/images/help.png') no-repeat;
    background-size:100% 100%;
    position:absolute;
    left:0;
    height:100%;
    z-index:-1;
  }
@media (max-width:576px){
   .white-transparent-back{background-color:rgba(255, 255, 255, 0.5);}
}
`]
})
export class HomeComponent  {


}
