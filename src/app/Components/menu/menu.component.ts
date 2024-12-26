import { Component, HostListener, OnInit } from '@angular/core';
import { MenuService } from '../../service/menu.service';
import { PaymentStateService } from 'src/app/service/payment-state.service';
import { Router } from '@angular/router';

interface MenuItem {
  name: string;
  price: number;
  description: string;
  category: string;
  unit: string;
  quantity: number;
}
interface Order {
  price: number;
  quantityOfOrder: number;
  sectionName: string;
  isMembership: boolean;
  numberOfChildrenAllowed: number;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit  {
  menuItems: MenuItem[] = [];
  categories: string[] = [];
  activeCategory: string = 'all';
  cart: MenuItem[] = [];
  total: number = 0;
  showPaymentForm = false;
  showSuccessModal = false;
  isCartPageVisible = false;

  constructor(private menuService: MenuService,
              private paymentStateService: PaymentStateService,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMenuItems();
    // Subscribe to payment state changes
    this.paymentStateService.state$.subscribe(state => {
      this.showPaymentForm = state.showForm;
    });
   
  }

  private loadMenuItems(): void {
    this.menuService.getMenuItems().subscribe({
      next: (items) => {
        this.menuItems = items;
        this.updateCategories();
      },
      error: (error) => {
        console.error('Error loading menu items:', error);
      }
    });
  }
  proceedToPayment() {
    //this.paymentStateService. updatePaymentStateFromMenuItems(this.cart.map)
    this.showPaymentForm = true;
  }
  showCartPage() {
    this.isCartPageVisible = true;
  }
  hideCartPage() {
    // If payment form is showing, hide it first
    if (this.showPaymentForm) {
      this.showPaymentForm = false;
    }
    this.isCartPageVisible = false;
  }
  private updateCategories(): void {
    const uniqueCategories = Array.from(
      new Set(this.menuItems.map(item => item.category))
    ).filter(Boolean);
    this.categories = ['all', ...uniqueCategories];
  }

  get filteredItems(): MenuItem[] {
    return this.activeCategory === 'all'
      ? this.menuItems
      : this.menuItems.filter(item => item.category === this.activeCategory);
  }

  setActiveCategory(category: string): void {
    this.activeCategory = category;
  }

  updateQuantity(item: MenuItem, delta: number): void {
    const index = this.menuItems.findIndex(i => i.name === item.name);
    if (index !== -1) {
       // Create a new reference for the menuItem to ensure change detection
    this.menuItems[index] = {
      ...this.menuItems[index],
      quantity: Math.max(0, (this.menuItems[index].quantity || 0) + delta)
    };
    this.updateCart();
    console.log('Updated item:', this.menuItems[index]);
    }
  }

  private updateCart(): void {
    // Filter items with quantity > 0 and update cart
    this.cart = [...this.menuItems.filter(item => item.quantity > 0)];
    this.calculateTotal();
    this.paymentStateService.updatePaymentStateFromMenuItems(this.menuItems);
    // For debugging
  console.log('Cart updated:', this.cart);
  }

  private calculateTotal(): void {
    this.total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getTotalItems(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  checkout(): void {
    if (this.cart.length > 0) {
      this.paymentStateService.updatePaymentStateFromMenuItems(this.menuItems);
    }
  }

  // onPaymentComplete(paymentDetails: any): void {
  //   // Handle successful payment
  //   this.paymentStateService.setShowSuccessModal(true);
  //   this.resetCart();
  // }

  // onPaymentCancel(): void {
  //   this.paymentStateService.resetState();
  // }

  private resetCart(): void {
    this.cart = [];
    this.menuItems.forEach(item => item.quantity = 0);
    this.total = 0;
    this.paymentStateService.resetState();
  }

  handleModalClose() {

    this.paymentStateService.setShowSuccessModal(false);
    
    setTimeout(() => {
      this.router.navigate(['/home']).then(() => {
        console.log('Navigation complete');
      }).catch(err => {
        console.error('Navigation failed:', err);
      });
    }, 300);
  }
}
