import {Component, OnInit} from '@angular/core';
import {AppConfigService} from '../services/app-config.service';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss']
})
export class RequirementsComponent implements OnInit {

  code = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>CEDAR Embeddable Editor Documentation</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <!-- youtube support -->
  <script src="https://www.youtube.com/iframe_api"></script>
</head>
<body>
<!-- This div is needed when targeting ES5. It will add the adapter to browsers that support customElements, which require ES6 classes -->
<div id="ce-es5-shim">
  <script type="text/javascript">
    if (!window.customElements) {
      const ceShimContainer = document.querySelector('#ce-es5-shim');
      ceShimContainer.parentElement.removeChild(ceShimContainer);
    }
  </script>
  <script type="text/javascript" src="node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"></script>
</div>

<!-- load the webcomponents loader, which injects the necessary polyfill bundle -->
<script type="text/javascript" src="node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>

<!-- load the component -->
<script type="text/javascript" src="https://component.metadatacenter.org/cedar-embeddable-editor/cedar-embeddable-editor-2.5.38.js"></script>
<app-root></app-root>
</body>
</html>
`

  constructor() {
  }

  ngOnInit(): void {
  }

}
