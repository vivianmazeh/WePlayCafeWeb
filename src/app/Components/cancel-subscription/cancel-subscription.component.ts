import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentStateService } from 'src/app/service/payment-state.service';
import { SubscriptionService } from 'src/app/service/subscription.service';
@Component({
  selector: 'app-cancel-subscription',
  templateUrl: './cancel-subscription.component.html',
  styleUrl: './cancel-subscription.component.css'
})
export class CancelSubscriptionComponent implements OnInit{
  subscriptionId: string = '';
  loading: boolean = false;
  error: string = '';
  showConfirmDialog: boolean = false;
  cancelSuccess: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private subscriptionService: SubscriptionService,    
  ) {}

  ngOnInit() {
    this.subscriptionId = this.route.snapshot.paramMap.get('subscriptionId') || '';
    if (!this.subscriptionId) {
      this.error = 'Invalid subscription ID';
    }
  }

  showConfirmation() {
    this.showConfirmDialog = true;
  }

  cancelSubscription() {
    this.loading = true;
    this.error = '';

    this.subscriptionService.confirmCancellation(this.subscriptionId)
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.cancelSuccess = true;
          this.showConfirmDialog = false;
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error.message || 'An error occurred while canceling the subscription';
          this.showConfirmDialog = false;
        }
      });
  }

  closeConfirmDialog() {
    this.showConfirmDialog = false;
  }
}
