import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import Plotly from 'plotly.js-dist-min';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SubstanceService } from 'src/app/services/substance.service';
import { CERoute, CERouteMatrix, MatrixLimit } from 'src/app/models/ceRoute';
import { SolutionService } from 'src/app/services/solution.service';

@Component({
  selector: 'app-solution-violin-chart',
  templateUrl: './solution-violin-chart.component.html',
  styleUrls: ['./solution-violin-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SolutionViolinChartComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  dataViolinChart: Array<any> = [];
  data: Array<any> = [];
  excludedMatrixes: Array<string> = ['Biota', 'Suspended matter', 'Air'];

  layoutViolin: any = {};
  configChart: any =  {responsive: true, scrollZoom: false};

  selectedCeRoute: CERouteMatrix | undefined = undefined;
  ceRoutesList: Array<CERouteMatrix> = [];

  matrixLimitOptions: Array<MatrixLimit> = [];
  selectedMatrix: MatrixLimit | undefined = undefined;
  selectedMatrixLimit: number | null = null;

  constructor(
    private translateService: TranslateService,
    private substanceService: SubstanceService,
    private solutionService: SolutionService
    ) {}

  ngOnInit(): void {
    this.retrieveCeRouteList();

    this.runSubscription(this.translateService.get(['solution.concentration']).subscribe({
      next: () => {
        this.layoutViolin = {
          title: {
            text: this.translateService.instant('solution.monitoredConcentration')
          },
          xaxis: {
            zeroline: false,
            showgrid: true
          },
          yaxis: {
            title: {
              text: this.translateService.instant('solution.concentration')+ ' (ug/L) <b>Log-scale</b>'
            },
            //type: 'log',
            //type: 'linear',
            //dtick: 10,
            //rangemode: 'normal',
            autorange: true
          },
          showlegend: true,
          legend: {
            title: {
              text:'Matrix'
            }
          }
        };

      }
    }));

    this.retrieveMatricesAndLimits();

    this.retrieveDataChart();
  }

  retrieveCeRouteList() {
    this.runSubscription(this.solutionService.retrieveCeRoute().subscribe((response: any) => {
      this.ceRoutesList = response;
      /** fill matrix options to each ce route */
      this.ceRoutesList.map((r: CERouteMatrix) => {
        switch (r.name) {
          case 'route_a':
            r.relatedMatrices = ['Surface water', 'Ground water', 'Soil'];
            break;
          case 'route_b':
            r.relatedMatrices = ['Surface water', 'Waste water', 'Ground water', 'Soil'];
            break;
          case 'route_c':
            r.relatedMatrices = ['Surface water', 'Ground water', 'Sewage sludge', 'Soil'];
            break;
            case 'route_d':
              r.relatedMatrices = ['Surface water', 'Ground water', 'Sediments', 'Soil'];
              break;
            case 'route_e':
              r.relatedMatrices = ['Surface water', 'Ground water', 'Soil'];
              break;
          default:
            break;
        }
        return r;
      })
    }));
  }

  updateChartWithSelectedOptions() {
    /** load data plots by ce route selected */
    let actualData: any = this.data;
    if (this.selectedCeRoute !== undefined && this.selectedCeRoute !== null) {
      this.selectedCeRoute.relatedMatrices;
      let relatedMatrices: any = this.selectedCeRoute.relatedMatrices ? this.selectedCeRoute.relatedMatrices?.join(',') : [];
      actualData = this.data.filter((d: any) => relatedMatrices.includes(d[0]));
    }
    /** update plot */
    this.updateChartData(actualData);
  }

  onChangeMatrixLimitSelected(event: MatrixLimit) {
    this.selectedMatrixLimit = event!==null && event!==undefined ? event.limit : null;
  }

  saveMatrixLimit() {
    if(this.selectedMatrix!==null && this.selectedMatrix!==undefined) {
      this.matrixLimitOptions.map((m: any) => {
        if (m.matrix==this.selectedMatrix?.matrix) {
          m.limit = this.selectedMatrixLimit;
        }
        return m;
      });
    }
    this.updateChartWithSelectedOptions();
  }

  retrieveDataChart() {
    this.runSubscription(this.substanceService.retrieveDataViolinChart().subscribe({
      next: (response: any) => {
        if (response !== null) {
          var dataRes = Object.entries(response);
          this.data = dataRes;
        }
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        this.updateChartData(this.data);
      }
    }));
  }

  retrieveMatricesAndLimits() {
    this.runSubscription(this.solutionService.retrieveDataMatricesAndLimits().subscribe({
      next: (response: any) => {
        this.matrixLimitOptions = response;
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        console.log('ok');
      }
    }));
  }

  updateChartData(data: Array<any>) {
    Plotly.purge('solutionViolinChart');
    this.dataViolinChart = [];
    let annotations: any = [];
    data?.forEach((res: any, ind: any) => {
      if (!this.excludedMatrixes.includes(res[0])) {
        this.dataViolinChart.push(
          {
            name: res[0],
            x: res[0],
            y: res[1].map((val: any) => {
              return Math.log10(val);
            }),
            type: 'violin',
            legendgroup: res[0],
            line: {
              width: 1
            }
          }
        );

        let indMatLimit = this.matrixLimitOptions.findIndex(matLimit => matLimit.matrix==res[0]);
        if (indMatLimit!==-1 && this.matrixLimitOptions[indMatLimit].limit !== null) {
          annotations.push({
            text: '<b>- - - '+this.matrixLimitOptions[indMatLimit].limit+' - - - - - -</b>',
            align: 'left',
            type: 'line',
            ayref: 'y',
            y: this.matrixLimitOptions[indMatLimit].limit,
            x: this.matrixLimitOptions[indMatLimit].matrix,
            showarrow: false,
            font: {
              color: 'red',
              //lineposition: 'over'//'through'+'over'
            }
          });
          this.dataViolinChart.push(
            {
              name: res[0],
              text: '<b>- - - '+this.matrixLimitOptions[indMatLimit].limit+' - - - - - -</b>',
              x: [res[0]],
              y: [this.matrixLimitOptions[indMatLimit].limit],
              type: 'scatter',
              legendgroup: res[0],
              showlegend: false,
              mode: 'text',
              textfont: {
                color: 'red'
              },
              hovertemplate: "%{x}<br>" +
              "<b>Limit: %{y}</b><br>" +
              "<extra></extra>",
              hovertext: 'Limit: ' + this.matrixLimitOptions[indMatLimit].limit,
            }
          );
        }
      }
    });

    Plotly.newPlot('solutionViolinChart', this.dataViolinChart, this.layoutViolin, this.configChart);
  }

  runSubscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
