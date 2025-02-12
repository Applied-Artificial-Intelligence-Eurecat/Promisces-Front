import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceSearchBarChartComponent } from './substance-search-bar-chart.component';

describe('SubstanceSearchBarChartComponent', () => {
  let component: SubstanceSearchBarChartComponent;
  let fixture: ComponentFixture<SubstanceSearchBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceSearchBarChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubstanceSearchBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
