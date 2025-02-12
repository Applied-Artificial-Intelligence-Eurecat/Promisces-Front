import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceCubeChartComponent } from './substance-cube-chart.component';

describe('SubstanceCubeChartComponent', () => {
  let component: SubstanceCubeChartComponent;
  let fixture: ComponentFixture<SubstanceCubeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceCubeChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubstanceCubeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
