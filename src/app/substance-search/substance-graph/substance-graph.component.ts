import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import Plotly from 'plotly.js-dist-min';
import { SubstanceSearchComponent } from '../substance-search.component';
import { SubstanceViewTypeEnum } from '../../models/substanceViewTypeEnum';
import { Substance } from '../../models/substance';
import { SubstanceDetailComponent } from '../../substance-detail/substance-detail.component';
import { BodyRequest, BodyRequestFilters } from '../../models/bodyRequest';
import { PageResponse } from '../../models/pageResponse';
import { SubstanceService } from '../../services/substance.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-substance-graph',
  templateUrl: './substance-graph.component.html',
  styleUrls: ['./substance-graph.component.scss']
})
export class SubstanceGraphComponent implements OnInit, OnChanges, OnDestroy {

  private subscriptions: Subscription[] = [];
  @Input()
  substanceFilters: BodyRequestFilters = new BodyRequestFilters();
  @Input()
  viewSelected!: SubstanceViewTypeEnum;

  SubstanceViewTypeEnum = SubstanceViewTypeEnum;
  substances: Array<Substance> = [];
  first: number = 0;
  last: number = 0;
  totalRecords: number = 0;
  preparingData!: boolean;

  constructor(
    private translateService: TranslateService,
    public substanceSearch: SubstanceSearchComponent,
    public substanceDetailComponent: SubstanceDetailComponent,
    private substanceService: SubstanceService) {

    }

  ngOnInit(): void {
    this.substances = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['substanceFilters'] && changes['substanceFilters'].currentValue) {
      this.substanceFilters = changes['substanceFilters'].currentValue;
      const request: BodyRequest = new BodyRequest();
      //body.sortBy = event.sortField as string;
      request.sortAsc = true;
      //body.offset = 0;
      request.page = 1;
      //Retrieving just the firsts 1000 substances
      request.pageSize = 1000;
      request.filters = this.substanceFilters;
      this.substances = [];
      this.retrieveSubstances(request);
    }
  }


  retrieveSubstances(request: BodyRequest) {
    this.preparingData = true;
    this.runSubscription(this.substanceService.retrieveSubstancesSearch(request, this.substanceFilters).subscribe({
      next: (response: PageResponse<Substance>) => {
        console.log('retrievePage. Retrieved substances');
        //console.log('retrievePage. Retrieved  ' + response.entities.length + ' substances');
        const substances = response?.data && response?.data.length>0 ? response.data : [];

        this.substances = this.substances.concat(...substances);
        if (response?.totalRegisters) {
          this.totalRecords = response.totalRegisters;
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
        this.preparingData=false;
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
