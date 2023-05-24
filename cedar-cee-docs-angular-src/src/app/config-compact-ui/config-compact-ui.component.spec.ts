import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ConfigCompactUIComponent} from './config-compact-u-i.component';

describe('ConfigCompactUIComponent', () => {
  let component: ConfigCompactUIComponent;
  let fixture: ComponentFixture<ConfigCompactUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigCompactUIComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigCompactUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
