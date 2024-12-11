import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAliment } from 'app/entities/aliment/aliment.model';
import { AlimentService } from 'app/entities/aliment/service/aliment.service';
import { IImages } from '../images.model';
import { ImagesService } from '../service/images.service';
import { ImagesFormGroup, ImagesFormService } from './images-form.service';

@Component({
  standalone: true,
  selector: 'jhi-images-update',
  templateUrl: './images-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ImagesUpdateComponent implements OnInit {
  isSaving = false;
  images: IImages | null = null;
  defaultUrl = 'http://localhost/aliment_<id>.png';

  alimentsSharedCollection: IAliment[] = [];

  protected imagesService = inject(ImagesService);
  protected imagesFormService = inject(ImagesFormService);
  protected alimentService = inject(AlimentService);
  protected activatedRoute = inject(ActivatedRoute);

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

    // Initialiser le champ url avec la valeur par défaut
    this.editForm.get('url')?.setValue(this.defaultUrl);
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const images = this.imagesFormService.getImages(this.editForm);
    if (images.id !== null) {
      this.subscribeToSaveResponse(this.imagesService.update(images));
    } else {
      this.subscribeToSaveResponse(this.imagesService.create(images));
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
