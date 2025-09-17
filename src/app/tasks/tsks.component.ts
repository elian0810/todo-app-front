import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../apis/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TaskComponent implements OnInit {
  loading = signal(false);
  tasks = signal<any[]>([]);
  message = signal<string | null>(null);
  showForm = false;

  newTask = { title: '', description: '', status_task: 1 };
  private apiUrl = 'http://127.0.0.1:8000/tasks/';

  page = signal(1);       // página actual
  totalPages = signal(1); // total de páginas
  pageSize = 10;          // máximo 10 por página

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchTasks();
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) throw new Error('Token no disponible');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  fetchTasks() {
    this.loading.set(true);
    this.message.set(null);

    const offset = (this.page() - 1) * this.pageSize;
    const url = `${this.apiUrl}?limit=${this.pageSize}&offset=${offset}`;

    this.http.get<any>(url, { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        this.tasks.set(res.data?.results || []);
        const count = res.data?.count || 0;
        this.totalPages.set(Math.ceil(count / this.pageSize));
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.message.set('Error al cargar los datos');
        this.loading.set(false);
      },
    });
  }

  createTask() {
    this.loading.set(true);
    this.message.set(null);

    const payload = {
      ...this.newTask,
      status_task: { id: this.newTask.status_task }
    };

    this.http.post(this.apiUrl, payload, { headers: this.getHeaders() }).subscribe({
      next: (res: any) => {
        // recarga la página actual para que respete paginación
        this.fetchTasks();
        this.newTask = { title: '', description: '', status_task: 1 };
        this.showForm = false;
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.message.set('Error al crear la tarea');
        this.loading.set(false);
      },
    });
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.set(this.page() - 1);
      this.fetchTasks();
    }
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.set(this.page() + 1);
      this.fetchTasks();
    }
  }
}
