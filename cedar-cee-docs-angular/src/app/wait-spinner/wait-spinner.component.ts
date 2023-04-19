import {Component, OnInit} from '@angular/core';
import {AppConfigService} from '../services/app-config.service';

@Component({
  selector: 'app-wait-spinner',
  templateUrl: './wait-spinner.component.html',
  styleUrls: ['./wait-spinner.component.scss']
})
export class WaitSpinnerComponent implements OnInit {

  confService: AppConfigService = null;

  configuration = null;
  delayedConfiguration = {
    sampleTemplateLocationPrefix: 'https://component.staging.metadatacenter.org/cedar-embeddable-editor-sample-templates/',
    loadSampleTemplateName: '01'
  };

  constructor() {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.configuration = this.delayedConfiguration;
    }, 3000);
  }

}
