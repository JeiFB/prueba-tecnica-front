// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'tasks',
    loadChildren: () =>
      import('./features/tasks/tasks.module').then(m => m.TasksModule),
    canActivate: [authGuard] // Proteger esta ruta
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [authGuard] // Proteger también el dashboard
  },
  // La ruta raíz debería redirigir a una página protegida si el usuario ya está logueado
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  // Atrapar todo lo demás y redirigir a login
  { path: '**', redirectTo: 'login' }
];
