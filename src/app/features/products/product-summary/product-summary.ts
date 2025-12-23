import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WishlistService } from '../../../services/wishlist-service';
import { AuthService } from '../../../services/auth-service';
import { CartService } from '../../../shared/cart-service/cart-service';
import { CommonModule } from '@angular/common';
import { ProductDto } from '../../../models/productDto.model';

@Component({
  selector: 'app-product-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-summary.html',
  styleUrl: './product-summary.css'
})


export class ProductSummary implements OnInit {
  product: ProductDto | null = null;
  selectedImage: string = '';
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private authService: AuthService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const raw = params['data'];
      this.product = raw ? JSON.parse(raw) : null;
      
      if (this.product) {
        // Set the first image as selected
        this.selectedImage = Array.isArray(this.product.imageUrl) 
          ? this.product.imageUrl[0] 
          : this.product.imageUrl;
      }
    });
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(product: ProductDto) {
    const cartItem = {
      ...product,
      quantity: this.quantity
    };
    
    this.cartService.addToCart(cartItem);
    alert('Product added to cart!');
  }

  addToBag(product: ProductDto) {
    this.addToCart(product);
  }

  handleWishlist(product: ProductDto) {
    if (!this.authService.getCurrentUser()) {
      this.router.navigate(['/auth']);
      return;
    }
    this.wishlistService.toggleWishlist(product);
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.getWishlist().some(p => p.id === productId);
  }

  getImages(): string[] {
    if (!this.product) return [];
    return Array.isArray(this.product.imgeUrls) 
      ? this.product.imgeUrls
      : [this.product.imgeUrls];
  }

  calculateDiscount(): number {
    if (!this.product || !this.product.originalPrice) return 0;
    return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
  }
}