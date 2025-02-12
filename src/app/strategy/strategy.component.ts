import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StrategyComponent implements OnInit{

  constructor(
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
  }

}
