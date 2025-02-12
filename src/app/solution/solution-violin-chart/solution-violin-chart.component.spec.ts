import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionViolinChartComponent } from './solution-violin-chart.component';

describe('SolutionViolinChartComponent', () => {
  let component: SolutionViolinChartComponent;
  let fixture: ComponentFixture<SolutionViolinChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolutionViolinChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolutionViolinChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
