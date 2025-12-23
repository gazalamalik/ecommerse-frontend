import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategoryDto, ProductDto, ProductFiltersDto } from '../../../models/productDto.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CartService } from '../../../shared/cart-service/cart-service';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from '../sidebar-component/sidebar.component';
import { HomeService } from '../../../services/home-service';
import { AuthService } from '../../../services/auth-service';
import { WishlistService } from '../../../services/wishlist-service';



@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
     CommonModule,
     FormsModule,
     HttpClientModule,
     SidebarComponent,
     RouterModule
    ], 
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList {
  categoryName: string ='';
  category: string = '';
  wishlist: number[] = [];
  allProducts: ProductDto[] = [];

  // Selected filters
  selectedCategories: string[] = [];
  selectedBrands: string[] = [];
  selectedColors: string[] = [];
  selectedDiscounts: number[] = [];
  priceRange: { min: number; max: number } = { min: 500, max: 5000 }; 
  categories: string[] = [];
  brands: string[] = [];
  colors: string[] = []; // This is the missing one
  discounts: number[] = [];
  defaultCategory: string = '';

  filterCriteria = {
    selectedCategories: [],
    selectedBrands: [],
    selectedColors: [],
    selectedDiscounts: [],
    maxPrice: 5000
  };



  //pagination
  currentPage: number = 1;
  productsPerPage: number = 45;
  categoryId!: number;
  filteredProducts: ProductDto[] = [];

  constructor(private route: ActivatedRoute, 
    private cartService: CartService, 
    private http: HttpClient, 
    private homeService: HomeService, 
    private authService: AuthService, 
    private wishlistService: WishlistService,
    private router: Router) {}

  ngOnInit() {
    
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('categoryId'));
      const categoryName = this.route.snapshot.queryParamMap.get('name');
     
      if (!isNaN(id)) {
        this.categoryId = id;
        this.categoryName = categoryName  || '';
        //set current Category Name 
        this.setCategoryName(categoryName || '');
        //Load product data 
        this.loadProducts(id);

        //LoadFilterOptions
        this.loadFilterOptions(id);
      }
    });

  }

  setCategoryName(name: string) {
    this.categoryName = name;
  }
  //load product data 
  private loadProducts(categoryId: number): void {
    this.homeService.getProductData(categoryId).subscribe({
      next: (response: ProductDto[]) => {
        this.filteredProducts = response;
      },
      error: (err) => {
        console.error('Product fetch failed', err);
        this.filteredProducts = []; // Clear stale data on error
      }
    });
  }
//load product Filters data 
  private loadFilterOptions(categoryId: number): void {
    this.homeService.getFilterOptions(categoryId).subscribe({
        next: (filters : ProductFiltersDto) => {
        this.categories = filters.categories;
        this.brands = filters.brands;
        this.colors = filters.colors;
        this.discounts = filters.discounts;
        this.priceRange = filters.priceRange;
        },
        error: (err) => console.error('Filter fetch failed', err)
      });
  }

//get product quantity 
  getProductQuantity(product: ProductCategoryDto): number {
    return this.cartService.getQuantity(product.id);
  }


  getQuantity(productId: number): number {
    return this.cartService.getQuantity(productId);
  }



  handleWishlist(product: ProductDto) {
  if (!this.authService.getCurrentUser()) {
    this.router.navigate(['/auth']);
    return;
  }

  this.wishlistService.toggleWishlist(product);
}

  goToSummary(product: ProductDto) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/product-summary'], {
        queryParams: { data: JSON.stringify(product) }
      })
    );
    window.open(url, '_blank');
  }


  isInWishlist(productId: number): boolean {
    return this.wishlistService.getWishlist().some(p => p.id === productId);
  }

  //sidebar filter section functions
  applyFilters() {
  // this.homeService.getFilteredProducts(this.categoryId, this.filterCriteria).subscribe({
  //   next: (products) => this.filteredProducts = products,
  //   error: (err) => console.error('Filtered fetch failed', err)
  // });
  }


  // Category
 categoryChange(cat: string) {
 // this.toggleInArray(this.filterCriteria.selectedCategories, cat);
  this.applyFilters();
}


  // Brand
  brandChange(brand: string): void {
    const index = this.selectedBrands.indexOf(brand);
    if (index > -1) {
      this.selectedBrands.splice(index, 1);
    } else {
      this.selectedBrands.push(brand);
    }
    this.applyFilters();
  }

  // Color
  colorChange(color: string): void {
    const index = this.selectedColors.indexOf(color);
    if (index > -1) {
      this.selectedColors.splice(index, 1);
    } else {
      this.selectedColors.push(color);
    }
    this.applyFilters();
  }

  // Discount
  discountChange(discount: number): void {
    const index = this.selectedDiscounts.indexOf(discount);
    if (index > -1) {
      this.selectedDiscounts.splice(index, 1);
    } else {
      this.selectedDiscounts.push(discount);
    }
    this.applyFilters();
  }
  // Price
  priceChange(price: number): void {
    // this.priceRange = price;
    // this.applyFilters();
  }

   //product count with formated category name to display the count of the products 
  get formattedCategory(): string {
    if (!this.category) return '';
    return this.category.charAt(0).toUpperCase() + this.category.slice(1).toLowerCase();
  }
  //pagination code -----------------------------------------
  get paginatedProducts() {
    const start = (this.currentPage - 1) * this.productsPerPage;
    return this.filteredProducts.slice(start, start + this.productsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }
  get totalPages(): number[] {
    const pages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    return Array.from({ length: pages }, (_, i) => i + 1);
  }

}

