import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IOrderLine } from '../order-line.model';

@Component({
  standalone: true,
  selector: 'jhi-order-line-detail',
  templateUrl: './order-line-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class OrderLineDetailComponent {
  orderLine = input<IOrderLine | null>(null);

  previousState(): void {
    window.history.back();
  }
}
