import { Substance } from "./substance";

export class CERoute {
  id?: string;
  name?: string;
  description?: string;//no
  relatedSubstances?: Array<Substance>;//no
}

export class CERouteMatrix extends CERoute {
  relatedMatrices?: Array<string>;
}

export interface MatrixLimit {
  matrix: string;
  limit: number | null;
}

