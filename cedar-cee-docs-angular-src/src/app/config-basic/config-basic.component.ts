import {Component, OnInit} from '@angular/core';
import {AppConfigService} from '../services/app-config.service';

@Component({
  selector: 'app-config-basic',
  templateUrl: './config-basic.component.html',
  styleUrls: ['./config-basic.component.scss']
})
export class ConfigBasicComponent implements OnInit {

  confService: AppConfigService = null;

  configuration = {
    sampleTemplateLocationPrefix: 'https://component.staging.metadatacenter.org/cedar-embeddable-editor-sample-templates/',
    loadSampleTemplateName: '01'
  };

  constructor() {
  }

  ngOnInit(): void {
  }

}
