import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { AppConfigService } from '../services/app-config.service';

// The component reads the configuration the service loaded, so the test supplies a
// service already holding one. `cedar-embeddable-editor` is a custom element, which
// the schema admits the same way AppModule does.
class StubAppConfigService {
  appConfig = { ceeConfig: {} };
  template = {};
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      providers: [ { provide: AppConfigService, useClass: StubAppConfigService } ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
