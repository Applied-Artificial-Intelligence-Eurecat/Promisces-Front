import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { Substance } from '../models/substance';
import { SubstanceViewTypeEnum } from '../models/substanceViewTypeEnum';
import { SubstanceService } from '../services/substance.service';
import { BodyRequest, BodyRequestFilters } from '../models/bodyRequest';
import { CERoute } from '../models/ceRoute';
import { SectorOfUse } from '../models/sectorOfUse';
import { PageResponse } from '../models/pageResponse';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-substance-search',
  templateUrl: './substance-search.component.html',
  styleUrls: ['./substance-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SubstanceSearchComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  substanceSearchFormGroup!: FormGroup;
  substanceGroupOptions: Array<any> = [];
  ceRouteOptions: Array<CERoute> = [];
  chemicalClassOptions: Array<any> = [];
  sectorOfUseOptions: Array<SectorOfUse> = [];
  substanceSearchFilters: BodyRequestFilters = new BodyRequestFilters();
  showListView: boolean = true;
  viewSelected: SubstanceViewTypeEnum = SubstanceViewTypeEnum.list;
  SubstanceViewTypeEnum = SubstanceViewTypeEnum;
  sortFieldSelected: string = '';
  filteredSubstanceNames: Array<any> = [];
  environment = environment;
  viewOptions: Array<SelectItem> = [];

  constructor(
    //private substanceService: SubstanceService
    private translateService: TranslateService,
    private fb: FormBuilder,
    private router: Router,
    private substanceService: SubstanceService
    ) {}

  get substanceName() { return this.substanceSearchFormGroup.get('substanceName'); }
  get substanceCasNumber() { return this.substanceSearchFormGroup.get('substanceCasNumber'); }
  get solutionName() { return this.substanceSearchFormGroup.get('solutionName'); }
  get substanceGroup() { return this.substanceSearchFormGroup.get('substanceGroup'); }

  get ceRoute() { return this.substanceSearchFormGroup.get('ceRoute'); }
  get chemicalClass() { return this.substanceSearchFormGroup.get('chemicalClass'); }
  get sectorOfUse() { return this.substanceSearchFormGroup.get('sectorOfUse'); }

  get strategy() { return this.substanceSearchFormGroup.get('strategy'); }

  get prediction() { return this.substanceSearchFormGroup.get('prediction'); }
  get experimental() { return this.substanceSearchFormGroup.get('experimental'); }
  get inchikey() { return this.substanceSearchFormGroup.get('inchikey'); }
  ngOnInit(): void {
    this.initializeForm();
    this.retrieveSubstanceGroupOptions();
    this.retrieveCeRouteOptions();
    this.retrieveChemicalClassOptions();
    this.retrieveSectorOfUseOptions();
    this.runSubscription(this.translateService.get([SubstanceViewTypeEnum.list, SubstanceViewTypeEnum.graph]).subscribe({
      next: () => {
        this.viewOptions = [
          { label: this.translateService.instant(SubstanceViewTypeEnum.list), value: SubstanceViewTypeEnum.list },
          { label: this.translateService.instant(SubstanceViewTypeEnum.graph), value: SubstanceViewTypeEnum.graph },
          { label: this.translateService.instant(SubstanceViewTypeEnum.graphConservative), value: SubstanceViewTypeEnum.graphConservative },
          { label: this.translateService.instant(SubstanceViewTypeEnum.graphRobust), value: SubstanceViewTypeEnum.graphRobust },
          { label: this.translateService.instant(SubstanceViewTypeEnum.graphAverage), value: SubstanceViewTypeEnum.graphAverage }
        ]
      }
    }));
  }

  private initializeForm() {
    this.substanceSearchFormGroup = this.fb.group({
      substanceName: new FormControl(''),
      substanceCasNumber: new FormControl(''),
      solutionName: new FormControl(''),
      substanceGroup: new FormControl(''),
      ceRoute: new FormControl(''),
      chemicalClass: new FormControl(''),
      sectorOfUse: new FormControl(''),
      strategy: new FormControl(''),
      prediction: new FormControl(false),
      experimental: new FormControl(false),
      inchikey: new FormControl('')
    });
  }

  autocompleteSubstancesName() {
    const filters = new BodyRequestFilters();
    filters.substance_name = this.substanceName?.value ? this.substanceName?.value : '';

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

  searchSubstancesByName(event: any) {

    const body: BodyRequest = new BodyRequest();
    body.sortBy = '';
    body.sortAsc = true;
    body.pageSize = event?.rows ? event?.rows : environment.pagination.items_per_page;
    body.offset = event?.first ? event?.first : 1;
    body.page = event?.page ? event?.page : 1;

    const filters = new BodyRequestFilters();
    filters.substance_name = this.substanceName?.value ? this.substanceName?.value : '';
    body.filters = filters;

    this.runSubscription(this.substanceService.retrieveSubstancesSearch(body, filters).subscribe({
      next: (response: PageResponse<Substance>) => {
        console.log('retrievePage. Retrieved substances');
        //console.log('retrievePage. Retrieved  ' + response.entities.length + ' substances');
        const substances = response?.data && response?.data.length>0 ? response.data : [];

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

  resetFilters() {
    this.substanceSearchFormGroup.reset();
    this.buildFilterForSubstances();
  }

  buildFilterForSubstances() {
    const request = new BodyRequest();
    request.sortAsc = true;
    request.sortBy = this.sortFieldSelected;
    const filters = new BodyRequestFilters();
    filters.substance_name = this.substanceName?.value ? this.substanceName?.value : '';
    filters.substance_cas = this.substanceCasNumber?.value ? this.substanceCasNumber?.value : '';
    filters.solution_name = this.solutionName?.value ? this.solutionName?.value : '';
    filters.substance_group = this.substanceGroup?.value?.id ? this.substanceGroup?.value?.id : '';
    filters.ce_route = this.ceRoute?.value?.name ? this.ceRoute?.value?.name : '';
    filters.chemical_class = this.chemicalClass?.value?.name ? this.chemicalClass?.value?.name : '';
    filters.use_sector = this.sectorOfUse?.value?.code ? this.sectorOfUse?.value?.code : '';
    filters.followed_strategy = this.strategy?.value ? this.strategy?.value : '';

    filters.prediction = this.prediction?.value !== null ? this.prediction?.value : '';
    filters.experimental = this.experimental?.value !== null ? this.experimental?.value : '';
    filters.inchikey = this.inchikey?.value ? this.inchikey?.value : '';

    this.substanceSearchFilters = filters;

    /*request.filters = filters;
    this.retrieveSubstancesByFilters(request);*/
    //this.router.navigateByUrl('/substance/list');
  }

  retrieveSubstanceGroupOptions() {
    this.runSubscription(this.substanceService.retrieveSubstanceGroupAll().subscribe(
      response => {
        console.log('Retrieved substanceGroupOptions');
        this.substanceGroupOptions = response;
    }));
  }

  async retrieveCeRouteOptions() {
    return this.runSubscription((await this.substanceService.retrieveCeRouteAll()).subscribe({
      next: (response: any) => {
        console.log('Retrieved ceRoutes');
        this.ceRouteOptions = response ? response : [];
      },
      error: (error: any) => {
        console.log();
      },
      complete: () => {
        console.log('ok');
      }

    }));


  }

  retrieveChemicalClassOptions() {
    this.runSubscription(this.substanceService.retrieveChemicalClassAll().subscribe(
      response => {
        console.log('Retrieved ');
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
        console.log('Retrieved ');
        this.sectorOfUseOptions = response;
    }));
  }

  onChangeSortFieldSelection(field: string) {
    this.sortFieldSelected = field;
  }

  onChangeViewSelection(view: SubstanceViewTypeEnum) {
    this.viewSelected = view;
    //this.showListView = view === 'List' ? true : false;
  }

  runSubscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
