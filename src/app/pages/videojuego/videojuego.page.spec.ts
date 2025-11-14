import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideojuegoPage } from './videojuego.page';

describe('VideojuegoPage', () => {
  let component: VideojuegoPage;
  let fixture: ComponentFixture<VideojuegoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VideojuegoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
