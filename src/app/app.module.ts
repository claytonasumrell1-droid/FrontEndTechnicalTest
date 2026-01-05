import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppComponent } from './app.component';
import { TimelineComponent } from './timeline/timeline.component';
import { TimelinePanelComponent } from './timeline/timeline-panel.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopControlsComponent } from './components/top-controls/top-controls.component';
import { WorkOrderCardComponent } from './components/work-order-card/work-order-card.component';
import { RightPanelComponent } from './components/right-panel/right-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    TimelinePanelComponent,
    HeaderComponent,
    SidebarComponent,
    TopControlsComponent,
    WorkOrderCardComponent,
    RightPanelComponent
  ],
    imports: [BrowserModule, ReactiveFormsModule, FormsModule, NgbModule, NgSelectModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
