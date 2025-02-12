export class Sample {
  id?: number;
  sampleMatrix?: string;
  sampleMatrixType?: string;
  concentration?: number;
  samplingDate?: string;
  limitOfDetection?: number;
  limitOfQuantification?: number;
  stationName?: string;
}

export class SampleSubstance extends Sample {
  substanceName!: string;
  casNumber?: string;
  t?: any;
  ph?: any;
  dataSource?: any;
}
