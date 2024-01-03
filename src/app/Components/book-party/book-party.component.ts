import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule} from '@angular/forms';


@Component({
  selector: 'app-book-party',
  standalone: true,
  templateUrl: './book-party.component.html',
  styleUrls: ['./book-party.component.css'],
  imports: [ReactiveFormsModule]
})
export class BookPartyComponent {
  BookPartyComponent= new FormControl('');
}
