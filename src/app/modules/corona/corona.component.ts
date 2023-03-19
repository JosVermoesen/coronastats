import { Component } from '@angular/core';
import { faSpinner, faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { ChartType } from 'chart.js';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { environment } from 'src/environments/environment';
import { CoronaService } from './corona.service';
import { ICountry } from './models/country';
import { ICountryHistorical } from './models/countryHistorical';
import { IDayData } from './models/dayData';
import { ITimeline } from './models/timeline';
import { IWorld } from './models/world';

function setSelectedIndex(s: any, v: string) {
  for (let i = 0; i < s.options.length; i++) {
    if (s.options[i].text === v) {
      s.options[i].selected = true;
      console.log('found: ' + s.options[i].text);
      return;
    }
  }
}

@Component({
  selector: 'app-corona',
  templateUrl: './corona.component.html',
  styleUrls: ['./corona.component.scss'],
})
export class CoronaComponent {
  faSpinner = faSpinner;
  faPin = faThumbtack;

  apiWaiting = true;
  apiError = false;
  evalAvailable = false;

  evalDays = environment.daysEval;

  preferdCountry: string | null = '';
  preferdIsRefreshed = false;
  selectedCountryName!: string;
  selectedCountryIndex!: number;

  public coronaChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };

  coronaChartData: any;
  coronaEvalChartData: any;

  coronaGlobalNumbers: IWorld | null = null;
  coronaCountries!: ICountry[];
  coronaCountry: ICountry | null = null;
  countryHistorical!: ICountryHistorical;

  countryTimeline: ITimeline | null = null;

  public coronaChartLabels!: string[];
  public coronaChartType: ChartType = 'line';
  public coronaChartLegend = true;

  countryCases!: IDayData[];
  countryDeaths!: IDayData[];
  countryRecovered!: IDayData[];

  countryCasesOnDay: number[] = [];
  countryDeathsOnDay: number[] = [];
  countryRecoveredOnDay: number[] = [];

  globalLastUpdate: unknown;
  countryLastUpdate: unknown;

  graphLabel1!: string;
  graphLabel2!: string;
  // graphLabel3: string;

  constructor(private cs: CoronaService, private ts: TranslateService) {}

  ngOnInit(): void {
    this.getGlobalNumbers();
  }

  onSelect(data: TabDirective): void {
    this.evalAvailable = false;
    if (data.id === 'status') {
      if (this.preferdCountry !== '') {
        if (!this.preferdIsRefreshed) {
          setSelectedIndex(
            document.getElementById('thisCountry'),
            this.preferdCountry as string
          );
          this.preferdIsRefreshed = true;
        }
      }
    } else {
      if (data.id === 'graph') {
        this.prepareEvalGraph();
      }
    }
  }

  setDefaultCountry() {
    // Add to local storage
    localStorage.setItem(
      'coronaApi_DefaultCountryName',
      this.selectedCountryName
    );
    localStorage.setItem(
      'coronaApi_DefaultCountryIndex',
      this.selectedCountryIndex.toString()
    );
  }

  getAllCountries() {
    this.apiWaiting = true;
    this.cs.getAllCountries().subscribe({
      next: (data: ICountry[]) => {
        this.coronaCountries = data;
        this.preferdCountry = localStorage.getItem(
          'coronaApi_DefaultCountryName'
        );
        const tmpCountryIndex = localStorage.getItem(
          'coronaApi_DefaultCountryIndex'
        );

        if (this.preferdCountry) {
          this.selectedCountryName = this.preferdCountry;
          this.setCountryDetails(tmpCountryIndex ? +tmpCountryIndex : 0);
          this.getHistory(this.preferdCountry);
        } else {
          this.setCountryDetails(0);
        }
        this.apiWaiting = false;
        // console.log(this.coronaCountries);
      },
      error: (err) => {
        console.log(err);
        this.apiWaiting = false;
        this.apiError = true;
      },
    });
  }

  getGlobalNumbers() {
    this.apiWaiting = true;
    this.cs.getGlobal().subscribe({
      next: (data: IWorld) => {
        this.coronaGlobalNumbers = data;
        // console.log(this.coronaGlobalNumbers);
        this.globalLastUpdate = new Date(this.coronaGlobalNumbers.updated);
        this.getAllCountries();
        this.apiWaiting = false;
      },
      error: (err) => {
        console.log(err);
        this.apiWaiting = false;
        this.apiError = true;
      },
    });
  }

  setCountryDetailsWithTarget(target: any) {
    const indexInList: number = target.selectedIndex;
    if (indexInList) {
      this.setCountryDetails(indexInList);
    }
  }

  setCountryDetails(index: number) {
    // this.countryHistorical;
    if (this.coronaCountries) {
      this.coronaCountry = this.coronaCountries[index];
      this.selectedCountryName = this.coronaCountry.country;
      this.selectedCountryIndex = index;
      this.countryLastUpdate = new Date(this.coronaCountry.updated);
    }
  }

  getHistory(country: string) {
    this.cs.getCountryHistorical(country, this.evalDays).subscribe({
      next: (data: ICountryHistorical) => {
        this.countryHistorical = data;
        this.prepareGraph();
      },
      error: (err) => {
        console.log(err);
        this.coronaGlobalNumbers = null;
        this.apiError = true;
      },
    });
  }

  prepareGraph() {
    this.countryCases = Object.values(this.countryHistorical.timeline.cases);
    this.countryRecovered = Object.values(
      this.countryHistorical.timeline.recovered
    );
    this.countryDeaths = Object.values(this.countryHistorical.timeline.deaths);

    this.ts.get('CORONA.GraphLabel1').subscribe((res: string) => {
      this.graphLabel1 = res;
    });
    this.ts.get('CORONA.GraphLabel2').subscribe((res: string) => {
      this.graphLabel2 = res;
    });
    /* this.ts.get('CORONA.GraphLabel3').subscribe((res: string) => {
      this.graphLabel3 = res;
    }); */

    this.coronaChartData = [
      { data: this.countryCases, label: this.graphLabel1 },
      { data: this.countryDeaths, label: this.graphLabel2 },
      // { data: this.countryRecovered, label: this.graphLabel3 },
    ];
    this.coronaChartLabels = Object.keys(this.countryHistorical.timeline.cases);

    console.log(this.countryDeaths[this.countryDeaths.length - 1]);
    // console.log('Deathssum last 150 days till yesterday: ', this.countryDeaths);
  }

  prepareEvalGraph() {
    let casesCounter = 0;
    while (casesCounter < this.countryCases.length - 2) {
      const valueCases1 = Number(this.countryCases[casesCounter]);
      const valueCases2 = Number(this.countryCases[casesCounter + 1]);
      const valueCases3 = valueCases2 - valueCases1;
      this.countryCasesOnDay.push(valueCases3);
      casesCounter++;
    }

    let deathCounter = 0;
    while (deathCounter < this.countryDeaths.length - 2) {
      const valueDeaths1 = Number(this.countryDeaths[deathCounter]);
      const valueDeaths2 = Number(this.countryDeaths[deathCounter + 1]);
      const valueDeaths3 = valueDeaths2 - valueDeaths1;
      this.countryDeathsOnDay.push(valueDeaths3);
      deathCounter++;
    }

    /* let recoveredCounter = 0;
    while (recoveredCounter < this.countryRecovered.length - 2) {
      const valueRecovered1 = Number(this.countryRecovered[recoveredCounter]);
      const valueRecovered2 = Number(this.countryRecovered[recoveredCounter + 1]);
      const valueRecovered3 = valueRecovered2 - valueRecovered1;
      this.countryRecoveredOnDay.push(valueRecovered3)
      recoveredCounter++;
    } */

    this.coronaEvalChartData = [
      { data: this.countryCasesOnDay, label: this.graphLabel1 },
      { data: this.countryDeathsOnDay, label: this.graphLabel2 },
      // { data: this.countryRecoveredOnDay, label: this.graphLabel3 }
    ];
    this.coronaChartLabels = Object.keys(this.countryHistorical.timeline.cases);
    this.evalAvailable = true;
  }
}
