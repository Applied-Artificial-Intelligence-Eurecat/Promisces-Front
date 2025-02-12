import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError, of, lastValueFrom } from 'rxjs';
import { Substance, SubstanceDetailSearch, SubstanceSortEnum } from '../models/substance';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { BodyRequest, BodyRequestCriteriaFilters, BodyRequestFilters } from '../models/bodyRequest';
import { SelectItem } from 'primeng/api';
import { PageResponse } from '../models/pageResponse';
import { CERoute } from '../models/ceRoute';

@Injectable({
  providedIn: 'root'
})
export class SubstanceService {

  constructor(private http: HttpClient,
    private apiService: ApiService) { }

  retrieveSubstanceDetail(substanceDetailSearch: SubstanceDetailSearch): Observable<any> {
    return this.apiService.getSubstanceDetail(substanceDetailSearch).pipe(
      map((substance: Substance) =>  {
        // If request fails, throw an Error that will be caught
        if(substance !== undefined && substance.nameSynonyms) {
          substance.substanceName = substance.nameSynonyms && substance.nameSynonyms.length>0 ? substance.nameSynonyms[0] : '';
          // Round all numerical values to 2 decimals
          Object.keys(substance).forEach(key => {
            const value = substance[key as keyof Substance];
            if (typeof value === 'number') {
              substance[key as keyof Substance] = Number(value.toFixed(2));
            }
            // Handle numerical values in numericalData object
            if (key === 'numericalData' && value) {
              Object.keys(value).forEach(numKey => {
                if (typeof value[numKey] === 'number') {
                  value[numKey] = Number(value[numKey].toFixed(2));
                }
              });
            }
          });
          return substance;
        } else {
          return undefined;
        }}),
        catchError(error => {
          return error(error);
        }));
  }

  retrieveSubstances(request: BodyRequest): Observable<any> {
    return this.apiService.getSubstancesAll(request).pipe(
      map((response: any) =>  {
        // If request fails, throw an Error that will be caught
        if(response !== null && response !== undefined) {
          if (response?.data && response.data?.length>0) {
            response.data.map((substance: Substance) => {
              substance.substanceName = substance.nameSynonyms && substance.nameSynonyms.length>0 ? substance.nameSynonyms[0] : '';
              return substance;
            });
          }
          return response;
        } else {
          return new PageResponse<Substance>();
        }}),
        catchError(error => {
          console.log('error retrieving substances');
          return error(error);
        }));
  }

  retrieveSimilarSubstanceNames(request: BodyRequestFilters) {
    return this.apiService.getAutocompletedSubstances(request).pipe(
      map((response: any) =>  {
        return response;
      }),
      catchError(error => {
        console.log('error retrieving similar substances');
        return error(error);
      }));
  }

  retrieveSimilarSubstances(substanceDetailSearch: SubstanceDetailSearch) {
    return this.apiService.getSimilarsSubstances(substanceDetailSearch).pipe(
      map((response: any) =>  {
        return response;
      }),
      catchError(error => {
        console.log('error retrieving similar substances');
        return error(error);
      }));
  }

  retrieveAverageScore(substanceDetailSearch: SubstanceDetailSearch = new SubstanceDetailSearch()) {
    return this.apiService.getSubstanceAverageScore(substanceDetailSearch).pipe(
      map((response: any) =>  {
        return response;
      }),
      catchError(error => {
        console.log('error retrieving average score');
        return error(error);
      }));
  }

  retrieveSubstancesSearch(request: BodyRequest, filters: BodyRequestFilters) {
    return this.apiService.getSubstancesSearch(request, filters).pipe(
      map((response: any) =>  {
        // If request fails, throw an Error that will be caught
        if(response !== null && response !== undefined) {
          if (response?.data && response.data?.length>0) {
            response.data.map((substance: Substance) => {
              substance.substanceName = substance.nameSynonyms && substance.nameSynonyms.length>0 ? substance.nameSynonyms[0] : '';
              return substance;
            });
          }
          return response;
        } else {
          return new PageResponse<Substance>();
        }}),
        catchError(error => {
          console.log('error retrieving substances');
          return error(error);
        }));
  }

  retrieveSubstancesByCriteries(filters: BodyRequestCriteriaFilters) {
    return this.apiService.getSubstancesRelevance(filters).pipe(
      map((response: any) =>  {
        // If request fails, throw an Error that will be caught
        if(response !== null && response !== undefined) {
          if (response?.data && response.data?.length>0) {
            response.data.map((substance: Substance) => {
              substance.substanceName = substance.nameSynonyms && substance.nameSynonyms.length>0 ? substance.nameSynonyms[0] : '';
              return substance;
            });
          }
          return response;
        } else {
          return new PageResponse<Substance>();
        }}),
      catchError(error => {
        console.log('error retrieving substances relevance');
        return error(error);
      }));
  }

  retrieveSubstanceGroupAll(): Observable<any> {
    return this.apiService.getSubstanceGroupAll().pipe(
      map(response => response?.content ? response.content : []),
      catchError(error => {
        console.log('error retrieving getSubstanceGroupAll');
        return error(error);
      }));
  }

