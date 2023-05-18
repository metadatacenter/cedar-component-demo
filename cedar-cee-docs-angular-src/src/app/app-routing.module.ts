import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IntroComponent} from './intro/intro.component';
import {ConfigBasicComponent} from './config-basic/config-basic.component';
import {ConfigControlledComponent} from './config-controlled/config-controlled.component';
import {WaitSpinnerComponent} from './wait-spinner/wait-spinner.component';
import {WaitHiddenComponent} from './wait-hidden/wait-hidden.component';
import {RequirementsComponent} from './requirements/requirements.component';
import {ParametersComponent} from "./parameters/parameters.component";
import {ResourcesComponent} from "./resources/resources.component";

const routes: Routes = [
  {
    path: '',
    component: IntroComponent,
    pathMatch: 'full'
  },
  {
    path: 'intro',
    component: IntroComponent,
    pathMatch: 'full'
  },
  {
    path: 'config-basic',
    component: ConfigBasicComponent,
    pathMatch: 'full'
  },
  {
    path: 'requirements',
    component: RequirementsComponent,
    pathMatch: 'full'
  },
  {
    path: 'resources',
    component: ResourcesComponent,
    pathMatch: 'full'
  },
  {
    path: 'parameters',
    component: ParametersComponent,
    pathMatch: 'full'
  },
  {
    path: 'config-controlled',
    component: ConfigControlledComponent,
    pathMatch: 'full'
  },
  {
    path: 'wait-spinner',
    component: WaitSpinnerComponent,
    pathMatch: 'full'
  },
  {
    path: 'wait-hidden',
    component: WaitHiddenComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
