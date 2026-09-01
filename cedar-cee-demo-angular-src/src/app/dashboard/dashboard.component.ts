import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';

import { AppConfigService } from '../services/app-config.service';

@Component({
  selector: 'app-dashboard',
  // cedar-embeddable-editor is a custom element, not an Angular component, so the
  // template has to be allowed to contain a tag Angular does not know.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  readonly confService = inject(AppConfigService);
}
