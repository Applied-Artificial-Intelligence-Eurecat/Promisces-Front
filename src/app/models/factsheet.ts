export interface Factsheet {
  number: string;
  ceRoute?: string | null;
  targetMedia: string;
  targetCompounds: string;
  categories: Array<string>;
  technologies: Array<string>;
  trl?: string;
  remediation?: Array<any>;
  cost?: string;
  energy?: string;
  link?: string;
  source?: string;
}
