import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private storageKey = 'cartItems';
  private cartItems = new BehaviorSubject<any[]>(this.loadCartFromStorage());
  cartItems$ = this.cartItems.asObservable();

  // Wishlist
  private wishlistSubject = new BehaviorSubject<number[]>([]);
  wishlist$ = this.wishlistSubject.asObservable();

  // Load cart from localStorage
  private loadCartFromStorage(): any[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  // Save cart to localStorage
  private saveCartToStorage(items: any[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  addToCart(product: any): void {
    const current = [...this.cartItems.value];
    const index = current.findIndex(p => p.id === product.id);

    if (index > -1) {
      const existing = current[index];
      const incomingQty = product.quantity || 1;
      existing.quantity = (existing.quantity || 1) + incomingQty;
    } else {
      current.push({ ...product, quantity: product.quantity || 1 });
    }

    this.cartItems.next(current);
    this.saveCartToStorage(current); // persist
  }

  removeFromCart(product: any): void {
    const current = [...this.cartItems.value];
    const index = current.findIndex(p => p.id === product.id);

    if (index > -1) {
      current[index].quantity -= 1;
      if (current[index].quantity <= 0) {
        current.splice(index, 1);
      }
    }

    this.cartItems.next(current);
    this.saveCartToStorage(current); // persist
  }

  getQuantity(productId: number): number {
    const item = this.cartItems.value.find(p => p.id === productId);
    return item ? item.quantity : 0;
  }

  getCartCount(): number {
    return this.cartItems.value.reduce((total, item) => total + item.quantity, 0);
  }

  updateWishlist(wishlist: number[]): void {
    this.wishlistSubject.next([...wishlist]);
  }
}