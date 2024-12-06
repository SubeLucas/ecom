import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PDFService } from 'app/core/util/PDF.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'jhi-payment-success',
  standalone: true,
  imports: [],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss',
})
export class PaymentSuccessComponent implements OnInit {
  order: number | undefined;
  private titleService = inject(Title);
  constructor(
    private pdfService: PDFService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Commande validée');
    this.route.queryParams.subscribe(params => {
      this.order = params['order'];
    });
  }

  generateReceipt(): void {
    this.pdfService.generatePDF(this.order!);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
