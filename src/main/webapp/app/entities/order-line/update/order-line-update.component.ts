import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IClientOrder } from 'app/entities/client-order/client-order.model';
import { ClientOrderService } from 'app/entities/client-order/service/client-order.service';
import { IAliment } from 'app/entities/aliment/aliment.model';
import { AlimentService } from 'app/entities/aliment/service/aliment.service';
import { OrderLineService } from '../service/order-line.service';
import { IOrderLine } from '../order-line.model';
import { OrderLineFormGroup, OrderLineFormService } from './order-line-form.service';

@Component({
  standalone: true,
  selector: 'jhi-order-line-update',
  templateUrl: './order-line-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class OrderLineUpdateComponent implements OnInit {
  isSaving = false;
  orderLine: IOrderLine | null = null;

  clientOrdersSharedCollection: IClientOrder[] = [];
  alimentsSharedCollection: IAliment[] = [];

  protected orderLineService = inject(OrderLineService);
  protected orderLineFormService = inject(OrderLineFormService);
  protected clientOrderService = inject(ClientOrderService);
  protected alimentService = inject(AlimentService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: OrderLineFormGroup = this.orderLineFormService.createOrderLineFormGroup();

  compareClientOrder = (o1: IClientOrder | null, o2: IClientOrder | null): boolean => this.clientOrderService.compareClientOrder(o1, o2);

  compareAliment = (o1: IAliment | null, o2: IAliment | null): boolean => this.alimentService.compareAliment(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderLine }) => {
      this.orderLine = orderLine;
      if (orderLine) {
        this.updateForm(orderLine);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orderLine = this.orderLineFormService.getOrderLine(this.editForm);
    if (orderLine.id !== null) {
      this.subscribeToSaveResponse(this.orderLineService.update(orderLine));
    } else {
      this.subscribeToSaveResponse(this.orderLineService.create(orderLine));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderLine>>): void {
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

  protected updateForm(orderLine: IOrderLine): void {
    this.orderLine = orderLine;
    this.orderLineFormService.resetForm(this.editForm, orderLine);

    this.clientOrdersSharedCollection = this.clientOrderService.addClientOrderToCollectionIfMissing<IClientOrder>(
      this.clientOrdersSharedCollection,
      orderLine.clientOrder,
    );
    this.alimentsSharedCollection = this.alimentService.addAlimentToCollectionIfMissing<IAliment>(
      this.alimentsSharedCollection,
      orderLine.aliment,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.clientOrderService
      .query()
      .pipe(map((res: HttpResponse<IClientOrder[]>) => res.body ?? []))
      .pipe(
        map((clientOrders: IClientOrder[]) =>
          this.clientOrderService.addClientOrderToCollectionIfMissing<IClientOrder>(clientOrders, this.orderLine?.clientOrder),
        ),
      )
      .subscribe((clientOrders: IClientOrder[]) => (this.clientOrdersSharedCollection = clientOrders));

    this.alimentService
      .query()
      .pipe(map((res: HttpResponse<IAliment[]>) => res.body ?? []))
      .pipe(map((aliments: IAliment[]) => this.alimentService.addAlimentToCollectionIfMissing<IAliment>(aliments, this.orderLine?.aliment)))
      .subscribe((aliments: IAliment[]) => (this.alimentsSharedCollection = aliments));
  }
}
