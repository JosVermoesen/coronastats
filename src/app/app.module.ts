import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { LanguageService } from './global/language.service';
import { LanguageComponent } from './global/navbar/language/language.component';
import { FooterComponent } from './global/footer/footer.component';
import { NavbarComponent } from './global/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    LanguageComponent,
    NavbarComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CarouselModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    ModalModule.forRoot(),
    FontAwesomeModule,
    AppRoutingModule,
  ],
  providers: [
    LanguageService,
    BsModalRef,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  entryComponents: [LanguageComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
