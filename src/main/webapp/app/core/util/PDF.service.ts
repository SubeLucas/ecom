import { Injectable, inject } from '@angular/core';
import { jsPDF } from 'jspdf';
import { IClientOrder } from '../../entities/client-order/client-order.model';
import { ClientOrderService } from '../../entities/client-order/service/client-order.service';
import { OrderLineService } from '../../entities/order-line/service/order-line.service';
import { IOrderLine } from '../../entities/order-line/order-line.model';
import { AlimentService } from '../../entities/aliment/service/aliment.service';
import { AccountService } from 'app/core/auth/account.service';
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
  private accountService = inject(AccountService);

  // id du ClientOrder
  generatePDF(id: number): void {
    const doc = new jsPDF();
    let y = 10;

    forkJoin({
      clientOrder: this.clientOrderService.find(id).pipe(map(response => response.body!)),
      orderLines: this.orderLineService.findByClientOrder(id).pipe(map(response => response.body!)),
      account: this.accountService.identity(),
    }).subscribe(({ clientOrder, orderLines, account }) => {
      // Titre principal
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Details de votre facture Cueillette', 10, y);
      y += 15;

      // Sous-titre pour les détails de la commande
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Information de la commande', 10, y);
      y += 10;

      // Détails de la commande
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`ID de la commande: ${clientOrder.id}`, 10, y);
      y += 10;

      if (clientOrder.orderDate) {
        doc.text(`Date de la commande: ${clientOrder.orderDate.format('YYYY-MM-DD')}`, 10, y);
        y += 10;
      }

      if (clientOrder.deliveryDate) {
        doc.text(`Date de livraison: ${clientOrder.deliveryDate.format('YYYY-MM-DD')}`, 10, y);
        y += 10;
      }

      if (clientOrder.deliveryAddress) {
        doc.text(`Adresse de livraison: ${clientOrder.deliveryAddress}`, 10, y);
        y += 10;
      }

      if (clientOrder.status) {
        doc.text(`Status: ${clientOrder.status}`, 10, y);
        y += 10;
      }

      if (clientOrder.totalPrice !== null) {
        doc.text(`Prix total: ${clientOrder.totalPrice} €`, 10, y);
        y += 10;
      }

      // Ligne de séparation
      doc.line(10, y, 200, y);
      y += 15;

      // Sous-titre pour les détails du client
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Information du client', 10, y);
      y += 10;

      // Détails du client
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      if (clientOrder.client) {
        doc.text(`ID du client: ${clientOrder.client.id}`, 10, y);
        y += 10;
      }

      // Informations supplémentaires du client
      if (account) {
        doc.text(`Prénom: ${account.firstName}`, 10, y);
        y += 10;
        doc.text(`Nom: ${account.lastName}`, 10, y);
        y += 10;
        doc.text(`Mail: ${account.email}`, 10, y);
        y += 10;
      }

      // Ligne de séparation
      doc.line(10, y, 200, y);
      y += 15;

      // Sous-titre pour les détails des lignes de commande
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Détails des produits', 10, y);
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
          doc.text(`Produit: ${aliment.name}`, 10, y);
          y += 10;
          doc.text(`Quantité: ${orderLine.quantity}`, 10, y);
          y += 10;
          doc.text(`Prix d'achat: ${orderLine.purchasePrice} €`, 10, y);
          y += 15; // Ajouter un peu plus d'espace entre les lignes de commande
        });

        // Sauvegarde du PDF
        doc.save('facture_cueillette.pdf');
      });
    });
  }
}
