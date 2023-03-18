import { IDayData } from './dayData';

export interface ITimeline {
  cases: IDayData[];
  deaths: IDayData[];
  recovered: IDayData[];
}
