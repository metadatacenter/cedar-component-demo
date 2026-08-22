import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AppConfigService {
  public appConfig;
  public template;

  constructor(private http: HttpClient) {
  }

  loadAppConfig(): object {
    return this.http.get('/assets/data/appConfig.json')
      .toPromise()
      .then(data => {
        this.appConfig = data;
      })
      .then(() => this.http.get('/assets/data/template.json').toPromise())
      .then(template => {
        this.template = template;
      });
  }

  getConfig(): object {
    return this.appConfig;
  }
}
