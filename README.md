# Prueba Técnica - Aplicación de Tareas (Frontend)

Este es el repositorio para el frontend de una aplicación web completa de gestión de tareas. La aplicación permite a los usuarios registrarse, iniciar sesión y realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre sus tareas.

## Demos en Vivo

*   **Frontend (Vercel):** [https://prueba-tecnica-front-three.vercel.app/](https://prueba-tecnica-front-three.vercel.app/)
*   **Backend (Render):** [https://prueba-tecnica-backend-exi4.onrender.com/](https://prueba-tecnica-backend-exi4.onrender.com/)

## Características

*   **Autenticación de Usuarios:** Sistema completo de registro e inicio de sesión.
*   **Gestión de Tareas (CRUD):**
    *   Crear nuevas tareas.
    *   Visualizar la lista de tareas pendientes.
    *   Marcar tareas como completadas.
    *   Eliminar tareas.
*   **Diseño Responsivo:** Interfaz adaptable a diferentes tamaños de pantalla.
*   **Rutas Protegidas:** Solo los usuarios autenticados pueden acceder al dashboard y a la gestión de tareas.

## Stack de Tecnologías

*   **Framework:** Angular v17
*   **Componentes UI:** Angular Material
*   **Lenguaje:** TypeScript
*   **Programación Reactiva:** RxJS
*   **Despliegue:** Vercel

## Prerrequisitos

Asegúrate de tener instalado lo siguiente en tu sistema:

*   [Node.js](https://nodejs.org/) (versión 18.13.0 o superior)
*   [Angular CLI](https://angular.io/cli) (versión 17.3 o superior)

## Instalación y Configuración Local

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/JeiFB/prueba-tecnica-front.git
    ```

2.  **Navegar al directorio del proyecto:**
    ```bash
    cd prueba-tecnica-front
    ```

3.  **Instalar las dependencias:**
    ```bash
    npm install
    ```

4.  **Configurar el entorno:**
    *   El archivo `src/environments/environment.ts` apunta al backend en `http://localhost:8080`. Asegúrate de que el servidor backend esté corriendo localmente en ese puerto.
    *   El archivo `src/environments/environment.prod.ts` está configurado para apuntar al backend desplegado en Render.

## Ejecutar en Modo Desarrollo

Para iniciar el servidor de desarrollo de Angular, ejecuta:

```bash
ng serve
```

Abre tu navegador y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si realizas cambios en los archivos fuente.

## Compilar para Producción

Para compilar el proyecto para un entorno de producción, ejecuta:

```bash
ng build
```

Los artefactos de la compilación se almacenarán en el directorio `dist/frontend`.

## Despliegue

Este proyecto está configurado para un despliegue continuo en [Vercel](https://vercel.com/). Cualquier `push` a la rama `main` del repositorio en GitHub disparará automáticamente un nuevo despliegue con la última versión del código.

El archivo `vercel.json` en la raíz del proyecto contiene la configuración necesaria para que Vercel compile y despliegue la aplicación correctamente.
