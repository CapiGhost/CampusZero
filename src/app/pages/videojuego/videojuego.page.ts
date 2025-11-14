import { Component, OnInit } from '@angular/core';
import { PersonajesService } from '../../services/personajes'; 
import { Personaje } from '../../componentes/interfaces/interfaces'; 
import { Router } from '@angular/router';
import { filter, switchMap, take } from 'rxjs'; 

@Component({
  selector: 'app-videojuego',
  standalone: false,
  templateUrl: './videojuego.page.html',
  styleUrls: ['./videojuego.page.scss'],
})
export class VideojuegoPage implements OnInit {
  
  personajes: Personaje[] = [];
  cargando: boolean = true;

  // Propiedades para controlar el modal de imagen
  modalAbierto: boolean = false;
  imagenSeleccionada: string = '';
  
  constructor(
    private personajesService: PersonajesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarPersonajes();
  }

  cargarPersonajes() {
    this.cargando = true;
    
    this.personajesService.isReady$.pipe(
      filter(isReady => isReady),
      switchMap(() => this.personajesService.getDatos()),
      take(1)
    ).subscribe({
      next: (resp: Personaje[]) => { 
        this.personajes = resp;
        this.cargando = false;
        console.log('[Videojuego] Personajes cargados:', this.personajes.length);
      },
      error: (error: any) => {
        this.cargando = false;
        console.error('[Videojuego] Error al cargar personajes:', error);
      }
    });
  }

  // Lógica para el modal de imagen
  mostrarImagenAmpliada(avatarUrl: string) {
    this.imagenSeleccionada = avatarUrl;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.imagenSeleccionada = '';
  }
}