import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceBarChartComponent } from './substance-bar-chart.component';

describe('SubstanceBarChartComponent', () => {
  let component: SubstanceBarChartComponent;
  let fixture: ComponentFixture<SubstanceBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceBarChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubstanceBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
