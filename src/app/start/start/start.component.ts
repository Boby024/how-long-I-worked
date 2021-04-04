import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import * as moment from 'moment';

export const checkFormStatus: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const endDate = control.get('endDate');
  const unitHours = control.get('unitHours');
  const unitMinutes = control.get('unitMinutes');
  const pattern = /^\d+(\.\d+)*$/;
  let status = false;

  // unitHours?.setValidators(Validators.pattern(/^\d+(\.\d+)*$/));
  // unitHours?.updateValueAndValidity();
  if (endDate?.value) {
    status = true;
  } else if (unitHours?.value && pattern.test(unitHours?.value)) {
    status = true;
  } else if (unitMinutes?.value && pattern.test(unitMinutes?.value)) {
    status = true;
  }
  return  status ? { checkFormStatusRevealed: status } : null;
};

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  dateGroupForm = this.fb.group({
    startDate: [null, Validators.required],
    endDate: [{value: null, disabled: true}],
    idUnit: [{value: null, disabled: true}],
    unitHours: [{value: null, disabled: true}],
    unitMinutes: [{value: null, disabled: true}],
    unitHoursMinutes: [{value: null, disabled: true}],
    disabledValue: [false]
  }, { validators: checkFormStatus });
  disabled = false;
  unitHoursBoolean = false;
  unitMinutesBoolean = false;
  unitHoursMinutesBoolean = false;

  units = [
    {id: 1, value: 'hour(s)'},
    {id: 2, value: 'minute(s)'},
    // {id: 3, value: 'hour(s) : minute(s)'},
  ];
  myDatePickerFrom: any;
  resultStatus = false;
  resultString1 = '';
  resultString2 = '';
  resultStringForSelectedUnit = '';
  howToUseBoolean = false;
  /* howToUse = [
    {id: 1, headerText: 'To convert time to number of hours:',
      arraysText: [
        {id: 1, text: `let's explain with an example: `}
      ]
    }
  ]; */
  myTimePicker: any;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formControlValueChanged();
  }

  formControlValueChanged(): void {
    // tslint:disable-next-line: deprecation
    this.dateGroupForm.controls.startDate.valueChanges.subscribe((selectedValue) => {
      this.myDatePickerFrom = selectedValue;
      this.dateGroupForm.controls.endDate.enable();
      this.dateGroupForm.controls.idUnit.enable();
    });
    // tslint:disable-next-line: deprecation
    this.dateGroupForm.controls.idUnit.valueChanges.subscribe((selectedValue) => {
      if (selectedValue !== null ) {
        this.dateGroupForm.controls.endDate.reset();
        this.dateGroupForm.controls.endDate.disable();
        this.disabled = true;
        if (selectedValue === 1) {
          this.dateGroupForm.controls.unitMinutes.reset();
          this.unitMinutesBoolean = false;
          this.unitHoursBoolean = true;
          this.dateGroupForm.controls.unitHours.enable();
        } else if (selectedValue === 2) {
          this.dateGroupForm.controls.unitHours.reset();
          this.unitHoursBoolean = false;
          this.unitMinutesBoolean = true;
          this.dateGroupForm.controls.unitMinutes.enable();
        } /* else if (selectedValue === 3) {
          this.dateGroupForm.controls.unitHours.reset();
          this.dateGroupForm.controls.unitMinutes.reset();
          this.unitHoursBoolean = false;
          this.unitMinutesBoolean = false;
          this.unitHoursMinutesBoolean = true;
          this.dateGroupForm.controls.unitHoursMinutes.enable();
        } */
      }
    });

    // tslint:disable-next-line: deprecation
    this.dateGroupForm.controls.disabledValue.valueChanges.subscribe((selectedValue) => {
      if (selectedValue === true) {
        this.dateGroupForm.controls.endDate.enable();
        this.dateGroupForm.controls.idUnit.reset();
        this.dateGroupForm.controls?.idUnit.disable();
        this.dateGroupForm.controls.unitHours.reset();
        this.dateGroupForm.controls?.unitHours.disable();
        this.dateGroupForm.controls.unitMinutes.reset();
        this.dateGroupForm.controls?.unitMinutes.disable();
      } else {
        this.dateGroupForm.controls.endDate.reset();
        this.dateGroupForm.controls.endDate.disable();
        this.dateGroupForm.controls?.idUnit.enable();
        this.dateGroupForm.controls?.unitHours.enable();
        this.dateGroupForm.controls?.unitMinutes.enable();
      }
    });
  }

  onCalculate(): void {
    this.resultStatus = true;
    this.resultString1 = '';
    this.resultString2 = '';
    this.resultStringForSelectedUnit = '';

    if (this.dateGroupForm.get('endDate')?.value) {
      let result = moment(new Date(this.dateGroupForm.get('startDate')?.value).toISOString())
                      .diff(moment(new Date(this.dateGroupForm.get('endDate')?.value).toISOString()), 'minutes');
      result = - 1 * result;
      const hours = Math.floor(result / 60);
      const minutes = result % 60;

      this.resultString1 = `${hours} hours ${minutes} minutes`;
      if (minutes === 0) {
        this.resultString1 = `${hours}:00`;
      }
      this.resultString2 = `${result / 60} hours`;
    } else if (this.dateGroupForm.get('unitHours')?.value) {
      const result = moment(new Date(this.dateGroupForm.get('startDate')?.value).toISOString())
                      .add(this.dateGroupForm.get('unitHours')?.value, 'hours');
      this.resultStringForSelectedUnit = result.format('DD/MM/YYYY hh:mm:ss');
    } else if (this.dateGroupForm.get('unitMinutes')?.value) {
      const result = moment(new Date(this.dateGroupForm.get('startDate')?.value).toISOString())
                      .add(this.dateGroupForm.get('unitMinutes')?.value, 'minutes');
      this.resultStringForSelectedUnit = result.format('DD/MM/YYYY hh:mm:ss');
    }
  }

  onClear(): void {
    this.resultStatus = false;
    this.resultString1 = '';
    this.resultString2 = '';
    this.resultStringForSelectedUnit = '';

    this.dateGroupForm.reset();
    this.dateGroupForm.controls.endDate.disable();
    this.disabled = false;
    this.dateGroupForm.controls.idUnit.disable();
    this.dateGroupForm.controls.unitHours.disable();
    this.dateGroupForm.controls.unitMinutes.disable();
    this.unitHoursBoolean = false;
    this.unitMinutesBoolean = false;
  }

}
