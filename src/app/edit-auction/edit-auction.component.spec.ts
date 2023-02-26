import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAuctionComponent } from './edit-auction.component';

describe('EditAuctionComponent', () => {
  let component: EditAuctionComponent;
  let fixture: ComponentFixture<EditAuctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAuctionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
