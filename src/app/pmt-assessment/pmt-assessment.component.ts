import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { SubstanceService } from '../services/substance.service';
import { SubstanceDetailComponent } from '../substance-detail/substance-detail.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BodyRequest, BodyRequestFilters, BodyRequestCriteriaFilters } from '../models/bodyRequest';
import { Similar } from '../models/similars';
import { SubstanceDetailSearch, SubstanceAverageScore } from '../models/substance';
import { TranslateService } from '@ngx-translate/core';
import { SectorOfUse } from '../models/sectorOfUse';
import { environment } from 'src/environments/environment';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pmt-assessment',
  templateUrl: './pmt-assessment.component.html',
  styleUrls: ['./pmt-assessment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PmtAssessmentComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  substanceNameSearch: string = '';
  substanceCasNumberSearch: string = '';
  inchikeySearch: string = '';
  concernedAboutActive: boolean | null = null;

  pmtSubstanceSearchFormGroup!: FormGroup;
  chemicalClassOptions: Array<string> = [];
  sectorOfUseOptions: Array<SectorOfUse> = [];
  sortFieldSelected: string = '';
  totalSimilarsData: Array<Similar> = [];
  similarsData: Array<Similar> = [];
  sectorAverageScore: Array<SubstanceAverageScore> = [];
  pcAverageScore: Array<SubstanceAverageScore> = [];

  sortFieldOptions: Array<SelectItem> = [];

  environment = environment;
  first: number = 0;
  last: number = 0;
  rows: number = 0;
  totalRecords: number = 0;
  page: number = 0;
  pageCount: number = 0;

  filteredSubstanceNames: Array<any> = [];

  // Chart variables
  substancesChart: any;

  substancesOptions: any;

  persistence = 0;
  mobility = 0;
  toxicity = 0;
  kemi = 0;
  criteria4 = 0;
  criteria5= 0;
  criteria6 = 0;

  substanceSearchFilters = {
    persistence: 0,
    mobility: 0,
    toxicity: 0,
    kemi: 0
  };

  constructor(
    private substanceService: SubstanceService,
    public substanceDetailComponent: SubstanceDetailComponent,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private messageService: MessageService
  ) {}

  get ceRoute() { return this.pmtSubstanceSearchFormGroup.get('ceRoute'); }
  get chemicalClass() { return this.pmtSubstanceSearchFormGroup.get('chemicalClass'); }
  get sectorOfUse() { return this.pmtSubstanceSearchFormGroup.get('sectorOfUse'); }

  ngOnInit(): void {
    this.substanceSearchFilters = {
      persistence: this.persistence,
      mobility: this.mobility,
      toxicity: this.toxicity,
      kemi: this.kemi
    };
  }

  onCriteriaFilterSelected() {
    if (this.persistence === 0 && this.mobility === 0 && this.toxicity === 0 && this.kemi === 0) {
      this.similarsData = JSON.parse(JSON.stringify(this.totalSimilarsData));
      return;
    }

    const total = this.persistence + this.mobility + this.toxicity + this.kemi;

    const weightPersistence = this.persistence/total;
    const weightMobility = this.mobility/total;
    const weightToxicity = this.toxicity/total;
    const weightKemi = this.kemi/total;

    // Create a deep copy of totalSimilarsData to avoid modifying the original
    this.similarsData = JSON.parse(JSON.stringify(this.totalSimilarsData));

    this.similarsData.forEach(similar => {
      similar.p = (similar.p !== '' ? Number(similar.p) : 0) * weightPersistence;
      similar.m = (similar.m !== '' ? Number(similar.m) : 0) * weightMobility;
      similar.t = (similar.t !== '' ? Number(similar.t) : 0) * weightToxicity;
      similar.k = (similar.k !== '' ? Number(similar.k) : 0) * weightKemi;

      similar.likeness = similar.p + similar.m + similar.t + similar.k;
    });
  }

  resetSearchSelection() {
    this.persistence = 0;
    this.mobility = 0;
    this.toxicity = 0;
    this.kemi = 0;
    this.criteria4 = 0;
    this.criteria5 = 0;
    this.criteria6 = 0;
    this.onCriteriaFilterSelected();
  }

  retrieveChemicalClassOptions() {
    this.runSubscription(this.substanceService.retrieveChemicalClassAll().subscribe(
      response => {
        //console.log('Retrieved chimical class options');
        this.chemicalClassOptions = response.map((value: string) => {
          return {
            name: value
          }
        });
    }));
  }

  retrieveSectorOfUseOptions() {
    this.runSubscription(this.substanceService.retrieveSectorOfUseAll().subscribe(
      response => {
        //console.log('Retrieved Sector of use');
        this.sectorOfUseOptions = response;
    }));
  }

  searchSubstancesByName() {
    const filters = new BodyRequestFilters();
    filters.substance_name = this.substanceNameSearch ? this.substanceNameSearch : '';
    console.log('name', this.substanceNameSearch);
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

  onButtonShowSubstanceDetailsClicked() {
    const filters = new BodyRequestFilters();
    filters.substance_name = this.substanceNameSearch ? this.substanceNameSearch : '';
    filters.substance_cas = this.substanceCasNumberSearch ? this.substanceCasNumberSearch : '';

    if (filters.substance_name !== '' || filters.substance_cas !== '') {

      this.runSubscription(this.substanceService.retrieveSubstancesSearch(new BodyRequest(), filters).subscribe({
        next: (response: any) => {
          console.log('retrievePage. Retrieved ');

          if (response?.data && response.data.length>0) {
            this.substanceDetailComponent.showSubstanceDetailDialog(response.data[0].nameSynonyms[0]);
          }
        },
        error: (error: any) => {
          console.log();
        },
        complete: () => {
          console.log('ok');
        }
      }));
    }
  }

  onButtonSearchSubstanceClicked() {
    const request: SubstanceDetailSearch = new SubstanceDetailSearch();
    if (this.substanceNameSearch !== '') request.name = this.substanceNameSearch;
    if (this.substanceCasNumberSearch !== '') request.cas_n = this.substanceCasNumberSearch;
    if (this.inchikeySearch !== '') request.inchikey = this.inchikeySearch;

    this.retrieveSimilarSubstances(request);
    this.retrieveAverageScore(request, 'sector_of_use');
    this.retrieveAverageScore(request, 'pc');
  }

  retrieveSimilarSubstances(substanceDetailSearch: SubstanceDetailSearch) {
    this.runSubscription(this.substanceService.retrieveSimilarSubstances(substanceDetailSearch).subscribe({
      next: (response) => {
        const substances = Array.isArray(response) ? response : [];
        this.totalSimilarsData = substances;
        this.similarsData = substances;
      }
    }));
  }

  retrieveAverageScore(substanceDetailSearch: SubstanceDetailSearch, groupby: string) {
    substanceDetailSearch.groupby = groupby;
    this.runSubscription(this.substanceService.retrieveAverageScore(substanceDetailSearch).subscribe({
      next: (response) => {
        const substances = Array.isArray(response) ? response : [];
        if (groupby === 'sector_of_use') {
          this.sectorAverageScore = substances;
        }else if (groupby === 'pc') {
          this.pcAverageScore = substances;
        }
      }
    }));
  }

  runSubscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
