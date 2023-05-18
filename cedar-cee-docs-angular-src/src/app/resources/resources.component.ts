import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  code = `
/MaterialIcons-Regular.eot
/MaterialIcons-Regular.ttf
/MaterialIcons-Regular.woff
/MaterialIcons-Regular.woff2

/assets/images/cedar-logo-80x80.png
/assets/images/bmir-logo.png
`

  constructor() {
  }

  ngOnInit(): void {
  }

}
