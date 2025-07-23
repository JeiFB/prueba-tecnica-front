export const AUTH_TEXTS = {
  login: {
    title: 'Iniciar sesión',
    emailLabel: 'Email',
    passwordLabel: 'Contraseña',
    loginButton: 'Ingresar',
    registerLink: 'Crear cuenta',
    errors: {
      emailRequired: 'Email requerido',
      emailFormat: 'Formato inválido',
      passwordRequired: 'Contraseña requerida',
      loginFailed: 'Login fallido',
    },
  },
  register: {
    title: 'Crear cuenta',
    nameLabel: 'Nombre',
    emailLabel: 'Email',
    passwordLabel: 'Contraseña',
    confirmPasswordLabel: 'Confirmar contraseña',
    registerButton: 'Registrarse',
    loginLink: 'Ya tengo cuenta',
    showPasswordAria: 'Mostrar contraseña',
    errors: {
      nameRequired: 'Nombre requerido',
      emailRequired: 'Email requerido',
      emailFormat: 'Formato inválido',
      passwordRequired: 'Contraseña requerida',
      passwordMinLength: 'Mínimo 6 caracteres',
      passwordsMismatch: 'Las contraseñas no coinciden',
      registerFailed: 'Registro fallido',
    },
  },
};

export const AUTH_ROUTES = {
  login: '/login',
  tasks: '/tasks',
}; 