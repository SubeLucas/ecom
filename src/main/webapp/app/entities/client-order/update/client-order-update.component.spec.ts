import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { ClientOrderService } from '../service/client-order.service';
import { IClientOrder } from '../client-order.model';
import { ClientOrderFormService } from './client-order-form.service';

import { ClientOrderUpdateComponent } from './client-order-update.component';

describe('ClientOrder Management Update Component', () => {
  let comp: ClientOrderUpdateComponent;
  let fixture: ComponentFixture<ClientOrderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let clientOrderFormService: ClientOrderFormService;
  let clientOrderService: ClientOrderService;
  let clientService: ClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClientOrderUpdateComponent],
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
      .overrideTemplate(ClientOrderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClientOrderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    clientOrderFormService = TestBed.inject(ClientOrderFormService);
    clientOrderService = TestBed.inject(ClientOrderService);
    clientService = TestBed.inject(ClientService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Client query and add missing value', () => {
      const clientOrder: IClientOrder = { id: 456 };
      const client: IClient = { id: 21577 };
      clientOrder.client = client;

      const clientCollection: IClient[] = [{ id: 6711 }];
      jest.spyOn(clientService, 'query').mockReturnValue(of(new HttpResponse({ body: clientCollection })));
      const additionalClients = [client];
      const expectedCollection: IClient[] = [...additionalClients, ...clientCollection];
      jest.spyOn(clientService, 'addClientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ clientOrder });
      comp.ngOnInit();

      expect(clientService.query).toHaveBeenCalled();
      expect(clientService.addClientToCollectionIfMissing).toHaveBeenCalledWith(
        clientCollection,
        ...additionalClients.map(expect.objectContaining),
      );
      expect(comp.clientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const clientOrder: IClientOrder = { id: 456 };
      const client: IClient = { id: 4178 };
      clientOrder.client = client;

      activatedRoute.data = of({ clientOrder });
      comp.ngOnInit();

      expect(comp.clientsSharedCollection).toContain(client);
      expect(comp.clientOrder).toEqual(clientOrder);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClientOrder>>();
      const clientOrder = { id: 123 };
      jest.spyOn(clientOrderFormService, 'getClientOrder').mockReturnValue(clientOrder);
      jest.spyOn(clientOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clientOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clientOrder }));
      saveSubject.complete();

      // THEN
      expect(clientOrderFormService.getClientOrder).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(clientOrderService.update).toHaveBeenCalledWith(expect.objectContaining(clientOrder));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClientOrder>>();
      const clientOrder = { id: 123 };
      jest.spyOn(clientOrderFormService, 'getClientOrder').mockReturnValue({ id: null });
      jest.spyOn(clientOrderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clientOrder: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clientOrder }));
      saveSubject.complete();

      // THEN
      expect(clientOrderFormService.getClientOrder).toHaveBeenCalled();
      expect(clientOrderService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClientOrder>>();
      const clientOrder = { id: 123 };
      jest.spyOn(clientOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clientOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(clientOrderService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareClient', () => {
      it('Should forward to clientService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(clientService, 'compareClient');
        comp.compareClient(entity, entity2);
        expect(clientService.compareClient).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
