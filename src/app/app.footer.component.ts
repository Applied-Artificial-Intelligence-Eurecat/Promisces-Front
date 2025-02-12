import { TranslateService } from '@ngx-translate/core';
import {Component, OnInit} from '@angular/core';
import {AppComponent} from './app.component';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html'
})
export class AppFooterComponent implements OnInit{

    constructor(
      public app: AppComponent,
      private translateService: TranslateService) {}

      ngOnInit(): void {
      }
}
