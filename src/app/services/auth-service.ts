import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  email: string;
  userName?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  // Reactive login state
  private loggedInUser = new BehaviorSubject<User | null>(null);
  user$ = this.loggedInUser.asObservable();

  constructor(private http: HttpClient) {
  const userData = localStorage.getItem('currentUser');
  if (userData) {
    this.loggedInUser.next(JSON.parse(userData)); // Restore user on reload
  }

  }

  // API calls
  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  loginUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  //get profile data 
  getUserProfile(userId: number): Observable<any> {
   return this.http.get(`${this.apiUrl}/profile/${userId}`);
  }


  // State management
  setUser(user: User) {
    this.loggedInUser.next(user);
  }

  getCurrentUser(): User | null {
    return this.loggedInUser.getValue();
  }

  logout() {
    this.loggedInUser.next(null);
    localStorage.removeItem('userEmail');
    localStorage.removeItem('currentUser');
  }
}
