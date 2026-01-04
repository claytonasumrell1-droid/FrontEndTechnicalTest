import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppComponent } from './app.component';
import { TimelineComponent } from './timeline/timeline.component';
import { TimelinePanelComponent } from './timeline/timeline-panel.component';

@NgModule({
  declarations: [AppComponent, TimelineComponent, TimelinePanelComponent],
    imports: [BrowserModule, ReactiveFormsModule, FormsModule, NgbModule, NgSelectModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
