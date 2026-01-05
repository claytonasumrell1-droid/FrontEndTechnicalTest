import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { WorkDataService } from './work-data.service';
import { WORK_CENTERS } from '../sample-data';

describe('WorkDataService', () => {
  let service: WorkDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkDataService);
  });

  it('should provide initial centers and orders', async () => {
    const centers = await firstValueFrom(service.getCenters());
    expect(centers.length).toBeGreaterThan(0);
    const orders = await firstValueFrom(service.getOrders());
    expect(orders.length).toBeGreaterThan(0);
  });

  it('should add, update, and delete orders', async () => {
    const order = {
      docId: 'test-wo', docType: 'workOrder', data: { name: 'T', workCenterId: WORK_CENTERS[0].docId, status: 'open', startDate: '2025-01-01', endDate: '2025-01-02' }
    } as any;

    service.addOrder(order);
    let list = await firstValueFrom(service.getOrders());
    expect(list.find(o => o.docId === 'test-wo')).toBeDefined();

    order.data.name = 'Updated';
    service.updateOrder(order);
    list = await firstValueFrom(service.getOrders());
    expect(list.find(o => o.docId === 'test-wo')?.data.name).toBe('Updated');

    service.deleteOrder('test-wo');
    list = await firstValueFrom(service.getOrders());
    expect(list.find(o => o.docId === 'test-wo')).toBeUndefined();
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
