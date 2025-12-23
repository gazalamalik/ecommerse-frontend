import { Routes } from '@angular/router';
import { CartView } from './features/cart/cart-view/cart-view';
import { HomeComponent } from './home-component/home-component';
import { provideHttpClient } from '@angular/common/http';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cart', component: CartView },
  {
  path: 'auth',
  loadComponent: () =>
    import('./features/auth/auth component/auth.component').then(m => m.AuthComponent),
  providers: [provideHttpClient()] //This makes HttpClient available to AuthService
  },
  {
  path: 'profile',
  loadComponent: () =>
    import('./shared/profile-summary/profile-summary.component').then(m => m.ProfileSummaryComponent),
  providers: [provideHttpClient()] //This makes HttpClient available to AuthService
  },

  { path: 'products/:categoryId',
     loadComponent: () =>
       import('./features/products/product-list/product-list').then(m => m.ProductList),
      providers: [provideHttpClient()] //This makes HttpClient available to homeService
  },
  {
    path: 'product-summary',
    loadComponent: () =>
      import('./features/products/product-summary/product-summary').then(m => m.ProductSummary),
    providers: [provideHttpClient()] //This makes HttpClient available to cartService
  },
   {
    path: 'checkout/cart',
    loadComponent: () =>
      import('./features/cart/cart-details/cart-details').then(m => m.CartDetails),
    providers: [provideHttpClient()] //This makes HttpClient available to cartService
  }
  

];
