import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBalanceVendorComponent } from './add-balance-vendor.component';

describe('AddBalanceVendorComponent', () => {
  let component: AddBalanceVendorComponent;
  let fixture: ComponentFixture<AddBalanceVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBalanceVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBalanceVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
