import { SolutionComponent } from './solution.component';
import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { Substance } from "../models/substance";
import { Router } from "@angular/router";
import { CERoute } from '../models/ceRoute';
import { Subscription } from 'rxjs';
import Plotly from 'plotly.js-dist-min';
import { SolutionService } from '../services/solution.service';
import { SubstanceService } from '../services/substance.service';
import { PageResponse } from '../models/pageResponse';
import { Factsheet } from '../models/factsheet';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-solution-treatment',
  templateUrl: './solution-treatment.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SolutionTreatmentComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  ceRoutesList: Array<CERoute> = [];
  ceRouteSelected: CERoute | null = null;  data: Array<any> = [];
  preparingData!: boolean;

  factsheets: Array<Factsheet> = [];
  factsheetsFiltered: Array<Factsheet> = [];
  technologies: Array<Factsheet> = [];

  dataTreatmentRemediationBoxChart: Array<any> = [];
  dataTreatmentCostBarChart: Array<any> = [];
  dataTreatmentEnergyBarChart: Array<any> = [];

  layoutTreatmentBox: any = {};
  layoutTreatmentCostBar: any = {};
  layoutTreatmentEnergyBar: any = {};
  configChart: any =  {responsive: true, scrollZoom: false};

  constructor(
    private router: Router,
    private solutionService: SolutionService,
    public solutionComponent: SolutionComponent,
    private substanceService: SubstanceService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {

    this.runSubscription(this.translateService.get(['criteria.persistence','criteria.mobility']).subscribe({
      next: () => {
        this.layoutTreatmentBox = {
          title: {
            text: this.translateService.instant('solution.remediationYield')
          },
          xaxis: {
            title: {
              text: this.translateService.instant('solution.compoundsEachTechnologyIdNumber')
            },
            showgrid: true,
          },
          boxmode: 'group',
          showlegend: true
        };

        this.layoutTreatmentCostBar = {
          barmode: 'stack',
          title: {
            text: this.translateService.instant('solution.costm3')
          },
          xaxis: {
            title: this.translateService.instant('solution.technologyIdNumber')
          },
          showlegend: true
        };

        this.layoutTreatmentEnergyBar = {
          barmode: 'stack',
          title: {
            text: this.translateService.instant('solution.energym3')
          },
          xaxis: {
            title: this.translateService.instant('solution.technologyIdNumber')
          },
          showlegend: true
        };
      }
    }));

    Plotly.newPlot('solutionTreatmentRemediationBoxChart', this.dataTreatmentRemediationBoxChart, this.layoutTreatmentBox, this.configChart);
    Plotly.newPlot('solutionTreatmentCostBarChart', this.dataTreatmentCostBarChart, this.layoutTreatmentCostBar, this.configChart);
    Plotly.newPlot('solutionTreatmentEnergyBarChart', this.dataTreatmentEnergyBarChart, this.layoutTreatmentEnergyBar, this.configChart);

    this.retrieveDataTreatment();
    this.retrieveFactsheets();
    this.retrieveCeRouteList();
  }

  runSubscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  retrieveCeRouteList() {
    this.runSubscription(this.solutionService.retrieveCeRoute().subscribe((response: any) => {
      this.ceRoutesList = response;
    }));
  }

  onChangeCeRouteSelected(event: CERoute) {
    /** load data factsheets by ce route selected */
    this.factsheetsFiltered = [];
    this.factsheetsFiltered = this.factsheets.filter((f: Factsheet) => f.ceRoute == event?.name || f.ceRoute == null);
  }

  updateChartData() {
    this.dataTreatmentRemediationBoxChart = [];
    this.dataTreatmentCostBarChart = [];
    this.dataTreatmentEnergyBarChart = [];
    Plotly.purge('solutionTreatmentRemediationBoxChart');
    Plotly.purge('solutionTreatmentCostBarChart');
    Plotly.purge('solutionTreatmentEnergyBarChart');

    this.runSubscription(this.translateService.get(['substance.toxic','substance.nonToxic']).subscribe({
      next: () => {

        this.technologies.length>0 ? this.technologies.forEach(fact => {
          let yBox: any = [];
          let xBox: any = [];
          let remediationName: Array<string> = [];

          let xBar: any = [];
          let yBar: Array<any> = [];
          let yBar1: Array<any> = [];

          let techName: string = 'Technology '+fact.number;
          xBar.push(techName);
          yBar.push(fact.energy);
          yBar1.push(fact.cost);

          if (fact.remediation && fact.remediation.length>0) {
            fact.remediation?.forEach(r => {
              xBox.push(techName);//r.name//techName
              yBox.push(r.values && r.values.length>0 ? r.values[0] : null);
              remediationName.push(r.name);
            });
          }


            /*let index = yBar.findIndex(s => s==Object.keys(val)[0]);
            if (index !== -1) {
              xBar[index] = Number(xBar[index])+1;
            } else {
              yBar.push(Object.keys(val)[0]);
              xBar.push(1);
            }*/

          this.dataTreatmentRemediationBoxChart.push({
            name: techName,
            //boxmode: 'group',
            x: xBox,
            y: yBox,
            customdata: remediationName,
            boxpoints: 'all',
            pointpos: -0.1,
            jitter: 0.3,
            type: 'box',
            fillcolor: 'transparent',
            line: {
              width: 1,
              //color: '#f8766d'
            },
            boxmean: false,
            //orientation: 'h',
            showlegend: true,
            hovertemplate: "<b>Name: </b>%{customdata}<br>" +
            "<b>Value: </b>%{y}<br>" +
            "<extra></extra>",
          });

          this.dataTreatmentCostBarChart.push({
            name: techName,
            x: xBar,
            y: yBar,
            marker: {
              //color: 'rgba(55,128,191,0.6)',
              width: 1
            },
            type: 'bar',
            showlegend: true,
            hovertemplate: "%{x}<br>" +
            "<b>%{y}</b><br>" +
            "<extra></extra>",
          });

          this.dataTreatmentEnergyBarChart.push({
            name: techName,
            x: xBar,
            y: yBar1,
            marker: {
              //color: 'rgba(55,128,191,0.6)',
              width: 1
            },
            type: 'bar',
            showlegend: true,
            hovertemplate: "%{x}<br>" +
            "<b>%{y}</b><br>" +
            "<extra></extra>",
          });
        }) : [];


        Plotly.newPlot('solutionTreatmentRemediationBoxChart', this.dataTreatmentRemediationBoxChart, this.layoutTreatmentBox, this.configChart).
        then(pbox => {
          pbox.on('plotly_click', function(clickData) {
            console.log('relayout boxes '+clickData)
          });
        });
        Plotly.newPlot('solutionTreatmentCostBarChart', this.dataTreatmentCostBarChart, this.layoutTreatmentCostBar, this.configChart).
        then(pbar => {
          pbar.on('plotly_relayout', function(clickData) {
            console.log('relayout bars '+clickData.title)
          });
          pbar.on('plotly_click', function(clickData) {
            console.log('click bar '+clickData)
          });
        });

        Plotly.newPlot('solutionTreatmentEnergyBarChart', this.dataTreatmentEnergyBarChart, this.layoutTreatmentEnergyBar, this.configChart).
        then(pbar => {
          pbar.on('plotly_relayout', function(clickData) {
            console.log('relayout bars '+clickData.title)
          });
          pbar.on('plotly_click', function(clickData) {
            console.log('click bar '+clickData)
          });
        });
      }
    }));

  }

  navigateToPMTAssessment() {
    this.router.navigateByUrl('/assessment');
  }

  retrieveDataTreatment() {
    this.preparingData=true;
    this.runSubscription(this.substanceService.retrieveDataSolutionTreatment().subscribe({
      next: (response: any) => {
        console.log('retrievePage. Retrieved data');
        let data: Array<any> = [];

        if (response && response.content.length>0) {
          data = response.content;
        }

        this.technologies = data;
        this.updateChartData();
      },
      error: (error: any) => {
        console.error('error retrieving substances targeted chemical monitoring data');
      },
      complete: () => {
        console.log('ok retrieving substances');
        this.preparingData=false;
      }
    }));
  }

  retrieveFactsheets() {
    this.runSubscription(this.substanceService.retrieveDataFactsheets().subscribe({
      next: (response: any) => {
        console.log('retrievePage. Retrieved factsheets');
        this.factsheets = response;
        this.factsheetsFiltered = this.factsheets.filter((f: Factsheet) => f.ceRoute == null);;
      },
      error: (error: any) => {
        console.error('error retrieving factsheets');
      },
      complete: () => {
        console.log('ok retrieving factsheets');
        this.preparingData=false;
      }
    }));
  }

}
