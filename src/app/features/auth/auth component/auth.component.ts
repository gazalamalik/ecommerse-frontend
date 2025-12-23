import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode = true;
  rememberMe = false;
  constructor(private snackBar: MatSnackBar,private http: HttpClient, private authService: AuthService,  private router: Router, private route: ActivatedRoute) {}
  // Login form data
  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  // Signup form data
  signupData = {
    UserName: '',
    email: '',
    mobile: '',
    gender: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: ''
  };

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.resetForms();
  }

  resetForms() {
    this.loginData = { email: '', password: '', rememberMe: false };
    this.signupData = { UserName: '', email: '', password: '', confirmPassword: '', mobile: '', gender: '', dateOfBirth: '' };
    this.rememberMe = false;
  }

 onRegisterClick() {
  if (this.signupData.password !== this.signupData.confirmPassword) {
      this.snackBar.open('Passwords do not match', 'Close', { duration: 3000 });
      return;
  }
  const { confirmPassword, ...rawPayload } = this.signupData;
  const payload = {
  ...rawPayload,
  mobile: rawPayload.mobile.toString(), // Ensure it's a string
  dateOfBirth: new Date(rawPayload.dateOfBirth).toISOString() // Convert to ISO format
  };
  this.authService.registerUser(payload).subscribe({
      next: res => {
        this.snackBar.open('Registration successful', 'Close', { duration: 3000 });
        // Show toast or redirect
      },
      error: err => {
        console.error('Registration failed:', err);
      }
    });
 }

  // onLoginClick() {
  //  const { rememberMe, ...payload } = this.loginData;
  //  this.authService.loginUser(payload).subscribe({
  //     next: res => {
  //       this.snackBar.open('Login successful', 'Close', { duration: 3000 });
  //       if (rememberMe) {
  //         localStorage.setItem('userEmail', this.loginData.email);
  //       }
  //       localStorage.setItem('currentUser', JSON.stringify(res)); // Store user for profile page
  //       this.authService.setUser(res);                           
  //       this.router.navigate(['/']);

  //     },
  //     error: err => {
  //       console.error('Login failed:', err);
  //        this.snackBar.open(`Login Failed: ${err.error}`, 'Close', { duration: 3000 });
  //     }
  //   });
  // }

 onLoginClick(): void {
  const { rememberMe, ...payload } = this.loginData;

  this.authService.loginUser(payload).subscribe({
    next: res => {
      this.snackBar.open('Login successful', 'Close', { duration: 3000 });

      // ✅ Persist login state
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(res));
      this.authService.setUser(res);

      if (rememberMe) {
        localStorage.setItem('userEmail', this.loginData.email);
      }

      // ✅ Redirect with login flag
      const returnUrl = this.route.snapshot.queryParams['returnUrl'];
      if (returnUrl) {
        this.router.navigate([], {
          queryParams: { loggedin: 'true' },
          queryParamsHandling: 'merge',
          relativeTo: this.route
        }).then(() => {
          this.router.navigateByUrl(returnUrl + '?loggedin=true');
        });
      } else {
        this.router.navigate(['/']);
      }
    },
    error: err => {
      console.error('Login failed:', err);
      this.snackBar.open(`Login Failed: ${err.error}`, 'Close', { duration: 3000 });
    }
  });
}
  onGoogleAuth() {
    console.log('Google authentication');
    // Add Google OAuth logic here
  }

  onFacebookAuth() {
    console.log('Facebook authentication');
    // Add Facebook OAuth logic here
  }

  onForgotPassword() {
    console.log('Forgot password clicked');
    // Add forgot password logic here
  }
}