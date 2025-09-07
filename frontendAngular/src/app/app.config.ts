import { ApplicationConfig, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './interceptors/auth.interceptor';
import { loggingInterceptor } from './interceptors/logging.interceptor';
import { DomMonitorService } from './services/dom-monitor.service';
import { AppInitializerService, appInitializerFactory } from './services/app-initializer.service';
import { ApiConnectorService } from './services/api-connector.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([loggingInterceptor, authInterceptor])),
    provideAnimationsAsync(),
    importProvidersFrom(CommonModule),
    DomMonitorService,
    ApiConnectorService,
    AppInitializerService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [AppInitializerService],
      multi: true
    }
  ]
};
