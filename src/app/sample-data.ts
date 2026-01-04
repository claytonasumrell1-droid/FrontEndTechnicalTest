import { WorkCenterDocument, WorkOrderDocument } from './models';

export const WORK_CENTERS: WorkCenterDocument[] = [
  { docId: 'wc-1', docType: 'workCenter', data: { name: 'Extrusion Line A' } },
  { docId: 'wc-2', docType: 'workCenter', data: { name: 'CNC Machine 1' } },
  { docId: 'wc-3', docType: 'workCenter', data: { name: 'Assembly Station' } },
  { docId: 'wc-4', docType: 'workCenter', data: { name: 'Quality Control' } },
  { docId: 'wc-5', docType: 'workCenter', data: { name: 'Packaging Line' } }
];

// Helper to format ISO date strings
const d = (y: number, m: number, day: number) => new Date(y, m - 1, day).toISOString().split('T')[0];

export const WORK_ORDERS: WorkOrderDocument[] = [
  {
    docId: 'wo-1',
    docType: 'workOrder',
    data: {
      name: 'Order 1001',
      workCenterId: 'wc-1',
      status: 'complete',
      startDate: d(2025, 12, 1),
      endDate: d(2025, 12, 3)
    }
  },
  {
    docId: 'wo-2',
    docType: 'workOrder',
    data: {
      name: 'Order 1002',
      workCenterId: 'wc-3',
      status: 'in-progress',
      startDate: d(2025, 12, 5),
      endDate: d(2025, 12, 12)
    }
  },
  {
    docId: 'wo-3',
    docType: 'workOrder',
    data: {
      name: 'Order 1003',
      workCenterId: 'wc-4',
      status: 'blocked',
      startDate: d(2025, 12, 8),
      endDate: d(2025, 12, 20)
    }
  },
  {
    docId: 'wo-4',
    docType: 'workOrder',
    data: {
      name: 'Order 1004',
      workCenterId: 'wc-2',
      status: 'open',
      startDate: d(2025, 12, 10),
      endDate: d(2025, 12, 15)
    }
  },
  {
    docId: 'wo-5',
    docType: 'workOrder',
    data: {
      name: 'Order 1005',
      workCenterId: 'wc-1',
      status: 'in-progress',
      startDate: d(2025, 12, 6),
      endDate: d(2025, 12, 9)
    }
  },
  {
    docId: 'wo-6',
    docType: 'workOrder',
    data: {
      name: 'Order 1006',
      workCenterId: 'wc-5',
      status: 'open',
      startDate: d(2025, 12, 14),
      endDate: d(2025, 12, 18)
    }
  },
  {
    docId: 'wo-7',
    docType: 'workOrder',
    data: {
      name: 'Order 1007',
      workCenterId: 'wc-3',
      status: 'complete',
      startDate: d(2025, 11, 25),
      endDate: d(2025, 12, 2)
    }
  },
  {
    docId: 'wo-8',
    docType: 'workOrder',
    data: {
      name: 'Order 1008',
      workCenterId: 'wc-3',
      status: 'open',
      startDate: d(2025, 12, 20),
      endDate: d(2025, 12, 25)
    }
  }
];
