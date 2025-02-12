export class BodyRequest {
  sortBy!: string;
  sortAsc!: boolean;
  pageSize!: number;
  offset!: number; //offset or page
  page?: number;
  filters!: { [name: string]: any };
}

export class BodyRequestFilters {
  substance_name!: string;
  substance_cas!: string;
  solution_type!: string;
  solution_name!: string;
  substance_group!: any;
  ce_route!: any;
  chemical_class!: any;
  use_sector!: string; //code
  followed_strategy!: any;
  addressed_application!: string;
  prediction!: any;
  experimental!: any;
  inchikey!: string;
}

export class BodyRequestCriteriaFilters {
  persistence!: number;
  mobility!: number;
  toxicity!: number;
  //potential_environment_emissions!: string;
}
