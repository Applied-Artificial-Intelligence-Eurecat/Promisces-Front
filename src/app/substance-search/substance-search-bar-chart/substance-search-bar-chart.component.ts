import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import Plotly from 'plotly.js-dist-min';
import { SubstanceSearchComponent } from '../substance-search.component';
import { Substance } from '../../models/substance';
import { SubstanceDetailComponent } from '../../substance-detail/substance-detail.component';
import { SubstanceViewTypeEnum } from 'src/app/models/substanceViewTypeEnum';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { LogarithmicScale } from 'chart.js';

@Component({
  selector: 'app-substance-search-bar-chart',
  templateUrl: './substance-search-bar-chart.component.html',
  styleUrls: ['./substance-search-bar-chart.component.scss']
})
export class SubstanceSearchBarChartComponent implements OnInit, OnChanges {

  @Input()
  substances: Array<Substance> = [];
  @Input()
  viewSelected!: SubstanceViewTypeEnum;
  SubstanceViewTypeEnum = SubstanceViewTypeEnum;

  layout: any = {
    barmode: 'stack',
    xaxis: {
      title: {
        text: this.translateService.instant('substance.classification')
      }
    },
    yaxis: {
      title: {
        text: this.translateService.instant('substance.countScale')
      },
      type: 'log',
      autorange: true
    },
		showlegend: false,
    textposition: 'auto'
    //bargap :0.5
  };
  configBarChart: any =  {responsive: true, scrollZoom: false, willReadFrequently: true};
  dataConservativeChart: Array<any> = [];
  dataRobustChart: Array<any> = [];
  dataAverageChart: Array<any> = [];


  constructor(
    private translateService: TranslateService,
    public substanceSearch: SubstanceSearchComponent,
    public substanceDetailComponent: SubstanceDetailComponent) {

    }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['substances'] && changes['substances'].currentValue) {
      //this.substances = changes['substances'].currentValue;
      this.updateChartData();
    }
    if (changes['viewSelected'] && changes['viewSelected'].currentValue) {
      this.updateChartData();
    }
  }

  updateChartData() {

    this.dataConservativeChart = [];
    this.dataRobustChart = [];
    this.dataAverageChart = [];

    const conservativeClassifications: Array<any> = [];
    const robustClassifications: Array<any> = [];
    const averageClassifications: Array<any> = [];


    this.substances.forEach((substance: Substance) => {
      // conservative
      if (substance.robustClassification !== '') {
        if (conservativeClassifications[substance.conservativeClassification as any]) {
          conservativeClassifications[substance.conservativeClassification as any] = conservativeClassifications[substance.conservativeClassification as any]+1;
        } else {
          conservativeClassifications[substance.conservativeClassification as any] = 1;
        }
      }
      // robust
      if (substance.robustClassification !== '') {
        if (robustClassifications[substance.robustClassification as any]) {
          robustClassifications[substance.robustClassification as any] = robustClassifications[substance.robustClassification as any]+1;
        } else {
          robustClassifications[substance.robustClassification as any] = 1;
        }
      }
      // average
      if (substance.averageClassification !== '') {
        if (averageClassifications[substance.averageClassification as any]) {
          averageClassifications[substance.averageClassification as any] = averageClassifications[substance.averageClassification as any]+1;
        } else {
          averageClassifications[substance.averageClassification as any] = 1;
        }
      }
    });

    const traceConservative = {
      x: Object.keys(conservativeClassifications),
      y: Object.values(conservativeClassifications),
      type: 'bar',
      text: (Object.values(conservativeClassifications)).map(String),
      textposition: 'outside',
      hoverinfo: 'none'
    };
    this.dataConservativeChart.push(traceConservative);
    const conservativeLayout = this.layout;
    conservativeLayout['title'] = { text: this.translateService.instant('substance.pmtClassConservative')};

    const traceRobust = {
      x: Object.keys(robustClassifications),
      y: Object.values(robustClassifications),
      type: 'bar',
      text: (Object.values(robustClassifications)).map(String),
      textposition: 'outside',
      hoverinfo: 'none'
    };
    this.dataRobustChart.push(traceRobust);
    const robustLayout = {...this.layout};
    robustLayout['title'] = { text: this.translateService.instant('substance.pmtClassRobust')};

    const traceAverage = {
      x: Object.keys(averageClassifications),
      y: Object.values(averageClassifications),
      type: 'bar',
      text: (Object.values(averageClassifications)).map(String),
      textposition: 'outside',
      hoverinfo: 'none'
    };
    this.dataAverageChart.push(traceAverage);
    const averageLayout = {...this.layout};
    averageLayout['title'] = { text: this.translateService.instant('substance.pmtClassAverage')};

    if (this.viewSelected==SubstanceViewTypeEnum.graphConservative) {
      Plotly.newPlot('divConservativeBarChart', this.dataConservativeChart as any, conservativeLayout, this.configBarChart);
      Plotly.purge('divRobustBarChart');
      Plotly.purge('divAverageBarChart');
    }
    if (this.viewSelected==SubstanceViewTypeEnum.graphRobust) {
      Plotly.newPlot('divRobustBarChart', this.dataRobustChart as any, robustLayout, this.configBarChart);
      Plotly.purge('divConservativeBarChart');
      Plotly.purge('divAverageBarChart');
    }
    if (this.viewSelected==SubstanceViewTypeEnum.graphAverage) {
      Plotly.newPlot('divAverageBarChart', this.dataAverageChart as any, averageLayout, this.configBarChart);
      Plotly.purge('divConservativeBarChart');
      Plotly.purge('divRobustBarChart');
    }

  }

}
