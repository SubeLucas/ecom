import { Component, HostListener, OnInit, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map, switchMap, tap } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAliment } from 'app/entities/aliment/aliment.model';
import { AlimentService } from 'app/entities/aliment/service/aliment.service';
import { IImages } from '../images.model';
import { ImagesService } from '../service/images.service';
import { ImagesFormGroup, ImagesFormService } from './images-form.service';

@Component({
  standalone: true,
  selector: 'jhi-images-update-upload',
  templateUrl: './images-update-upload.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ImagesUpdateComponent implements OnInit {
  isSaving = false;
  images: IImages | null = null;
  img_data: File | null = null;

  alimentsSharedCollection: IAliment[] = [];

  protected imagesService = inject(ImagesService);
  protected imagesFormService = inject(ImagesFormService);
  protected alimentService = inject(AlimentService);
  protected activatedRoute = inject(ActivatedRoute);

  constructor(private http: HttpClient) {}

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const file = event && event.item(0);
    this.img_data = file;
    console.log('file uploaded', event);
  }

  editForm: ImagesFormGroup = this.imagesFormService.createImagesFormGroup();

  compareAliment = (o1: IAliment | null, o2: IAliment | null): boolean => this.alimentService.compareAliment(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ images }) => {
      this.images = images;
      if (images) {
        this.updateForm(images);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const images = this.imagesFormService.getImages(this.editForm);
    if (this.img_data !== null) {
      const formData = new FormData();
      formData.append('file', this.img_data);
      this.imagesService
        .upload(formData)
        .pipe(
          tap((response: HttpResponse<any>) => {
            // Assuming the response contains the URL of the uploaded image
            images.url = response.body?.url;
          }),
          switchMap(() => {
            if (images.id !== null) {
              return this.imagesService.update(images);
            } else {
              return this.imagesService.create(images);
            }
          }),
          finalize(() => this.onSaveFinalize()),
        )
        .subscribe({
          next: () => console.log('success'),
          error: e => console.log('error ouin', e),
        });
    } else {
      if (images.id !== null) {
        this.subscribeToSaveResponse(this.imagesService.update(images));
      } else {
        this.subscribeToSaveResponse(this.imagesService.create(images));
      }
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IImages>>): void {
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

  protected updateForm(images: IImages): void {
    this.images = images;
    this.imagesFormService.resetForm(this.editForm, images);

    this.alimentsSharedCollection = this.alimentService.addAlimentToCollectionIfMissing<IAliment>(
      this.alimentsSharedCollection,
      images.aliment,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.alimentService
      .query()
      .pipe(map((res: HttpResponse<IAliment[]>) => res.body ?? []))
      .pipe(map((aliments: IAliment[]) => this.alimentService.addAlimentToCollectionIfMissing<IAliment>(aliments, this.images?.aliment)))
      .subscribe((aliments: IAliment[]) => (this.alimentsSharedCollection = aliments));
  }
}
