import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));



// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideRouter } from '@angular/router';
// import { importProvidersFrom } from '@angular/core';
// import { provideAnimations } from '@angular/platform-browser/animations';
// import { AppComponent } from './app/app.component';
// import { routes } from './app/app.routes';
// import { HttpClientModule } from '@angular/common/http';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// bootstrapApplication(AppComponent, {
//   providers: [
//     // Para que funcione <router-outlet> y this.router.navigate()
//     provideRouter(routes),

//     // Para HttpClient en tus servicios (AuthService)
//     importProvidersFrom(HttpClientModule),

//     // Para Angular Material animations
//     provideAnimations(),
//     importProvidersFrom(BrowserAnimationsModule)
//   ]
// }).catch(err => console.error(err));
