import {ComponentFixture, TestBed} from '@angular/core/testing';
import {WaitHiddenComponent} from './wait-spinner.component';

describe('WaitSpinnerComponent', () => {
  let component: WaitHiddenComponent;
  let fixture: ComponentFixture<WaitHiddenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WaitHiddenComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitHiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
