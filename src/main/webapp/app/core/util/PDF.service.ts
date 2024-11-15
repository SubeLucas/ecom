import { Injectable, inject } from '@angular/core';
import { jsPDF } from 'jspdf';
import { IClientOrder } from '../../entities/client-order/client-order.model';
import { ClientOrderService } from '../../entities/client-order/service/client-order.service';
import { OrderLineService } from '../../entities/order-line/service/order-line.service';
import { IOrderLine } from '../../entities/order-line/order-line.model';
import { AlimentService } from '../../entities/aliment/service/aliment.service';
import { IAliment } from '../../entities/aliment/aliment.model';

import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PDFService {
  private clientOrderService = inject(ClientOrderService);
  private orderLineService = inject(OrderLineService);
  private alimentService = inject(AlimentService);

  // id du ClientOrder
  generatePDF(id: number): void {
    const doc = new jsPDF();
    let y = 10;

    forkJoin({
      clientOrder: this.clientOrderService.find(id).pipe(map(response => response.body!)),
      orderLines: this.orderLineService.findByClientOrder(id).pipe(map(response => response.body!)),
    }).subscribe(({ clientOrder, orderLines }) => {
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
        doc.text(`Total Price: ${clientOrder.totalPrice} €`, 10, y);
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

      // Ligne de séparation
      doc.line(10, y, 200, y);
      y += 15;

      // Sous-titre pour les détails des lignes de commande
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Order Lines', 10, y);
      y += 10;

      // Détails des lignes de commande
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');

      const alimentObservables = orderLines.map(orderLine =>
        this.alimentService.find(orderLine.aliment!.id).pipe(map(response => response.body!)),
      );

      forkJoin(alimentObservables).subscribe(aliments => {
        orderLines.forEach((orderLine, index) => {
          const aliment = aliments[index];
          doc.text(`Aliment: ${aliment.name}`, 10, y);
          y += 10;
          doc.text(`Quantity: ${orderLine.quantity}`, 10, y);
          y += 10;
          doc.text(`Purchase Price: ${orderLine.purchasePrice} €`, 10, y);
          y += 15; // Ajouter un peu plus d'espace entre les lignes de commande
        });

        // Sauvegarde du PDF
        doc.save('receipt.pdf');
      });
    });
  }
}
