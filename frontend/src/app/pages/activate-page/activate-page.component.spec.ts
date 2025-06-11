import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatePageComponent } from './activate-page.component';

describe('ActivatePageComponent', () => {
  let component: ActivatePageComponent;
  let fixture: ComponentFixture<ActivatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
