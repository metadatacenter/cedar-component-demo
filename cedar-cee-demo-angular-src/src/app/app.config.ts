import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

// Importing the bundle is what defines the cedar-embeddable-editor element. Nothing
// references it by name, so it is imported for its side effect alone.
import 'cedar-embeddable-editor/cedar-embeddable-editor.js';

import { routes } from './app.routes';
import { AppConfigService } from './services/app-config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    AppConfigService,
    // The dashboard reads the configuration in its constructor, so it has to be
    // loaded before the application starts rather than alongside it.
    provideAppInitializer(() => inject(AppConfigService).loadAppConfig())
  ]
};
