import { TestBed } from '@angular/core/testing';
import { WorkDataService } from './work-data.service';
import { WORK_ORDERS, WORK_CENTERS } from '../sample-data';

describe('WorkDataService', () => {
  let service: WorkDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkDataService);
  });

  it('should provide initial centers and orders', (done) => {
    service.getCenters().subscribe(c => {
      expect(c.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should add, update, and delete orders', (done) => {
    const order = {
      docId: 'test-wo', docType: 'workOrder', data: { name: 'T', workCenterId: WORK_CENTERS[0].docId, status: 'open', startDate: '2025-01-01', endDate: '2025-01-02' }
    } as any;
    service.addOrder(order);
    service.getOrders().subscribe(list => {
      const found = list.find(o => o.docId === 'test-wo');
      if (found) {
        // update
        order.data.name = 'Updated';
        service.updateOrder(order);
        service.getOrders().subscribe(list2 => {
          const u = list2.find(o => o.docId === 'test-wo');
          expect(u?.data?.name).toBe('Updated');
          service.deleteOrder('test-wo');
          service.getOrders().subscribe(list3 => {
            expect(list3.find(o => o.docId === 'test-wo')).toBeUndefined();
            done();
          });
        });
      }
    });
  });

  it('hasOverlap detects overlaps on same center', () => {
    const aStart = '2025-01-01';
    const aEnd = '2025-01-05';
    const bStart = '2025-01-04';
    const bEnd = '2025-01-07';
    const centerId = WORK_CENTERS[0].docId;
    // add base order
    const base = { docId: 'ov-1', docType: 'workOrder', data: { name: 'O', workCenterId: centerId, status: 'open', startDate: aStart, endDate: aEnd } } as any;
    service.addOrder(base);
    expect(service.hasOverlap(bStart, bEnd, centerId)).toBeTrue();
    service.deleteOrder('ov-1');
  });
});
