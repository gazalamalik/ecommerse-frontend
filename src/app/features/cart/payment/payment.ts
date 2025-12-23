import { Component } from '@angular/core';

@Component({
  selector: 'app-payment',
  imports: [],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class PaymentComponent {
  selectedMethod: string = 'cod';

  selectMethod(method: string): void {
    this.selectedMethod = method;
  }

  placeOrder(): void {
    if (this.selectedMethod) {
      alert(`Order placed using ${this.selectedMethod.toUpperCase()}!`);
      // Navigate or trigger order logic here
    } else {
      alert('Please select a payment method.');
    }
  }
}