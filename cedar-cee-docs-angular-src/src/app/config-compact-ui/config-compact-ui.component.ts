import {Component, OnInit} from '@angular/core';
import {AppConfigService} from '../services/app-config.service';

@Component({
  selector: 'app-config-compact-ui',
  templateUrl: './config-compact-ui.component.html',
  styleUrls: ['./config-compact-ui.component.scss']
})
export class ConfigCompactUIComponent implements OnInit {

  confService: AppConfigService = null;

  configuration = {
    sampleTemplateLocationPrefix: 'https://component.staging.metadatacenter.org/cedar-embeddable-editor-sample-templates/',
    loadSampleTemplateName: '29',
    showSampleTemplateLinks: true,
    showTemplateRenderingRepresentation: true,
    showInstanceDataCore: true,
    showMultiInstanceInfo: true,
  };

  constructor() {
  }

  ngOnInit(): void {
  }

}
