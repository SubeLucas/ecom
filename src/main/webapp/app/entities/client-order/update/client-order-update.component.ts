import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { EnumStatus } from 'app/entities/enumerations/enum-status.model';
import { ClientOrderService } from '../service/client-order.service';
import { IClientOrder } from '../client-order.model';
import { ClientOrderFormGroup, ClientOrderFormService } from './client-order-form.service';

@Component({
  standalone: true,
  selector: 'jhi-client-order-update',
  templateUrl: './client-order-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ClientOrderUpdateComponent implements OnInit {
  isSaving = false;
  clientOrder: IClientOrder | null = null;
  enumStatusValues = Object.keys(EnumStatus);

  clientsSharedCollection: IClient[] = [];

  protected clientOrderService = inject(ClientOrderService);
  protected clientOrderFormService = inject(ClientOrderFormService);
  protected clientService = inject(ClientService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ClientOrderFormGroup = this.clientOrderFormService.createClientOrderFormGroup();

  compareClient = (o1: IClient | null, o2: IClient | null): boolean => this.clientService.compareClient(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clientOrder }) => {
      this.clientOrder = clientOrder;
      if (clientOrder) {
        this.updateForm(clientOrder);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const clientOrder = this.clientOrderFormService.getClientOrder(this.editForm);
    if (clientOrder.id !== null) {
      this.subscribeToSaveResponse(this.clientOrderService.update(clientOrder));
    } else {
      this.subscribeToSaveResponse(this.clientOrderService.create(clientOrder));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClientOrder>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(clientOrder: IClientOrder): void {
    this.clientOrder = clientOrder;
    this.clientOrderFormService.resetForm(this.editForm, clientOrder);

    this.clientsSharedCollection = this.clientService.addClientToCollectionIfMissing<IClient>(
      this.clientsSharedCollection,
      clientOrder.client,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.clientService
      .query()
      .pipe(map((res: HttpResponse<IClient[]>) => res.body ?? []))
      .pipe(map((clients: IClient[]) => this.clientService.addClientToCollectionIfMissing<IClient>(clients, this.clientOrder?.client)))
      .subscribe((clients: IClient[]) => (this.clientsSharedCollection = clients));
  }
}
