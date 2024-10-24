import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IClientOrder } from '../client-order.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../client-order.test-samples';

import { ClientOrderService, RestClientOrder } from './client-order.service';

const requireRestSample: RestClientOrder = {
  ...sampleWithRequiredData,
  orderDate: sampleWithRequiredData.orderDate?.format(DATE_FORMAT),
  deliveryDate: sampleWithRequiredData.deliveryDate?.format(DATE_FORMAT),
};

describe('ClientOrder Service', () => {
  let service: ClientOrderService;
  let httpMock: HttpTestingController;
  let expectedResult: IClientOrder | IClientOrder[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ClientOrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a ClientOrder', () => {
      const clientOrder = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(clientOrder).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ClientOrder', () => {
      const clientOrder = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(clientOrder).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ClientOrder', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ClientOrder', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ClientOrder', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a ClientOrder', () => {
      const queryObject: any = {
        page: 0,
        size: 20,
        query: '',
        sort: [],
      };
      service.search(queryObject).subscribe(() => expectedResult);

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
      expect(expectedResult).toBe(null);
    });

    describe('addClientOrderToCollectionIfMissing', () => {
      it('should add a ClientOrder to an empty array', () => {
        const clientOrder: IClientOrder = sampleWithRequiredData;
        expectedResult = service.addClientOrderToCollectionIfMissing([], clientOrder);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clientOrder);
      });

      it('should not add a ClientOrder to an array that contains it', () => {
        const clientOrder: IClientOrder = sampleWithRequiredData;
        const clientOrderCollection: IClientOrder[] = [
          {
            ...clientOrder,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addClientOrderToCollectionIfMissing(clientOrderCollection, clientOrder);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ClientOrder to an array that doesn't contain it", () => {
        const clientOrder: IClientOrder = sampleWithRequiredData;
        const clientOrderCollection: IClientOrder[] = [sampleWithPartialData];
        expectedResult = service.addClientOrderToCollectionIfMissing(clientOrderCollection, clientOrder);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clientOrder);
      });

      it('should add only unique ClientOrder to an array', () => {
        const clientOrderArray: IClientOrder[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const clientOrderCollection: IClientOrder[] = [sampleWithRequiredData];
        expectedResult = service.addClientOrderToCollectionIfMissing(clientOrderCollection, ...clientOrderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const clientOrder: IClientOrder = sampleWithRequiredData;
        const clientOrder2: IClientOrder = sampleWithPartialData;
        expectedResult = service.addClientOrderToCollectionIfMissing([], clientOrder, clientOrder2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clientOrder);
        expect(expectedResult).toContain(clientOrder2);
      });

      it('should accept null and undefined values', () => {
        const clientOrder: IClientOrder = sampleWithRequiredData;
        expectedResult = service.addClientOrderToCollectionIfMissing([], null, clientOrder, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clientOrder);
      });

      it('should return initial array if no ClientOrder is added', () => {
        const clientOrderCollection: IClientOrder[] = [sampleWithRequiredData];
        expectedResult = service.addClientOrderToCollectionIfMissing(clientOrderCollection, undefined, null);
        expect(expectedResult).toEqual(clientOrderCollection);
      });
    });

    describe('compareClientOrder', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareClientOrder(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareClientOrder(entity1, entity2);
        const compareResult2 = service.compareClientOrder(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareClientOrder(entity1, entity2);
        const compareResult2 = service.compareClientOrder(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareClientOrder(entity1, entity2);
        const compareResult2 = service.compareClientOrder(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
