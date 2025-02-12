import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import Plotly from 'plotly.js-dist-min';
import { SubstanceSearchComponent } from '../substance-search.component';
import { Substance } from '../../models/substance';
import { SubstanceDetailComponent } from '../../substance-detail/substance-detail.component';

@Component({
  selector: 'app-substance-cube-chart',
  templateUrl: './substance-cube-chart.component.html',
  styleUrls: ['./substance-cube-chart.component.scss']
})
export class SubstanceCubeChartComponent implements OnInit, OnChanges {

  @Input()
  substances: Array<Substance> = [];

  dataCubeChart: Array<any> = [];
  configAreaChart: any =  {responsive: true, scrollZoom: true, willReadFrequently: true};
  layoutCube: any = {
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0
    },
    autosize: true,
    height: 400,
    showlegend: false,
    paper_bgcolor: 'transparent',
    scene: {
      xaxis: {
        title: this.translateService.instant('substance.mobility'),
        showgrid: false,
        showdividers: false,
        showspikes: false,
        showticklabels: false,
        showline: true,
        zeroline: true,
        mirror: true,
        showbackground: true,
        backgroundcolor: 'rgba(255, 255, 255, 1)',/*
        spikesides: false,
        zeroline: true*/
      },
      yaxis: {
        title: this.translateService.instant('substance.persistence'),
        showgrid: false,
        showdividers: false,
        showspikes: false,
        showticklabels: false,
        showline: true,
        zeroline: true,
        mirror: true,
        showbackground: true,
        backgroundcolor: 'rgba(255, 255, 255, 1)',/*
        spikesides: false,
        zeroline: true*/
      },
      zaxis: {
        title: this.translateService.instant('substance.emission'),
        showgrid: false,
        showdividers: false,
        showspikes: false,
        showticklabels: false,
        showline: true,
        zeroline: true,
        mirror: true,
        showbackground: true,
        backgroundcolor: 'rgba(255, 255, 255, 1)',/*
        spikesides: false,
        zeroline: true*/
      },
      aspectmode:'cube',
      domain:{row:0, column:0}
    }
  };


  constructor(
    private translateService: TranslateService,
    public substanceSearch: SubstanceSearchComponent,
    public substanceDetailComponent: SubstanceDetailComponent) {

    }

  ngOnInit(): void {
    this.dataCubeChart = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['substances'] && changes['substances'].currentValue) {
      //this.substances = changes['substances'].currentValue;
      this.updateChartData();
    }
  }

  updateChartData() {
    const newData: Array<any> = [];
    this.substances.forEach((substance: Substance) => {
      const trace = {
        name: substance.substanceName,
        x: [Math.round((Number(substance.mobility !== undefined && substance.mobility !== '' ? substance.mobility : '') + Number.EPSILON) * 100) / 100],
        y: [Math.round((Number(substance.persistence !== undefined && substance.persistence !== '' ? substance.persistence : '') + Number.EPSILON) * 100) / 100],
        z: [Math.round((Number(substance.potentialEnvironmentEmissions !== undefined && substance.potentialEnvironmentEmissions !== '' ? substance.potentialEnvironmentEmissions : '') + Number.EPSILON) * 100) / 100],
        hoverinfo: 'name',
        mode: 'markers',
        marker: {
          color: '#2b78e7',
          size: 10,
          symbol: 'circle',
          line: {
            color: 'rgb(204, 204, 204)',
            width: 1
          },
        },
        type: 'scatter3d',
        aspectmode: 'cube',
        showlegend: false,
        hoverlabel: {
          namelength: -1
        }
      };
      newData.push(trace);
    });
    this.dataCubeChart = newData;
    Plotly.newPlot('divCubeChart', this.dataCubeChart as any, this.layoutCube, this.configAreaChart);

    var myPlot: any = document.getElementById('divCubeChart'),
    data = this.dataCubeChart,
    layout = this.layoutCube;

    const that = this;
    myPlot.on('plotly_click', function(data: any) {
      console.log('plot cube clicked');
      var pts = '';
      let subsName = '';
      for(var i=0; i < data.points.length; i++){
          pts = 'x = '+data.points[i].x +'\ny = '+
              data.points[i].y +'\nz = '+
              data.points[i].z + '\n\n';
          subsName = data.points[i].data.name;
      }
      //alert('Substance clicked:\n\n'+pts+'\nName: '+ subsName);
      that.substanceDetailComponent.showSubstanceDetailDialog(subsName);
    });
  }

}
