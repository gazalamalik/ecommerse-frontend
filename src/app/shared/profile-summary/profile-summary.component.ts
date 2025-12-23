import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

interface UserProfile {
  userName: string;
  email: string;
  mobile: string;
  gender: string;
  dateOfBirth: string;
  avatar?: string;
}

@Component({
  selector: 'app-profile-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.css']
})
export class ProfileSummaryComponent implements OnInit {
  userProfile: UserProfile = {
    userName: '',
    email: '',
    mobile: '',
    gender: '',
    dateOfBirth: ''
  };

  originalProfile: UserProfile = { ...this.userProfile };
  isEditing = false;
  activeMenu = 'profile';

  constructor(private router: Router, private authService: AuthService) {}

 ngOnInit() {
  const userData = localStorage.getItem('currentUser');
  if (!userData) {
    this.router.navigate(['/auth']);
    return;
  }

  const user = JSON.parse(userData);
  const userId = user.userId;

  this.authService.getUserProfile(userId).subscribe({
      next: res => {
        if (res.success && res.data) {
          this.userProfile = res.data; // Extract only the profile data
          this.originalProfile = { ...res.data };
          localStorage.setItem('userProfile', JSON.stringify(res.data)); // Optional caching
        } else {
          console.warn('Unexpected profile format:', res);
          this.router.navigate(['/auth']);
        }
      },
      error: err => {
        console.error('Failed to load profile:', err);
        this.router.navigate(['/auth']);
      }
    });
  }

  //My profile circle
  getInitial(): string {
    return this.userProfile.userName.charAt(0).toUpperCase();
  }

  navigateTo(route: string) {
    this.activeMenu = route;
    //this.router.navigate([`/${route}`]);
  }

  changeAvatar() {
    console.log('Change avatar clicked');
  }

  editField(field: string) {
    this.isEditing = true;
  }

  saveChanges() {
    localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      user.name = this.userProfile.userName;
      user.email = this.userProfile.email;
      localStorage.setItem('currentUser', JSON.stringify(user));
    }

    this.originalProfile = { ...this.userProfile };
    this.isEditing = false;
    alert('Profile updated successfully!');
  }

  cancel() {
    this.userProfile = { ...this.originalProfile };
    this.isEditing = false;
  }

  logout() {
    this.authService.logout();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userProfile');
    this.router.navigate(['/']);
  }

  changePassword() {
    this.router.navigate(['/change-password']);
  }
}