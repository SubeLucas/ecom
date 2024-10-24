import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IClientOrder } from 'app/entities/client-order/client-order.model';
import { ClientOrderService } from 'app/entities/client-order/service/client-order.service';
import { IAliment } from 'app/entities/aliment/aliment.model';
import { AlimentService } from 'app/entities/aliment/service/aliment.service';
import { IOrderLine } from '../order-line.model';
import { OrderLineService } from '../service/order-line.service';
import { OrderLineFormService } from './order-line-form.service';

import { OrderLineUpdateComponent } from './order-line-update.component';

describe('OrderLine Management Update Component', () => {
  let comp: OrderLineUpdateComponent;
  let fixture: ComponentFixture<OrderLineUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let orderLineFormService: OrderLineFormService;
  let orderLineService: OrderLineService;
  let clientOrderService: ClientOrderService;
  let alimentService: AlimentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderLineUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(OrderLineUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrderLineUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    orderLineFormService = TestBed.inject(OrderLineFormService);
    orderLineService = TestBed.inject(OrderLineService);
    clientOrderService = TestBed.inject(ClientOrderService);
    alimentService = TestBed.inject(AlimentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ClientOrder query and add missing value', () => {
      const orderLine: IOrderLine = { id: 456 };
      const clientOrder: IClientOrder = { id: 5262 };
      orderLine.clientOrder = clientOrder;

      const clientOrderCollection: IClientOrder[] = [{ id: 22467 }];
      jest.spyOn(clientOrderService, 'query').mockReturnValue(of(new HttpResponse({ body: clientOrderCollection })));
      const additionalClientOrders = [clientOrder];
      const expectedCollection: IClientOrder[] = [...additionalClientOrders, ...clientOrderCollection];
      jest.spyOn(clientOrderService, 'addClientOrderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ orderLine });
      comp.ngOnInit();

      expect(clientOrderService.query).toHaveBeenCalled();
      expect(clientOrderService.addClientOrderToCollectionIfMissing).toHaveBeenCalledWith(
        clientOrderCollection,
        ...additionalClientOrders.map(expect.objectContaining),
      );
      expect(comp.clientOrdersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Aliment query and add missing value', () => {
      const orderLine: IOrderLine = { id: 456 };
      const aliment: IAliment = { id: 13848 };
      orderLine.aliment = aliment;

      const alimentCollection: IAliment[] = [{ id: 14305 }];
      jest.spyOn(alimentService, 'query').mockReturnValue(of(new HttpResponse({ body: alimentCollection })));
      const additionalAliments = [aliment];
      const expectedCollection: IAliment[] = [...additionalAliments, ...alimentCollection];
      jest.spyOn(alimentService, 'addAlimentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ orderLine });
      comp.ngOnInit();

      expect(alimentService.query).toHaveBeenCalled();
      expect(alimentService.addAlimentToCollectionIfMissing).toHaveBeenCalledWith(
        alimentCollection,
        ...additionalAliments.map(expect.objectContaining),
      );
      expect(comp.alimentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const orderLine: IOrderLine = { id: 456 };
      const clientOrder: IClientOrder = { id: 13967 };
      orderLine.clientOrder = clientOrder;
      const aliment: IAliment = { id: 4710 };
      orderLine.aliment = aliment;

      activatedRoute.data = of({ orderLine });
      comp.ngOnInit();

      expect(comp.clientOrdersSharedCollection).toContain(clientOrder);
      expect(comp.alimentsSharedCollection).toContain(aliment);
      expect(comp.orderLine).toEqual(orderLine);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrderLine>>();
      const orderLine = { id: 123 };
      jest.spyOn(orderLineFormService, 'getOrderLine').mockReturnValue(orderLine);
      jest.spyOn(orderLineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderLine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orderLine }));
      saveSubject.complete();

      // THEN
      expect(orderLineFormService.getOrderLine).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(orderLineService.update).toHaveBeenCalledWith(expect.objectContaining(orderLine));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrderLine>>();
      const orderLine = { id: 123 };
      jest.spyOn(orderLineFormService, 'getOrderLine').mockReturnValue({ id: null });
      jest.spyOn(orderLineService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderLine: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orderLine }));
      saveSubject.complete();

      // THEN
      expect(orderLineFormService.getOrderLine).toHaveBeenCalled();
      expect(orderLineService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrderLine>>();
      const orderLine = { id: 123 };
      jest.spyOn(orderLineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderLine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(orderLineService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareClientOrder', () => {
      it('Should forward to clientOrderService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(clientOrderService, 'compareClientOrder');
        comp.compareClientOrder(entity, entity2);
        expect(clientOrderService.compareClientOrder).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAliment', () => {
      it('Should forward to alimentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(alimentService, 'compareAliment');
        comp.compareAliment(entity, entity2);
        expect(alimentService.compareAliment).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
