import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { LANGUAGES } from 'app/config/language.constants';
import { ClientOrderService } from 'app/entities/client-order/service/client-order.service';
import { IClientOrder } from 'app/entities/client-order/client-order.model';
import dayjs, { Dayjs } from 'dayjs';
import { PDFService } from 'app/core/util/PDF.service';
import { Title } from '@angular/platform-browser';

const initialAccount: Account = {} as Account;

@Component({
  standalone: true,
  selector: 'jhi-settings',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
})
export default class SettingsComponent implements OnInit {
  success = signal(false);
  languages = LANGUAGES;
  clientOrders: IClientOrder[] = [];
  private titleService = inject(Title);

  settingsForm = new FormGroup({
    firstName: new FormControl(initialAccount.firstName, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    lastName: new FormControl(initialAccount.lastName, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    email: new FormControl(initialAccount.email, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    activated: new FormControl(initialAccount.activated, { nonNullable: true }),
    authorities: new FormControl(initialAccount.authorities, { nonNullable: true }),
    imageUrl: new FormControl(initialAccount.imageUrl, { nonNullable: true }),
    login: new FormControl(initialAccount.login, { nonNullable: true }),
  });

  private accountService = inject(AccountService);
  private translateService = inject(TranslateService);
  private clientOrderService = inject(ClientOrderService);
  private pdfService = inject(PDFService);

  ngOnInit(): void {
    this.titleService.setTitle('Cueillette - info client');
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.settingsForm.patchValue(account);
      }
    });

    this.clientOrderService.getClientOrdersByCurrentClient().subscribe(response => {
      this.clientOrders = response.body!;
    });
  }

  save(): void {
    this.success.set(false);

    const account = this.settingsForm.getRawValue();
    this.accountService.save(account).subscribe(() => {
      this.success.set(true);

      this.accountService.authenticate(account);
    });
  }

  convertToDate(dayjsDate: Dayjs | null | undefined): Date | null {
    return dayjsDate ? dayjsDate.toDate() : null;
  }

  generateReceipt(orderId: number): void {
    this.pdfService.generatePDF(orderId);
  }
}
