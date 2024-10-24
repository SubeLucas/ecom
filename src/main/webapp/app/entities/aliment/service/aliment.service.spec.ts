import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IAliment } from '../aliment.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../aliment.test-samples';

import { AlimentService } from './aliment.service';

const requireRestSample: IAliment = {
  ...sampleWithRequiredData,
};

describe('Aliment Service', () => {
  let service: AlimentService;
  let httpMock: HttpTestingController;
  let expectedResult: IAliment | IAliment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AlimentService);
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

    it('should create a Aliment', () => {
      const aliment = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(aliment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Aliment', () => {
      const aliment = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(aliment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Aliment', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Aliment', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Aliment', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a Aliment', () => {
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

    describe('addAlimentToCollectionIfMissing', () => {
      it('should add a Aliment to an empty array', () => {
        const aliment: IAliment = sampleWithRequiredData;
        expectedResult = service.addAlimentToCollectionIfMissing([], aliment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(aliment);
      });

      it('should not add a Aliment to an array that contains it', () => {
        const aliment: IAliment = sampleWithRequiredData;
        const alimentCollection: IAliment[] = [
          {
            ...aliment,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAlimentToCollectionIfMissing(alimentCollection, aliment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Aliment to an array that doesn't contain it", () => {
        const aliment: IAliment = sampleWithRequiredData;
        const alimentCollection: IAliment[] = [sampleWithPartialData];
        expectedResult = service.addAlimentToCollectionIfMissing(alimentCollection, aliment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(aliment);
      });

      it('should add only unique Aliment to an array', () => {
        const alimentArray: IAliment[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const alimentCollection: IAliment[] = [sampleWithRequiredData];
        expectedResult = service.addAlimentToCollectionIfMissing(alimentCollection, ...alimentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const aliment: IAliment = sampleWithRequiredData;
        const aliment2: IAliment = sampleWithPartialData;
        expectedResult = service.addAlimentToCollectionIfMissing([], aliment, aliment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(aliment);
        expect(expectedResult).toContain(aliment2);
      });

      it('should accept null and undefined values', () => {
        const aliment: IAliment = sampleWithRequiredData;
        expectedResult = service.addAlimentToCollectionIfMissing([], null, aliment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(aliment);
      });

      it('should return initial array if no Aliment is added', () => {
        const alimentCollection: IAliment[] = [sampleWithRequiredData];
        expectedResult = service.addAlimentToCollectionIfMissing(alimentCollection, undefined, null);
        expect(expectedResult).toEqual(alimentCollection);
      });
    });

    describe('compareAliment', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAliment(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAliment(entity1, entity2);
        const compareResult2 = service.compareAliment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAliment(entity1, entity2);
        const compareResult2 = service.compareAliment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAliment(entity1, entity2);
        const compareResult2 = service.compareAliment(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
