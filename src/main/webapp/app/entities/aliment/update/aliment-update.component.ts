import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EnumOrigin } from 'app/entities/enumerations/enum-origin.model';
import { EnumColor } from 'app/entities/enumerations/enum-color.model';
import { IAliment } from '../aliment.model';
import { AlimentService } from '../service/aliment.service';
import { AlimentFormGroup, AlimentFormService } from './aliment-form.service';

@Component({
  standalone: true,
  selector: 'jhi-aliment-update',
  templateUrl: './aliment-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AlimentUpdateComponent implements OnInit {
  isSaving = false;
  aliment: IAliment | null = null;
  enumOriginValues = Object.keys(EnumOrigin);
  enumColorValues = Object.keys(EnumColor);

  protected alimentService = inject(AlimentService);
  protected alimentFormService = inject(AlimentFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AlimentFormGroup = this.alimentFormService.createAlimentFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ aliment }) => {
      this.aliment = aliment;
      if (aliment) {
        this.updateForm(aliment);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const aliment = this.alimentFormService.getAliment(this.editForm);
    if (aliment.id !== null) {
      this.subscribeToSaveResponse(this.alimentService.update(aliment));
    } else {
      this.subscribeToSaveResponse(this.alimentService.create(aliment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAliment>>): void {
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

  protected updateForm(aliment: IAliment): void {
    this.aliment = aliment;
    this.alimentFormService.resetForm(this.editForm, aliment);
  }
}
