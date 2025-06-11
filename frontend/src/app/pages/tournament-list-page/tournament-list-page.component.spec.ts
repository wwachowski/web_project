import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentListPageComponent } from './tournament-list-page.component';

describe('TournamentListPageComponent', () => {
  let component: TournamentListPageComponent;
  let fixture: ComponentFixture<TournamentListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TournamentListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
