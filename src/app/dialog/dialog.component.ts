import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogComponent {

  hourValue: number = 12;
  minuteValue: number = 0;
  period: string = 'AM';

  mode: 'add' | 'update' | 'delete';

  taskData: Task;

  TaskForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private builder: FormBuilder)
  {
    this.mode = data.mode;
    this.taskData = data.task;

    this.TaskForm = this.builder.group({
      QuoteID: [this.taskData?.QuoteID || '0'],
      QuoteType: [this.taskData?.QuoteType || 'Auto'],
      Sales: [this.taskData?.Sales || '', Validators.required],
      Premium: [this.taskData?.Premium || '', Validators.required],
      DueDate: new FormControl(this.taskData?.DueDate ? new Date(this.taskData.DueDate) : new Date()),
      Description: [this.taskData?.Description || '', Validators.required],
    });
  }

  onSubmitClick(): void {
    if (this.TaskForm.valid) {
      const task: Task = this.TaskForm.value;
      console.log('Returning Task:', task);
      this.dialogRef.close({ action: this.mode, task });
    } else {
      console.log('Form is invalid');
      this.dialogRef.close();
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close({ action: this.mode });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  incrementHour(): void {
    let date = this.TaskForm.get('DueDate')?.value;
    let hour = date.getHours();
    hour = (hour % 12) + 1;
    date.setHours(this.convertTo24Hour(hour, this.getPeriod()));
    this.TaskForm.get('DueDate')?.setValue(date);
  }

  decrementHour(): void {
    let date = this.TaskForm.get('DueDate')?.value;
    let hour = date.getHours();
    hour = (hour - 1) === 0 ? 12 : (hour - 1);
    date.setHours(this.convertTo24Hour(hour, this.getPeriod()));
    this.TaskForm.get('DueDate')?.setValue(date);
  }

  incrementMinute(): void {
    let date = this.TaskForm.get('DueDate')?.value;
    let minute = date.getMinutes();
    minute = (minute + 1) % 60;
    date.setMinutes(minute);
    this.TaskForm.get('DueDate')?.setValue(date);
  }

  decrementMinute(): void {
    let date = this.TaskForm.get('DueDate')?.value;
    let minute = date.getMinutes();
    minute = (minute - 1 + 60) % 60;
    date.setMinutes(minute);
    this.TaskForm.get('DueDate')?.setValue(date);
  }

  private convertTo24Hour(hour: number, period: string): number {
    if (period === 'PM' && hour < 12) {
      return hour + 12;
    }
    if (period === 'AM' && hour === 12) {
      return 0;
    }
    return hour;
  }

  getPeriod(): string {
    let hour = this.TaskForm.get('DueDate')?.value.getHours();
    return hour >= 12 ? 'PM' : 'AM';
  }

  getFormattedHour(): string {
    let hour = this.TaskForm.get('DueDate')?.value.getHours();
    hour = hour % 12 || 12;
    return hour.toString().padStart(2, '0');
  }

  getFormattedMinute(): string {
    let minute = this.TaskForm.get('DueDate')?.value.getMinutes();
    return minute.toString().padStart(2, '0');
  }

}

export interface Task {
  QuoteID: number;
  QuoteType: string;
  Description: string;
  Sales: string;
  DueDate: Date;
  Premium: number;
}