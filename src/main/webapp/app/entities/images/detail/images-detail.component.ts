import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IImages } from '../images.model';

@Component({
  standalone: true,
  selector: 'jhi-images-detail',
  templateUrl: './images-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ImagesDetailComponent {
  images = input<IImages | null>(null);

  previousState(): void {
    window.history.back();
  }
}
