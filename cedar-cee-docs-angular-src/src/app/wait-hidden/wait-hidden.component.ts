import {Component, OnInit} from '@angular/core';
import {AppConfigService} from '../services/app-config.service';

@Component({
  selector: 'app-wait-hidden',
  templateUrl: './wait-hidden.component.html',
  styleUrls: ['./wait-hidden.component.scss']
})
export class WaitHiddenComponent implements OnInit {

  confService: AppConfigService = null;

  configuration = null;
  wrongConfiguration = {
    sampleTemplateLocationPrefix: 'badUrl',
    loadSampleTemplateName: '01',
    showSpinnerBeforeInit: false
  };
  goodConfiguration = {
    sampleTemplateLocationPrefix: 'https://component.staging.metadatacenter.org/cedar-embeddable-editor-sample-templates/',
    loadSampleTemplateName: '01',
  };

  constructor() {
  }

  ngOnInit(): void {
    this.configuration = this.wrongConfiguration;
    setTimeout(() => {
      this.configuration = this.goodConfiguration;
    }, 3000);
  }

}
