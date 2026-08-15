// app/routes/application.js

import Route from '@ember/routing/route';

export default class ApplicationRoute extends Route {
  // The template this demo edits ships with the application, under public/data/.
  async model() {
    const response = await fetch('/data/template.json');
    return {
      conf: { showDownloadMenu: true },
      template: await response.json(),
    };
  }
}
