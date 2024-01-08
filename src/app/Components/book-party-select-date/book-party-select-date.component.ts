import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-book-party-select-date',
  standalone: true,
  imports: [],
  templateUrl: './book-party-select-date.component.html',
  styleUrl: './book-party-select-date.component.css'
})
export class BookPartySelectDateComponent {
  BookPartyComponent= new FormControl('');
}
