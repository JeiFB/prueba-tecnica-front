// src/app/features/tasks/tasks-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importa tus dos componentes
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
// Eliminar la importación de TaskDashboardComponent

// Importa tu guard funcional
import { authGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  // { path: 'dashboard', component: TaskDashboardComponent }, // Eliminado
  {
    path: '',
    canActivate: [ authGuard ],
    children: [
      { path: '', component: TaskListComponent },
      { path: 'new', component: TaskFormComponent },
      { path: 'edit/:id', component: TaskFormComponent }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class TasksRoutingModule {}
