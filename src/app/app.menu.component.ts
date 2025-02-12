import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit} from '@angular/core';
import {AppComponent} from './app.component';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    styleUrls: ['./app.menu.component.scss']
})
export class AppMenuComponent implements OnInit {

    model: MenuItem[] = [];
    visible: boolean = true;

    constructor(public app: AppComponent,
      private readonly translateService: TranslateService) {

      }

    ngOnInit() {
      this.translateService.get(['menu.home', 'menu.features', 'menu.pmtIdentifier',
        'menu.pmtAssessment', 'menu.solutionAssessment', 'menu.possibleStrategies',
        'menu.searchSubstances', 'menu.about', 'menu.profile', 'menu.contact']).subscribe({
        next: () => {
          this.model = [
            {
              label: this.translateService.instant('menu.home'), routerLink: ['/']
            }, 
            { label: this.translateService.instant('menu.pmtIdentifier'), routerLink: '/identifier' },
            { label: this.translateService.instant('menu.pmtAssessment'), routerLink: '/assessment' },
            { label: this.translateService.instant('menu.solutionAssessment'), routerLink: '/solution' },
            { label: this.translateService.instant('menu.possibleStrategies'), routerLink: '/strategy' },
            { label: this.translateService.instant('menu.searchSubstances'), routerLink: '/substance' }
            ,
            {
              label: this.translateService.instant('menu.about'), routerLink: ['/about']
            }
          ];
        }
      });

    }
}
