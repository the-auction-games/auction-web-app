import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionGridComponent } from './auction-grid.component';

describe('AuctionGridComponent', () => {
  let component: AuctionGridComponent;
  let fixture: ComponentFixture<AuctionGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuctionGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuctionGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
