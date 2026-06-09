import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:5137/api/todo';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  getTodos(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  createTodo(name: string): Observable<any> {
    return this.http.post(this.apiUrl, { name }, { headers: this.getHeaders() });
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status }, { headers: this.getHeaders() });
  }
}
