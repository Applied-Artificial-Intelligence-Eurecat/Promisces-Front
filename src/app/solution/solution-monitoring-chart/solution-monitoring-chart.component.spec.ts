import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionMonitoringChartComponent } from './solution-monitoring-chart.component';

describe('SolutionMonitoringChartComponent', () => {
  let component: SolutionMonitoringChartComponent;
  let fixture: ComponentFixture<SolutionMonitoringChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolutionMonitoringChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolutionMonitoringChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
