import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { StartComponent } from './start/start.component';
import { DatetimepickerComponent } from '../shared/datetimepicker/datetimepicker.component';



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
