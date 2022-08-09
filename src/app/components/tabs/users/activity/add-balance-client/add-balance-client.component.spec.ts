import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBalanceClientComponent } from './add-balance-client.component';

describe('AddBalanceClientComponent', () => {
  let component: AddBalanceClientComponent;
  let fixture: ComponentFixture<AddBalanceClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBalanceClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBalanceClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
