import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-hamburger-menu',
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.css']
})
export class HamburgerMenuComponent  {

  isOpen = false;
  @Output() logOut = new EventEmitter<void>();

  toggleMenu(event:any)
  {
    this.isOpen = !this.isOpen;
  }

  onLogOut()
  {
    this.logOut.emit();
  }
}
