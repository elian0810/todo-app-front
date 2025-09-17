import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../apis/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';

  loading = signal(false);
  message = signal<string | null>(null);
  success = signal<boolean | null>(null);

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    this.loading.set(true);
    this.message.set(null);
    this.success.set(null);

    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.loading.set(false);
        const body = res.body;

        this.success.set(body.success);
        this.message.set(body.messages?.[0] || 'Respuesta del backend');
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error en la petición:', err);

        // Si el backend envía JSON en error, Angular no lo parsea automáticamente
        if (err.error) {
          this.success.set(err.error.success);
          this.message.set(err.error.messages?.[0] || 'Error del backend');
        } else {
          this.success.set(false);
          this.message.set('Error al conectar con el servidor');
        }
      },
    });
  }
}
