import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WorkCenterDocument, WorkOrderDocument } from '../models';
import { WORK_CENTERS, WORK_ORDERS } from '../sample-data';

@Injectable({ providedIn: 'root' })
export class WorkDataService {
  private centers = WORK_CENTERS.slice();
  private orders = WORK_ORDERS.slice();

  public centers$ = new BehaviorSubject<WorkCenterDocument[]>(this.centers);
  public orders$ = new BehaviorSubject<WorkOrderDocument[]>(this.orders);

  getCenters() {
    return this.centers$;
  }

  getOrders() {
    return this.orders$;
  }

  addOrder(order: WorkOrderDocument) {
    this.orders.push(order);
    this.orders$.next(this.orders.slice());
  }

  updateOrder(updated: WorkOrderDocument) {
    const idx = this.orders.findIndex(o => o.docId === updated.docId);
    if (idx > -1) {
      this.orders[idx] = updated;
      this.orders$.next(this.orders.slice());
    }
  }

  deleteOrder(docId: string) {
    this.orders = this.orders.filter(o => o.docId !== docId);
    this.orders$.next(this.orders.slice());
  }

  // Check overlap for a candidate order on same work center (exclude optional docId)
  hasOverlap(candidateStartIso: string, candidateEndIso: string, workCenterId: string, excludeDocId?: string) {
    const cStart = new Date(candidateStartIso).getTime();
    const cEnd = new Date(candidateEndIso).getTime();
    return this.orders.some(o => {
      if (o.data.workCenterId !== workCenterId) return false;
      if (excludeDocId && o.docId === excludeDocId) return false;
      const s = new Date(o.data.startDate).getTime();
      const e = new Date(o.data.endDate).getTime();
      // overlap when ranges intersect
      return cStart <= e && cEnd >= s;
    });
  }
}
