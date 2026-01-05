import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-top-controls',
  templateUrl: './top-controls.component.html',
  styleUrls: ['./top-controls.component.css']
})
export class TopControlsComponent {
  @Input() timescale: string = 'day';
  @Output() timescaleChange = new EventEmitter<string>();
}
