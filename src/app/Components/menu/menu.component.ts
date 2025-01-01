import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('paymentContainer') paymentContainer: ElementRef | undefined;
  constructor(private menuService: MenuService,
              private paymentStateService: PaymentStateService,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMenuItems();
    // Subscribe to payment state changes
    this.paymentStateService.state$.subscribe(state => {
      // Only update other state properties, not form visibility
      this.total = state.totalPrice;
      console.log('is Mobile view: ' + this.isMobileView());
      if (this.isMobileView()) {
        // On mobile, only show form when explicitly navigating
        this.showPaymentForm = state.showForm && this.isCartPageVisible;
      } else {
        // On desktop, follow the state directly
        this.showPaymentForm = state.showForm;
      }
    });
   
  }
  isMobileView(): boolean {
    return window.innerWidth < 640; // Match the CSS breakpoint
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
    // Update payment state
    this.paymentStateService.updatePaymentState(
      this.total,
      this.cart.map(item => ({
        price: item.price,
        quantityOfOrder: item.quantity,
        sectionName: item.name,
        isMembership: false,
        numberOfChildrenAllowed: 0
      }))
    );
    
        // Subscribe to state changes to ensure form visibility is updated
        this.paymentStateService.state$.subscribe(state => {
          this.showPaymentForm = state.showForm;
        });
    // Show payment form and hide cart
    this.showPaymentForm = true;
    this.isCartPageVisible = false;

    
    // For mobile view, add show-payment class to payment form container
    const paymentContainer = document.querySelector('.payment-form-container');
    if (paymentContainer) {
      paymentContainer.classList.add('show-payment');
    }

    // Hide mobile cart section
    const mobileCartSection = document.querySelector('.mobile-cart-section');
    if (mobileCartSection) {
      mobileCartSection.classList.remove('show-cart');
    }
        // Ensure we're preventing any default navigation
        setTimeout(() => {
          if (!this.showPaymentForm) {
            this.paymentStateService.updatePaymentState(this.total, this.cart.map(item => ({
              price: item.price,
              quantityOfOrder: item.quantity,
              sectionName: item.name,
              isMembership: false,
              numberOfChildrenAllowed: 0
            })));
          }
        }, 0);       
}

hidePaymentForm() {
    this.showPaymentForm = false;
    const paymentContainer = document.querySelector('.payment-form-container');
    if (paymentContainer) {
      paymentContainer.classList.remove('show-payment');
    }

    // Show cart page
    this.isCartPageVisible = true;
    const mobileCartSection = document.querySelector('.mobile-cart-section');
    if (mobileCartSection) {
      mobileCartSection.classList.add('show-cart');
    }

    // Keep the payment state but update form visibility
    const currentState = this.paymentStateService.getCurrentState();
    this.paymentStateService.updatePaymentState(
      currentState.totalPrice,
      currentState.orderInfo
    );
  }
  showCartPage() {
    this.showPaymentForm = false;
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
    const orderInfo = this.menuItems
    .filter(item => item.quantity > 0)
    .map(item => ({
      price: item.price,
      quantityOfOrder: item.quantity,
      sectionName: item.name,
      isMembership: false,
      numberOfChildrenAllowed: 0
    }));
    const currentState = this.paymentStateService.getCurrentState();
    if (window.innerWidth < 640) { // Mobile view
      // On mobile, preserve current showForm state
      this.paymentStateService.state.next({
        ...currentState,
        totalPrice: this.total,
        orderInfo: orderInfo,
        showForm: false 
      });
    } else { // Desktop view
      // On desktop, show form if cart has items
      this.paymentStateService.updatePaymentState(this.total, orderInfo);
    }
  }

  private calculateTotal(): void {
    this.total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getTotalItems(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
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