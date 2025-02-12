import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Substance, SubstanceDetailSearch } from '../../models/substance';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SubstanceService } from '../../services/substance.service';
import { SolutionComponent } from '../../solution/solution.component';
import { SolutionDetailSearch } from '../../models/solution';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-substance-detail-dialog',
  templateUrl: './substance-detail-dialog.component.html',
  styleUrls: ['./substance-detail-dialog.component.scss']
})
export class SubstanceDetailDialogComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  substance: Substance = new Substance();

  constructor(
    //private substanceService: SubstanceService
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private substanceService: SubstanceService,
    private solutionComponent: SolutionComponent,
    private changeDetectorRef: ChangeDetectorRef
    ) {}

  ngOnInit(): void {
    this.getSubstanceDetail(this.config.data);

  }

  private getSubstanceDetail(substanceDataSearch: SubstanceDetailSearch = new SubstanceDetailSearch()) {
    this.runSubscription(this.substanceService.retrieveSubstanceDetail(substanceDataSearch).subscribe({
      next: (substance: Substance) => {
        this.changeDetectorRef.detectChanges();
        if (substance && substance !== undefined) {
          this.substance = substance;
        }
      },
      error: (error) => {
        this.ref.close();
        console.error(error);
      },
      complete: () => {
        console.log('ok');
      }
    }));
  }

  /*
  onBtnOkPressed() {
    this.ref.close();
  }*/

  runSubscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
