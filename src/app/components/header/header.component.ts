import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Currencies } from '../../model/currencies.model';
import { CurrencyService } from '../../service/currency.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [RouterLink, RouterLinkActive, NgIf],
  standalone: true,
})
export class HeaderComponent implements OnInit {
  uahToEur: string | null = null;
  uahToUsd: string | null = null;
  a = 1;
  b = 2;
  c = 3;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencyService.getCurrenciesHeader().subscribe(
      (data: Currencies[]) => {
        const usdRate = data.find((currency) => currency.code === 'usd')?.rate;
        const eurRate = data.find((currency) => currency.code === 'eur')?.rate;
        if (usdRate) {
          this.uahToUsd = `1 USD = ${(1 / usdRate).toFixed(2)} UAH`;
        } else {
          this.uahToUsd = 'Курсы валют не доступны';
        }

        if (eurRate) {
          this.uahToEur = `1 EUR = ${(1 / eurRate).toFixed(2)} UAH`;
        } else {
          this.uahToEur = 'Курсы валют не доступны';
        }
      },
      (error) => {
        console.error('Ошибка при получении валют:', error);
        this.uahToEur = 'Ошибка при загрузке данных';
        this.uahToUsd = 'Ошибка при загрузке данных';
      }
    );
  }
}
