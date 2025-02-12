import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { Substance } from "../models/substance";
import { Subscription } from "rxjs";
import { BodyRequest, BodyRequestFilters } from "../models/bodyRequest";
import { SubstanceService } from "../services/substance.service";

@Component({
  selector: 'app-solution-prevention',
  templateUrl: './solution-prevention.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SolutionPreventionComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  substancesData: Array<Substance> = [];

  constructor(
    private substanceService: SubstanceService
  ) {}

  ngOnInit(): void {

  }

  runSubscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  searchSubstances() {

    const request: BodyRequest = new BodyRequest();
    request.pageSize = 1000;
    request.offset = 1;
    request.page = 1;

    const filters = new BodyRequestFilters();

    this.runSubscription(this.substanceService.retrieveSubstancesSearch(new BodyRequest(), filters).subscribe({
      next: (response: any) => {
        console.log('retrievePage. Retrieved ');
        this.substancesData = response?.data && response?.data.length>0 ? response.data : [];
      },
      error: (error: any) => {
        console.log();
      },
      complete: () => {
        console.log('ok');
      }
    }));
  }
}
