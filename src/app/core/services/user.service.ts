import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/user';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  /** Listar usuarios */
  list(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/`);
  }

  /** Obtener perfil del usuario actual */
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/profile`);
  }
} 