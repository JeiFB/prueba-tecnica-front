import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface DashboardStats {
  totalTasks: number;
  completed: number;
  inProgress: number;
  toDo: number;
  overdue: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  completionPercentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  /** Obtener estadísticas del dashboard */
  getDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/`);
  }
} 