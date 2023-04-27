import {Component, OnInit} from '@angular/core';
import {AppConfigService} from '../services/app-config.service';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent implements OnInit {

  code1 = `{
    "sampleTemplateLocationPrefix": "https://component.metadatacenter.org/cedar-embeddable-editor-sample-templates/",
    "loadSampleTemplateName": "01",

    "showSampleTemplateLinks": true,
    "expandedSampleTemplateLinks": true,

    "showFooter": true,
    "showHeader": true,

    "terminologyProxyUrl": "https://api-php.cee.metadatacenter.org/index.php",

    "showTemplateRenderingRepresentation": true,
    "showMultiInstanceInfo": true,
    "showTemplateSourceData": true,
    "showInstanceDataCore": true,
    "showInstanceDataFull": true,

    "expandedInstanceDataCore": true,
    "expandedInstanceDataFull": true,
    "expandedTemplateSourceData": true,
    "expandedTemplateRenderingRepresentation": true,
    "expandedMultiInstanceInfo": true
  }
`;

  code2 = `<cedar-embeddable-editor
  [config]="configurationObject"
></cedar-embeddable-editor>
`;

  constructor() {
  }

  ngOnInit(): void {
  }

}
