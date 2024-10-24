import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAliment } from '../aliment.model';
import { AlimentService } from '../service/aliment.service';

@Component({
  standalone: true,
  templateUrl: './aliment-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AlimentDeleteDialogComponent {
  aliment?: IAliment;

  protected alimentService = inject(AlimentService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.alimentService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
