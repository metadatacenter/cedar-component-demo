import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

/**
 * What the demo reads out of `appConfig.json`. Only `ceeConfig` is handed to the
 * editor; CEE decides for itself which keys inside it it recognises.
 */
export interface DemoAppConfig {
  ceeConfig: Record<string, unknown>;
}

/** A CEDAR template, as far as this demo is concerned: JSON it passes through. */
export type CedarTemplate = Record<string, unknown>;

@Injectable()
export class AppConfigService {
  private readonly http = inject(HttpClient);

  appConfig: DemoAppConfig | null = null;
  template: CedarTemplate | null = null;

  async loadAppConfig(): Promise<void> {
    this.appConfig = await firstValueFrom(
      this.http.get<DemoAppConfig>('/assets/data/appConfig.json')
    );
    this.template = await firstValueFrom(
      this.http.get<CedarTemplate>('/assets/data/template.json')
    );
  }
}
