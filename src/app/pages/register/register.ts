import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = { name: '', email: '', password: '', role: 'student' };
  errorMessage = '';

  onSubmit() {
    this.authService.register(this.user).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => this.errorMessage = err.error?.message || 'Registration failed'
    });
  }
}