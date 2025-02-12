import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceSearchComponent } from './substance-search.component';

describe('SubstanceSearchComponent', () => {
  let component: SubstanceSearchComponent;
  let fixture: ComponentFixture<SubstanceSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubstanceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
