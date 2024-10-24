import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IClientOrder, NewClientOrder } from '../client-order.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IClientOrder for edit and NewClientOrderFormGroupInput for create.
 */
type ClientOrderFormGroupInput = IClientOrder | PartialWithRequiredKeyOf<NewClientOrder>;

type ClientOrderFormDefaults = Pick<NewClientOrder, 'id'>;

type ClientOrderFormGroupContent = {
  id: FormControl<IClientOrder['id'] | NewClientOrder['id']>;
  orderDate: FormControl<IClientOrder['orderDate']>;
  deliveryDate: FormControl<IClientOrder['deliveryDate']>;
  deliveryAddress: FormControl<IClientOrder['deliveryAddress']>;
  status: FormControl<IClientOrder['status']>;
  totalPrice: FormControl<IClientOrder['totalPrice']>;
  client: FormControl<IClientOrder['client']>;
};

export type ClientOrderFormGroup = FormGroup<ClientOrderFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ClientOrderFormService {
  createClientOrderFormGroup(clientOrder: ClientOrderFormGroupInput = { id: null }): ClientOrderFormGroup {
    const clientOrderRawValue = {
      ...this.getFormDefaults(),
      ...clientOrder,
    };
    return new FormGroup<ClientOrderFormGroupContent>({
      id: new FormControl(
        { value: clientOrderRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      orderDate: new FormControl(clientOrderRawValue.orderDate, {
        validators: [Validators.required],
      }),
      deliveryDate: new FormControl(clientOrderRawValue.deliveryDate, {
        validators: [Validators.required],
      }),
      deliveryAddress: new FormControl(clientOrderRawValue.deliveryAddress, {
        validators: [Validators.required],
      }),
      status: new FormControl(clientOrderRawValue.status, {
        validators: [Validators.required],
      }),
      totalPrice: new FormControl(clientOrderRawValue.totalPrice, {
        validators: [Validators.required],
      }),
      client: new FormControl(clientOrderRawValue.client),
    });
  }

  getClientOrder(form: ClientOrderFormGroup): IClientOrder | NewClientOrder {
    return form.getRawValue() as IClientOrder | NewClientOrder;
  }

  resetForm(form: ClientOrderFormGroup, clientOrder: ClientOrderFormGroupInput): void {
    const clientOrderRawValue = { ...this.getFormDefaults(), ...clientOrder };
    form.reset(
      {
        ...clientOrderRawValue,
        id: { value: clientOrderRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ClientOrderFormDefaults {
    return {
      id: null,
    };
  }
}
