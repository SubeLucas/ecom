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

  //constructor() {}

  generatePDF(id: number): void {
    this.clientOrderService.find(id).subscribe(response => {
      const clientOrder: IClientOrder = response.body!;
      const doc = new jsPDF();
      let y = 10;

      // Titre principal
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Client Order Details', 10, y);
      y += 15;

      // Sous-titre pour les détails de la commande
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Order Information', 10, y);
      y += 10;

      // Détails de la commande
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
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

      // Ligne de séparation
      doc.line(10, y, 200, y);
      y += 15;

      // Sous-titre pour les détails du client
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Client Information', 10, y);
      y += 10;

      // Détails du client
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      if (clientOrder.client) {
        doc.text(`Client ID: ${clientOrder.client.id}`, 10, y);
        y += 10;
        if (clientOrder.client.preferedDay) {
          doc.text(`Preferred Day: ${clientOrder.client.preferedDay}`, 10, y);
          y += 10;
        }
        if (clientOrder.client.address) {
          doc.text(`Client Address: ${clientOrder.client.address}`, 10, y);
          y += 10;
        }
        if (clientOrder.client.user) {
          doc.text(`User ID: ${clientOrder.client.user.id}`, 10, y);
          y += 10;
        }
      }

      // Sauvegarde du PDF
      doc.save('receipt.pdf');
    });
  }
}
