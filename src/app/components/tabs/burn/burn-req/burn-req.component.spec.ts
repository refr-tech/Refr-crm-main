import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurnReqComponent } from './burn-req.component';

describe('BurnReqComponent', () => {
  let component: BurnReqComponent;
  let fixture: ComponentFixture<BurnReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BurnReqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BurnReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
