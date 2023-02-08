import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageViewAuctionComponent } from './page-view-auction.component';

describe('PageViewAuctionComponent', () => {
  let component: PageViewAuctionComponent;
  let fixture: ComponentFixture<PageViewAuctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageViewAuctionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageViewAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
