import { Component, OnInit, Input, SimpleChanges, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
import Plotly from 'plotly.js-dist-min';
import { Substance } from '../../models/substance';
import { TranslateService } from '@ngx-translate/core';
import { SubstanceDetailComponent } from '../../substance-detail/substance-detail.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-substance-point-area-chart',
  templateUrl: './substance-point-area-chart.component.html',
  styleUrls: ['./substance-point-area-chart.component.scss']
})
export class SubstancePointAreaChartComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  private subscriptions: Subscription[] = [];
  substances: Array<Substance> = [];
  dataPointAreaChart: Array<any> = [];

  @Input() set substancesData(data: Array<Substance>) {
    this.substances = data;
    this.updateChartData();
  }

  layoutPointArea: any = {};
  configAreaChart: any =  {
    responsive: true,
    scrollZoom: false,
    toImageButtonOptions: {
      format: 'svg',
      filename: 'Substances_plot',
      height: 800,
      width: 1200,
      scale: 1
    },
    modeBarButtonsToAdd: [
      {
        name: 'downloadHTML',
        title: 'Download plot as HTML',
        icon: Plotly.Icons.disk,
        click: (gd: any) => {
          const html = `
            <html><head><meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
                <style>
                  #plot {
                    width: 100%;
                    height: 100vh;
                    padding-top: 50px;
                  }
                </style>
              </head>
              <body>
                <div id="plot"></div>
                <script>
                  var data = ${JSON.stringify(gd.data)};
                  var layout = ${JSON.stringify(gd.layout)};
                  layout.title = ${gd.data.length === 9 ? JSON.stringify(gd.data[8].name) : JSON.stringify('Substances Plot')};
                  layout.autosize = true;
                  layout.margin = {...layout.margin, t: 50};
                  var config = {responsive: true};
                  Plotly.newPlot('plot', data, layout, config);
                  window.addEventListener('resize', function() {
                    Plotly.Plots.resize('plot');
                  });
                </script>
              </body>
            </html>
          `;
          const blob = new Blob([html], {type: 'text/html'});
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'substances_plot.html';
          a.click();
          window.URL.revokeObjectURL(url);
        }
      }
    ]
  };
  limitOfToxicity: number = 0.5;

  constructor(
    private translateService: TranslateService,
    private substanceDetailComponent: SubstanceDetailComponent
    ) {}

  ngOnInit(): void {
    this.runSubscription(this.translateService.get(['criteria.persistence','criteria.mobility']).subscribe({
      next: () => {
        this.layoutPointArea = {
          margin: {
            //l: 0,
            //r: 0,
            //b: 0,
            t: 10
          },
          showlegend: true,
          plot_bgcolor: '#f2f2f2',
          xaxis: {
            range: [-0.04, 1.03],
            title: this.translateService.instant('criteria.persistence'),
            tick0: 0,
            dtick: 0.5,/*
            ticks: 'outside',*/
            showgrid: true,
            showdividers: true,
            showticklabels: true,
            showline: false,
            //fixedrange: true
          },
          yaxis: {
            range: [-0.05, 1.05],
            title: this.translateService.instant('criteria.mobility'),
            tick0: 0,
            dtick: 0.5,/*
            ticks: 'outside',*/
            showgrid: true,
            showdividers: true,
            showticklabels: true,
            showline: false,
            //fixedrange: true
          }
        };
      }
    }));

    this.updateChartData();
  }

  ngAfterViewInit(): void {

    this.updateChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['substancesData'] && changes['substancesData'].currentValue && !changes['substancesData'].firstChange) {
      this.substances = changes['substancesData'].currentValue;
      this.updateChartData();
    }
    this.updateChartData();
  }

  updateChartData() {

    this.runSubscription(this.translateService.get(['substance.toxic','substance.nonToxic', 'substance.pm']).subscribe({
      next: () => {
        const newData: Array<any> = [];
        var traceAreaPM = {
          name: this.translateService.instant('substance.pm'),
          x: [0.33, 0.33, 1, 1],
          y: [0.33, 1, 1, 0.33],
          type: 'scatter',
          mode: 'none',
          fill: 'toself',
          fillcolor: '#3873af',
          line: {
            color: '#3873af'
          },
          opacity: 0.7,
          hoverlabel: {
            namelength: -1
          }
        };
        newData.push(traceAreaPM);

        var traceAreaVPVM = {
          name: this.translateService.instant('substance.vPvM'),
          x: [0.5, 0.5, 1, 1],
          y: [0.5, 1, 1, 0.5],
          type: 'scatter',
          mode: 'none',
          fill: 'toself',
          fillcolor: '#3873af',
          line: {
            color: '#3873af'
          },
          hoverlabel: {
            namelength: -1
          }
        };
        newData.push(traceAreaVPVM);

        var traceAreaM = {
          name: this.translateService.instant('substance.m'),
          x: [0.0, 0.0, 0.33, 0.33],
          y: [0.33, 0.5, 0.5, 0.33],
          type: 'scatter',
          mode: 'none',
          fill: 'toself',
          fillcolor: '#83b5f9',
          line: {
            color: '#004c99'
          },
          hoverlabel: {
            namelength: -1
          }
        };
        newData.push(traceAreaM);

        var traceAreaVm = {
          name: this.translateService.instant('substance.vM'),
          x: [0.0, 0.0, 0.33, 0.33],
          y: [0.5, 1, 1, 0.5],
          type: 'scatter',
          mode: 'none',
          fill: 'toself',
          fillcolor: '#4990e1',
          line: {
            color: '#004c99'
          },
          hoverlabel: {
            namelength: -1
          }
        };
        newData.push(traceAreaVm);

        var traceAreaP = {
          name: this.translateService.instant('substance.p'),
          x: [0.33, 0.33, 0.5, 0.5],
          y: [0.0, 0.33, 0.33, 0.0],
          type: 'scatter',
          mode: 'none',
          fill: 'toself',
          fillcolor: '#bdd5f6',
          line: {
            color: '#3888af'
          },
          hoverlabel: {
            namelength: -1
          }
        };
        newData.push(traceAreaP);

        var traceAreaVp = {
          name: this.translateService.instant('substance.vP'),
          x: [0.5, 0.5, 1, 1],
          y: [0.0, 0.33, 0.33, 0.0],
          type: 'scatter',
          mode: 'none',
          fill: 'toself',
          fillcolor: '#52a6db',
          line: {
            color: '#3888af'
          },
          hoverlabel: {
            namelength: -1
          }
        };
        newData.push(traceAreaVp);

        var legendNonToxic = {
          name: this.translateService.instant('substance.nonToxic'),
          x: [null],
          y: [null],
          mode: 'markers',
          type: 'scatter',
          marker: {
            color: '#000000',
            size: 16
          },
          fillcolor: '#000000',
          legendgroup: 'nonToxic',
          showlegend: true,
          visible: true,
          hoverlabel: {
            namelength: -1
          }
        };
        newData.push(legendNonToxic);

        var legendToxic = {
          name: this.translateService.instant('substance.toxic'),
          x: [null],
          y: [null],
          mode: 'markers',
          type: 'scatter',
          marker: {
            color: '#6cbb00',
            size: 16,
          },
          legendgroup: 'toxic',
          showlegend: true,
          visible: true,
          hoverlabel: {
            namelength: -1
          }
        };
        newData.push(legendToxic);

        this.substances?.forEach((substance: Substance) => {
          /*const persistence = Math.round((Number(substance.persistence !== undefined && substance.persistence !== '' ? (substance.persistence as string).replace(',', '.') as string : '') + Number.EPSILON) * 100) / 100;
          const mobility = Math.round((Number(substance.mobility !== undefined && substance.mobility !== '' ? (substance.mobility as string).replace(',', '.') as string : '') + Number.EPSILON) * 100) / 100;
          const toxicity = Math.round((Number(substance.toxicity !== undefined && substance.toxicity !== '' ? (substance.toxicity as string).replace(',', '.') as string : '') + Number.EPSILON) * 100) / 100;*/
          const persistence = Math.round((Number(substance.persistence !== undefined && substance.persistence !== '' ? substance.persistence : '') + Number.EPSILON) * 100) / 100;
          const mobility = Math.round((Number(substance.mobility !== undefined && substance.mobility !== '' ? substance.mobility : '') + Number.EPSILON) * 100) / 100;
          const toxicity = Math.round((Number(substance.toxicity !== undefined && substance.toxicity !== '' ? substance.toxicity : '') + Number.EPSILON) * 100) / 100;


          if (toxicity <= this.limitOfToxicity) {
            const traceNonToxic = {
              name: substance.substanceName,
              x: [persistence],
              y: [mobility],
              hoverinfo: 'name',
              mode: 'markers',
              type: 'scatter',
              marker: {
                color: '#000000',
                size: 16,
                line: {
                  color: 'rgba(156, 165, 196, 1.0)',
                  width: 1,
                },
              },
              legendgroup: 'nonToxic',
              showlegend: false,
              hoverlabel: {
                namelength: -1
              }
            };
            newData.push(traceNonToxic);
          } else {
            const traceToxic = {
              name: substance.substanceName,
              x: [persistence],
              y: [mobility],
              hoverinfo: 'name',
              mode: 'markers',
              type: 'scatter',
              marker: {
                color: '#6cbb00',
                size: 16,
                line: {
                  color: 'rgba(156, 165, 196, 1.0)',
                  width: 1,
                },
              },
              legendgroup: 'toxic',
              showlegend: false,
              hoverlabel: {
                namelength: -1
              }
            };
            newData.push(traceToxic);
          }

        });

        this.dataPointAreaChart = newData;
        Plotly.newPlot('pointAreaChart', this.dataPointAreaChart, this.layoutPointArea, this.configAreaChart);

        var myPlot: any = document.getElementById('pointAreaChart'),
        data = this.dataPointAreaChart,
        layout = this.layoutPointArea;

        const that = this;
        myPlot.on('plotly_click', function(data: any){
          var pts = '';
          let subsName = '';
          for(var i=0; i < data.points.length; i++){
              pts = 'x = '+data.points[i].x +'\ny = '+
                  data.points[i].y ;
              subsName = data.points[i].data.name;
          }
          //alert('Point clicked:\n\n'+pts+'\nName: '+ subsName);
          that.substanceDetailComponent.showSubstanceDetailDialog(subsName);
        });
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
