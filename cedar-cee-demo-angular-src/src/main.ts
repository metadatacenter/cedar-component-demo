import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Some bundles expect Node's `global` to exist. The intersection names exactly what
// is being added rather than casting the window away to `any`.
(window as Window & { global?: Window }).global = window;

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
