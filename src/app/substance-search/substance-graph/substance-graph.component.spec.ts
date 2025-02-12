import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceGraphComponent } from './substance-graph.component';

describe('SubstanceGraphComponent', () => {
  let component: SubstanceGraphComponent;
  let fixture: ComponentFixture<SubstanceGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubstanceGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
