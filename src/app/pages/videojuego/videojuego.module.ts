import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; 
import { IonicModule } from '@ionic/angular';

import { VideojuegoPage } from './videojuego.page';
import { VideojuegoPageRoutingModule } from './videojuego-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideojuegoPageRoutingModule,
    RouterModule 
  ],
  declarations: [VideojuegoPage]
})
export class VideojuegoPageModule {}