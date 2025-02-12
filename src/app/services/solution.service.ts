import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError, of } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SolutionService {

  constructor(
    private apiService: ApiService) { }

  retrieveSubstancesIPMTMethodData(): Observable<any> {
    return this.apiService.getSubstancesIPMTMethodData().pipe(
      map(response => response?.content ? response.content : []),
      catchError(error => {
        console.log('error retrieving data iPMT');
        return error(error);
      }));
  }

  retrieveSubstancesPFASMethodData() {
    return this.apiService.getSubstancesPFASMethodData().pipe(
      map(response => response?.content ? response.content : []),
      catchError(error => {
        console.log('error retrieving data PFAS');
        return error(error);
      }));
  }

  retrieveDataMatricesAndLimits() {
    return this.apiService.getDataMatricesAndLimits().pipe(
      map(response => response?.content ? response.content : []),
      catchError(error => {
        console.log('error retrieving data matrices and limit');
        return error(error);
      }));
  }

  retrieveCeRoute(): Observable<any> {
    return this.apiService.getCeRoutes().pipe(
      map(response => response?.content ? response.content : []),
      catchError(error => {
        console.log('error retrieving routes');
        return error(error);
      }));
  }

}
