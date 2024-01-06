
import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { FormControl, ReactiveFormsModule} from '@angular/forms';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import * as $ from 'jquery';

declare var bootstrap: any;
enum CheckBoxType {GOLD_PACKAGE, SILVER_PACKAGE, BRONZE_PACKAGE , NONE};
@Component({
  selector: 'app-book-party',
  standalone: true,
  templateUrl: './book-party.component.html',
  styleUrls: ['./book-party.component.css'],
  imports: [ReactiveFormsModule, NgbPopoverModule],
})
export class BookPartyComponent implements OnInit, AfterViewInit {
  BookPartyComponent= new FormControl('');
  check_box_type = CheckBoxType;
  currentlyChecked: CheckBoxType = 0;

  vm: {
    goldPackage: {
      content: string;
    
      title: string;
    
    };
    silverPackage: {
      content: string;
      title: string;
      
    };
    bronzePackage: {
      content: string;
      title: string;
     
    };
  } = {
    goldPackage: {
      content: '',
   
      title: '',
    
    },
    silverPackage: {
      content: '', 
      title: '',
      
    },
    bronzePackage: {
      content: '',
      title: '',
  
    },
  };
   
  constructor(private elementRef: ElementRef) { 

    let raw_content_gold_package: string[] = [ "Rental is up to 2 hours, and $100 per additional hour.",
                          "Includes up to 20 children, and $20 per additional child." ,
                          "Includes FREE Photo Booth for printing." ,
                          "Includes a Projector, and you can play your own music.",
                          "The maximum capicity for the room is 50 people." ,
                          "You may bring your own food and decorations." ,
                          "50% Deposit is required. "];

   let raw_content_silver_package: string[] = [ "Rental is up to 2 hours, and $100 per additional hour.",
                          "Includes up to 15 children, and $20 per additional child." ,
                          "Includes a Projector, and you can play your own music.",
                          "Photo Booth rental for $100",
                          "The maximum capicity for the room is 50 people." ,
                          "You may bring your own food and decorations." ,
                          "50% Deposit is required. "];
    let raw_content_bronze_package: string[] = [ "Rental is up to 2 hours, and $100 per additional hour.",
                          "Includes up to 15 children, and $20 per additional child." ,
                          "Includes a Projector, and you can play your own music.",
                          "Photo Booth rental for $100",
                          "The maximum capicity for the room is 50 people." ,
                          "You may bring your own food and decorations." ,
                          "50% Deposit is required. "];                      
                          
  
      this.vm.goldPackage = {
        content: this.gold_package_content(raw_content_gold_package),
        title: 'Gold Package'
    
      }

      this.vm.silverPackage = {
        content: this.gold_package_content(raw_content_silver_package),
        title: 'Silver Package'
       
      }

      this.vm.bronzePackage = {
        content: this.gold_package_content(raw_content_bronze_package),
        title: 'Bronze package'
     
      }
    }

    ngOnInit() { }

    ngAfterViewInit() {
      // Initialize Bootstrap popover
      const popoverTriggerList = [].slice.call(this.elementRef.nativeElement.querySelectorAll('[data-bs-toggle="popover"]'));
      const popoverList = popoverTriggerList.map(function (popoverTriggerEl: any) {
        return new bootstrap.Popover(popoverTriggerEl);
      });
    }


     gold_package_content( raw_content :string[]):string {
        var content = "";
  
        content = "<ul>";

        for(var i =0; i < raw_content.length; i ++ ){
          content +=  "<li>" + raw_content[i] + "</li>"
        }

        content += "</ul>";

      return content;
    }

    selectedCheckbox(targetType: CheckBoxType) {
      // If the checkbox was already checked, clear the currentlyChecked variable
      if(this.currentlyChecked === targetType) {
        this.currentlyChecked = CheckBoxType.NONE;
        return;
      }
  
      this.currentlyChecked = targetType;
    }
}


