import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppMainComponent } from './app.main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StrategyComponent } from './strategy/strategy.component';
import { SolutionComponent } from './solution/solution.component';
import { AboutComponent } from './about/about.component';
import { LegalNoticeComponent } from './legal/legal-notice/legal-notice.component';
import { CookiesPolicyComponent } from './legal/cookies-policy/cookies-policy.component';
import { PrivacyPolicyComponent } from './legal/privacy-policy/privacy-policy.component';
import { SubstanceSearchComponent } from './substance-search/substance-search.component';
import { PmtIdentifierComponent } from './pmt-identifier/pmt-identifier.component';
import { PmtAssessmentComponent } from './pmt-assessment/pmt-assessment.component';

const routes: Routes = [
  {
      path: '', component: AppMainComponent,
      children: [
        { path: '', component: DashboardComponent },
        { path: 'identifier', component: PmtIdentifierComponent },
        { path: 'assessment', component: PmtAssessmentComponent },
        { path: 'solution', component: SolutionComponent },
        { path: 'strategy', component: StrategyComponent },
        { path: 'substance', component: SubstanceSearchComponent },
        { path: 'about', component: AboutComponent },
        { path: 'cookies', component: CookiesPolicyComponent },
        { path: 'privacy', component: PrivacyPolicyComponent },
        { path: 'legal', component: LegalNoticeComponent }
      ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
