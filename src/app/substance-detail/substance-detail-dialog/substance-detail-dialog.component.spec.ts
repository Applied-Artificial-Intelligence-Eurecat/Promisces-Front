import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceDetailDialogComponent } from './substance-detail-dialog.component';

describe('SubstanceDetailDialogComponent', () => {
  let component: SubstanceDetailDialogComponent;
  let fixture: ComponentFixture<SubstanceDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceDetailDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubstanceDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
