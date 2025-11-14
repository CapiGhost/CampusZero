import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, ParamMap } from '@angular/router'; 
import { PersonajesService } from '../../services/personajes'; 
import { Personaje, RespuestaDetalle } from '../../componentes/interfaces/interfaces'; 
import { CommonModule } from '@angular/common'; 
import { IonicModule } from '@ionic/angular'; 
import { switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs'; 

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
})
export class DetalleComponent implements OnInit {

  personaje: Personaje | null = null;
  cargando: boolean = true;
  idPersonaje: string | null = null;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private personajesService: PersonajesService 
  ) { }

  ngOnInit() {
   
    this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap): Observable<{ data: Personaje } | null> => { 
        this.idPersonaje = params.get('id');
        this.cargando = true;
        console.log('[Detalle] Intentando cargar ID:', this.idPersonaje); 

        if (this.idPersonaje) {
            return this.personajesService.getDetalle(this.idPersonaje); 
        } else {
           
            return of(null);
        }
      })
    ).subscribe({
      next: (resp: RespuestaDetalle | null) => { 
        if (resp && resp.data) {
          this.personaje = resp.data;
          console.log('[Detalle] Carga exitosa:', this.personaje?.nombre);
        } else {
          this.personaje = null;
          console.warn('[Detalle] No se recibió data válida del servicio.');
        }
        this.cargando = false;
      },
      error: (error) => {
        this.cargando = false;
        this.personaje = null;
        console.error('[Detalle] Error en la suscripción del Observable:', error);
      }
    });
  }
}