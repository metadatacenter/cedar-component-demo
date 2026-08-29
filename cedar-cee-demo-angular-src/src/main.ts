import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// Some bundles expect Node's `global` to exist. The intersection names exactly what
// is being added rather than casting the window away to `any`.
(window as Window & { global?: Window }).global = window;

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
