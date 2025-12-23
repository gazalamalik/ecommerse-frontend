import { Component } from '@angular/core';
import { ProductDto } from '../../../models/productDto.model';
import { CartService } from '../../../shared/cart-service/cart-service';
import { WishlistService } from '../../../services/wishlist-service';
import { HomeService } from '../../../services/home-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Address } from '../address/address';
import { AuthService } from '../../../services/auth-service';
import { PaymentComponent } from '../payment/payment';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.html',
  imports: [CommonModule, FormsModule, Address, PaymentComponent],
  styleUrls: ['./cart-details.css']
})
export class CartDetails {
  cartItems: ProductDto[] = [];
  similarProducts: ProductDto[] = [];

  // Price calculations
  totalMRP: number = 0;
  discountOnMRP: number = 0;
  platformFee: number = 23;
  shippingCharges: number = 0;
  totalAmount: number = 0;

  // Coupon
  couponCode: string = '';
  couponDiscount: number = 0;
  isCouponApplied: boolean = false;

  // UI States
  showPinCodeInput: boolean = false;
  pinCode: string = '';
  estimatedDelivery: string = '';
   currentStep: 'bag' | 'address' | 'payment' = 'bag';
  isLoggedIn: boolean = false;


  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private homeService: HomeService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
  const queryParams = this.route.snapshot.queryParams;

  //Check login state from AuthService
  this.isLoggedIn = !!this.authService.getCurrentUser();

  this.authService.user$.subscribe(user => {
    this.isLoggedIn = !!user;
  });

  // If 'loggedin=true' is present, persist login and clean URL
  if (queryParams['loggedin'] === 'true') {
    this.isLoggedIn = true;
    localStorage.setItem('isLoggedIn', 'true');
    this.currentStep = 'bag';

    // Remove 'loggedin' from URL
    const { loggedin, ...cleanParams } = queryParams;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: cleanParams,
      replaceUrl: true
    });
  }

  // Load cart items and similar products
  this.cartService.cartItems$.subscribe(items => {
    this.cartItems = items;
    this.calculatePrices();

    if (items.length > 0) {
      const categoryId = items[0].categoryId;
      this.loadSimilarProducts(categoryId);
    }
  });
}
 proceedToPayment(): void {
  this.currentStep = 'payment';
  this.router.navigate(['checkout/cart/payment'], {
    queryParams: { currentStep: this.currentStep },
    queryParamsHandling: 'merge'
  });
}
  checkLoginStatus(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  loadSimilarProducts(categoryId: number): void {
    this.homeService.getProductData(categoryId).subscribe({
      next: (response: ProductDto[]) => {
        // ✅ Filter out items already in cart
        this.similarProducts = response.filter(p => !this.cartItems.some(ci => ci.id === p.id)).slice(0, 6);
      },
      error: (err) => {
        console.error('Product fetch failed', err);
        this.similarProducts = [];
      }
    });
  }

  calculatePrices(): void {
    this.totalMRP = this.cartItems.reduce((sum, item) => {
      const originalPrice = item.originalPrice || item.price;
      return sum + (originalPrice * item.quantity);
    }, 0);

    this.discountOnMRP = this.cartItems.reduce((sum, item) => {
      const originalPrice = item.originalPrice || item.price;
      const discount = (originalPrice - item.price) * item.quantity;
      return sum + discount;
    }, 0);

    const subtotal = this.totalMRP - this.discountOnMRP;
    this.shippingCharges = subtotal >= 1000 ? 0 : 50;

    this.totalAmount = subtotal - this.couponDiscount + this.platformFee + this.shippingCharges;
  }

  updateQuantity(item: ProductDto, change: number): void {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      this.cartService.addToCart({ ...item, quantity: newQuantity - item.quantity });
    } else {
      this.removeItem(item);
    }
  }

  removeItem(item: ProductDto): void {
    if (confirm('Are you sure you want to remove this item from cart?')) {
      this.cartService.removeFromCart(item);
    }
  }

  moveToWishlist(item: ProductDto): void {
    this.wishlistService.addToWishlist(item);
    this.cartService.removeFromCart(item);
    alert('Item moved to wishlist!');
  }

  applyCoupon(): void {
    if (!this.couponCode.trim()) {
      alert('Please enter a coupon code');
      return;
    }

    if (this.couponCode === 'SAVE10') {
      this.couponDiscount = Math.floor((this.totalMRP - this.discountOnMRP) * 0.1);
      this.isCouponApplied = true;
      this.calculatePrices();
      alert('Coupon applied successfully!');
    } else {
      alert('Invalid coupon code');
    }
  }

  removeCoupon(): void {
    this.couponCode = '';
    this.couponDiscount = 0;
    this.isCouponApplied = false;
    this.calculatePrices();
  }

  checkPinCode(): void {
    if (this.pinCode.length === 6) {
      this.estimatedDelivery = '3-5 days';
      alert(`Delivery available! Estimated delivery: ${this.estimatedDelivery}`);
    } else {
      alert('Please enter a valid 6-digit PIN code');
    }
  }


  placeOrder(): void {
  if (this.cartItems.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  if (!this.isLoggedIn) {
    alert('Please log in to continue');
    this.router.navigate(['/auth'], {
      queryParams: { returnUrl: '/checkout/cart' }
    });
    return;
  }

  this.currentStep = 'address';
  this.router.navigate(['checkout/cart/address'], {
    queryParams: { currentStep: this.currentStep },
    queryParamsHandling: 'merge'
  });
}
  continueShopping(): void {
    this.router.navigate(['/products', 5]);
  }

  viewProductDetails(product: ProductDto): void {
    this.router.navigate(['/product', product.id]);
  }

  addSimilarToCart(product: ProductDto): void {
    this.cartService.addToCart({ ...product, quantity: 1 });
    alert('Product added to cart!');
  }

  getSavingsPercentage(): number {
    if (this.totalMRP === 0) return 0;
    return Math.round(((this.discountOnMRP + this.couponDiscount) / this.totalMRP) * 100);
  }
}