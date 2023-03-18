import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgChartsModule } from 'ng2-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CoronaService } from './corona.service';

import { CoronaRoutingModule } from './corona-routing.module';
import { CoronaComponent } from './corona.component';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [CoronaComponent],
  imports: [
    CommonModule,
    CoronaRoutingModule,    
    SharedModule.forRoot(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    FontAwesomeModule,
    TabsModule.forRoot(),
    NgChartsModule,
  ],
})
export class CoronaModule {}
