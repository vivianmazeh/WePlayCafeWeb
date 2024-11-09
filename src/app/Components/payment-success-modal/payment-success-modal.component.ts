import { Component,Input, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-payment-success-modal',
  templateUrl: './payment-success-modal.component.html',
  styleUrl: './payment-success-modal.component.css'
})
export class PaymentSuccessModalComponent {
  @Input() isOpen: boolean = false;
  @Output() onClose = new EventEmitter<void>();

  close(): void {
    this.onClose.emit();
  }
}
