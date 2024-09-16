import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buy-tickets',
  templateUrl: './buy-tickets.component.html',
  styleUrls: ['./buy-tickets.component.css']
})
export class BuyTicketsComponent {
  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    // Buy buttons event listeners
    const buyButtons = [
      { id: 'buy-adult-pass', service: 'Adult Pass' },
      { id: 'buy-three-hours-pass', service: 'Three Hours Pass' },
      { id: 'buy-group-rate-10', service: 'Group Rate (Up to 10 People)' },
      { id: 'buy-group-rate-15', service: 'Group Rate (Up to 15 People)' },
      { id: 'buy-group-rate-more-15', service: 'Group Rate (More than 15 People)' },
    ];

    buyButtons.forEach(button => {
      const btn = document.getElementById(button.id);
      if (btn) {
        btn.addEventListener('click', () => {
          alert(`Redirecting to payment for ${button.service}`);
          // Implement redirection to the payment page
          this.router.navigate(['/card-payment']); // You can pass service details if needed
        });
      }
    });
  }
}
