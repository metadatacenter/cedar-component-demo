import { ComponentFixture, TestBed } from '@angular/core/testing';

// The application imports the bundle from app.config.ts, which no spec loads. Without
// this the element is never upgraded and its shadow root stays empty.
import 'cedar-embeddable-editor/cedar-embeddable-editor.js';
import { DashboardComponent } from './dashboard.component';
import { AppConfigService } from '../services/app-config.service';
import appConfig from '../../assets/data/appConfig.json';
import template from '../../assets/data/template.json';

// The service is normally filled before startup by an initializer reading these two
// files over HTTP. This one is already filled, from the same files, so the specs
// exercise the configuration and template the demo actually ships.
class LoadedAppConfigService {
  appConfig = appConfig;
  template = template;
}

// CEE renders into an open shadow root, after its own asynchronous startup, which
// Angular's fixture knows nothing about. Poll rather than guess.
async function shadowTextOf(element: Element, contains: string): Promise<string> {
  for (let attempt = 0; attempt < 100; attempt++) {
    const text = element.shadowRoot?.textContent ?? '';
    if (text.includes(contains)) {
      return text;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return element.shadowRoot?.textContent ?? '';
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [{ provide: AppConfigService, useClass: LoadedAppConfigService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('places the editor and draws the host page around it', () => {
    const host: HTMLElement = fixture.nativeElement;

    expect(host.querySelector('cedar-embeddable-editor')).not.toBeNull();
    expect(host.querySelector('header.host-header')).not.toBeNull();
    expect(host.querySelector('footer.host-footer')).not.toBeNull();
  });

  it('gives the editor the bundled template to render', async () => {
    const editor = fixture.nativeElement.querySelector('cedar-embeddable-editor');
    const text = await shadowTextOf(editor, 'eDNA ECT Demonstration');

    expect(text).toContain('eDNA ECT Demonstration');
    expect(text).toContain('SpatialCoverage');
  });

  it('gives the editor a configuration it acts on', async () => {
    const editor = fixture.nativeElement.querySelector('cedar-embeddable-editor');
    await shadowTextOf(editor, 'eDNA ECT Demonstration');
    const icons = Array.from(editor.shadowRoot.querySelectorAll('mat-icon'), (icon: Element) =>
      icon.textContent?.trim()
    );

    // showDownloadMenu is the one visible flag the demo sets; without it CEE draws no
    // download control, so the icon is the evidence the configuration arrived.
    expect(icons).toContain('file_download');
  });
});