  async retrieveCeRouteAll() {
    let mockResponse: any = await lastValueFrom(this.apiService.getCeRoutes());
    let mockList: Array<CERoute> = mockResponse?.content ? mockResponse.content : [];
    return this.apiService.getRoutesAll().pipe(
      map(response => {
        let res = response?.content ? response.content : response;
        return res ?
        res.map((route: CERoute) => {
          route.description = mockList.length>0 ? mockList.find(r => r.name == route.name)?.description : '';
          return route;
        })
       : []
      }),
      catchError(error => {
        console.log('error retrieving getRoutesAll');
        return error(error);
      }));
  }

  retrieveChemicalClassAll(): Observable<any> {
    return this.apiService.getChemicalClassAll().pipe(
      map(response => response ? response : []),
      catchError(error => {
        console.log('error retrieving getChemicalClassAll');
        return error(error);
      }));
  }

  retrieveSectorOfUseAll(): Observable<any> {
    return this.apiService.getSectorsAll().pipe(
      map(response => response ? response : []),
      catchError(error => {
        console.log('error retrieving getSubstanceSectorAll');
        return error(error);
      }));
  }

  transformSubstanceSortEnumIntoDropdownOptions(): SelectItem[] {
    return Object.keys(SubstanceSortEnum)
      .filter(item => isNaN(Number(item)))
      .map(key => {
        console.log('key ' + (SubstanceSortEnum as any)[key]);
        return { label: key, value: (SubstanceSortEnum as any)[key] as any };
      });
  }

  retrieveAPDashboardFile(): Observable<any> {
    return this.apiService.getAPDashboardFile().pipe(
      map(response => {
        return response ? response : null;
      }),
      catchError(error => {
        console.log('error retrieving file');
        return error(error);
      }));
  }

  retrieveDataViolinChart(): Observable<any> {
    return this.apiService.getDataViolinChart().pipe(
      map(response => response ? response : null),
      catchError(error => {
        console.log('error retrieving data violin chart');
        return error(error);
      }));
  }

  retrieveDataTargetedChemical(): Observable<any> {
    return this.apiService.getDataTargetedChemical().pipe(
      map((response: any) =>  {
        // If request fails, throw an Error that will be caught
        if(response !== null && response !== undefined) {
          if (response?.data && response.data?.length>0) {
            response.data.map((substance: Substance) => {
              substance.substanceName = substance.nameSynonyms && substance.nameSynonyms.length>0 ? substance.nameSynonyms[0] : '';
              return substance;
            });
          }
          return response;
        } else {
          return new PageResponse<Substance>();
        }}),
      catchError(error => {
        console.log('error retrieving data targeted chemical');
        return error(error);
      }));
  }

  retrieveDataSolutionTreatment(): Observable<any> {
    return this.apiService.getDataSolutionTreatment().pipe(
      map(response => response ? response : null),
      catchError(error => {
        console.log('error retrieving data treatment');
        return error(error);
      }));
  }

  retrieveDataFactsheets(): Observable<any> {
    return this.apiService.getDataFactsheets().pipe(
      map(response => response?.content ? response.content : []),
      catchError(error => {
        console.log('error retrieving data factsheets');
        return error(error);
      }));
  }

  toCsv(substances: Substance[], comma: boolean) {
    // Get all properties from Substance class
    const headers = Object.keys(substances[0])
      .reduce((acc: string[], prop) => {
        const descriptor = Object.getOwnPropertyDescriptor(substances[0], prop);
        if (!descriptor) {
          return acc;
        }

        const { value } = descriptor;

        // Handle primitive values
        if (typeof value !== 'object' || value === null) {
          acc.push(prop);
          return acc;
        }

        // Skip arrays
        if (Array.isArray(value)) {
          return acc;
        }

        // Handle nested objects
        if (typeof value === 'object') {
          const nestedProps = Object.getOwnPropertyNames(value)
            .map(nestedProp => `${nestedProp}`);
          acc.push(...nestedProps);
        }

        return acc;
      }, [] as string[]);

    // Create CSV content
    const separator = comma ? ',' : ';';
    let csvContent = headers.join(separator) + '\n';

    // Add data rows
    substances.forEach(substance => {
      const row = headers.map(header => {
        let value = substance[header as keyof Substance];
        if (value === undefined) {
          // Check nested objects
          for (let key in substance) {
            if (typeof substance[key as keyof Substance] === 'object' && substance[key as keyof Substance] !== null) {
              const nestedValue = substance[key as keyof Substance][header as keyof Substance];
              if (nestedValue !== undefined) {
                value = nestedValue;
                break;
              }
            }
          }
        }
        // Handle arrays, objects and null values
        if (Array.isArray(value)) {
          return `"${value.join(separator)}"`;
        } else if (typeof value === 'object' && value !== null) {
          // Extract just the values from nested object
          const objValues = Object.values(value);
          return `"${objValues.join(separator)}"`;
        } else if (value === null || value === undefined) {
          return '';
        } else {
          // Escape quotes and wrap in quotes if contains separator
          const stringValue = String(value);
          return stringValue.includes(separator) ?
            `"${stringValue.replace(/"/g, '""')}"` :
            stringValue;
        }
      });
      csvContent += row.join(separator) + '\n';
    });
    return csvContent;
  }

}
