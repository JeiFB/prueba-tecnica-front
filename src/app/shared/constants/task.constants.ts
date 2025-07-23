import { TaskStatus, TaskPriority } from '../models/tasks';

export const TASK_STATUS_MAP: Record<TaskStatus, string> = {
  [TaskStatus.TO_DO]: 'To Do',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.DONE]: 'Done',
};

export const TASK_PRIORITY_MAP: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'Low',
  [TaskPriority.MEDIUM]: 'Medium',
  [TaskPriority.HIGH]: 'High',
};

export const TASK_STATUS_INFO = {
  [TaskStatus.TO_DO]: { icon: 'pending_actions', color: '#ff9800', class: 'status-todo' },
  [TaskStatus.IN_PROGRESS]: { icon: 'autorenew', color: '#2196f3', class: 'status-in-progress' },
  [TaskStatus.DONE]: { icon: 'check_circle', color: '#4caf50', class: 'status-done' },
};

export const TASK_PRIORITY_INFO = {
  [TaskPriority.HIGH]: { icon: 'priority_high', color: '#f44336' },
  [TaskPriority.MEDIUM]: { icon: 'drag_handle', color: '#ff9800' },
  [TaskPriority.LOW]: { icon: 'low_priority', color: '#7b1fa2' },
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20],
};

export const TASK_MESSAGES = {
  confirmDelete: '¿Eliminar esta tarea?',
};

export const TASK_TEXTS = {
  title: 'Mis Tareas',
  newTaskButton: 'Nueva tarea',
  dashboardButton: 'Ver Dashboard',
  searchLabel: 'Buscar tareas',
  searchPlaceholder: 'Escribe para buscar...',
  statusFilterLabel: 'Estado',
  priorityFilterLabel: 'Prioridad',
  allStatuses: 'Todos',
  allPriorities: 'Todas',
  applyFiltersButton: 'Aplicar filtros',
  clearFiltersButton: 'Limpiar',
  fromDateLabel: 'Desde',
  toDateLabel: 'Hasta',
}; 