import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../aliment.test-samples';

import { AlimentFormService } from './aliment-form.service';

describe('Aliment Form Service', () => {
  let service: AlimentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlimentFormService);
  });

  describe('Service methods', () => {
    describe('createAlimentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAlimentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            origin: expect.any(Object),
            season: expect.any(Object),
            color: expect.any(Object),
            weight: expect.any(Object),
            stockQuantity: expect.any(Object),
            price: expect.any(Object),
          }),
        );
      });

      it('passing IAliment should create a new form with FormGroup', () => {
        const formGroup = service.createAlimentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            origin: expect.any(Object),
            season: expect.any(Object),
            color: expect.any(Object),
            weight: expect.any(Object),
            stockQuantity: expect.any(Object),
            price: expect.any(Object),
          }),
        );
      });
    });

    describe('getAliment', () => {
      it('should return NewAliment for default Aliment initial value', () => {
        const formGroup = service.createAlimentFormGroup(sampleWithNewData);

        const aliment = service.getAliment(formGroup) as any;

        expect(aliment).toMatchObject(sampleWithNewData);
      });

      it('should return NewAliment for empty Aliment initial value', () => {
        const formGroup = service.createAlimentFormGroup();

        const aliment = service.getAliment(formGroup) as any;

        expect(aliment).toMatchObject({});
      });

      it('should return IAliment', () => {
        const formGroup = service.createAlimentFormGroup(sampleWithRequiredData);

        const aliment = service.getAliment(formGroup) as any;

        expect(aliment).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAliment should not enable id FormControl', () => {
        const formGroup = service.createAlimentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAliment should disable id FormControl', () => {
        const formGroup = service.createAlimentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
