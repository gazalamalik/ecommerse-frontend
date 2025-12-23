import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartService } from '../shared/cart-service/cart-service';
import { HomeService } from '../services/home-service';
import { Router } from '@angular/router';
import { BannerDto } from '../models/CommonHome.model';
import { ProductCategoryDto, ProductDto } from '../models/productDto.model';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.html',
  imports: [CommonModule],
  providers: [HomeService],
  standalone: true,
  styleUrl: './home-component.css'
})
export class HomeComponent {
   
constructor(private cartService: CartService, private homeService: HomeService,private router: Router) {}

   // ...existing arrays...

 featuredProducts = [
  { id: 1, name: 'Product 1', img: 'images/featuredProduct/product1.jpg', description: 'Desc 1', price: 1000 },
  { id: 2, name: 'Product 2', img: 'images/featuredProduct/product2.jpg', description: 'Desc 2', price: 1200 },
  { id: 3, name: 'Product 3', img: 'images/featuredProduct/product3.jpg', description: 'Desc 3', price: 1300 },
  { id: 4, name: 'Product 4', img: 'images/featuredProduct/product4.jpg', description: 'Desc 4', price: 1400 },
  { id: 5, name: 'Product 5', img: 'images/featuredProduct/product5.jpg', description: 'Desc 5', price: 1500 },
  { id: 6, name: 'Product 6', img: 'images/featuredProduct/product6.jpg', description: 'Desc 6', price: 1600 },
  { id: 7, name: 'Product 7', img: 'images/featuredProduct/product7.jpg', description: 'Desc 7', price: 1700 },
  { id: 8, name: 'Product 8', img: 'images/featuredProduct/product8.jpg', description: 'Desc 8', price: 1800 }
 ];
    //categories search 
featuredProductGroups: any[][] = [];
banners: BannerDto[] = [];
categories: ProductCategoryDto[] = [];


ngOnInit() {
  this.featuredProductGroups = this.chunkArray(this.featuredProducts, 4);
  //get Banner Data 
   this.homeService.getBanners().subscribe({
    next: (data) => this.banners = data,
    error: (err) => console.error('Banner fetch failed', err)
  });
  //get category data 
  this.homeService.getCategories().subscribe({
    next: (data: ProductCategoryDto[]) => this.categories = data,
    error: (err) => console.error('Category fetch failed', err)
  });

}

  goToSummary(product: ProductDto) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/product-summary'], {
        queryParams: { data: JSON.stringify(product) }
      })
    );
    window.open(url, '_blank');
  }
chunkArray(arr: any[], size: number): any[][] {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

//cart on click add to cart 
 add(product: any) {
    this.cartService.addToCart(product);
  }

  remove(product: any) {
    this.cartService.removeFromCart(product);
  }


  getProductQuantity(product: any): number {
    return this.cartService.getQuantity(product.id);
  }
  navigateToProducts(categoryId: number) {
    this.router.navigate(['/products', categoryId]);
  }
}