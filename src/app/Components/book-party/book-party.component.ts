
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule} from '@angular/forms';

declare var bootstrap: any;
@Component({
  selector: 'app-book-party',
  standalone: true,
  templateUrl: './book-party.component.html',
  styleUrls: ['./book-party.component.css'],
  imports: [ReactiveFormsModule]
})
export class BookPartyComponent {
  BookPartyComponent= new FormControl('');


  vm: {
    goldPackage: {
      contentPoint1: string;
      contentPoint2: string;
      contentPoint3: string;
      contentPoint4: string;
      contentPoint5: string;
      contentPoint6: string;
      contentPoint7: string;
      title: string;
      placehold: string;
    };
    silverPackage: {
      contentPoint1: string;
      contentPoint2: string;
      contentPoint3: string;
      contentPoint4: string;
      contentPoint5: string;
      contentPoint6: string;
      contentPoint7: string;
      title: string;
      placehold: string;
    };
    bronzePackage: {
      contentPoint1: string;
      contentPoint2: string;
      contentPoint3: string;
      contentPoint4: string;
      contentPoint5: string;
      title: string;
      placehold: string;
    };
  } = {
    goldPackage: {
      contentPoint1: '',
      contentPoint2:'',
      contentPoint3: '',
      contentPoint4: '',
      contentPoint5: '',
      contentPoint6: '',
      contentPoint7: '',
      title: '',
      placehold: '',
    },
    silverPackage: {
      contentPoint1: '',
      contentPoint2:'',
      contentPoint3: '',
      contentPoint4: '',
      contentPoint5: '',
      contentPoint6: '',
      contentPoint7: '',
      title: '',
      placehold: '',
    },
    bronzePackage: {
      contentPoint1: '',
      contentPoint2:'',
      contentPoint3: '',
      contentPoint4: '',
      contentPoint5: '',
      title: '',
      placehold: '',
    },
  };
   
    constructor(){

  


      this.vm.goldPackage = {
        contentPoint1: 'Rental is up to 2 hours, and $100 per additional hour.',
        contentPoint2: 'Includes up to 20 children, and $20 per additional child.',
        contentPoint3: 'Includes FREE Photo Booth for printing. ',
        contentPoint4: 'Includes a Projector, and you can play your own music ',
        contentPoint5: 'The maximum capicity for the room is 50 people. ',
        contentPoint6: 'You may bring your own food and decorations ',
        contentPoint7: '50% Deposit is required. ',
        title: 'More Info',
        placehold: 'Gold Package'
      }

      this.vm.silverPackage = {
        contentPoint1: 'Rental is up to 2 hours, and $100 per additional hour.',
        contentPoint2: 'Includes up to 15 children, and $20 per additional child.',      
        contentPoint3: 'Includes a Projector, and you can play your own music ',
        contentPoint4: 'The maximum capicity for the room is 50 people. ',
        contentPoint5: 'You may bring your own food and decorations ',
        contentPoint6: 'Photo Booth rental for $100',
        contentPoint7: '50% Deposit is required. ',
        title: 'More Info',
        placehold: 'Silver Package'
      }

      this.vm.bronzePackage = {
        contentPoint1: 'Rental is up to 2 hours, and $100 per additional hour.',
        contentPoint2: 'Includes up to 15 children, and $20 per additional child.',      
        contentPoint3: 'Includes a Projector, and you can play your own music ',
        contentPoint4: 'The maximum capicity for the room is 50 people. ',
        contentPoint5: '50% Deposit is required. ',
        title: 'More Info',
        placehold: 'Bronze package'
      }
    }

 

}
