import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IClientOrder } from '../client-order.model';

@Component({
  standalone: true,
  selector: 'jhi-client-order-detail',
  templateUrl: './client-order-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ClientOrderDetailComponent {
  clientOrder = input<IClientOrder | null>(null);

  previousState(): void {
    window.history.back();
  }
}
