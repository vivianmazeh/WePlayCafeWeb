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
      monthly_two: 80,
      monthly_family: 100,
      three_month_one: 160,
      three_month_two: 210,
      three_month_family: 270,
      group_10: 130,
      group_15: 180,
      group_20: 220,
      group_more_20: 9.99
    };  
  }
}
