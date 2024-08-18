import { Component, Inject, InjectionToken, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

export const SNACKBAR_DATA = new InjectionToken<any>('SNACKBAR_DATA');

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class SnackBarComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}
