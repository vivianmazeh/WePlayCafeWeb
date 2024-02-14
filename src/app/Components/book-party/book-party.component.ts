

import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { FormControl, ReactiveFormsModule} from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';


declare var bootstrap: any;
enum CheckBoxType {GOLD_PACKAGE, SILVER_PACKAGE, BRONZE_PACKAGE , NONE};
@Component({
  selector: 'app-book-party',
  standalone: true,
  templateUrl: './book-party.component.html',
  styleUrls: ['./book-party.component.css'],
  imports: [ReactiveFormsModule, NgbPopoverModule, CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
})
export class BookPartyComponent implements OnInit, AfterViewInit {
  BookPartyComponent= new FormControl('');
  check_box_type = CheckBoxType;
  currentlyChecked: CheckBoxType = 0;

   
  constructor(private elementRef: ElementRef, private renderer: Renderer2, private router: Router) { 
  }                
    ngOnInit() { }



    ngAfterViewInit() {
      // Initialize Bootstrap popover
      const popoverTriggerList = [].slice.call(this.elementRef.nativeElement.querySelectorAll('[data-bs-toggle="popover"]'));
      const popoverList = popoverTriggerList.map(function (popoverTriggerEl: any) {
        return new bootstrap.Popover(popoverTriggerEl);
      });
    }
    selectedCheckbox(targetType: CheckBoxType) {

     // this.router.navigate(['/book-a-party/select-date']);

      // If the checkbox was already checked, clear the currentlyChecked variable
      if(this.currentlyChecked === targetType) {
        this.currentlyChecked = CheckBoxType.NONE;
        return;
      }
  
      this.currentlyChecked = targetType;
    }
    selectedSerice(){

    }
    closeNavbar() {
    
      const navbarCollapse = document.querySelector('.navbar-collapse');
      this.renderer.setStyle(navbarCollapse, 'display', 'none');
    }  
}


