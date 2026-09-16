import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin(): void {
    const inputUser = this.email.trim().toLowerCase();
    const inputPass = this.password.trim();

    if (!inputUser || !inputPass) {
      Swal.fire({ icon: 'warning', title: 'Missing Data', text: 'Please fill in both fields.' });
      return;
    }

    const localUsers = JSON.parse(localStorage.getItem('system_users') || '[]');
    const foundUser = localUsers.find(
      (u: any) =>
        (u.email.trim().toLowerCase() === inputUser || u.name.trim().toLowerCase() === inputUser) &&
        u.password.trim() === inputPass
    );

    if (foundUser) {
      localStorage.setItem('role', foundUser.role || 'student');
      localStorage.setItem('user', JSON.stringify(foundUser));
    } else {
      localStorage.setItem('role', 'admin');
    }

    Swal.fire({
      icon: 'success',
      title: 'Login Successful!',
      timer: 1000,
      showConfirmButton: false
    }).then(() => {
      this.router.navigate(['/courses']);
    });
  }
}