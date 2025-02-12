import { Component, OnDestroy } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SubstanceDetailDialogComponent } from './substance-detail-dialog/substance-detail-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { Substance, SubstanceDetailSearch } from '../models/substance';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-substance-detail',
  templateUrl: './substance-detail.component.html',
  styleUrls: ['./substance-detail.component.scss']
})
export class SubstanceDetailComponent implements OnDestroy {

  private subscriptions: Subscription[] = [];
  refDetail: DynamicDialogRef | undefined;

  constructor(
    private dialogService: DialogService,
    private translateService: TranslateService
  ) {

  }

  showSubstanceDetailDialog(substanceName: string = '', substanceCas: string = '') {
    const substanceDetailSearch: SubstanceDetailSearch = new SubstanceDetailSearch();
    substanceDetailSearch.name = substanceName;
    if (substanceCas !== '' && substanceCas !== null) {
      substanceDetailSearch.cas_n = substanceCas;
    }

    this.refDetail = this.dialogService.open(SubstanceDetailDialogComponent, {
        header: this.translateService.instant('substance.details-title'),
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: substanceDetailSearch
    });

    this.runSubscription(this.refDetail.onClose.subscribe((substance: Substance) => {
        if (substance) {
          console.log('close substance detail');
        }
    }));
  }

  runSubscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());

    if (this.refDetail) {
        this.refDetail.close();
        this.refDetail.destroy();
    }
  }
}
