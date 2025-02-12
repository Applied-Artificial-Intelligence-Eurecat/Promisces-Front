import {Component} from '@angular/core';
import {AppComponent} from './app.component';
import {AppMainComponent} from './app.main.component';
@Component({
    selector: 'app-topbar',
    templateUrl: 'app.topbar.component.html',
    styleUrls: ['./app.topbar.component.scss']
})
export class AppTopBarComponent {

    constructor(public appMain: AppMainComponent, public app: AppComponent) {
    }
    
}
