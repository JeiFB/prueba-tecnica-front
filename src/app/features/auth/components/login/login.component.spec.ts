import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // Importar
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/services/auth.service';
import { AUTH_ROUTES, AUTH_TEXTS } from '../../../../shared/constants/auth.constants';

// Mock simple, ya no necesitamos espiar el navigate aquí
const authServiceMock = {
  login: jasmine.createSpy('login').and.returnValue(of(undefined))
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router; // Para espiar la instancia real

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule, // Añadir
        LoginComponent 
      ],
      providers: [
        provideRouter([]), // Proveedor del router
        { provide: AuthService, useValue: authServiceMock },
        // Ya no proveemos un mock de Router
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router); // Obtenemos la instancia real
    fixture.detectChanges();
  });

  afterEach(() => {
    authServiceMock.login.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['email']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
  });

  it('form should be invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('email field validity', () => {
    const email = component.loginForm.controls['email'];
    expect(email.valid).toBeFalsy();

    email.setValue('');
    expect(email.hasError('required')).toBeTruthy();

    email.setValue('test');
    expect(email.hasError('email')).toBeTruthy();

    email.setValue('test@example.com');
    expect(email.valid).toBeTruthy();
  });

  it('password field validity', () => {
    const password = component.loginForm.controls['password'];
    expect(password.valid).toBeFalsy();

    password.setValue('');
    expect(password.hasError('required')).toBeTruthy();

    password.setValue('123456');
    expect(password.valid).toBeTruthy();
  });

  it('should not call login service if form is invalid on submit', () => {
    component.onSubmit();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should call login service and navigate on successful login', () => {
    spyOn(router, 'navigate'); // Espiamos el método navigate
    authServiceMock.login.and.returnValue(of(undefined)); // Aseguramos comportamiento
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('123456');
    
    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({ email: 'test@example.com', password: '123456' });
    expect(router.navigate).toHaveBeenCalledWith([AUTH_ROUTES.tasks]);
  });

  it('should log an error on failed login', () => {
    spyOn(router, 'navigate'); // Espiamos el método navigate
    authServiceMock.login.and.returnValue(throwError(() => new Error('Login Failed')));
    const consoleErrorSpy = spyOn(console, 'error');
    
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('123456');

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(AUTH_TEXTS.login.errors.loginFailed, jasmine.any(Error));
  });
}); 