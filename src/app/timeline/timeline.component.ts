import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { WorkDataService } from '../services/work-data.service';
import { WorkCenterDocument, WorkOrderDocument } from '../models';

type Timescale = 'day' | 'week' | 'month';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  workCenters: WorkCenterDocument[] = [];
  workOrders: WorkOrderDocument[] = [];

  // Simple visible range: today +/- 7 days (Day view mock)
  visibleStart!: Date;
  visibleEnd!: Date;
  cellWidth = 40; // px per day for mock positioning
  timescale: Timescale = 'day';

  // Panel state
  panelOpen = false;
  panelMode: 'create' | 'edit' = 'create';
  panelOrder: WorkOrderDocument | null = null;
  panelWorkCenterId?: string;
  // grid metrics
  totalDays = 0;
  gridWidth = 0;
  todayLeft = 0;

  @ViewChild('rightPanel', { static: false }) rightPanel!: ElementRef<HTMLDivElement>;
  @ViewChild('gridInner', { static: false }) gridInner!: ElementRef<HTMLDivElement>;

  constructor(private data: WorkDataService) {}

  ngOnInit(): void {
    const today = new Date();
    this.visibleStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    this.visibleEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

    this.data.getOrders().subscribe(o => {
      this.workOrders = o;
      this.recalculateGrid();
    });

    // subscribe to centers so the left panel and grid height render
    this.data.getCenters().subscribe(c => {
      this.workCenters = c;
      this.recalculateGrid();
    });
  }

  ngAfterViewInit(): void {
    // center on today after view is ready
    setTimeout(() => this.centerOnDate(new Date()), 50);
  }

  setTimescale(scale: Timescale) {
    this.timescale = scale;
    const today = new Date();
    if (scale === 'day') {
      this.cellWidth = 40;
      this.visibleStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
      this.visibleEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14);
    } else if (scale === 'week') {
      this.cellWidth = 100; // px per week
      this.visibleStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 60);
      this.visibleEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 60);
    } else {
      this.cellWidth = 200; // px per month
      this.visibleStart = new Date(today.getFullYear(), today.getMonth() - 6, 1);
      this.visibleEnd = new Date(today.getFullYear(), today.getMonth() + 6, 1);
    }
    this.recalculateGrid();
  }

  recalculateGrid() {
    // total days inclusive
    const s = new Date(this.visibleStart.getFullYear(), this.visibleStart.getMonth(), this.visibleStart.getDate());
    const e = new Date(this.visibleEnd.getFullYear(), this.visibleEnd.getMonth(), this.visibleEnd.getDate());
    const ms = e.getTime() - s.getTime();
    this.totalDays = Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
    this.gridWidth = this.totalDays * this.cellWidth;
    // compute today's left offset
    this.todayLeft = this.leftForDate(new Date());
    // update gridInner width if available
    if (this.gridInner && this.gridInner.nativeElement) {
      this.gridInner.nativeElement.style.width = this.gridWidth + 'px';
    }
  }

  leftForDate(d: Date) {
    const days = Math.round((d.getTime() - this.visibleStart.getTime()) / (1000 * 60 * 60 * 24));
    return days * this.cellWidth;
  }

  openCreate(workCenterId: string, dateIso?: string) {
    this.panelMode = 'create';
    this.panelWorkCenterId = workCenterId;

    // Prefill a minimal WorkOrderDocument so the panel form is populated
    const today = dateIso ? new Date(dateIso) : new Date();
    const startIso = today.toISOString().split('T')[0];
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const endIso = end.toISOString().split('T')[0];

    this.panelOrder = {
      docId: `wo-${Date.now()}`,
      docType: 'workOrder',
      data: {
        name: 'New Work Order',
        workCenterId: workCenterId,
        status: 'open',
        startDate: startIso,
        endDate: endIso
      }
    };

    this.panelOpen = true;
    // allow view to initialize
    setTimeout(() => {}, 20);
  }

  openEdit(order: WorkOrderDocument) {
    this.panelMode = 'edit';
    this.panelOrder = order;
    this.panelWorkCenterId = undefined;
    this.panelOpen = true;
  }

  closePanel() {
    this.panelOpen = false;
    this.panelOrder = null;
    this.panelWorkCenterId = undefined;
  }

  onSaveOrder(order: WorkOrderDocument) {
    const overlap = this.data.hasOverlap(order.data.startDate, order.data.endDate, order.data.workCenterId, order.docId);
    if (overlap) {
      alert('Overlap detected with existing work orders on this work center.');
      return;
    }
    if (this.panelMode === 'create') {
      this.data.addOrder(order);
    } else {
      this.data.updateOrder(order);
    }
    this.closePanel();
  }

  onDeleteOrder(docId: string) {
    if (!confirm('Delete this work order?')) return;
    this.data.deleteOrder(docId);
    this.closePanel();
  }

  // Convert ISO date to pixel left offset from visibleStart
  leftFor(order: WorkOrderDocument) {
    const s = new Date(order.data.startDate);
    const left = this.leftForDate(s);
    return Math.max(-1000, left); // allow some negative in case order is before visible range
  }

  widthFor(order: WorkOrderDocument) {
    const s = new Date(order.data.startDate).getTime();
    const e = new Date(order.data.endDate).getTime();
    const days = Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1);
    return days * this.cellWidth;
  }

  centerOnDate(date: Date) {
    if (!this.rightPanel || !this.rightPanel.nativeElement) return;
    const container = this.rightPanel.nativeElement;
    const centerLeft = this.leftForDate(date) - container.clientWidth / 2;
    container.scrollLeft = Math.max(0, centerLeft);
  }

  // Handle clicks inside a row to compute which date was clicked and open create with that date
  onRowClick(event: MouseEvent, workCenterId: string) {
    // If clicking an order-bar which stops propagation, this won't run for those clicks
    if (!this.gridInner || !this.rightPanel) {
      this.openCreate(workCenterId);
      return;
    }

    const gridEl = this.gridInner.nativeElement as HTMLElement;
    const container = this.rightPanel.nativeElement as HTMLElement;
    const rect = gridEl.getBoundingClientRect();
    const clientX = event.clientX;
    // account for horizontal scroll of the containing panel
    const x = clientX - rect.left + container.scrollLeft;
    const dayIndex = Math.floor(x / this.cellWidth);
    const clickedDate = new Date(this.visibleStart.getTime() + dayIndex * 24 * 60 * 60 * 1000);
    const iso = clickedDate.toISOString().split('T')[0];
    this.openCreate(workCenterId, iso);
  }

  onRowKeydown(event: KeyboardEvent, workCenterId: string) {
    const k = event.key;
    if (k === 'Enter' || k === ' ') {
      event.preventDefault();
      // open create with today's date when using keyboard
      const todayIso = new Date().toISOString().split('T')[0];
      this.openCreate(workCenterId, todayIso);
    }
  }

  onOrderKeydown(event: KeyboardEvent, order: WorkOrderDocument) {
    const k = event.key;
    if (k === 'Enter' || k === ' ') {
      event.preventDefault();
      this.openEdit(order);
    } else if (k === 'Delete') {
      event.preventDefault();
      if (confirm('Delete this work order?')) {
        this.onDeleteOrder(order.docId);
      }
    }
  }

  // Simple status class
  statusClass(order: WorkOrderDocument) {
    return `status-${order.data.status.replace(/_/g, '-')}`;
  }

  // Return orders for a specific work center (avoids using arrow functions in templates)
  getOrdersForCenter(workCenterId: string) {
    return this.workOrders.filter(o => o.data.workCenterId === workCenterId);
  }
}
