import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <h2>Signup</h2>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Name</label>
          <input type="text" [(ngModel)]="name" name="name" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" name="email" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" [(ngModel)]="password" name="password" required />
        </div>
        <div class="form-group">
          <label>Confirm Password</label>
          <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" required />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <a href="javascript:void(0)" (click)="goToLogin()">Login</a></p>
    </div>
  `,
  styles: [`
    .auth-container { max-width: 400px; margin: 50px auto; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); border-radius: 8px; background: white; }
    h2 { text-align: center; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; }
    input { width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; }
    button { width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background-color: #0056b3; }
    p { text-align: center; margin-top: 15px; }
  `]
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    this.authService.signup({ name: this.name, email: this.email, password: this.password, confirmPassword: this.confirmPassword }).subscribe({
      next: (res) => {
        alert('Signup successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const msg = err.error?.message || (typeof err.error === 'string' ? err.error : err.message);
        alert('Error: ' + msg);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
