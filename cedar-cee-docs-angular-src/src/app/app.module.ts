import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {IntroComponent} from './intro/intro.component';
import {AppConfigService} from './services/app-config.service';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ConfigBasicComponent} from './config-basic/config-basic.component';
import {ConfigCompactUIComponent} from './config-compact-ui/config-compact-ui.component';
import {ConfigControlledComponent} from './config-controlled/config-controlled.component';
import {WaitSpinnerComponent} from './wait-spinner/wait-spinner.component';
import {WaitHiddenComponent} from './wait-hidden/wait-hidden.component';
import {RequirementsComponent} from './requirements/requirements.component';
import {HIGHLIGHT_OPTIONS, HighlightModule} from 'ngx-highlightjs';
import {ParametersComponent} from './parameters/parameters.component';
import {ResourcesComponent} from './resources/resources.component';
import {MaterialModule} from './modules/material-module';
import 'cedar-embeddable-editor/cedar-embeddable-editor.js';

const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};

@NgModule({
  declarations: [
    AppComponent,
    IntroComponent,
    RequirementsComponent,
    ResourcesComponent,
    ParametersComponent,
    ConfigBasicComponent,
    ConfigCompactUIComponent,
    ConfigControlledComponent,
    WaitSpinnerComponent,
    WaitHiddenComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    HighlightModule
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService]
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        lineNumbersLoader: () => import('highlightjs-line-numbers.js'),
        languages: {
          typescript: () => import('highlight.js/lib/languages/typescript'),
          css: () => import('highlight.js/lib/languages/css'),
          xml: () => import('highlight.js/lib/languages/xml')
        }
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
