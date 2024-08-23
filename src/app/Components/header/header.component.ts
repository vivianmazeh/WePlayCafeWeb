
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router'; // Import Router from '@angular/router'
import { environment } from 'src/app/environments/env';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],

})
export class HeaderComponent {
  hideNavbar: boolean = false;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.hideNavbar = environment.production; // Hide the navbar if in production
  }
   clickNavbarButton() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    this.renderer.setStyle(navbarCollapse, 'display', 'block'); // Always show on click
    } 

  closeNavbar() {
    
    const navbarCollapse = document.querySelector('.navbar-collapse');
    this.renderer.setStyle(navbarCollapse, 'display', 'none');
  }  

}
