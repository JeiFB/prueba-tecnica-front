import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Task, TaskPriority, TaskStatus, PageResponse, TaskSearchResult } from "../../shared/models/tasks";
import { map, Observable } from 'rxjs';

// DTOs para mapeo
interface TaskRequestDto {
  title: string;
  description: string;
  userId: number;
  dueDate: string; // YYYY-MM-DD
  status: TaskStatus;
  priority: TaskPriority;
}

interface TaskResponseDto {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  userId: number;
  dueDate: string; // "YYYY-MM-DD"
  status: TaskStatus;
  priority: TaskPriority;
  userName: string;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private baseUrl = 'http://localhost:8080/task';

  constructor(private http: HttpClient) {}

  private toTask(dto: TaskResponseDto): Task {
    return {
      ...dto,
      dueDate: new Date(dto.dueDate)
    };
  }

  private toTaskRequestDto(task: Task): TaskRequestDto {
    return {
      title: task.title,
      description: task.description,
      userId: task.userId,
      dueDate: task.dueDate.toISOString().split('T')[0],
      status: task.status,
      priority: task.priority,
    };
  }

  /** Listar todas las tareas */
  list(): Observable<Task[]> {
    return this.http.get<TaskResponseDto[]>(`${this.baseUrl}/`).pipe(
      map(dtos => dtos.map(this.toTask))
    );
  }

  /** Obtener una tarea por ID */
  get(id: number): Observable<Task> {
    return this.http.get<TaskResponseDto>(`${this.baseUrl}/${id}`).pipe(
      map(this.toTask)
    );
  }

  /** Crear nueva tarea */
  create(task: Task): Observable<void> {
    const dto = this.toTaskRequestDto(task);
    return this.http.post<void>(`${this.baseUrl}/`, dto);
  }

  /** Actualizar una tarea existente */
  update(id: number, task: Task): Observable<void> {
    const dto = this.toTaskRequestDto(task);
    return this.http.put<void>(`${this.baseUrl}/${id}`, dto);
  }

  /** Eliminar tarea */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /** Filtrar tareas */
  filter(filters: {
    status?: string;
    priority?: string;
    fromDate?: string;
    toDate?: string;
  }): Observable<Task[]> {
    return this.http.post<TaskResponseDto[]>(`${this.baseUrl}/filter`, filters).pipe(
      map(dtos => dtos.map(this.toTask))
    );
  }

  /** Buscar tareas por título con paginación */
  searchTasks(
    title: string,
    page: number = 0,
    size: number = 10,
    sortField: string = 'title',
    sortDirection: 'asc' | 'desc' = 'desc'
  ): Observable<PageResponse<TaskSearchResult>> {
    let params = new HttpParams()
      .set('title', title)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sortField},${sortDirection}`);

    return this.http.get<PageResponse<TaskSearchResult>>(`${this.baseUrl}/search`, { params });
  }
}
