import { TestBed } from '@angular/core/testing';
import { PdfService } from './pdf.service';
import { IClientOrder } from '../entities/client-order/client-order.model';
import { jsPDF } from 'jspdf';
import dayjs from 'dayjs/esm';

describe('PdfService', () => {
  let service: PdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a PDF with client order details', () => {
    const clientOrder: IClientOrder = {
      id: 1,
      orderDate: dayjs('2023-10-01'),
      deliveryDate: dayjs('2023-10-10'),
      deliveryAddress: '123 Main St',
      status: 'PENDING',
      totalPrice: 100.0,
      client: {
        id: 1,
        name: 'John Doe',
      },
    };

    spyOn(jsPDF.prototype, 'save').and.callThrough();

    service.generatePDF(clientOrder);

    expect(jsPDF.prototype.save).toHaveBeenCalledWith('client_order.pdf');
  });
});
