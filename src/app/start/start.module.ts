import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { StartComponent } from './start/start.component';


@NgModule({
  declarations: [
    StartComponent,
  ],
  imports: [
    SharedModule
  ],
  exports: [ StartComponent ]
})
export class StartModule { }
