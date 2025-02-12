import { Component } from '@angular/core';
import {MenuItem, MessageService} from 'primeng/api';
import { AppMainComponent } from '../app.main.component';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(private translateService: TranslateService,
              private appMain: AppMainComponent,
              private router: Router,
              private messageService: MessageService) {

  }

  ngOnInit() {
  }

  navigateToIdentifier() {
    this.router.navigateByUrl('/identifier');
  }
  navigateToSubstance() {
    this.router.navigateByUrl('/substance');
  }
  navigateToAssessment() {
    this.router.navigateByUrl('/assessment');
  }
  navigateToSolution() {
    this.router.navigateByUrl('/solution');
  }
  navigateToStrategy() {
    this.router.navigateByUrl('/strategy');
  }

}
