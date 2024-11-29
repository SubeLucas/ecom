import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IImages, NewImages } from '../images.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IImages for edit and NewImagesFormGroupInput for create.
 */
type ImagesFormGroupInput = IImages | PartialWithRequiredKeyOf<NewImages>;

type ImagesFormDefaults = Pick<NewImages, 'id'>;

type ImagesFormGroupContent = {
  id: FormControl<IImages['id'] | NewImages['id']>;
  url: FormControl<IImages['url']>;
  img: FormControl<IImages['img']>;
  aliment: FormControl<IImages['aliment']>;
};

export type ImagesFormGroup = FormGroup<ImagesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ImagesFormService {
  createImagesFormGroup(images: ImagesFormGroupInput = { id: null }): ImagesFormGroup {
    const imagesRawValue = {
      ...this.getFormDefaults(),
      ...images,
    };
    console.log(imagesRawValue);
    return new FormGroup<ImagesFormGroupContent>({
      id: new FormControl(
        { value: imagesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      url: new FormControl(imagesRawValue.url, {
        validators: [],
      }),
      img: new FormControl(imagesRawValue.img, {
        validators: [],
      }),
      aliment: new FormControl(imagesRawValue.aliment),
    });
  }

  getImages(form: ImagesFormGroup): IImages | NewImages {
    return form.getRawValue() as IImages | NewImages;
  }

  resetForm(form: ImagesFormGroup, images: ImagesFormGroupInput): void {
    const imagesRawValue = { ...this.getFormDefaults(), ...images };
    form.reset(
      {
        ...imagesRawValue,
        id: { value: imagesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ImagesFormDefaults {
    return {
      id: null,
    };
  }
}
