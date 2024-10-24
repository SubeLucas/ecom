import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../client-order.test-samples';

import { ClientOrderFormService } from './client-order-form.service';

describe('ClientOrder Form Service', () => {
  let service: ClientOrderFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientOrderFormService);
  });

  describe('Service methods', () => {
    describe('createClientOrderFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createClientOrderFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            orderDate: expect.any(Object),
            deliveryDate: expect.any(Object),
            deliveryAddress: expect.any(Object),
            status: expect.any(Object),
            totalPrice: expect.any(Object),
            client: expect.any(Object),
          }),
        );
      });

      it('passing IClientOrder should create a new form with FormGroup', () => {
        const formGroup = service.createClientOrderFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            orderDate: expect.any(Object),
            deliveryDate: expect.any(Object),
            deliveryAddress: expect.any(Object),
            status: expect.any(Object),
            totalPrice: expect.any(Object),
            client: expect.any(Object),
          }),
        );
      });
    });

    describe('getClientOrder', () => {
      it('should return NewClientOrder for default ClientOrder initial value', () => {
        const formGroup = service.createClientOrderFormGroup(sampleWithNewData);

        const clientOrder = service.getClientOrder(formGroup) as any;

        expect(clientOrder).toMatchObject(sampleWithNewData);
      });

      it('should return NewClientOrder for empty ClientOrder initial value', () => {
        const formGroup = service.createClientOrderFormGroup();

        const clientOrder = service.getClientOrder(formGroup) as any;

        expect(clientOrder).toMatchObject({});
      });

      it('should return IClientOrder', () => {
        const formGroup = service.createClientOrderFormGroup(sampleWithRequiredData);

        const clientOrder = service.getClientOrder(formGroup) as any;

        expect(clientOrder).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IClientOrder should not enable id FormControl', () => {
        const formGroup = service.createClientOrderFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewClientOrder should disable id FormControl', () => {
        const formGroup = service.createClientOrderFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
