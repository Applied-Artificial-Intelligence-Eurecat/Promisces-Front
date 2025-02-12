import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SubstanceAverageScore } from '../../models/substance';
import Plotly from 'plotly.js-dist-min';

@Component({
  selector: 'app-substance-bubble-chart',
  templateUrl: './substance-bubble-chart.component.html',
  styleUrls: ['./substance-bubble-chart.component.scss']
})
export class SubstanceBubbleChartComponent implements OnInit {
  
  _pcAverageScore: any[] = [];
  _sectorAverageScore: any[] = [];
  constructor(private translateService: TranslateService) { 
  }

  @Input() set pcAverageScore(data: Array<SubstanceAverageScore>) {
    this._pcAverageScore = data;
    this.preparePCChartData();
  }

  @Input() set sectorAverageScore(data: Array<SubstanceAverageScore>) {
    this._sectorAverageScore = data;
    this.prepareSectorChartData();
  }

  ngOnInit(): void {
  }

  private preparePCChartData(): void {
    const pcData = this._pcAverageScore.map(substance => ({
      x: substance.p,
      y: substance.m,
      z: substance.k,
      numberOfSubstances: substance.numberOfSubstances,
      itemName: substance.itemName
    }));
    
      const tracePc = {
      x: pcData.map(d => d.x),
      y: pcData.map(d => d.y), 
      text: pcData.map(d => d.itemName),
      mode: 'markers',
      marker: {
        size: pcData.map(d => d.numberOfSubstances),
        sizeref: 2 * Math.max(...pcData.map(d => d.numberOfSubstances)) / (40**2),
        sizemode: 'area',
        color: pcData.map(d => d.numberOfSubstances),
        colorscale: 'RdYl',
        showscale: true,
        colorbar: {
          thickness: 20,
          len: 0.75
        }
      }
    };

    const layoutPc = {
      title: this.translateService.instant('pmt-assessment.bubbleChartPC'),
      showlegend: false,
      xaxis: {
        title: this.translateService.instant('pmt-assessment.bubbleChartPCX'),
        zeroline: true
      },
      yaxis: {
        title: this.translateService.instant('pmt-assessment.bubbleChartPCY'),
        zeroline: true
      }
    };

    

    const config = {
      responsive: true,
      scrollZoom: true,
      displayModeBar: true
    };

    Plotly.newPlot('bubble-PC', [tracePc], layoutPc, config);
  }

  private prepareSectorChartData(): void {
    const sectorData = this._sectorAverageScore.map(substance => ({
      x: substance.p,
      y: substance.m,
      z: substance.k,
      numberOfSubstances: substance.numberOfSubstances,
      itemName: substance.itemName
    }));
    
    console.log(sectorData);
    const traceSector = {
      x: sectorData.map(d => d.x),
      y: sectorData.map(d => d.y),
      text: sectorData.map(d => d.itemName),
      mode: 'markers',
      marker: {
        size: sectorData.map(d => d.numberOfSubstances),
        sizeref: 2 * Math.max(...sectorData.map(d => d.numberOfSubstances)) / (40**2),
        sizemode: 'area',
        color: sectorData.map(d => d.numberOfSubstances),
        colorscale: 'RdYl',
        showscale: true,
        colorbar: {
          thickness: 20,
          len: 0.75
        }
      }
    };

    const layoutSector = {
      title: this.translateService.instant('pmt-assessment.bubbleChartSector'),
      showlegend: false,
      xaxis: {
        title: this.translateService.instant('pmt-assessment.bubbleChartPCX'),
        zeroline: true
      },
      yaxis: {
        title: this.translateService.instant('pmt-assessment.bubbleChartPCY'),
        zeroline: true
      }
    };

    const config = {
      responsive: true,
      scrollZoom: true,
      displayModeBar: true
    };

    Plotly.newPlot('bubble-sector', [traceSector], layoutSector, config);

  }

}
