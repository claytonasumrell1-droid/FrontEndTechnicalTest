import { TestBed } from '@angular/core/testing';
import { TimelineComponent } from './timeline.component';
import { WorkDataService } from '../services/work-data.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Timeline create flow', () => {
  let component: TimelineComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [TimelineComponent], providers: [WorkDataService], schemas: [NO_ERRORS_SCHEMA] });
    const fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('openCreate sets panelOpen and panelOrder with date', () => {
    component.openCreate('wc-1', '2025-01-10');
    expect(component.panelOpen).toBeTrue();
    expect(component.panelOrder).toBeDefined();
    expect(component.panelOrder?.data.workCenterId).toBe('wc-1');
    expect(component.panelOrder?.data.startDate).toBe('2025-01-10');
  });
});
