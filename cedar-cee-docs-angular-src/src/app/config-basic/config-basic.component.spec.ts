import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ConfigBasicComponent} from './config-basic.component';

describe('ConfigBasicComponent', () => {
  let component: ConfigBasicComponent;
  let fixture: ComponentFixture<ConfigBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigBasicComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
