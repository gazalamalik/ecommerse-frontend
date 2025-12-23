import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-address',
  imports: [],
  standalone: true,
  templateUrl: './address.html',
  styleUrl: './address.css'
})
export class Address {
  @Output() continue = new EventEmitter<void>();

  selectedAddressId: number | null = null;

  addresses = [
    {
      id: 1,
      name: 'Gazala Malik',
      label: 'HOME',
      address: 'C2101, host grid cghs, Sector 14 near Huda market, Gurgaon, Haryana - 122001',
      mobile: '8755745898',
      payOnDelivery: false
    }
    // You can add more addresses here
  ];

 selectAddress(id: number): void {
  this.selectedAddressId = id;
 }

  onContinue(): void {
    if (this.selectedAddressId !== null) {
      this.continue.emit();
    } else {
      alert('Please select an address before continuing.');
    }
  }

  

  openAddAddressForm(): void {
    // You can open a modal or navigate to an address form page
    alert('Add Address form coming soon!');
  }

}

