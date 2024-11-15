import { TestBed } from '@angular/core/testing';
import { PdfService } from './pdf.service';
import { IClientOrder } from '../entities/client-order/client-order.model';
import { jsPDF } from 'jspdf';
import dayjs from 'dayjs/esm';
import { IClient } from 'app/entities/client/client.model';
import { IUser } from 'app/entities/user/user.model';

describe('PDFService', () => {
  let service: PDFService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PDFService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a PDF with client order details', () => {
    const client: IClient = {
      id: 1,
      preferedDay: 'Monday',
      address: '123 Main St',
      user: { id: 1 },
    };

    const clientOrder: IClientOrder = {
      id: 1,
      orderDate: dayjs('2023-10-01'),
      deliveryDate: dayjs('2023-10-10'),
      deliveryAddress: '123 Main St',
      status: 'IN_PROGRESS',
      totalPrice: 100.0,
      client: client,
    };

    spyOn(jsPDF.prototype, 'save').and.callThrough();

    service.generatePDF(clientOrder);

    expect(jsPDF.prototype.save).toHaveBeenCalledWith('client_order.pdf');
  });
});
