import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridViewAuctionComponent } from './grid-view-auction.component';

describe('GridViewAuctionComponent', () => {
  let component: GridViewAuctionComponent;
  let fixture: ComponentFixture<GridViewAuctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridViewAuctionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridViewAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
