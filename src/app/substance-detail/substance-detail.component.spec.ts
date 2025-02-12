import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceDetailComponent } from './substance-detail.component';

describe('SubstanceDetailComponent', () => {
  let component: SubstanceDetailComponent;
  let fixture: ComponentFixture<SubstanceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubstanceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
