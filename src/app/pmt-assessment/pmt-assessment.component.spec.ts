import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmtAssessmentComponent } from './pmt-assessment.component';

describe('PmtAssessmentComponent', () => {
  let component: PmtAssessmentComponent;
  let fixture: ComponentFixture<PmtAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmtAssessmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmtAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
