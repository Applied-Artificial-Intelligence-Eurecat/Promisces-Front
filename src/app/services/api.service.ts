import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ErrorObserver, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BodyRequest, BodyRequestCriteriaFilters, BodyRequestFilters } from '../models/bodyRequest';
import { Substance, SubstanceDetailSearch, SubstanceAverageScore } from '../models/substance';
import { Solution } from '../models/solution';
import { Strategy } from '../models/strategy';
import { SectorOfUse } from '../models/sectorOfUse';
import { CERoute } from '../models/ceRoute';

@Injectable()
export class ApiService {

  constructor(
    public httpClient: HttpClient) { }

    private url(suffix: string) {
        return environment.apiUrl + suffix;
    }

    private retrieveHttpOptions() {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json'
            }),
            withCredentials: true,
            params: new HttpParams(),
            body: new BodyRequestFilters()
          };
          return httpOptions;
    }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = 'Error: ' + error.error.message;
    } else {
      // server-side error
      errorMessage = 'Error Code: ' + error.status + 'Message: ' + error.message;
    }
    //window.alert(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /** Get all the substances */
  getSubstancesAll(request: BodyRequest): Observable<any> {
    const pageSize = request.pageSize ? request.pageSize : 1000;
    const pageNum = request.page ? request.page : 1;
    return this.httpClient.get<any>(this.url(`/substances/?pagenum=${pageNum}&perpage=${pageSize}`), this.retrieveHttpOptions());//.pipe(catchError(err => of([])));
  }

  /** Return the Substances that match the attributes passed  */ /**BodyRequestFilters or BodyRequest */
  getSubstancesSearch(request: BodyRequest, filters: BodyRequestFilters): Observable<any> {
    const pageSize = request.pageSize ? request.pageSize : 1000;
    const pageNum = request.page ? request.page : 1;
    return this.httpClient.post<any>(this.url(`/substances/search/?pagenum=${pageNum}&perpage=${pageSize}`), filters, this.retrieveHttpOptions())
    /*.pipe(
      switchMap(res => res.status === 204 ? (console.log('status ' + res.status), of([]) ) : of(res))
    )*/;//.pipe(catchError(err => of([])));
  }

  getAutocompletedSubstances(filters: BodyRequestFilters): Observable<any> {
    const name = filters.substance_name ? filters.substance_name : '';
    return this.httpClient.get<any>(this.url(`/substances/autocomplete/?name=${name}`), this.retrieveHttpOptions());
  }

  /** Get a list of substances that are similar to the substance passed as parameter */
  getSimilarsSubstances(substanceDetailSearch: SubstanceDetailSearch): Observable<any> {
    return this.httpClient.post<any>(this.url(`/substances/similarSubstances/`), substanceDetailSearch, this.retrieveHttpOptions());
  }

  /** Get a substance given either its name or its cas */
  getSubstanceDetail(substanceDetailSearch: SubstanceDetailSearch): Observable<Substance> {
    return this.httpClient.post<Substance>(this.url('/substances/details/'), substanceDetailSearch, this.retrieveHttpOptions());
  }

  /** Get the average score of a substance */
  getSubstanceAverageScore(substanceDetailSearch: SubstanceDetailSearch): Observable<SubstanceAverageScore[]> {
    return this.httpClient.post<SubstanceAverageScore[]>(this.url('/substances/averagescores/'), substanceDetailSearch, this.retrieveHttpOptions());
  }

  /** Get a list of substances that match certain attributes  */
  getSubstancesAssessment(filters: BodyRequestFilters): Observable<any> {
    let params = new HttpParams();
    params.set('ce_route', filters.ce_route);
    params.set('sector_of_use', filters.use_sector);
    params.set('chemical_class', filters.chemical_class);
    const options = this.retrieveHttpOptions();
    options.params = params;
    return this.httpClient.get<any>(this.url('/substances/assessment'), options);//.pipe(catchError(err => of([])));
  }

  /** Return the Substances sorted by criteria given  */
  getSubstancesRelevance(filters: BodyRequestCriteriaFilters): Observable<any> {
    return this.httpClient.post<any>(this.url('/substances/relevance/'), filters, this.retrieveHttpOptions());//.pipe(catchError(err => of([])));
  }

  /** Get all the solutions  */
  getSolutionsAll(): Observable<any> {
    const options = this.retrieveHttpOptions();
    return this.httpClient.get<any>(this.url('/solutions'), options);//.pipe(catchError(err => of([])));
  }

  /** Get a solution given its name  */
  getSolutionByName(solutionName: string): Observable<Solution> {
    let params = new HttpParams();
    params.set('name', solutionName);
    const options = this.retrieveHttpOptions();
    options.params = params;
    return this.httpClient.get<Solution>(this.url('/solution/details'), options);
  }

  /** Get list of all strategies */
  getStrategiesAll(): Observable<any> {
    const options = this.retrieveHttpOptions();
    return this.httpClient.get<any>(this.url('/strategies/'), options);//.pipe(catchError(err => of([])));
  }

  /** Get a strategy by name */
  getStrategyByName(strategyName: string): Observable<Strategy> {
    let params = new HttpParams();
    params.set('name', strategyName);
    const options = this.retrieveHttpOptions();
    options.params = params;
    return this.httpClient.get<Strategy>(this.url('/strategies/details/'), options);
  }

  /** Get a list of related strategies to a substance by substance_name or substance_cas */
  getStrategiesRelated(substanceName: string): Observable<any> {
    let params = new HttpParams();
    params.set('substance_name', substanceName);
    //params.set('substance_cas', substanceCas);
    const options = this.retrieveHttpOptions();
    options.params = params;
    return this.httpClient.get<any>(this.url('/strategies/related'), options);
  }

  /** Get a list of all Sectors of use */
  getSectorsAll(): Observable<any> {
    return this.httpClient.get<any>(this.url('/sectors/'), this.retrieveHttpOptions());//.pipe(catchError(err => of([])));
  }

  /** Get a Sector of use by name */
  getSectorByName(sectorName: string): Observable<SectorOfUse> {
    let params = new HttpParams();
    params.set('name', sectorName);
    const options = this.retrieveHttpOptions();
    options.params = params;
    return this.httpClient.get<SectorOfUse>(this.url('/sectors/details/'), options);
  }

  /** Get list of all CE routes */
  getRoutesAll(): Observable<any> {
    const options = this.retrieveHttpOptions();
    //return this.httpClient.get<any>('/assets/json/ceRoutes.json');
    return this.httpClient.get<any>(this.url('/routes/'), options);//.pipe(catchError(err => of([])));
  }

  /** Get a list of all chemical classes */
  getChemicalClassAll(): Observable<any> {
    const options = this.retrieveHttpOptions();
    return this.httpClient.get<any>(this.url('/substances/chemicalclasses/'), options);//.pipe(catchError(err => of([])));
  }

  getDataViolinChart(): Observable<any> {
    const options = this.retrieveHttpOptions();
    return this.httpClient.get<any>(this.url('/substances/violinplot/'), options);//.pipe(catchError(err => of([])));
  }

  getDataTargetedChemical(): Observable<any> {
    const options = this.retrieveHttpOptions();
    //return this.httpClient.get<any>('/assets/json/targetedchemicalMockdata.json');
    return this.httpClient.get<any>(this.url('/substances/targetedchemical/'), options);
  }

  getSubstanceGroupAll(): Observable<any> {
    return this.httpClient.get<any>('/assets/json/substanceGroup.json');
  }

  getDataSolutionTreatment(): Observable<any> {
    return this.httpClient.get<any>('/assets/json/solutionTreatmentData.json');
  }

  getDataFactsheets(): Observable<any> {
    return this.httpClient.get<any>('/assets/json/factsheets.json');
  }

  getSubstancesIPMTMethodData(): Observable<any> {
    return this.httpClient.get<any>('/assets/json/solutionMonitoringIPMT.json');
  }

  getSubstancesPFASMethodData(): Observable<any> {
    return this.httpClient.get<any>('/assets/json/solutionMonitoringPFAS.json');
  }

  getDataMatricesAndLimits(): Observable<any> {
    return this.httpClient.get<any>('/assets/json/matricesAndLimits.json');
  }

  getCeRoutes(): Observable<any> {
    return this.httpClient.get<any>('/assets/json/ceRoutes.json');
  }

  /** Get a CE Route by name */
  getRouteByName(routeName: string): Observable<CERoute> {
    let params = new HttpParams();
    params.set('name', routeName);
    const options = this.retrieveHttpOptions();
    options.params = params;
    return this.httpClient.get<CERoute>(this.url('/routes/details'), options);
  }

  getStrategyFile() {
    return this.httpClient.get(`/assets/files/strategy.pdf`, {
      responseType: 'arraybuffer',
      headers: new HttpHeaders().append('Content-Type', 'application/pdf'),
    });
  }

  getAPDashboardFile() {
    return this.httpClient.get(`/assets/files/SimpleBox4.0_SB_AP_Dashboard.xlsm`, {
      responseType: 'arraybuffer',
      headers: new HttpHeaders().append('Content-Type', 'application/xls'),
    });
  }
}
