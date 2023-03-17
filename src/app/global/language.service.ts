import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const LNG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  selected = '';

  constructor(private ts: TranslateService) {}

  setInitialAppLanguage() {
    const language = this.ts.getBrowserLang() || 'en';
    this.ts.setDefaultLang(language);

    const chosenLanguage = localStorage.getItem(LNG_KEY);
    if (!chosenLanguage) {
      this.setLanguage(language);
      this.selected = language;
    }
  }

  getLanguages() {
    return [
      {
        text: 'Nederlands',
        subtext: 'België, Nederland',
        value: 'nl',
        img: 'assets/images/flags/nl.png',
        enabled: true,
      },
      {
        text: 'Français',
        subtext: 'La Belgique, La France',
        value: 'fr',
        img: 'assets/images/flags/fr.png',
        enabled: true,
      },
      {
        text: 'Deutsch',
        subtext: 'Ostbelgien, Deutschland',
        value: 'de',
        img: 'assets/images/flags/de.png',
        enabled: true,
      },
      {
        text: 'English',
        subtext: 'Ireland, United Kingdom',
        value: 'en',
        img: 'assets/images/flags/ie.png',
        enabled: true,
      }, // ,
      /* {
        text: 'Pilipino',
        subtext: 'Pilipinas',
        value: 'ph',
        img: 'assets/images/flags/ph.png',
        enabled: false
      } */
    ];
  }

  setLanguage(lng: string) {
    this.ts.use(lng);
    this.selected = lng;
    localStorage.setItem(LNG_KEY, lng);
  }
}
