import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ConfigControlledComponent} from './config-controlled.component';

describe('ConfigControlledComponent', () => {
  let component: ConfigControlledComponent;
  let fixture: ComponentFixture<ConfigControlledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigControlledComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigControlledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
