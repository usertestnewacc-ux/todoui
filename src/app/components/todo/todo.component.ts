import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="todo-container">
      <div class="header">
        <h2>My Todos</h2>
        <button class="logout-btn" (click)="logout()">Logout</button>
      </div>
      
      <div class="add-todo">
        <input type="text" [(ngModel)]="newTodoName" placeholder="What needs to be done?" />
        <button (click)="addTodo()">Add</button>
      </div>

      <ul class="todo-list">
        <li *ngFor="let todo of todos" [class.completed]="todo.status === 'Completed'">
          <span class="todo-name">{{ todo.name }}</span>
          <div class="actions">
            <span class="status-badge" [class.pending]="todo.status === 'Pending'" [class.done]="todo.status === 'Completed'">
              {{ todo.status }}
            </span>
            <button *ngIf="todo.status === 'Pending'" (click)="toggleStatus(todo)">Mark Completed</button>
            <button *ngIf="todo.status === 'Completed'" (click)="toggleStatus(todo)">Mark Pending</button>
          </div>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .todo-container { max-width: 600px; margin: 50px auto; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); border-radius: 8px; background: white; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
    h2 { margin: 0; }
    .logout-btn { background-color: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; }
    .add-todo { display: flex; gap: 10px; margin-bottom: 20px; }
    .add-todo input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
    .add-todo button { padding: 10px 20px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .todo-list { list-style: none; padding: 0; margin: 0; }
    .todo-list li { display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #eee; }
    .todo-list li:last-child { border-bottom: none; }
    .todo-list li.completed .todo-name { text-decoration: line-through; color: #888; }
    .actions { display: flex; gap: 10px; align-items: center; }
    .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 0.8em; font-weight: bold; }
    .status-badge.pending { background-color: #ffc107; color: #333; }
    .status-badge.done { background-color: #28a745; color: white; }
    .actions button { padding: 5px 10px; border: 1px solid #ccc; background: #f8f9fa; border-radius: 4px; cursor: pointer; }
    .actions button:hover { background: #e2e6ea; }
  `]
})
export class TodoComponent implements OnInit {
  todos: any[] = [];
  newTodoName = '';

  constructor(private todoService: TodoService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe({
      next: (data) => this.todos = data,
      error: (err) => {
        if (err.status === 401) {
          this.logout();
        } else {
          console.error(err);
        }
      }
    });
  }

  addTodo() {
    if (!this.newTodoName.trim()) return;
    this.todoService.createTodo(this.newTodoName).subscribe({
      next: (todo) => {
        this.todos.push(todo);
        this.newTodoName = '';
      },
      error: (err) => console.error(err)
    });
  }

  toggleStatus(todo: any) {
    const newStatus = todo.status === 'Pending' ? 'Completed' : 'Pending';
    this.todoService.updateStatus(todo.id, newStatus).subscribe({
      next: (updatedTodo) => {
        todo.status = updatedTodo.status;
      },
      error: (err) => console.error(err)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
