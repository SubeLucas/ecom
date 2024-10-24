import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { AlimentService } from '../service/aliment.service';
import { IAliment } from '../aliment.model';
import { AlimentFormService } from './aliment-form.service';

import { AlimentUpdateComponent } from './aliment-update.component';

describe('Aliment Management Update Component', () => {
  let comp: AlimentUpdateComponent;
  let fixture: ComponentFixture<AlimentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let alimentFormService: AlimentFormService;
  let alimentService: AlimentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AlimentUpdateComponent],
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
      .overrideTemplate(AlimentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AlimentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    alimentFormService = TestBed.inject(AlimentFormService);
    alimentService = TestBed.inject(AlimentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const aliment: IAliment = { id: 456 };

      activatedRoute.data = of({ aliment });
      comp.ngOnInit();

      expect(comp.aliment).toEqual(aliment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAliment>>();
      const aliment = { id: 123 };
      jest.spyOn(alimentFormService, 'getAliment').mockReturnValue(aliment);
      jest.spyOn(alimentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ aliment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: aliment }));
      saveSubject.complete();

      // THEN
      expect(alimentFormService.getAliment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(alimentService.update).toHaveBeenCalledWith(expect.objectContaining(aliment));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAliment>>();
      const aliment = { id: 123 };
      jest.spyOn(alimentFormService, 'getAliment').mockReturnValue({ id: null });
      jest.spyOn(alimentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ aliment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: aliment }));
      saveSubject.complete();

      // THEN
      expect(alimentFormService.getAliment).toHaveBeenCalled();
      expect(alimentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAliment>>();
      const aliment = { id: 123 };
      jest.spyOn(alimentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ aliment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(alimentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
