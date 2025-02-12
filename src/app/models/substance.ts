import { CERoute } from "./ceRoute";
import { Sample } from "./sample";
import { SectorOfUse } from "./sectorOfUse";
import { Solution } from "./solution";
import { SubstanceGroup } from "./substanceGroup";

export class Substance {
  id?: string | number;
  substanceName!: string;
  casNumber?: string;
  promiscesID?: string;
  normanSusDatId?: string;
  inchikey?: string;
  canonicalSmiles?: string;
  nameSynonyms?: Array<string>;
  chemicalClasses?: Array<string>;
  group?: SubstanceGroup;
  persistence?: number | string;
  mobility?: number | string;
  toxicity?: number | string;
  potentialEnvironmentEmissions?: number | string;
  addressedApplication?: string;
  conservativeClassification?: string;
  robustClassification?: string;
  averageClassification?: string;
  numericalData?: any;
  concentrationValues?: {string: Array<number>};
  relatedSolutions?: Array<any>;
  sectorsOfUse?: Array<SectorOfUse>;
  ceRoutes?: Array<CERoute>;
  samples?: Array<Sample>;


  substanceGroup?: string;
  substanceSector!: string;
  chemicalClass!: string;
  solutions?: Array<Solution>;
  solutionType?: string;
  solutionName?: string;
  solutionCeRoute?: string; // el ce route pertenece a solution class

  ecNumber?: string;
  priorityGroup?: string;
  priorityGroupDefinition?: string;
  biodegDashboard?: string;
  mobilityUBA?: string;
  mobilityExperimental?: string;
  mobilityPredicted?: string;
  persistenceDashboard?: string;
  persistenceSoil?: string;
  persistenceSediment?: string;
  persistenceAverage?: string;
  otherEmissionSources?: string;
  pUBAw?: string | number;
  pUBAs?: string | number;
  pUBAsed?: string | number;
  tclass?: string | number;
}

export class NumericalData {
  P_score_conservative?: number;
  P_score_average?: number;
  P_score_robust?: number;
  M_score_conservative?: number;
  M_score_average?: number;
  M_score_robust?: number;
  T_score_predicted?: number;
  T_score_predicted_rivm_average?: number;
  T_score_predicted_rivm_conservative?: number;
  Kemi_score?: number;
}

export enum SubstanceSortEnum {
  persistence = 'persistence',
  mobility = 'mobility',
  toxicity = 'toxicity',
  potentialEnvironmentEmissions = 'potentialEnvironmentEmissions'
}

export class SubstanceDetailSearch {
  name?: string;
  cas_n?: string;
  inchikey?: string;
  groupby?: string;
}

export class SubstanceAverageScore {
  itemName?: string;
  p?: number;
  m?: number;
  k?: number;
  numberOfSubstances?: number;
}
