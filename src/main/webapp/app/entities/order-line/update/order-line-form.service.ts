import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IOrderLine, NewOrderLine } from '../order-line.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOrderLine for edit and NewOrderLineFormGroupInput for create.
 */
type OrderLineFormGroupInput = IOrderLine | PartialWithRequiredKeyOf<NewOrderLine>;

type OrderLineFormDefaults = Pick<NewOrderLine, 'id'>;

type OrderLineFormGroupContent = {
  id: FormControl<IOrderLine['id'] | NewOrderLine['id']>;
  quantity: FormControl<IOrderLine['quantity']>;
  purchasePrice: FormControl<IOrderLine['purchasePrice']>;
  clientOrder: FormControl<IOrderLine['clientOrder']>;
  aliment: FormControl<IOrderLine['aliment']>;
};

export type OrderLineFormGroup = FormGroup<OrderLineFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OrderLineFormService {
  createOrderLineFormGroup(orderLine: OrderLineFormGroupInput = { id: null }): OrderLineFormGroup {
    const orderLineRawValue = {
      ...this.getFormDefaults(),
      ...orderLine,
    };
    return new FormGroup<OrderLineFormGroupContent>({
      id: new FormControl(
        { value: orderLineRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      quantity: new FormControl(orderLineRawValue.quantity, {
        validators: [Validators.required],
      }),
      purchasePrice: new FormControl(orderLineRawValue.purchasePrice, {
        validators: [Validators.required],
      }),
      clientOrder: new FormControl(orderLineRawValue.clientOrder),
      aliment: new FormControl(orderLineRawValue.aliment),
    });
  }

  getOrderLine(form: OrderLineFormGroup): IOrderLine | NewOrderLine {
    return form.getRawValue() as IOrderLine | NewOrderLine;
  }

  resetForm(form: OrderLineFormGroup, orderLine: OrderLineFormGroupInput): void {
    const orderLineRawValue = { ...this.getFormDefaults(), ...orderLine };
    form.reset(
      {
        ...orderLineRawValue,
        id: { value: orderLineRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): OrderLineFormDefaults {
    return {
      id: null,
    };
  }
}
