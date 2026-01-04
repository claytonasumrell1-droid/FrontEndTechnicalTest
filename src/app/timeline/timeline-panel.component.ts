import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkOrderDocument } from '../models';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-timeline-panel',
  templateUrl: './timeline-panel.component.html',
  styleUrls: ['./timeline-panel.component.css']
})
export class TimelinePanelComponent implements OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() order: WorkOrderDocument | null = null;
  @Input() workCenterId?: string;

  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<WorkOrderDocument>();
  @Output() delete = new EventEmitter<string>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      status: ['open', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.order && this.order) {
      this.form.patchValue({
        name: this.order.data.name,
        status: this.order.data.status,
        startDate: this.order.data.startDate,
        endDate: this.order.data.endDate
      });
    }

    if (this.mode === 'create' && this.workCenterId) {
      this.form.reset({ name: '', status: 'open', startDate: '', endDate: '' });
    }
  }

  private toIso(d: NgbDateStruct | null): string {
    if (!d) return '';
    const mm = String(d.month).padStart(2, '0');
    const dd = String(d.day).padStart(2, '0');
    return `${d.year}-${mm}-${dd}`;
  }

  onDateSelect(date: NgbDateStruct, controlName: 'startDate' | 'endDate') {
    const iso = this.toIso(date);
    this.form.get(controlName)?.setValue(iso);
  }

  onCancel() {
    this.cancel.emit();
  }

  onDelete() {
    if (this.order) this.delete.emit(this.order.docId);
  }

  onSave() {
    if (this.form.invalid) return;

    const v = this.form.value;
    const doc: WorkOrderDocument = this.mode === 'edit' && this.order ? {
      docId: this.order.docId,
      docType: 'workOrder',
      data: { name: v.name, status: v.status, startDate: v.startDate, endDate: v.endDate, workCenterId: this.order.data.workCenterId }
    } : {
      docId: `wo-${Date.now()}`,
      docType: 'workOrder',
      data: { name: v.name, status: v.status, startDate: v.startDate, endDate: v.endDate, workCenterId: this.workCenterId || '' }
    };

    this.save.emit(doc);
  }
}
