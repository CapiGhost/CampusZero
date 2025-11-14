import { Component } from '@angular/core';

interface Elemento {
  icono: string;
  nombre: string;
  ruta: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  
  elementos: Elemento[] = [
    {
      
      icono: 'business-outline', 
      nombre: 'Inicio',
      ruta: '/inicio'
    },
    {
      
      icono: 'game-controller-outline', 
      nombre: 'Videojuego',
      ruta: '/videojuego'
    },
    {
      
      icono: 'chatbubbles-outline', 
      nombre: 'Contacto',
      ruta: '/contacto'
    },
    {
      
      icono: 'people-circle-outline', 
      nombre: 'Comunidad',
      ruta: '/comunidad'
    }
  ];

  constructor() {}
  
}