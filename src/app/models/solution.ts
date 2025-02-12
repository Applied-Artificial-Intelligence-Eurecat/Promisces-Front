import { Strategy } from "./strategy";
import { Substance } from "./substance";

export class Solution {
  id?: string;
  name!: string;
  type!: string;
  addressedApplication!: string;
  ceRoute!: string;

  strategies!: Array<any>;//Strategy

  substances?: Array<any>; //Substance

  economicImpact?: number;
  ecologicalImpact?: number;
  risk?: number;
}

export class SolutionDetailSearch {
  name?: string;
}
