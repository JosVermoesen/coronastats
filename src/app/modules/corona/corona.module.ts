import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoronaRoutingModule } from './corona-routing.module';
import { CoronaComponent } from './corona.component';


@NgModule({
  declarations: [
    CoronaComponent
  ],
  imports: [
    CommonModule,
    CoronaRoutingModule
  ]
})
export class CoronaModule { }
