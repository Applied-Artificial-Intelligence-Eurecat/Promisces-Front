import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceListComponent } from './substance-list.component';

describe('SubstanceListComponent', () => {
  let component: SubstanceListComponent;
  let fixture: ComponentFixture<SubstanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubstanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
