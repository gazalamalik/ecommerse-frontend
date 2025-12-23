import { Injectable } from '@angular/core';
import { ProductDto } from '../models/productDto.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  
private wishlist: ProductDto[] = [];
private storageKey = 'wishlist';


toggleWishlist(product: ProductDto) {
  const index = this.wishlist.findIndex(p => p.id === product.id);
  if (index > -1) {
    this.wishlist.splice(index, 1);
  } else {
    this.wishlist.push(product);
  }
}


// getWishlist(): ProductDto[] {
//   return this.wishlist;
// }
getWishlist(): ProductDto[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  saveWishlist(wishlist: ProductDto[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(wishlist));
  }

  addToWishlist(product: ProductDto): void {
    const wishlist = this.getWishlist();
    const exists = wishlist.find(p => p.id === product.id);
    if (!exists) {
      wishlist.push(product);
      this.saveWishlist(wishlist);
    }
  }

  removeFromWishlist(productId: number): void {
    const wishlist = this.getWishlist().filter(p => p.id !== productId);
    this.saveWishlist(wishlist);
  }

  isInWishlist(productId: number): boolean {
    return this.getWishlist().some(p => p.id === productId);
  }
}
