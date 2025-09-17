import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../apis/auth.service';
import { Router } from '@angular/router';
import { CreateComponent } from './forms/create/create.component.';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, CreateComponent],
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

  page = signal(1); // página actual
  totalPages = signal(1); // total de páginas
  pageSize = 10; // máximo 10 por página

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
      'Content-Type': 'application/json',
    });
  }

  fetchTasks(page: number = 1) {
    this.loading.set(true);
    this.message.set(null);

    this.page.set(page);

    const url = `${this.apiUrl}?limit=${this.pageSize}&page=${this.page()}`;

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

  createTask(task: any) {
    this.http
      .post<any>(this.apiUrl, task, { headers: this.getHeaders(), observe: 'response' })
      .subscribe({
        next: (res) => {
          const body = res.body;

          this.message.set(body.messages?.[0] || 'Tarea creada correctamente');

          if (body.success) {
            // Resetear a la primera página para que se vea la nueva tarea
            this.fetchTasks(1);

            this.showForm = false;
            this.newTask = { title: '', description: '', status_task: 1 };
          }
        },
        error: (err) => {
          console.error('Error al crear tarea:', err);
          if (err.error) {
            this.message.set(err.error.messages?.[0] || 'Error en la creación de la tarea');
          } else {
            this.message.set('Error al conectar con el servidor');
          }
        },
      });
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.fetchTasks(this.page() + 1); // reemplaza, no append
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.fetchTasks(this.page() - 1); // reemplaza
    }
  }
}
