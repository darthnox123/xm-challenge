import { Component, Input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-loading-spinner',
    templateUrl: './loading-spinner.component.html',
    styleUrls: ['./loading-spinner.component.scss'],
    imports: [MatProgressSpinner]
})
export class LoadingSpinnerComponent {
  @Input() diameter = 40;
}
