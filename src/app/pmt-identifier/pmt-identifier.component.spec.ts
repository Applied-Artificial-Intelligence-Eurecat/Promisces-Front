import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmtIdentifierComponent } from './pmt-identifier.component';

describe('PmtIdentifierComponent', () => {
  let component: PmtIdentifierComponent;
  let fixture: ComponentFixture<PmtIdentifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmtIdentifierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmtIdentifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
