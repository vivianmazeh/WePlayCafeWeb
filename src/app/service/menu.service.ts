import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


interface MenuItem {
  name: string;
  price: number;
  description: string;
  category: string;
  unit: string;
  quantity: number;
}
@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private static readonly MENU_ITEMS: MenuItem[] = [
    {
      name: "Anti-slip Socks",
      price: 2.99,
      description: "",
      category: "Other",
      unit: "Pair 1.00",
      quantity: 0
    },
    {
      name: "Birthday Chicken Tenders Tray (20 Pieces)",
      price: 54.99,
      description: "Halal food",
      category: "Food Menu",
      unit: "Per Tray 1.00",
      quantity: 0
    },
    {
      name: "Birthday Chicken Nuggets Tray (50 Pieces)",
      price: 49.99,
      description: "Halal food",
      category: "Food Menu",
      unit: "Per Tray 1.00",
      quantity: 0
    },
    {
      name: "Birthday Breadsticks Tray (36 Pieces)",
      price: 34.99,
      description: "Halal food",
      category: "Food Menu",
      unit: "Per Tray 1.00",
      quantity: 0
    },
    {
      name: "Birthday French Fries Tray",
      price: 34.99,
      description: "Halal food",
      category: "Food Menu",
      unit: "Per Tray 1.00",
      quantity: 0
    },
    {
      name: "Birthday House Salad Tray",
      price: 39.99,
      description: "Halal food",
      category: "Food Menu",
      unit: "Per Tray 1.00",
      quantity: 0
    },
    {
      name: "Boneless Wings  (6 Pieces)",
      price: 12.99,
      description: "Halal food",
      category: "Food Menu",
      unit: "Box 1.00",
      quantity: 0
    },
    {
      name: "Bowl of Chips",
      price: 4.99,
      description: "",
      category: "Food Menu",
      unit: "Box 1.00",
      quantity: 0
    },
    {
      name: "Breadsticks (12 pc)",
      price: 9.99,
      description: "",
      category: "Food Menu",
      unit: "Box 1.00",
      quantity: 0
    },
    {
      name: "Chicken Nuggets (12 Pieces)",
      price: 12.99,
      description: "",
      category: "Food Menu",
      unit: "Box 1.00",
      quantity: 0
    },
    {
      name: "Chicken Nuggets (6 Pieces)",
      price: 6.99,
      description: "",
      category: "Food Menu",
      unit: "Box 1.00",
      quantity: 0
    },
    {
      name: "Chicken Tenders (4 Pieces)",
      price: 11.99,
      description: "Halal food",
      category: "Food Menu",
      unit: "Box 1.00",
      quantity: 0
    },
    {
      name: "French Fries",
      price: 4.99,
      description: "",
      category: "Food Menu",
      unit: "Box 1.00",
      quantity: 0
    },
    {
      name: "Hot Americano",
      price: 2.59,
      description: "",
      category: "Beverage",
      unit: "Cup 1.00",
      quantity: 0
    },
    {
      name: "Hot Caramel Latte",
      price: 5.59,
      description: "Double shot of Espresso; Made with whole milk; 1.5 Pumps of Caramel;1 Pump of Vanilla",
      category: "Beverage",
      unit: "Cup 1.00",
      quantity: 0
    },
    {
      name: "Hot Latte",
      price: 3.99,
      description: "Fresh brewed coffee made from grinded whole beans; Double Shot of Espresso",
      category: "Beverage",
      unit: "Cup 1.00",
      quantity: 0
    },
    {
      name: "Hot Vanilla Latte",
      price: 5.59,
      description: "Double shot of Espresso; Made with whole milk; 2 Pumps of Vanilla",
      category: "Beverage",
      unit: "Cup 1.00",
      quantity: 0
    },
    {
      name: "House Salad",
      price: 10.99,
      description: "",
      category: "Food Menu",
      unit: "Box 1.00",
      quantity: 0
    },
    {
      name: "Iced Caramel Latte",
      price: 5.59,
      description: "Double shot of Espresso; Made with whole milk; 1.5 Pumps of Caramel;1 Pump of Vanilla",
      category: "Beverage",
      unit: "Cup 1.00",
      quantity: 0
    },
    {
      name: "Iced Latte",
      price: 3.99,
      description: "Double shot of Espresso; Made with whole milk",
      category: "Beverage",
      unit: "Cup 1.00",
      quantity: 0
    },
    {
      name: "Iced Vanilla Latte",
      price: 5.59,
      description: "Double shot of Espresso; Made with whole milk; 2 Pumps of Vanilla",
      category: "Beverage",
      unit: "Cup 1.00",
      quantity: 0
    },
    {
      name: "Large One Topping Pizza",
      price: 15.99,
      description: "",
      category: "Food Menu",
      unit: "piece",
      quantity: 0
    },
    {
      name: "Mango Smoothies",
      price: 6.99,
      description: "",
      category: "Beverage",
      unit: "Cup 1.00",
      quantity: 0
    },
    {
      name: "One Topping Pizza",
      price: 10.99,
      description: "",
      category: "Food Menu",
      unit: "piece",
      quantity: 0
    },
    {
      name: "Strawberries Smoothies",
      price: 6.99,
      description: "",
      category: "Beverage",
      unit: "Cup 1.00",
      quantity: 0
    }
  ];

  getMenuItems(): Observable<MenuItem[]> {
    // Return the static menu items as an Observable
    return of(MenuService.MENU_ITEMS.map(item => ({...item})));
  }
}
