import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstancePointAreaChartComponent } from './substance-point-area-chart.component';

describe('SubstancePointAreaChartComponent', () => {
  let component: SubstancePointAreaChartComponent;
  let fixture: ComponentFixture<SubstancePointAreaChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstancePointAreaChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubstancePointAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
