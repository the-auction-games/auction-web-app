import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridViewActivityComponent } from './grid-view-activity.component';

describe('GridViewActivityComponent', () => {
  let component: GridViewActivityComponent;
  let fixture: ComponentFixture<GridViewActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridViewActivityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridViewActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
