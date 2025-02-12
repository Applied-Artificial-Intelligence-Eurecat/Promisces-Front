import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import Plotly from 'plotly.js-dist-min';
import { Substance } from '../../models/substance';
import { TranslateService } from '@ngx-translate/core';
import { PageResponse } from 'src/app/models/pageResponse';
import { SubstanceService } from 'src/app/services/substance.service';
import { Sample, SampleSubstance } from 'src/app/models/sample';
import { SelectItem } from 'primeng/api';

export enum FieldFilterTable {
  SubstanceName = 'substanceName',
  CasNumber = 'casNumber',
  SampleMatrix = 'sampleMatrix'
}

@Component({
  selector: 'app-solution-monitoring-chart',
  templateUrl: './solution-monitoring-chart.component.html',
  styleUrls: ['./solution-monitoring-chart.component.scss']
})
export class SolutionMonitoringChartComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  @ViewChild('substanceTable', { static: true }) substanceTable: any;

  sampleSubstances: Array<SampleSubstance> = [];
  sampleSubstancesList: Array<SampleSubstance> = [];
  matrices: {[key: string]: Array<{[key: string]: any}>} = {};
  matricesFiltered: {[key: string]: Array<{[key: string]: any}>} = {};
  sampleMatrixOptions: Array<SelectItem> = [];
  flagFilerFromLegend: boolean = false;
  flagFilerFromRelayoutBox: boolean = false;
  flagFilerFromRelayoutBar: boolean = false;

  loading!: boolean;
  lastEventFilter?: {filteredValue: any[], filters: {}};
  totalRecords: number = 0;
  first: number = 0;
  last: number = 0;

  dataMonitoringBoxChart: Array<any> = [];
  dataMonitoringBarChart: Array<any> = [];
  layoutMonitoringBox: any = {};
  layoutMonitoringBar: any = {};
  configChart: any =  {responsive: true, scrollZoom: false};

  constructor(
    private translateService: TranslateService,
    private substanceService: SubstanceService
    ) {}
  ngOnInit(): void {
    this.runSubscription(this.translateService.get(['criteria.persistence','criteria.mobility']).subscribe({
      next: () => {
        this.layoutMonitoringBox = {
          title: {
            text: this.translateService.instant('solution.occurrenceSubstanceAcrossMatrices')
          },
          xaxis: {
            title: this.translateService.instant('solution.concentrationOccurence')
          },
          yaxis: {
            title: this.translateService.instant('solution.industrialCompound'),
            titlefont: {
              size: 14
            },
            tickfont: {
              size: 10
            },
            titlepad: 40,
            automargin: true // Ensures enough margin for y-axis labels
          },
          boxmode: 'group',
          showlegend: true,
          margin: {
            l: 150 // Add extra left margin to ensure y-axis labels are visible
          }
        };

        this.layoutMonitoringBar = {
          barmode: 'stack',
          title: {
            text: this.translateService.instant('solution.frequencyAboveLOQ')
          },
          xaxis: {
            title: this.translateService.instant('solution.numberSamples')
          },
          yaxis: {
            showticklabels: false,
            title: '',
            //tickmode: 'array',
          },
          showlegend: true,
          margin: {
          }
        };
      }
    }));

    Plotly.newPlot('solutionMonitoringBoxChart', this.dataMonitoringBoxChart, this.layoutMonitoringBox, this.configChart);
    Plotly.newPlot('solutionMonitoringBarChart', this.dataMonitoringBarChart, this.layoutMonitoringBar, this.configChart);

    this.retrieveSubstances();
  }


  onFilterTable(event: any | {filteredValue: any[], filters: {}}) {
    console.log(`Filter changed values: ${event.filteredValue.length}`);
    this.lastEventFilter = event;
    if (this.flagFilerFromLegend) {
      this.flagFilerFromLegend = false;
    } else {
      this.updatePlots(event.filteredValue)
    }
  }

  buildData(substances: Array<Substance> = []) {

    //this.matricesFiltered = {};

    substances.length>0 ? substances.forEach((sub: Substance) => {
      if (sub.samples && sub.samples.length>0) {
        sub.samples.forEach((sample: Sample) => {
          /** fil sampleMatrix options */
          let indMat = this.sampleMatrixOptions.findIndex(m => m.label == sample.sampleMatrix);
          if (indMat == -1) {
            this.sampleMatrixOptions.push({label: sample.sampleMatrix, value: sample.sampleMatrix});
          }
          /** build data table */
          var substanceSample: SampleSubstance = new SampleSubstance();
          substanceSample = {
            ...sample,
            substanceName: sub.substanceName,
            casNumber: sub.casNumber
          };
          this.sampleSubstancesList.push(substanceSample);
          /** build data by matrix */
          /*if (sample.sampleMatrix && sample.sampleMatrix!==undefined && this.matricesFiltered.hasOwnProperty(sample.sampleMatrix as any)) {
            this.matricesFiltered[sample.sampleMatrix as any].push({[sub.substanceName]: sample.concentration});
          } else {
            this.matricesFiltered[sample.sampleMatrix as any] = [{[sub.substanceName]: sample.concentration}];//push();
          }*/
        });
      }
    }) : [];
    this.sampleSubstances = this.sampleSubstancesList;
    this.updatePlots(this.sampleSubstancesList);
  }

  updatePlots(samplesSubstance: Array<SampleSubstance>) {

    this.matricesFiltered = {};
    samplesSubstance.forEach((sample: SampleSubstance) => {
      /** build data by matrix */
      if (sample.sampleMatrix && sample.sampleMatrix!==undefined && this.matricesFiltered.hasOwnProperty(sample.sampleMatrix as any)) {
        this.matricesFiltered[sample.sampleMatrix as any].push({[sample.substanceName]: sample.concentration});
      } else {
        this.matricesFiltered[sample.sampleMatrix as any] = [{[sample.substanceName]: sample.concentration}];//push();
      }
    });

    this.dataMonitoringBoxChart = [];
    this.dataMonitoringBarChart = [];
    Plotly.purge('solutionMonitoringBoxChart');
    Plotly.purge('solutionMonitoringBarChart');

    this.runSubscription(this.translateService.get(['substance.toxic','substance.nonToxic']).subscribe({
      next: () => {
        const keyMatrices = Object.keys(this.matricesFiltered);

        const traceColors: Array<string> = [];

        for (let i = 0; i < keyMatrices.length; i++) {
          /** generate random color */
          const randomColor = "hsl( " + this.makeColor(i, keyMatrices.length) + ", 80%, 50% )";
          traceColors.push(randomColor);
        }

        let yValue: Array<any> = [];
        let yAlias: Array<any> = [];

        keyMatrices.length>0 ? keyMatrices.forEach((keyMat: any, ind: any) => {
          const mat = this.matricesFiltered[keyMat];
          let yBox: any = [];
          let xBox: any = [];
          let xBar: any = [];
          let yBar: Array<any> = [];

          mat.forEach((val: any) => {
            let matKey = Object.keys(val)[0];
            let matValues = Object.values(val)[0];
            yBox.push(matKey);
            xBox.push(matValues);

            yValue.push(matKey);
            let matAlias = (matKey).substring(0,10);
            if (matKey.length>10) {
              matAlias=matAlias+'...';
            }
            yAlias.push(matAlias);

            let index = yBar.findIndex(s => s==matKey);
            if (index !== -1) {
              xBar[index] = Number(xBar[index])+1;
            } else {
              yBar.push(matKey);
              xBar.push(1);
            }
          });

          this.dataMonitoringBoxChart.push({
            name: keyMat,
            boxmode: 'group',
            x: xBox,
            y: yBox,
            text: yBox,
            textposition: 'none',
            boxpoints: 'all',
            pointpos: -0.1,
            jitter: 0.3,
            type: 'box',
            fillcolor: 'transparent',
            line: {
              width: 1,
              color: traceColors[ind]
            },
            hovertemplate: "<b>%{x}</b><br>" +
            "%{y}<br>" +
            "<extra></extra>",
            boxmean: false,
            orientation: 'h',
            showlegend: false
          });

          this.dataMonitoringBarChart.push({
            name: keyMat,
            mode: 'markers',
            x: xBar,
            y: yBar,
            text: yBar,
            textposition: 'none',
            orientation: 'h',
            marker: {
              color: traceColors[ind],
              width: 1
            },
            type: 'bar',
            showlegend: true,
            hovertemplate: "<b>%{x}</b><br>" +
            "%{y}<br>" +
            "<extra></extra>",
          });
        }) : [];

        let boxyAxis = {};
        boxyAxis = {
          ...this.layoutMonitoringBox.yaxis,
          tickvals: yValue,
          ticktext: yAlias
        };
        //this.layoutMonitoringBox.yaxis = boxyAxis;

        let baryAxis = {};
        baryAxis = {
          ...this.layoutMonitoringBar.yaxis,
          tickvals: yValue,
          ticktext: yAlias
        };
        //this.layoutMonitoringBar.yaxis = baryAxis;

        var myPlotBox: any = document.getElementById('solutionMonitoringBoxChart'),
        data = this.dataMonitoringBoxChart,
        layout = this.layoutMonitoringBox;

        var myPlotBar: any = document.getElementById('solutionMonitoringBarChart'),
        data = this.dataMonitoringBarChart,
        layout = this.layoutMonitoringBar;

        const that = this;

        Plotly.newPlot('solutionMonitoringBoxChart', this.dataMonitoringBoxChart, this.layoutMonitoringBox, this.configChart).
        then(pbox => {
          pbox.on('plotly_click', function(clickData) {
            /** autorrange layouts */
            /*pbox.layout.xaxis.autorange = true;
            pbox.layout.yaxis.autorange = true;
            pbox.layout.xaxis.showspikes = false;
            pbox.layout.yaxis.showspikes = false;
            pbox.layout.xaxis.range = clickData.points[0].xaxis.range;
            pbox.layout.yaxis.range = clickData.points[0].yaxis.range;*/
            //myPlotBar.layout.yaxis.autorange = true;
            //myPlotBar.layout.xaxis.autorange = pbox.layout.xaxis.range;
            //myPlotBar.layout.yaxis.autorange = pbox.layout.yaxis.range;

            that.filterDataTable([clickData.points[0].y], FieldFilterTable.SubstanceName, 'in');
          });
          pbox.on('plotly_doubleclick', function() {
            console.log('double click boxes');

            pbox.layout.xaxis.autorange = true;
            pbox.layout.yaxis.autorange = true;
            pbox.layout.xaxis.showspikes = false;
            pbox.layout.yaxis.showspikes = false;

            myPlotBar.layout.xaxis.autorange = true;
            myPlotBar.layout.yaxis.autorange = true;
            myPlotBar.layout.xaxis.showspikes = false;
            myPlotBar.layout.yaxis.showspikes = false;
            that.filterDataTable();
          });
          pbox.on('plotly_relayout', function(clickData: any) {
            console.log(clickData["xaxis.range[0]"] +' - ' +  clickData['xaxis.range[0]']);
            console.log('relayout boxes ');
            if (that.flagFilerFromRelayoutBar) {
              that.flagFilerFromRelayoutBar = false;
              /** test with calcdata */
              let substancesNameSelected: Array<string> = [];
              var yRange = [clickData['yaxis.range[0]'], clickData['yaxis.range[1]']];
              myPlotBar.calcdata.forEach((data: any) => {
                if (data.length>0) {
                  data.forEach((val: any) => {
                    if ((val?.y && yRange && yRange[0] && yRange[1]) && val?.y > yRange[0] && val?.y < yRange[1]) {
                      let index = substancesNameSelected.indexOf(val.tx);
                      if (index == -1) {
                        substancesNameSelected.push(val.tx);
                      }
                    }
                  });
                }
              });
              //that.flagFilerFromLegend = true;
              that.filterDataTable(substancesNameSelected, FieldFilterTable.SubstanceName, 'in');
              console.log('y inside bar ' + JSON.stringify(substancesNameSelected));
            } else {
              that.flagFilerFromRelayoutBox = true;
              //Plotly.relayout(myPlotBar, clickData);
              that.relayoutPlot(clickData, myPlotBar);
            }
            //that.relayoutPlot(clickData, myPlotBox);

           // var xRange = [clickData['xaxis.range[0]'], clickData['xaxis.range[1]']];
            //var yRange = [clickData['yaxis.range[0]'], clickData['yaxis.range[1]']];
              /*var xInside = [];
              var yInside = [];
            myPlotBox.data.forEach((trace: any) => {
              var len = Math.min(trace.x.length, trace.y.length);
              for (var i = 0; i < len; i++) {
                var x = trace.x[i];
                var y = trace.y[i];
                if(x > xRange[0] && x < xRange[1] && y > yRange[0] && y < yRange[1]) {
                  xInside.push(x);
                  yInside.push(y);
                }
              }
              //console.log('y values');
            });*/
              /*var yRange: Array<any> = myPlotBox.layout.yaxis.range;
              if (yRange[0] < 0) {
                yRange[0] = -1;
              }
              for (var i = parseInt(yRange[0]) + 1;i < parseInt(yRange[1]) + 1 && i < data[0].y.length;i++) {
                yInside.push(data[0].y[i]);
              }
              console.log('y values inside' + JSON.stringify(yInside));*/
          });
        });

        Plotly.newPlot('solutionMonitoringBarChart', this.dataMonitoringBarChart, this.layoutMonitoringBar, this.configChart).
        then(pbar => {
          pbar.on('plotly_relayout', function(clickData) {
            console.log('relayout bars ');
            if (that.flagFilerFromRelayoutBox) {
              that.flagFilerFromRelayoutBox = false;
              /** test with calcdata */
              let substancesNameSelected: Array<string> = [];
              var yRange = [clickData['yaxis.range[0]'], clickData['yaxis.range[1]']];
              myPlotBar.calcdata.forEach((data: any) => {
                if (data.length>0) {
                  data.forEach((val: any) => {
                    if ((val?.y && yRange && yRange[0] && yRange[1]) && val?.y > yRange[0] && val?.y < yRange[1]) {
                      let index = substancesNameSelected.indexOf(val.tx);
                      if (index == -1) {
                        substancesNameSelected.push(val.tx);
                      }
                    }
                  });
                }
              });
              //that.flagFilerFromLegend = true;
              that.filterDataTable(substancesNameSelected, FieldFilterTable.SubstanceName, 'in');
            } else {
              that.flagFilerFromRelayoutBar = true;
              //Plotly.relayout(myPlotBox, clickData);
              that.relayoutPlot(clickData, myPlotBox);
            }

            //Plotly.relayout(myPlotBar, clickData);

            /*var yInside = [];
            var yRange: Array<any> = myPlotBar.layout.yaxis.range;
            if (yRange[0] < 0) {
              yRange[0] = -1;
            }
            for (var i = parseInt(yRange[0]) + 1; i < parseInt(yRange[1]) + 1 && i < data[0].y.length;i++) {
              yInside.push(data[0].y[i]);
            }
            console.log('y values inside' + JSON.stringify(yInside));*/
          });
          pbar.on('plotly_click', function(clickData) {
            //console.log('click bar '+clickData);
            /** autorrange layouts */
           /*pbar.layout.xaxis.autorange = true;
            pbar.layout.yaxis.autorange = true;
            pbar.layout.xaxis.showspikes = false;
            pbar.layout.yaxis.showspikes = false;
            myPlotBox.layout.xaxis.autorange = true;
            myPlotBox.layout.yaxis.autorange = true;
            myPlotBox.layout.xaxis.autorange = pbar.layout.xaxis.range;
            myPlotBox.layout.yaxis.autorange = pbar.layout.yaxis.range;*/
            that.filterDataTable([clickData.points[0].y], FieldFilterTable.SubstanceName, 'in');
          });
          pbar.on('plotly_doubleclick', function() {
            //console.log('double click bar');
            pbar.layout.xaxis.autorange = true;
            pbar.layout.yaxis.autorange = true;
            pbar.layout.xaxis.showspikes = false;
            pbar.layout.yaxis.showspikes = false;

            myPlotBox.layout.xaxis.autorange = true;
            myPlotBox.layout.yaxis.autorange = true;
            myPlotBox.layout.xaxis.showspikes = false;
            myPlotBox.layout.yaxis.showspikes = false;

            that.filterDataTable();
          });
        });

        myPlotBar.on('plotly_legendclick', function(data: any) {
          // Get the clicked legend item
          var clickedItem = data.curveNumber;
          let nameMatriceClicked = data.data[clickedItem].name;
          //console.log('clicked legend ' +nameMatriceClicked);
          /*** update box plot */
          var index = -1;
          var visible: boolean | undefined = undefined;
          for (var i = 0; i < myPlotBox.data.length; i++) {
            if (myPlotBox.data[i].name === nameMatriceClicked) {
              visible = myPlotBox.data[i].visible !== undefined ? !myPlotBox.data[i].visible : false;
              index = i;
            }
          }
          if (index !== -1) {
            Plotly.restyle('solutionMonitoringBoxChart', {'visible': visible}, [index]);
          }
          /** update data table */
          var filteredMatrices: Array<string> = [];
          data.fullData.forEach((m: any) => {
            /** check if is the current matrix */
            if (m.name == nameMatriceClicked) {
              if (m.visible!=true) {
                filteredMatrices.push(m.name);
              }
            } else if (m.visible==true) {
              filteredMatrices.push(m.name);
            }
          });

          that.flagFilerFromLegend=true;
          if (filteredMatrices.length>0) {
            that.filterDataTable(filteredMatrices, FieldFilterTable.SampleMatrix, 'in');
          } else {
            that.filterDataTable([''], FieldFilterTable.SampleMatrix, 'in');
          }
        });
      }
    }));
  }

  relayoutPlot(event: any, div: any) {
    if (Object.entries(event).length === 0) {
      return;
    }
    let x = div.layout.xaxis;
    let y = div.layout.yaxis;
    if (event['xaxis.autorange'] && x.autorange && event['yaxis.autorange'] && y.autorange) {
      this.filterDataTable();
      //return;
    }
    /*if (x.range[0] != event['xaxis.range[0]'] || x.range[1] != event['xaxis.range[1]']
      || y.range[0] != event['yaxis.range[0]'] || y.range[1] != event['yaxis.range[1]']
    ) {
      var update = {
      'xaxis.range[0]': event['xaxis.range[0]'],
      'xaxis.range[1]': event['xaxis.range[1]'],
      'xaxis.autorange': event['xaxis.autorange'],
      'yaxis.range[0]': event['yaxis.range[0]'],
      'yaxis.range[1]': event['yaxis.range[1]'],
      'yaxis.autorange': event['yaxis.autorange'],
     };
    }*/
    Plotly.relayout(div, event);
    return;
  }

  filterDataTable(value: any = null, field: any = null, operator: any = null) {
    if ((value == null && field == null && operator == null) || !(value.length > 0)) {
      this.substanceTable.reset();
    } else {
      if (this.flagFilerFromLegend && field == FieldFilterTable.SubstanceName) {
        this.substanceTable.filter(value, field, operator);
      } else {
        this.substanceTable.filter(value, field, operator);
      }
    }
  }

  makeColor(colorNum: any, colors: any){
    if (colors < 1) colors = 1;
    // defaults to one color - avoid divide by zero
    return colorNum * (360 / colors) % 360;
  }

  retrieveSubstances() {
    this.loading = true;
    this.runSubscription(this.substanceService.retrieveDataTargetedChemical().subscribe({
      next: (response: PageResponse<Substance>) => {
        console.log('retrievePage. Retrieved substances');
        //console.log('retrievePage. Retrieved  ' + response.entities.length + ' substances');
        let substances: Array<Substance> = [];

        if (response?.data && response.data.length>0) {
          substances = response.data;
          this.buildData(substances);
        }

      },
      error: (error: any) => {
        console.error('error retrieving substances targeted chemical monitoring data');
      },
      complete: () => {
        console.log('ok retrieving substances');
        this.loading = false;
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
