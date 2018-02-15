import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ClarityModule } from 'clarity-angular';
import { AppComponent } from './app.component';
import {NetworkingTopologyDesktopComponent} from './networking-topology-desktop/networking-topology-desktop.component';


@NgModule({
  declarations: [
    AppComponent,
    NetworkingTopologyDesktopComponent
  ],
  imports: [
    BrowserModule,
    ClarityModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
