import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CartService } from '../cart-service/cart-service';
import { AuthService, User } from '../../services/auth-service';
import { HomeService } from '../../services/home-service';
import { ProductCategoryDto } from '../../models/productDto.model';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  // Existing cart and wishlist properties
  cartCount = 0;
  wishlistCount = 0;

  // Profile dropdown properties
  isProfileDropdownVisible = false;
  isHoveringOverDropdown = false;
  currentUser: User | null = null;
  isLoggedIn = false;
  categories: ProductCategoryDto[] = [];
  categoryId!: number;

  // Profile menu items
  profileMenuItems = [
    { label: 'Orders', icon: 'fa-box', route: '/orders' },
    { label: 'Wishlist', icon: 'fa-heart', route: '/wishlist' },
    { label: 'Gift Cards', icon: 'fa-gift', route: '/gift-cards' },
    { label: 'Contact Us', icon: 'fa-phone', route: '/contact' }
  ];

  accountMenuItems = [
    { label: 'Coupons', icon: 'fa-ticket', route: '/coupons' },
    { label: 'Saved Cards', icon: 'fa-credit-card-alt', route: '/saved-cards' },
    { label: 'Saved Addresses', icon: 'fa-map-marker', route: '/addresses' }
  ];

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService,
    private homeService: HomeService

    ) {
    // Existing cart subscription
    this.cartService.cartItems$.subscribe(items => {
      this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  ngOnInit() {
      // Existing wishlist subscription
      this.cartService.wishlist$.subscribe(ids => {
        this.wishlistCount = ids.length;
      });
     // get current user data 
      const user = this.authService.getCurrentUser(); // Immediate sync
      this.currentUser = user;
      this.isLoggedIn = !!user;

      this.authService.user$.subscribe(user => {
        this.currentUser = user;
        this.isLoggedIn = !!user;
      });
    
      //Load Category List for dropdown
      this.homeService.getCategories().subscribe({ 
        next: (data: ProductCategoryDto[]) => this.categories = data, 
        error: (err) => console.error('Category fetch failed', err)
       });
 
    // Check auth status on init
    this.checkAuthStatus();
    this.listenToAuthChanges();
  }
  // Check if user is logged in
  checkAuthStatus() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
        this.isLoggedIn = true;
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.isLoggedIn = false;
      }
    }
  }

  // Listen for auth changes
  listenToAuthChanges() {
    window.addEventListener('storage', (event) => {
      if (event.key === 'currentUser') {
        this.checkAuthStatus();
      }
    });

    this.router.events.subscribe(() => {
      this.checkAuthStatus();
    });
  }

  // Show profile dropdown
  showProfileDropdown() {
    this.isProfileDropdownVisible = true;
  }

  // Hide profile dropdown
  hideProfileDropdown() {
    setTimeout(() => {
    if (!this.isHoveringOverDropdown) {
      this.isProfileDropdownVisible = false;
    }
  }, 300); // You can tweak this delay

  }
  trackByRoute(index: number, item: { route: string }) {
    return item.route;
  }

  // Get first name from full name
 getFirstName(): string {
  if (this.currentUser?.userName) {
    return this.currentUser.userName.split(' ')[0]; //Extract first word from full name
  }

  if (this.currentUser?.email) {
    return this.currentUser.email.split('@')[0]; //Fallback to email prefix
  }
  return 'User'; // Default fallback
}


  // Navigate to auth page
  navigateToAuth() {
    this.router.navigate(['/auth']);
  }

  // Navigate to profile page
  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  // Navigate to menu item
  navigateToMenuItem(route: string) {
    this.router.navigate([route]);
  }

  // Logout
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);

  }
}