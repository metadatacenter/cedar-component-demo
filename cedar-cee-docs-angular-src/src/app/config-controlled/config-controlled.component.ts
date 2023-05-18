import {Component, OnInit} from '@angular/core';
import {AppConfigService} from '../services/app-config.service';

@Component({
  selector: 'app-config-controlled',
  templateUrl: './config-controlled.component.html',
  styleUrls: ['./config-controlled.component.scss']
})
export class ConfigControlledComponent implements OnInit {

  confService: AppConfigService = null;

  configuration = {
    sampleTemplateLocationPrefix: 'https://component.metadatacenter.orgx/cedar-embeddable-editor-sample-templates/',
    loadSampleTemplateName: '43',
    terminologyProxyUrl: 'https://api-php.cee.staging.metadatacenter.org/index.php'
  };

  constructor() {
  }

  ngOnInit(): void {
  }

}
