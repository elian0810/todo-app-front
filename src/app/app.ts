// src/app/app.ts
import { Component, signal } from '@angular/core';
import { LoginComponent } from './auth/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('todo-app-front');
}
