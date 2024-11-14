import { Injectable, inject } from '@angular/core';
import { jsPDF } from 'jspdf';
import { IClientOrder } from '../../entities/client-order/client-order.model';
import { ClientOrderService } from '../../entities/client-order/service/client-order.service';
//import { IOrderLineService } from '../entities/order-line/service/order-line.service';

@Injectable({
  providedIn: 'root',
})
export class PDFService {
  private clientOrderService = inject(ClientOrderService);

  constructor() {}

  generatePDF(id: number): void {
    this.clientOrderService.find(id).subscribe((clientOrder: IClientOrder) => {
      const doc = new jsPDF();
      doc.text(id, 10, 10);

      /*let y = 10;

      doc.text('Client Order Details', 10, y);
      y += 10;

      doc.text(`Order ID: ${clientOrder.id}`, 10, y);
      y += 10;

      if (clientOrder.orderDate) {
        doc.text(`Order Date: ${clientOrder.orderDate.format('YYYY-MM-DD')}`, 10, y);
        y += 10;
      }

      if (clientOrder.deliveryDate) {
        doc.text(`Delivery Date: ${clientOrder.deliveryDate.format('YYYY-MM-DD')}`, 10, y);
        y += 10;
      }

      if (clientOrder.deliveryAddress) {
        doc.text(`Delivery Address: ${clientOrder.deliveryAddress}`, 10, y);
        y += 10;
      }

      if (clientOrder.status) {
        doc.text(`Status: ${clientOrder.status}`, 10, y);
        y += 10;
      }

      if (clientOrder.totalPrice !== null) {
        doc.text(`Total Price: ${clientOrder.totalPrice}`, 10, y);
        y += 10;
      }

      if (clientOrder.client) {
        doc.text(`Client: ${clientOrder.client.name}`, 10, y);
        y += 10;
      }*/

      doc.save('receipt.pdf');
    });
  }
}
