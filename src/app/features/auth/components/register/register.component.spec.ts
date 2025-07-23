import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // Importar
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../../core/services/auth.service';
import { AUTH_ROUTES, AUTH_TEXTS } from '../../../../shared/constants/auth.constants';

// Mock simple
const authServiceMock = {
  register: jasmine.createSpy('register').and.returnValue(of(undefined))
};

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router; // Instancia real

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule, // Añadir
        RegisterComponent
      ],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });
  
  afterEach(() => {
    authServiceMock.register.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize register form', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.controls['name']).toBeDefined();
    expect(component.registerForm.controls['email']).toBeDefined();
    expect(component.registerForm.controls['password']).toBeDefined();
    expect(component.registerForm.controls['confirmPassword']).toBeDefined();
  });

  it('password and confirmPassword should have mismatch error if they do not match', () => {
    const password = component.registerForm.controls['password'];
    const confirmPassword = component.registerForm.controls['confirmPassword'];

    password.setValue('123456');
    confirmPassword.setValue('1234567');
    
    expect(component.registerForm.hasError('mismatch')).toBeTruthy();
  });

  it('password and confirmPassword should not have mismatch error if they match', () => {
    const password = component.registerForm.controls['password'];
    const confirmPassword = component.registerForm.controls['confirmPassword'];

    password.setValue('123456');
    confirmPassword.setValue('123456');
    
    expect(component.registerForm.hasError('mismatch')).toBeFalsy();
  });

  it('should not call register service if form is invalid on submit', () => {
    component.onSubmit();
    expect(authServiceMock.register).not.toHaveBeenCalled();
  });

  it('should call register service and navigate on successful registration', () => {
    spyOn(router, 'navigate');
    authServiceMock.register.and.returnValue(of(undefined)); // Aseguramos el comportamiento
    
    component.registerForm.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
      confirmPassword: '123456'
    });

    component.onSubmit();

    expect(authServiceMock.register).toHaveBeenCalledWith({ name: 'Test User', email: 'test@example.com', password: '123456' });
    expect(router.navigate).toHaveBeenCalledWith([AUTH_ROUTES.login]);
  });

  it('should log an error on failed registration', () => {
    spyOn(router, 'navigate');
    authServiceMock.register.and.returnValue(throwError(() => new Error('Registration Failed')));
    const consoleErrorSpy = spyOn(console, 'error');

    component.registerForm.controls['name'].setValue('Test User');
    component.registerForm.controls['email'].setValue('test@example.com');
    component.registerForm.controls['password'].setValue('123456');
    component.registerForm.controls['confirmPassword'].setValue('123456');

    component.onSubmit();

    expect(authServiceMock.register).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(AUTH_TEXTS.register.errors.registerFailed, jasmine.any(Error));
  });
}); 