import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000';
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/login/`, { email, password }, { observe: 'response' })
      .pipe(
        tap((res) => {
          const body = res.body as any;
          // Ajuste: token está en body.data.token
          const token = body.data?.token;
          if (body.success && token) {
            this.token = token;
            if (typeof window !== 'undefined') {
              localStorage.setItem('token', this.token ?? '');
            }
          }
        })
      );
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }
}
