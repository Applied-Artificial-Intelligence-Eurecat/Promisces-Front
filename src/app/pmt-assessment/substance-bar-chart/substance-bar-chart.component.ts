import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import Plotly from 'plotly.js-dist-min';
import { Similar } from '../../models/similars';
import { SubstanceDetailComponent } from '../../substance-detail/substance-detail.component';
import { BodyRequestCriteriaFilters } from '../../models/bodyRequest';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-substance-bar-chart',
  templateUrl: './substance-bar-chart.component.html',
  styleUrls: ['./substance-bar-chart.component.scss']
})
export class SubstanceBarChartComponent implements OnInit, OnChanges, OnDestroy {

  private subscriptions: Subscription[] = [];

  totalRecords: number = 0;
  pageSize: number = 0;

  data: any = [];

  layout: any = {
    barmode: 'stack',
    xaxis: {
      zeroline: true,
      tickangle: -90,
      //fixedrange: true,
      //layer: 'above traces',
     // orientation: 'v',
      //textposition: 'inside',
      ticklabelposition: 'outside right',
      ticklabeloverflow: 'allow'
    },
    yaxis: {
      zeroline: true,
      //fixedrange: true
    },
		showlegend: true,
		legend: {
      orientation: 'h',
    },
    //textposition: 'inside'
    //bargap :0.5
  };
  configBarChart: any =  {responsive: true, scrollZoom: false};
  similars: Array<Similar> = [];
  dataBarChart: Array<any> = [];

  constructor(
    public substanceDetailComponent: SubstanceDetailComponent,
    private translateService: TranslateService
  ) {}

  @Input() set similarsData(data: Array<Similar>) {
    this.similars = data;
    this.updateChartData();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes['similarsData']) {
      this.similars = changes['similarsData'].currentValue;
      this.retrieveSubstancesByCriteriaFilters();
    }
  }

  retrieveSubstancesByCriteriaFilters() {

    // TODO: Filters should order the array of similars
    this.updateChartData();
  }

  updateChartData() {
    this.dataBarChart = [];
    const substanceNames: Array<string> = [];
    const persistence: Array<number> = [];
    const mobility: Array<number> = [];
    const toxicity: Array<number> = [];
    const emissions: Array<number> = [];
    const aliasSubstanceNames: any = {};

    // Sort similars by likeness in descending order
    const sortedSimilars = [...this.similars].sort((a, b) => {
      const likenessA = a.likeness || 0;
      const likenessB = b.likeness || 0;
      return likenessB - likenessA;
    });

    sortedSimilars.forEach((similar: Similar) => {
      if (similar.name !== undefined && similar.name !== '') {
        aliasSubstanceNames[`${similar.name}`] = similar.name;
        substanceNames.push(similar.name);
        persistence.push(Number(similar.p !== undefined && similar.p !== '' ? similar.p : 0));
        mobility.push(Number(similar.m !== undefined && similar.m !== '' ? similar.m : 0));
        toxicity.push(Number(similar.t !== undefined && similar.t !== '' ? similar.t : 0));
        emissions.push(Number(similar.k !== undefined && similar.k !== '' ? similar.k : 0));
      }
    });

    const traceKemi = {
      name: this.translateService.instant('criteria.kemi'),
      x: substanceNames,
      y: emissions,
      type: 'bar',
      marker: {
        color: '#c12950',
        //opacity: 0.8
      },
      width: 0.2,
      offset: -0.3,
      hoverlabel: {
        namelength: -1
      }
    };
    this.dataBarChart.push(traceKemi);

    const traceToxicity = {
      name: this.translateService.instant('criteria.toxicity'),
      x: substanceNames,
      y: toxicity,
      type: 'bar',
      marker: {
        color: '#2b78e7',
        //opacity: 0.8
      },
      width: 0.2,
      offset: -0.3,
      hoverlabel: {
        namelength: -1
      }
    };
    this.dataBarChart.push(traceToxicity);

    const traceMobility = {
      name: this.translateService.instant('criteria.mobility'),
      x: substanceNames,
      y: mobility,
      type: 'bar',
      marker: {
        color: '#01070c',
        //opacity: 0.8
      },
      width: 0.2,
      offset: -0.3,
      hoverlabel: {
        namelength: -1
      }
    };
    this.dataBarChart.push(traceMobility);

    const tracePersistence = {
      name: this.translateService.instant('criteria.persistence'),
      x: substanceNames,
      y: persistence,
      type: 'bar',
      marker: {
        color: '#ec6492',
        //opacity: 0.8
      },
      width: 0.2,
      offset: -0.3,
      hoverlabel: {
        namelength: -1
      }
    };
    this.dataBarChart.push(tracePersistence);

    this.layout.xaxis.labelalias = aliasSubstanceNames;


    Plotly.newPlot('substanceBarDashboard', this.dataBarChart, this.layout,  this.configBarChart);


    var myPlot: any = document.getElementById('substanceBarDashboard'),
    data = this.dataBarChart,
    layout = this.layout;

    const that = this;
    myPlot.on('plotly_click', function(data: any) {
      console.log('plot substance bar clicked');
      var pts = '';
      let substanceName = '';
      for(var i=0; i < data.points.length; i++){
          pts = 'x = '+data.points[i].x +'\ny = '+
              data.points[i].y + '\n\n';
              substanceName = data.points[i].x;
      }
      //alert('Solution clicked:\n\n'+pts+'\nName: '+ solutionName);
      that.substanceDetailComponent.showSubstanceDetailDialog(substanceName);
    });
  }

  runSubscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
