import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../apis/auth.service';
import { Router } from '@angular/router';
import { CreateComponent } from './forms/create/create.component.';
import { EditComponent } from './forms/edit/edit.component.';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, CreateComponent, EditComponent],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TaskComponent implements OnInit {
  loading = signal(false);
  tasks = signal<any[]>([]);
  message = signal<string | null>(null);
  messageType = signal<string | null>(null);
  showForm = false;
  showEdit = false;
  editingTask: any = null;
  confirmDelete = signal(false);
  taskToDelete: any = null;

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

  openEdit(task: any) {
    this.editingTask = { ...task, status_task: task.status_task.id };
    this.showEdit = true;
  }

  updateTask(updatedTask: any) {
    const url = `${this.apiUrl}${updatedTask.id}/`;

    const payload = {
      title: updatedTask.title,
      description: updatedTask.description,
      status_task: updatedTask.status_task,
    };

    this.http.put<any>(url, payload, { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        // actualizar la lista local con los nuevos datos
        this.tasks.update((prev) =>
          prev.map((t) => (t.id === updatedTask.id ? { ...t, ...payload } : t))
        );
        if (res.success) {
          this.fetchTasks(1);

          this.showEdit = false;
        }

        // mostrar mensaje del backend si existe
        if (res.messages?.length) {
          this.message.set(res.messages[0]);
        } else {
          this.message.set('Tarea actualizada correctamente');
        }
      },
      error: (err) => {
        console.error('Error al actualizar tarea:', err);

        if (err.error?.messages?.length) {
          this.message.set(err.error.messages[0]);
        } else {
          this.message.set('Error al actualizar la tarea');
        }
      },
    });
  }

  openDeleteModal(task: any) {
    this.taskToDelete = task;
    this.confirmDelete.set(true);
  }

  cancelDelete() {
    this.taskToDelete = null;
    this.confirmDelete.set(false);
  }

  confirmDeleteTask() {
    if (!this.taskToDelete?.id) return;

    this.loading.set(true);
    this.message.set(null);

    this.http
      .delete<any>(`${this.apiUrl}${this.taskToDelete.id}/`, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => {
          this.tasks.update((prev) => prev.filter((t) => t.id !== this.taskToDelete.id));
          this.message.set(res.messages?.[0] || 'Tarea eliminada correctamente');
          this.loading.set(false);
          this.cancelDelete();
        },
        error: (err) => {
          console.error('Error al eliminar tarea:', err);
          this.message.set(err.error?.messages?.[0] || 'Error al eliminar la tarea');
          this.loading.set(false);
          this.cancelDelete();
        },
      });
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.fetchTasks(this.page() + 1);
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.fetchTasks(this.page() - 1);
    }
  }
}
