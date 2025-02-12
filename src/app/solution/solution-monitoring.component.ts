import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { Substance } from './../models/substance';
import { SolutionService } from "../services/solution.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-solution-monitoring',
  templateUrl: './solution-monitoring.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SolutionMonitoringComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  substancesiPMTMethod: Array<Substance> = [];
  substancesPFASMethod: Array<Substance> = [];

  comparativeAllMethods: Array<any> = [];
  comparativePFASMethods: Array<any> = [];
  analyticalMethods: Array<any> = [];

  constructor(private solutionService: SolutionService) {
    this.retrieveSubstancesIPMTMethod();
    this.retrieveSubstancesPFASMethod();
  }

  ngOnInit(): void {
    this.comparativeAllMethods = [
      {
        name: 'Matrix',
        bafg: 'Surface water',
        bwb: 'Drinking, ground, surface water, wastewater',
        csic1: 'WWTP effluent',
        csic2: 'Groundwater'
      },
      {
        name: 'Separation',
        bafg: 'UPLC',
        bwb: 'UPLC',
        csic1: 'UPLC',
        csic2: 'GC<sup>α</sup>'
      },
      {
        name: 'Analyser',
        bafg: 'Triple quadrupole',
        bwb: 'Orbitrap (HRMS)',
        csic1: 'Q-TOF (HRMS)',
        csic2: 'Single quadrupole MS'
      },
      {
        name: 'Sample preparation',
        bafg: 'Direct injection',
        bwb: 'Online-SPE',
        csic1: 'Online-SPE',
        csic2: 'PT'
      },
      {
        name: '# PMTs analytes',
        bafg: '26',
        bwb: '21',
        csic1: '42',
        csic2: '59'
      },
      {
        name: '# Internal standards',
        bafg: '16',
        bwb: '8',
        csic1: '22',
        csic2: '3'
      },
      {
        name: 'LOQ (ng/L)',
        bafg: '1-200',
        bwb: '12-369',
        csic1: '0.02-321',
        csic2: '8.4-6400'
      }
    ];
    this.analyticalMethods = [
      {
        name: 'Waters (surface and groundwaters)',
        tuw: 'x',
        brgm1: 'x',
        brgm2: 'x',
        bwb: 'x'
      },
      {
        name: 'Waste water Effluent',
        tuw: 'x',
        brgm1: 'x',
        brgm2: 'x',
        bwb: ''
      },
      {
        name: 'Waste water Influent',
        tuw: 'x',
        brgm1: '',
        brgm2: '',
        bwb: ''
      },
      {
        name: 'Landfill leachates',
        tuw: '',
        brgm1: '',
        brgm2: 'x',
        bwb: ''
      },
      {
        name: 'Sludge',
        tuw: '',
        brgm1: 'x',
        brgm2: 'x',
        bwb: ''
      }
    ];
    this.comparativePFASMethods = [
      {
        name: 'Matrix',
        acea1: 'Sediment, sludge',
        acea2: 'Leachate, concentrate, liquid waste',
        ipgp1: 'Drinking water, Ground water, WWTP effuent, process water',
        ipgp2: 'Sediment, sooil, sludge',
        bwb1: 'Drinking water, wastewater',
        bwb2: 'Surface water, wastewater',
        csic1: 'Drinking water, ground water, WWTP in-& effuent, process water',
        csic2: 'Sediment, soil, sludge, lettuce',
        wien1: 'Aqueous matrices',
        wien2: 'Sludge, sediment'
      },
      {
        name: 'Separation',
        acea1: 'UPLC',
        acea2: 'UPLC',
        ipgp1: 'UPLC',
        ipgp2: 'UPLC',
        bwb1: 'UPLC',
        bwb2: 'UPLC',
        csic1: 'UPLC',
        csic2: 'UPLC',
        wien1: 'HPLC',
        wien2: 'HPLC'
      },
      {
        name: 'Analyser',
        acea1: 'Triple quadrupole',
        acea2: 'Triple quadrupole',
        ipgp1: 'Triple quadrupole',
        ipgp2: 'Triple quadrupole',
        bwb1: 'Triple quadrupole',
        bwb2: 'Orbitrap (HRMS)',
        csic1: 'Orbitrap (HRMS)',
        csic2: 'Orbitrap (HRMS)',
        wien1: 'Triple quadrupole',
        wien2: 'Triple quadrupole'
      },
      {
        name: 'Sample preparation',
        acea1: 'Ultrasonic extraction w/ MeOH. Sediment: concentrate',
        acea2: 'Dilution w/ H2O+MeOH. Washing water, permeate: DI',
        ipgp1: '(DI)',
        ipgp2: '(DI)',
        bwb1: '1:1 MeOH dilution. Optional auto-SPE',
        bwb2: 'Online-SPE',
        csic1: 'SLE',
        csic2: 'SPE',
        wien1: 'Solid: Online-SPE. (Aqueous: DI)',
        wien2: 'Sludge: Ultrasonic extraction'
      },
      {
        name: '# PFAS analytes',
        acea1: '30',
        acea2: '30',
        ipgp1: '56',
        ipgp2: '56',
        bwb1: '30',
        bwb2: '27',
        csic1: '29',
        csic2: '29',
        wien1: '34',
        wien2: '34'
      },
      {
        name: '# extracted internal standards',
        acea1: '1',
        acea2: '',
        ipgp1: '',
        ipgp2: '',
        bwb1: '',
        bwb2: '19',
        csic1: '20',
        csic2: '20',
        wien1: '24',
        wien2: '24'
      },
      {
        name: '# non-extracted internal calibration standards',
        acea1: '19',
        acea2: '19',
        ipgp1: '22',
        ipgp2: '22',
        bwb1: '19',
        bwb2: '',
        csic1: '2',
        csic2: '2',
        wien1: '7',
        wien2: '7'
      },
      {
        name: 'Limit of quantification in ng/L',
        acea1: '',
        acea2: '15 - 75 (washing water, leachate). 1000 - 10000 (liquid waste)',
        ipgp1: '15 - 100 (process water, WWTP effuent). 2 - 15 (groundwater, surfacewater)',
        ipgp2: '',
        bwb1: '1 - 5 (0.01 - 0.05 w/ automated SPE)',
        bwb2: '25 - 100',
        csic1: '0.13 - 5.44 (surface water). 0.15 - 12.40 (effuent water). 0.69 - 49.60 (influent water)',
        csic2: '',
        wien1: '1 - 10',
        wien2: ''
      },
      {
        name: 'Limit of quantification in ug/kg',
        acea1: '10 - 50 (sludge). 0.050 - 0.250 (sediment)',
        acea2: '',
        ipgp1: '',
        ipgp2: '0.040 - 0.300 (soil). 160 - 1200 (sludge)',
        bwb1: '',
        bwb2: '',
        csic1: '',
        csic2: '0.13 - 4.96 (sediment). 0.04 - 9.92 (lettuce)',
        wien1: '',
        wien2: '0.1 - 0.5 (soil). 1 - 20 (sludge)'
      }
    ];
  }

  retrieveSubstancesIPMTMethod() {
    this.runSubscription(this.solutionService.retrieveSubstancesIPMTMethodData().subscribe({
      next: (response: any) => {
        console.log('Retrieved substances iPMT monitoring data');
        this.substancesiPMTMethod = response ? response : [];
      },
      error: (error: any) => {
        console.error('error retrieving substances iPMT monitoring data');
      },
      complete: () => {
        console.log('ok retrieving substances');
      }
    }));
  }

  retrieveSubstancesPFASMethod() {
    this.runSubscription(this.solutionService.retrieveSubstancesPFASMethodData().subscribe({
      next: (response: any) => {
        console.log('Retrieved substances PFAS monitoring data');
        this.substancesPFASMethod = response ? response : [];
      },
      error: (error: any) => {
        console.error('error retrieving substances PFAS monitoring data');
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
