import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WorkOrderDocument } from '../../models';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.css']
})
export class RightPanelComponent {
  @Input() open = false;
  @Input() order: WorkOrderDocument | null = null;
  @Output() close = new EventEmitter<void>();
}
