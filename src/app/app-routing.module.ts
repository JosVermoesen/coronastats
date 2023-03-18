import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyLineChartComponent } from './modules/charts/my-line-chart/my-line-chart.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./modules/about/about.module').then((m) => m.AboutModule),
  },
  {
    path: 'corona',
    loadChildren: () =>
      import('./modules/corona/corona.module').then((m) => m.CoronaModule),
  },
  { path: 'chart', component: MyLineChartComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
