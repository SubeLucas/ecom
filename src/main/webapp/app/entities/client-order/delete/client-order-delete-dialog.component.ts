import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IClientOrder } from '../client-order.model';
import { ClientOrderService } from '../service/client-order.service';

@Component({
  standalone: true,
  templateUrl: './client-order-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ClientOrderDeleteDialogComponent {
  clientOrder?: IClientOrder;

  protected clientOrderService = inject(ClientOrderService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.clientOrderService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
