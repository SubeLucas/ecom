import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IAliment } from '../aliment.model';

@Component({
  standalone: true,
  selector: 'jhi-aliment-detail',
  templateUrl: './aliment-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class AlimentDetailComponent {
  aliment = input<IAliment | null>(null);

  previousState(): void {
    window.history.back();
  }
}
