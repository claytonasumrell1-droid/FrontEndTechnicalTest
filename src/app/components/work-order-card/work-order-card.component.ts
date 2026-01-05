import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WorkOrderDocument } from '../../models';

@Component({
  selector: 'app-work-order-card',
  templateUrl: './work-order-card.component.html',
  styleUrls: ['./work-order-card.component.css']
})
export class WorkOrderCardComponent {
  @Input() order!: WorkOrderDocument;
  @Output() edit = new EventEmitter<void>();

  onKeydown(e: KeyboardEvent) {
    const k = e.key;
    if (k === 'Enter' || k === ' ') {
      e.preventDefault();
      this.edit.emit();
    }
  }
}
