import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  mode = 'login';
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  token = '';
  message = '';
  error = '';
  todos: Array<{ id: number; name: string; status: string }> = [];

  constructor(private http: HttpClient) {}

  submitSignup(): void {
    this.clearStatus();
    this.http
      .post<{ message: string }>('/api/auth/signup', {
        name: this.name,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword
      })
      .subscribe({
        next: (res) => {
          this.message = res.message ?? 'Signup successful';
          this.mode = 'login';
        },
        error: (err) => {
          this.error = err?.error?.message ?? 'Signup failed';
        }
      });
  }

  submitLogin(): void {
    this.clearStatus();
    this.http
      .post<{ token: string }>('/api/auth/login', {
        email: this.email,
        password: this.password
      })
      .subscribe({
        next: (res) => {
          this.token = res.token;
          this.message = 'Logged in successfully';
          this.loadTodos();
        },
        error: (err) => {
          this.error = err?.error?.message ?? 'Login failed';
        }
      });
  }

  loadTodos(): void {
    if (!this.token) {
      this.error = 'Login required to load todos';
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    this.http
      .get<Array<{ id: number; name: string; status: string }>>('/api/todo', { headers })
      .subscribe({
        next: (items) => {
          this.todos = items;
        },
        error: (err) => {
          this.error = err?.error?.message ?? 'Could not load todos';
        }
      });
  }

  clearStatus(): void {
    this.message = '';
    this.error = '';
  }
}
