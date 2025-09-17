import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { TaskComponent } from './tasks/tsks.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'tasks', component: TaskComponent },
  { path: '**', redirectTo: 'login' }
];
