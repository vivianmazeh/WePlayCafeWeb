import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router'; // Import Router from '@angular/router'


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],

})
export class HeaderComponent {
  
  constructor(private renderer: Renderer2, private el: ElementRef, private router: Router) {}

   clickNavbarButton() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    this.renderer.setStyle(navbarCollapse, 'display', 'block'); // Always show on click
    } 

  closeNavbar() {
    
    const navbarCollapse = document.querySelector('.navbar-collapse');
    this.renderer.setStyle(navbarCollapse, 'display', 'none');
  }  

}
