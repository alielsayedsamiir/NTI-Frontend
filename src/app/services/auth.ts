import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5000/api/v1/users'; // الـ Base URL المربوط بالباك إند عندك

  currentUser = signal<any>(this.getUserFromToken());

  // تسجيل حساب جديد
  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, userData);
  }

  // تسجيل الدخول وحفظ التوكن
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.currentUser.set(this.getUserFromToken());
        }
      })
    );
  }

  // تسجيل الخروج
  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }

  // قراءة بيانات المستخدم والـ Role من الـ Token
  private getUserFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  }
}