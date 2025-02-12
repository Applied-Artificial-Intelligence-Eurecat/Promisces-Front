import { Component, Input, ViewEncapsulation, OnChanges, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { BodyRequest, BodyRequestFilters } from 'src/app/models/bodyRequest';
import { Substance } from 'src/app/models/substance';
import { SubstanceService } from 'src/app/services/substance.service';
import { SubstanceSearchComponent } from 'src/app/substance-search/substance-search.component';
import { SubstanceDetailComponent } from '../../substance-detail/substance-detail.component';
import { PageResponse } from 'src/app/models/pageResponse';
import { PageEvent } from 'src/app/models/pageEvent';
import { environment } from 'src/environments/environment';
import { SubstanceViewTypeEnum } from 'src/app/models/substanceViewTypeEnum';

@Component({
  selector: 'app-substance-list',
  templateUrl: './substance-list.component.html',
  styleUrls: ['./substance-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SubstanceListComponent implements OnInit, OnChanges, OnDestroy {

  private subscriptions: Subscription[] = [];
  @Input()
  substanceFilters: BodyRequestFilters = new BodyRequestFilters();
  @Input()
  viewSelected!: SubstanceViewTypeEnum;
  @Input()
  sortFieldSelected!: string;

  refDetail: DynamicDialogRef | undefined;
  sortFieldOptions: Array<SelectItem> = [];

  environment = environment;
  first: number = 0;
  last: number = 0;
  totalRecords: number = 0;
  lastLazyEvent!: LazyLoadEvent;
  loading: boolean = true;
  substancesList: Array<Substance> = [];

  constructor(
    public dialogService: DialogService,
    private substanceService: SubstanceService,
    public substanceSearch: SubstanceSearchComponent,
    public substanceDetailComponent: SubstanceDetailComponent
  ) {
    //this.sortFieldOptions = this.substanceService.transformSubstanceSortEnumIntoDropdownOptions();

  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['substanceFilters'].currentValue) {
      this.substanceFilters = changes['substanceFilters'].currentValue;

      this.onPageChange(undefined);
    }
  }

  onPageChange(event: PageEvent | undefined) {
    console.log('on page change ');
    if (event === undefined) {
      this.first = 0;
    }

    const body: BodyRequest = new BodyRequest();
    body.sortBy = '';
    body.sortAsc = true;
    body.pageSize = event?.rows ? event?.rows : environment.pagination.items_per_page;
    body.offset = event?.first ? event?.first : 1;
    body.page = event?.page ? event?.page : 1;

    body.filters = this.substanceFilters;

    this.retrievePage(body);
  }

  downloadCsv(comma: boolean) {
    if (!this.substancesList || this.substancesList.length === 0) {
      return;
    }

    let csvContent = this.substanceService.toCsv(this.substancesList, comma);

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

/*
  onLazyLoad(event: LazyLoadEvent) {

    this.lastLazyEvent = event;

    const body: BodyRequest = new BodyRequest();
    body.sortBy = '';
    body.sortAsc = true;
    body.pageSize = event && event.rows ? event.rows : environment.pagination.items_per_page;
    body.offset = 0;

    if (event !== undefined) {
      body.sortBy = event.sortField ? event.sortField as string : '';
      body.sortAsc = event.sortOrder === 1 ? true : false;
      body.pageSize = event.rows ? event.rows as number : environment.pagination.items_per_page;
      body.offset = event.first ? event.first as number : 0;
    }
    body.filters = this.substanceFilters;

    this.retrievePage(body);
  }
*/
  retrievePage(request: BodyRequest) {
    console.log(request)
    this.runSubscription(this.substanceService.retrieveSubstancesSearch(request, this.substanceFilters).subscribe({
      next: (response: PageResponse<Substance>) => {
        const substances = response?.data && response?.data.length>0 ? response.data : [];

        this.substancesList = substances;
        this.loading = false;
        if (response?.totalRegisters) {
          this.totalRecords = response?.totalRegisters ? response?.totalRegisters : 0;
          this.first = request.offset && request.offset!==1 ? request.offset+1 : 1;
        } else {
          this.totalRecords = 0;
          this.first = 0;
        }
        this.last = this.first+request.pageSize-1;
        if (this.last > this.totalRecords) {
          this.last = this.totalRecords;
        }
      },
      error: (error: any) => {
        console.error('error retrieving substances');
      },
      complete: () => {
        console.log('ok retrieving substances');
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
