import {Component, OnInit} from '@angular/core';
import {AppConfigService} from '../services/app-config.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {

  confService: AppConfigService = null;

  configuration = {
    sampleTemplateLocationPrefix: 'https://component.staging.metadatacenter.org/cedar-embeddable-editor-sample-templates/',
    loadSampleTemplateName: '01',
    showFooter: false
  };

  constructor(
    private configService: AppConfigService
  ) {
    this.confService = configService;
  }

  ngOnInit(): void {
  }

}
