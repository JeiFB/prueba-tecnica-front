import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TaskService } from '../../../../core/services/task.service';
import { Task, TaskStatus, TaskPriority } from '../../../../shared/models/tasks';
import { TASK_STATUSES, TASK_PRIORITIES } from '../../../../shared/constants/task.constants';
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
  statuses = TASK_STATUSES;
  priorities = TASK_PRIORITIES;

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

  getStatusLabel(value: string): string {
    return this.statuses.find(s => s.value === value)?.label || value;
  }

  getPriorityLabel(value: string): string {
    return this.priorities.find(p => p.value === value)?.label || value;
  }

  getStatusIcon(value: string): string {
    const status = value as TaskStatus;
    switch (status) {
      case TaskStatus.TO_DO: return 'pending_actions';
      case TaskStatus.IN_PROGRESS: return 'autorenew';
      case TaskStatus.DONE: return 'check_circle';
      default: return 'help_outline';
    }
  }

  getPriorityIcon(value: string): string {
    const priority = value as TaskPriority;
    switch (priority) {
      case TaskPriority.HIGH: return 'priority_high';
      case TaskPriority.MEDIUM: return 'drag_handle';
      case TaskPriority.LOW: return 'low_priority';
      default: return 'help_outline';
    }
  }

  getStatusColor(value: string): string {
    const status = value as TaskStatus;
    switch (status) {
      case TaskStatus.TO_DO: return '#ff9800';
      case TaskStatus.IN_PROGRESS: return '#2196f3';
      case TaskStatus.DONE: return '#4caf50';
      default: return '#757575';
    }
  }

  getPriorityColor(value: string): string {
    const priority = value as TaskPriority;
    switch (priority) {
      case TaskPriority.HIGH: return '#f44336';
      case TaskPriority.MEDIUM: return '#ff9800';
      case TaskPriority.LOW: return '#7b1fa2';
      default: return '#757575';
    }
  }

  getStatusClass(value: string): string {
    const status = value as TaskStatus;
    switch (status) {
      case TaskStatus.TO_DO: return 'status-todo';
      case TaskStatus.IN_PROGRESS: return 'status-in-progress';
      case TaskStatus.DONE: return 'status-done';
      default: return '';
    }
  }

  delete(id: number) {
    if (confirm('¿Eliminar esta tarea?')) {
      this.taskService.delete(id).subscribe(() => this.loadTasks());
    }
  }
}