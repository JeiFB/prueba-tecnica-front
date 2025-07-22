import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatDialogModule
  ],
  template: `
    <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-trigger">
      <mat-icon>account_circle</mat-icon>
      <span *ngIf="user">{{ user.name }}</span>
      <mat-icon>arrow_drop_down</mat-icon>
    </button>

    <mat-menu #userMenu="matMenu">
      <div class="user-info" *ngIf="user">
        <div class="user-name">{{ user.name }}</div>
        <div class="user-email">{{ user.email }}</div>
      </div>
      <mat-divider></mat-divider>
      <button mat-menu-item (click)="showProfile()">
        <mat-icon>person</mat-icon>
        <span>Mi Perfil</span>
      </button>
      <button mat-menu-item (click)="logout()">
        <mat-icon>exit_to_app</mat-icon>
        <span>Cerrar Sesión</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .user-menu-trigger {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-info {
      padding: 16px;
      min-width: 200px;
      
      .user-name {
        font-weight: 500;
        margin-bottom: 4px;
      }
      
      .user-email {
        font-size: 0.9em;
        color: rgba(0, 0, 0, 0.6);
      }
    }

    mat-divider {
      margin: 0;
    }
  `]
})
export class UserMenuComponent implements OnInit {
  user: User | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // No llamaremos a loadUserProfile() temporalmente, ya que el endpoint /profile no existe.
    // this.loadUserProfile(); 
  }

  loadUserProfile() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => { this.user = user; },
      error: (error) => {
        console.error('Error al cargar el perfil del usuario (endpoint /profile no existe):', error);
      }
    });
  }

  showProfile() {
    // Si no hay datos de usuario, no abrimos el diálogo.
    if (this.user) {
      this.dialog.open(UserProfileDialog, {
        width: '400px',
        data: this.user
      });
    } else {
      // Opcional: notificar al usuario que los datos no están disponibles.
      console.warn("No se pueden mostrar los detalles del perfil porque no se pudieron cargar.");
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        console.error('Logout failed', err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.router.navigate(['/login']);
      }
    });
  }
}

@Component({
  selector: 'user-profile-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Mi Perfil</h2>
    <mat-dialog-content>
      <div class="profile-info">
        <div class="info-row">
          <span class="label">Nombre:</span>
          <span class="value">{{ data.name }}</span>
        </div>
        <div class="info-row">
          <span class="label">Email:</span>
          <span class="value">{{ data.email }}</span>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .profile-info {
      padding: 16px 0;
    }
    .info-row {
      margin-bottom: 16px;
      .label {
        font-weight: 500;
        margin-right: 8px;
        color: rgba(0, 0, 0, 0.6);
      }
    }
  `]
})
export class UserProfileDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: User) {}
} 