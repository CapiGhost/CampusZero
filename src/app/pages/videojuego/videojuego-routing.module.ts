import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideojuegoPage } from './videojuego.page';

const routes: Routes = [
  {
    path: '',
    component: VideojuegoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideojuegoPageRoutingModule {}
