import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SubstanceService } from '../services/substance.service';
import { Substance, SubstanceDetailSearch } from '../models/substance';
import { BodyRequest, BodyRequestFilters } from '../models/bodyRequest';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { PageResponse } from '../models/pageResponse';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pmt-identifier',
  templateUrl: './pmt-identifier.component.html',
  styleUrls: ['./pmt-identifier.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PmtIdentifierComponent implements OnDestroy {

  private subscriptions: Subscription[] = [];
  substanceNameSearch!: string;
  substanceCasNumberSearch!: string;
  inchikeySearch!: string;
  substancesData: Array<Substance> = [];
  filteredSubstanceNames: Array<any> = [];
  environment = environment;

  constructor(
    private router: Router,
    private substanceService: SubstanceService,
    private translateService: TranslateService
  ) {}

  onBtnSolutionAssessmentClicked() {
    this.router.navigateByUrl('/solution');
  }

  onButtonSearchSubstancesClicked() {
    this.substancesData = [];
    /*const request: BodyRequest = new BodyRequest();
    request.pageSize = 1000;
    request.offset = 1;
    request.page = 1;*/

    const casNumberSequence = this.substanceCasNumberSearch ? this.substanceCasNumberSearch : '';
    const inchikeySequence = this.inchikeySearch ? this.inchikeySearch : '';
    
    const casNumbers = casNumberSequence
      .split(/[,;\s]+/)
      .map(cas => cas.trim())
      .filter(cas => cas.length > 0);

    if (casNumbers.length > 0) {
      casNumbers.forEach(casNumber => {
        this.searchSubstance(casNumber, '');
      });
      return;
    }
    
    const inchikeys = inchikeySequence
      .split(/[,;\s]+/)
      .map(inchikey => inchikey.trim())
      .filter(inchikey => inchikey.length > 0);

    if (inchikeys.length > 0) {
      inchikeys.forEach(inchikey => {
        this.searchSubstance('', inchikey);
      });
      return;
    }

    this.searchSubstance();
  }

  searchSubstance(casNumber?: string, inchikey?: string){
    const btnSearch = document.getElementById('btnSearchSubstances');
    if (btnSearch) {
      btnSearch.textContent = 'Already searching...';
    }

    const filters = new BodyRequestFilters();
    filters.substance_name = this.substanceNameSearch ? this.substanceNameSearch : '';
    filters.substance_cas = casNumber || (this.substanceCasNumberSearch ? this.substanceCasNumberSearch : '');
    filters.inchikey = inchikey || (this.inchikeySearch ? this.inchikeySearch : '');

    this.runSubscription(this.substanceService.retrieveSubstancesSearch(new BodyRequest(), filters).subscribe({
      next: (response: any) => {
        this.substancesData = this.substancesData.concat(response?.data && response.data.length>0 ? response.data : []);
        if (btnSearch) {
          btnSearch.textContent = this.translateService.instant('button.search');
        }
      },
      error: (error: any) => {
        if (btnSearch) {
          btnSearch.textContent = this.translateService.instant('button.search');
        }
      },
      complete: () => {
        if (btnSearch) {
          btnSearch.textContent = this.translateService.instant('button.search');
        }
      }
    }));
  }

  onSubstanceClicked(event: any){
    const btnSearch = document.getElementById('btnSearchSubstances');
    if (btnSearch) {
      btnSearch.textContent = 'Already searching...';
    }

    const substanceDetailSearch = new SubstanceDetailSearch();
    substanceDetailSearch.name = event;
    this.runSubscription(this.substanceService.retrieveSubstanceDetail(substanceDetailSearch).subscribe({
      next: (response: Substance) => {
        this.substancesData = response ? [response] : [];
        if (btnSearch) {
          btnSearch.textContent = this.translateService.instant('button.search');
        }
      },
      error: (error: any) => {
        console.error('error retrieving substance');
        if (btnSearch) {
          btnSearch.textContent = this.translateService.instant('button.search');
        }
      }
    }));
  }

  searchSubstancesByName() {
    const filters = new BodyRequestFilters();
    filters.substance_name = this.substanceNameSearch ? this.substanceNameSearch : '';

    this.runSubscription(this.substanceService.retrieveSimilarSubstanceNames(filters).subscribe({
      next: (response) => {
        const substances = Array.isArray(response) ? response : [];
        this.filteredSubstanceNames = substances;
      },
      error: (error: any) => {
        console.error('error retrieving substances');
      },
      complete: () => {
        console.log('ok retrieving substances');
      }
    }));
  }

  downloadCsv(comma: boolean) {
    if (!this.substancesData || this.substancesData.length === 0) {
      return;
    }
    
    let csvContent = this.substanceService.toCsv(this.substancesData, comma);
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `substances_export${comma ? '_comma' : '_semicolon'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  runSubscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
