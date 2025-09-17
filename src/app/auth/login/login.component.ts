import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    // Aquí iría tu lógica real con API
    if(this.email === 'test@test.com' && this.password === '123456') {
      // Redirige a la página principal después de login
      this.router.navigate(['/home']);
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  }
}
