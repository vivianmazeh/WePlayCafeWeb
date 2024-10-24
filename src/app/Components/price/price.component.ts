import { Component } from '@angular/core';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css']
})
export class PriceComponent {

  price: any;

  constructor(){
    this.price = {
      daily: 15.99,
      cash_daily: 15,
      monthly_one: 60,
      monthly_two: 115,
      monthly_three: 165,
      monthly_four: 195,
      group_10: 13,
      group_15: 11,
    
    };  
  }
}
