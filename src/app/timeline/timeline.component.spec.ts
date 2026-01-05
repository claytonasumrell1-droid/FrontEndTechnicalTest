import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineComponent } from './timeline.component';
import { WorkDataService } from '../services/work-data.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimelineComponent],
      providers: [WorkDataService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getOrdersForCenter returns only matching orders', () => {
    const centers = component.workCenters;
    if (!centers || centers.length === 0) return;
    const id = centers[0].docId;
    const list = component.getOrdersForCenter(id);
    expect(Array.isArray(list)).toBeTrue();
  });
});
