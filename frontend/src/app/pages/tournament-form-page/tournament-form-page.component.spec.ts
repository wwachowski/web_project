import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentFormPageComponent } from './tournament-form-page.component';

describe('TournamentFormPageComponent', () => {
  let component: TournamentFormPageComponent;
  let fixture: ComponentFixture<TournamentFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TournamentFormPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
