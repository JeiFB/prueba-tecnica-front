import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TaskService } from '../../../../core/services/task.service';
import { Task, TaskStatus, TaskPriority } from '../../../../shared/models/tasks';
import { 
  TASK_STATUS_MAP, 
  TASK_PRIORITY_MAP, 
  TASK_STATUS_INFO, 
  TASK_PRIORITY_INFO,
  TASK_MESSAGES,
  TASK_TEXTS
} from '../../../../shared/constants/task.constants';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filterForm: FormGroup;
  
  // Usamos los mapas y la información de las constantes
  statuses = Object.keys(TaskStatus);
  priorities = Object.keys(TaskPriority);
  statusMap = TASK_STATUS_MAP;
  priorityMap = TASK_PRIORITY_MAP;
  statusInfo = TASK_STATUS_INFO;
  priorityInfo = TASK_PRIORITY_INFO;
  taskTexts = TASK_TEXTS;

  // Búsqueda
  searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor(private taskService: TaskService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      status: [''],
      priority: [''],
      fromDate: [''],
      toDate: ['']
    });

    // Configurar búsqueda con debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.searchTasks(term);
    });
  }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.list().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  onSearch(event: any) {
    this.searchSubject.next(event.target.value);
  }

  clearSearch() {
    this.searchTerm = '';
    this.loadTasks();
  }

  searchTasks(term: string) {
    if (!term.trim()) {
      this.loadTasks();
      return;
    }

    this.taskService.searchTasks(term).subscribe(response => {
      this.tasks = response.content;
    });
  }

  filterTasks() {
    const filters = { ...this.filterForm.value };
    if (filters.fromDate) {
      filters.fromDate = this.formatDate(filters.fromDate);
    }
    if (filters.toDate) {
      filters.toDate = this.formatDate(filters.toDate);
    }
    Object.keys(filters).forEach(key => {
      if (!filters[key]) filters[key] = null;
    });
    
    this.taskService.filter(filters).subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  // Las funciones de obtención de información ahora son más simples
  getStatusLabel(value: TaskStatus): string {
    return this.statusMap[value] || value;
  }

  getPriorityLabel(value: TaskPriority): string {
    return this.priorityMap[value] || value;
  }

  getStatusIcon(value: TaskStatus): string {
    return this.statusInfo[value]?.icon || 'help_outline';
  }

  getPriorityIcon(value: TaskPriority): string {
    return this.priorityInfo[value]?.icon || 'help_outline';
  }

  getStatusColor(value: TaskStatus): string {
    return this.statusInfo[value]?.color || '#757575';
  }

  getPriorityColor(value: TaskPriority): string {
    return this.priorityInfo[value]?.color || '#757575';
  }

  getStatusClass(value: TaskStatus): string {
    return this.statusInfo[value]?.class || '';
  }

  delete(id: number) {
    if (confirm(TASK_MESSAGES.confirmDelete)) {
      this.taskService.delete(id).subscribe(() => this.loadTasks());
    }
  }

  // --- Funciones de ayuda para el tipado en la plantilla ---
  asTaskStatus(key: string): TaskStatus {
    return key as TaskStatus;
  }

  asTaskPriority(key: string): TaskPriority {
    return key as TaskPriority;
  }
}