import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IAliment, NewAliment } from '../aliment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAliment for edit and NewAlimentFormGroupInput for create.
 */
type AlimentFormGroupInput = IAliment | PartialWithRequiredKeyOf<NewAliment>;

type AlimentFormDefaults = Pick<NewAliment, 'id'>;

type AlimentFormGroupContent = {
  id: FormControl<IAliment['id'] | NewAliment['id']>;
  name: FormControl<IAliment['name']>;
  origin: FormControl<IAliment['origin']>;
  season: FormControl<IAliment['season']>;
  color: FormControl<IAliment['color']>;
  weight: FormControl<IAliment['weight']>;
  stockQuantity: FormControl<IAliment['stockQuantity']>;
  price: FormControl<IAliment['price']>;
};

export type AlimentFormGroup = FormGroup<AlimentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AlimentFormService {
  createAlimentFormGroup(aliment: AlimentFormGroupInput = { id: null }): AlimentFormGroup {
    const alimentRawValue = {
      ...this.getFormDefaults(),
      ...aliment,
    };
    return new FormGroup<AlimentFormGroupContent>({
      id: new FormControl(
        { value: alimentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(alimentRawValue.name, {
        validators: [Validators.required],
      }),
      origin: new FormControl(alimentRawValue.origin, {
        validators: [Validators.required],
      }),
      season: new FormControl(alimentRawValue.season, {
        validators: [Validators.required],
      }),
      color: new FormControl(alimentRawValue.color, {
        validators: [Validators.required],
      }),
      weight: new FormControl(alimentRawValue.weight, {
        validators: [Validators.required],
      }),
      stockQuantity: new FormControl(alimentRawValue.stockQuantity, {
        validators: [Validators.required],
      }),
      price: new FormControl(alimentRawValue.price, {
        validators: [Validators.required],
      }),
    });
  }

  getAliment(form: AlimentFormGroup): IAliment | NewAliment {
    return form.getRawValue() as IAliment | NewAliment;
  }

  resetForm(form: AlimentFormGroup, aliment: AlimentFormGroupInput): void {
    const alimentRawValue = { ...this.getFormDefaults(), ...aliment };
    form.reset(
      {
        ...alimentRawValue,
        id: { value: alimentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AlimentFormDefaults {
    return {
      id: null,
    };
  }
}
