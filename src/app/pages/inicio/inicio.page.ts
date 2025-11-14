import { Component, OnInit } from '@angular/core';
import { PersonajesService } from '../../services/personajes'; 
import { Personaje } from '../../componentes/interfaces/interfaces'; 
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { filter, switchMap, take } from 'rxjs'; 

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})

export class InicioPage implements OnInit {
  
  
  personajes: Personaje[] = [];
  cargando: boolean = true;

  constructor(private personajesService: PersonajesService) {}

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
        console.log('[Inicio] Personajes cargados:', this.personajes.length);
      },
      error: (error: any) => { 
        this.cargando = false;
        console.error('[Inicio] Error al cargar personajes:', error);
      }
    });
  }
}